'''
Business: Автоматическая синхронизация команд турнира WMFL - периодическое обновление данных
Args: event - dict with httpMethod, body (tournament_id, auto_sync settings)
      context - object with attributes: request_id, function_name
Returns: HTTP response with sync status
'''

import json
import os
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        raise Exception('DATABASE_URL not found in environment')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def get_tournaments_for_sync(conn) -> List[Dict[str, Any]]:
    cur = conn.cursor()
    cur.execute('''
        SELECT DISTINCT tournament_id, season
        FROM t_p5773343_football_league_app.wmfl_tournament_teams
        WHERE is_active = true
        GROUP BY tournament_id, season
    ''')
    return [dict(row) for row in cur.fetchall()]

def update_sync_status(conn, tournament_id: int, status: str, message: str, teams_updated: int = 0):
    cur = conn.cursor()
    
    cur.execute('''
        INSERT INTO t_p5773343_football_league_app.wmfl_sync_log 
        (tournament_id, status, message, teams_updated)
        VALUES (%s, %s, %s, %s)
    ''', (tournament_id, status, message, teams_updated))
    
    conn.commit()

def sync_tournament_data(conn, tournament_id: int) -> Dict[str, Any]:
    cur = conn.cursor()
    
    cur.execute('''
        SELECT team_id, team_name, rating, wins, draws, losses, 
               goals_for, goals_against, points, position
        FROM t_p5773343_football_league_app.wmfl_tournament_teams
        WHERE tournament_id = %s AND is_active = true
        ORDER BY points DESC, goal_difference DESC
    ''', (tournament_id,))
    
    teams = [dict(row) for row in cur.fetchall()]
    
    recalculated = 0
    for idx, team in enumerate(teams, start=1):
        new_position = idx
        new_points = team['wins'] * 3 + team['draws']
        
        if team['position'] != new_position or team['points'] != new_points:
            cur.execute('''
                UPDATE t_p5773343_football_league_app.wmfl_tournament_teams
                SET position = %s, updated_at = CURRENT_TIMESTAMP
                WHERE team_id = %s AND tournament_id = %s
            ''', (new_position, team['team_id'], tournament_id))
            recalculated += 1
    
    conn.commit()
    
    return {
        'tournament_id': tournament_id,
        'teams_count': len(teams),
        'teams_updated': recalculated,
        'status': 'success'
    }

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = get_db_connection()
        
        if method == 'GET':
            cur = conn.cursor()
            cur.execute('''
                SELECT * FROM t_p5773343_football_league_app.wmfl_sync_log
                ORDER BY sync_time DESC
                LIMIT 50
            ''')
            logs = [dict(row) for row in cur.fetchall()]
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'logs': logs}, ensure_ascii=False, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_str = event.get('body', '{}')
            body_data = json.loads(body_str) if body_str else {}
            tournament_id = body_data.get('tournament_id')
            
            if tournament_id:
                result = sync_tournament_data(conn, tournament_id)
                update_sync_status(
                    conn, 
                    tournament_id, 
                    'success', 
                    f"Синхронизировано команд: {result['teams_updated']}",
                    result['teams_updated']
                )
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'message': 'Синхронизация завершена',
                        'result': result
                    }, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            else:
                tournaments = get_tournaments_for_sync(conn)
                
                if not tournaments:
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({
                            'success': True,
                            'message': 'Нет турниров для синхронизации',
                            'synced_count': 0
                        }, ensure_ascii=False),
                        'isBase64Encoded': False
                    }
                
                results = []
                for tournament in tournaments:
                    try:
                        result = sync_tournament_data(conn, tournament['tournament_id'])
                        results.append(result)
                        update_sync_status(
                            conn, 
                            tournament['tournament_id'], 
                            'success', 
                            f"Автосинхронизация: обновлено {result['teams_updated']} команд",
                            result['teams_updated']
                        )
                    except Exception as e:
                        update_sync_status(
                            conn, 
                            tournament['tournament_id'], 
                            'error', 
                            str(e)
                        )
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'message': f'Синхронизировано турниров: {len(results)}',
                        'synced_count': len(results),
                        'results': results
                    }, ensure_ascii=False),
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
            'body': json.dumps({
                'error': str(e),
                'message': 'Ошибка синхронизации'
            }, ensure_ascii=False),
            'isBase64Encoded': False
        }
    
    finally:
        if 'conn' in locals():
            conn.close()