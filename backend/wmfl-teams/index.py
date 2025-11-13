'''
Business: API для управления командами турнира WMFL - получение, добавление и обновление рейтинга команд
Args: event - dict with httpMethod, body, queryStringParameters, pathParams
      context - object with attributes: request_id, function_name
Returns: HTTP response dict with team data
'''

import json
import os
from typing import Dict, Any, Optional, List
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        raise Exception('DATABASE_URL not found in environment')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            team_id = params.get('team_id')
            
            if team_id:
                cur.execute('''
                    SELECT * FROM t_p5773343_football_league_app.wmfl_tournament_teams 
                    WHERE team_id = %s AND is_active = true
                ''', (team_id,))
                team = cur.fetchone()
                
                if not team:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Team not found'}),
                        'isBase64Encoded': False
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(team), ensure_ascii=False, default=str),
                    'isBase64Encoded': False
                }
            
            cur.execute('''
                SELECT * FROM t_p5773343_football_league_app.wmfl_tournament_teams 
                WHERE is_active = true 
                ORDER BY points DESC, goal_difference DESC, goals_for DESC
            ''')
            teams = cur.fetchall()
            
            teams_list = [dict(team) for team in teams]
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(teams_list, ensure_ascii=False, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            required_fields = ['team_name']
            for field in required_fields:
                if field not in body_data:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': f'Missing required field: {field}'}),
                        'isBase64Encoded': False
                    }
            
            cur.execute('''
                INSERT INTO t_p5773343_football_league_app.wmfl_tournament_teams 
                (team_id, team_name, team_short_name, team_logo, city, stadium, 
                 matches_played, wins, draws, losses, goals_for, goals_against, 
                 rating, position, form, streak, home_wins, home_draws, home_losses, 
                 away_wins, away_draws, away_losses, yellow_cards, red_cards, 
                 tournament_id, season, is_active)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 
                        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id, team_id, team_name, points, goal_difference
            ''', (
                body_data.get('team_id'),
                body_data['team_name'],
                body_data.get('team_short_name'),
                body_data.get('team_logo'),
                body_data.get('city'),
                body_data.get('stadium'),
                body_data.get('matches_played', 0),
                body_data.get('wins', 0),
                body_data.get('draws', 0),
                body_data.get('losses', 0),
                body_data.get('goals_for', 0),
                body_data.get('goals_against', 0),
                body_data.get('rating', 1500),
                body_data.get('position'),
                body_data.get('form'),
                body_data.get('streak'),
                body_data.get('home_wins', 0),
                body_data.get('home_draws', 0),
                body_data.get('home_losses', 0),
                body_data.get('away_wins', 0),
                body_data.get('away_draws', 0),
                body_data.get('away_losses', 0),
                body_data.get('yellow_cards', 0),
                body_data.get('red_cards', 0),
                body_data.get('tournament_id', 1056456),
                body_data.get('season', '2024/2025'),
                body_data.get('is_active', True)
            ))
            
            new_team = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(new_team), ensure_ascii=False, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            team_id = body_data.get('team_id')
            
            if not team_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'team_id is required'}),
                    'isBase64Encoded': False
                }
            
            update_fields = []
            values = []
            
            allowed_fields = [
                'team_name', 'team_short_name', 'team_logo', 'city', 'stadium',
                'matches_played', 'wins', 'draws', 'losses', 'goals_for', 'goals_against',
                'rating', 'position', 'form', 'streak', 'home_wins', 'home_draws', 
                'home_losses', 'away_wins', 'away_draws', 'away_losses', 
                'yellow_cards', 'red_cards', 'season', 'is_active'
            ]
            
            for field in allowed_fields:
                if field in body_data:
                    update_fields.append(f"{field} = %s")
                    values.append(body_data[field])
            
            if not update_fields:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'No fields to update'}),
                    'isBase64Encoded': False
                }
            
            update_fields.append("updated_at = CURRENT_TIMESTAMP")
            values.append(team_id)
            
            query = f'''
                UPDATE t_p5773343_football_league_app.wmfl_tournament_teams 
                SET {', '.join(update_fields)}
                WHERE team_id = %s
                RETURNING id, team_id, team_name, points, goal_difference
            '''
            
            cur.execute(query, values)
            updated_team = cur.fetchone()
            
            if not updated_team:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Team not found'}),
                    'isBase64Encoded': False
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(updated_team), ensure_ascii=False, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters') or {}
            team_id = params.get('team_id')
            
            if not team_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'team_id is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('''
                UPDATE t_p5773343_football_league_app.wmfl_tournament_teams 
                SET is_active = false, updated_at = CURRENT_TIMESTAMP
                WHERE team_id = %s
                RETURNING team_id, team_name
            ''', (team_id,))
            
            deleted_team = cur.fetchone()
            
            if not deleted_team:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Team not found'}),
                    'isBase64Encoded': False
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Team deleted', 'team': dict(deleted_team)}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()