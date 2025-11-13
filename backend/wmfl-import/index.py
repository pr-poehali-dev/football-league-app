'''
Business: Импорт команд турнира из WMFL через парсинг HTML страницы
Args: event - dict with httpMethod, body (tournament_id)
      context - object with attributes: request_id, function_name
Returns: HTTP response with imported teams count
'''

import json
import os
import re
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import RealDictCursor
import urllib.request
import urllib.error
from html.parser import HTMLParser

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        raise Exception('DATABASE_URL not found in environment')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

class WMFLStandingsParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.teams = []
        self.current_team = {}
        self.in_standings = False
        self.in_team_row = False
        self.cell_index = 0
        self.current_data = []
        
    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        
        if tag == 'tr' and any('team' in str(v).lower() for k, v in attrs):
            self.in_team_row = True
            self.current_team = {}
            self.cell_index = 0
            
        if tag == 'td' and self.in_team_row:
            self.current_data = []
    
    def handle_data(self, data):
        if self.in_team_row and data.strip():
            self.current_data.append(data.strip())
    
    def handle_endtag(self, tag):
        if tag == 'td' and self.in_team_row and self.current_data:
            value = ' '.join(self.current_data)
            
            if self.cell_index == 0 and value.isdigit():
                self.current_team['position'] = int(value)
            elif self.cell_index == 1:
                self.current_team['team_name'] = value
            elif 'games' not in self.current_team and value.isdigit():
                self.current_team['games'] = int(value)
            elif 'wins' not in self.current_team and value.isdigit():
                self.current_team['wins'] = int(value)
            elif 'draws' not in self.current_team and value.isdigit():
                self.current_team['draws'] = int(value)
            elif 'losses' not in self.current_team and value.isdigit():
                self.current_team['losses'] = int(value)
            elif ':' in value:
                parts = value.split(':')
                if len(parts) == 2 and parts[0].isdigit() and parts[1].isdigit():
                    self.current_team['goals_for'] = int(parts[0])
                    self.current_team['goals_against'] = int(parts[1])
            elif 'points' not in self.current_team and value.isdigit():
                self.current_team['points'] = int(value)
                
            self.cell_index += 1
            
        if tag == 'tr' and self.in_team_row:
            if self.current_team and 'team_name' in self.current_team:
                self.teams.append(self.current_team)
            self.in_team_row = False

def fetch_wmfl_page(tournament_id: int) -> str:
    url = f'https://wmfl.ru/tournament/{tournament_id}/standings'
    
    try:
        req = urllib.request.Request(url)
        req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
        
        with urllib.request.urlopen(req, timeout=15) as response:
            return response.read().decode('utf-8')
    except Exception as e:
        raise Exception(f'Failed to fetch WMFL page: {str(e)}')

def parse_standings(html_content: str) -> List[Dict[str, Any]]:
    parser = WMFLStandingsParser()
    parser.feed(html_content)
    return parser.teams

def import_teams_to_db(conn, teams_data: List[Dict[str, Any]], tournament_id: int) -> int:
    cur = conn.cursor()
    imported_count = 0
    
    for team in teams_data:
        try:
            team_id = hash(team['team_name']) % 1000000
            rating = 1500 + (team.get('points', 0) * 10)
            
            cur.execute('''
                INSERT INTO t_p5773343_football_league_app.wmfl_tournament_teams 
                (team_id, team_name, matches_played, wins, draws, losses, 
                 goals_for, goals_against, rating, position, tournament_id, 
                 season, is_active)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (team_id) 
                DO UPDATE SET
                    team_name = EXCLUDED.team_name,
                    matches_played = EXCLUDED.matches_played,
                    wins = EXCLUDED.wins,
                    draws = EXCLUDED.draws,
                    losses = EXCLUDED.losses,
                    goals_for = EXCLUDED.goals_for,
                    goals_against = EXCLUDED.goals_against,
                    rating = EXCLUDED.rating,
                    position = EXCLUDED.position,
                    updated_at = CURRENT_TIMESTAMP
            ''', (
                team_id,
                team['team_name'],
                team.get('games', 0),
                team.get('wins', 0),
                team.get('draws', 0),
                team.get('losses', 0),
                team.get('goals_for', 0),
                team.get('goals_against', 0),
                rating,
                team.get('position'),
                tournament_id,
                '2024/2025',
                True
            ))
            imported_count += 1
        except Exception as e:
            print(f"Failed to import team {team.get('team_name')}: {str(e)}")
            continue
    
    conn.commit()
    return imported_count

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        tournament_id = body_data.get('tournament_id', 1056456)
        
        html_content = fetch_wmfl_page(tournament_id)
        teams_data = parse_standings(html_content)
        
        if not teams_data:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'imported_count': 0,
                    'message': 'Не удалось найти данные турнира. Возможно, турнир закрыт или ID неверный.'
                }, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        conn = get_db_connection()
        imported_count = import_teams_to_db(conn, teams_data, tournament_id)
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'imported_count': imported_count,
                'total_teams': len(teams_data),
                'tournament_id': tournament_id,
                'message': f'Импортировано команд: {imported_count}',
                'teams': teams_data
            }, ensure_ascii=False),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'error': str(e),
                'message': 'Ошибка импорта данных из WMFL'
            }, ensure_ascii=False),
            'isBase64Encoded': False
        }
