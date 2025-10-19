"""
Parse match JSON and extract all necessary information
"""
import pandas as pd
from datetime import datetime

def parse_match_json(match_data):
    """
    Parse JSON and return structured match info
    Supports both cricsheet format (with 'info' key) and simplified frontend format

    Returns:
        dict with:
        - match_id
        - match_date
        - team1, team2
        - venue
        - players: list of dicts with player_id, name, team
    """
    # Check if this is cricsheet format (with 'info' key) or simplified format
    if 'info' in match_data:
        # Full cricsheet format
        info = match_data['info']

        # Basic info
        match_date_str = info['dates'][0]
        match_date = pd.to_datetime(match_date_str)

        team1, team2 = info['teams']
        venue = info.get('venue', 'Unknown')
        season = info.get('season', str(match_date.year))

        # Extract match_id (construct if not present)
        match_id = f"{match_date_str}_{team1}_{team2}"

        # Registry for player_id mapping
        registry = info['registry']['people']

        # Extract all players from both teams
        players = []
        for team in [team1, team2]:
            team_players = info['players'].get(team, [])
            for player_name in team_players:
                player_id = registry.get(player_name)
                if player_id:
                    players.append({
                        'player_id': player_id,
                        'player_name': player_name,
                        'team': team
                    })

        return {
            'match_id': match_id,
            'match_date': match_date,
            'team1': team1,
            'team2': team2,
            'venue': venue,
            'season': season,
            'players': players,
            'registry': registry
        }
    else:
        # Simplified frontend format
        # Expected format: {match_id, players: [{player_name, player_id, team, role}], match_info: {venue, date}}
        match_id = match_data.get('match_id', 'unknown')
        match_info = match_data.get('match_info', {})

        venue = match_info.get('venue', 'Unknown')
        match_date_str = match_info.get('date', datetime.now().strftime('%Y-%m-%d'))
        match_date = pd.to_datetime(match_date_str)
        season = str(match_date.year)

        # Extract players
        players_input = match_data.get('players', [])
        players = []
        teams = set()

        for p in players_input:
            player_id = p.get('player_id', f"player_{len(players)}")
            player_name = p.get('player_name', f"Player {len(players)}")
            team = p.get('team', 'Team A')
            teams.add(team)

            players.append({
                'player_id': player_id,
                'player_name': player_name,
                'team': team
            })

        # Determine team names
        teams_list = list(teams)
        team1 = teams_list[0] if len(teams_list) > 0 else 'Team A'
        team2 = teams_list[1] if len(teams_list) > 1 else 'Team B'

        # Create a simple registry (player_name -> player_id)
        registry = {p['player_name']: p['player_id'] for p in players}

        return {
            'match_id': match_id,
            'match_date': match_date,
            'team1': team1,
            'team2': team2,
            'venue': venue,
            'season': season,
            'players': players,
            'registry': registry
        }
