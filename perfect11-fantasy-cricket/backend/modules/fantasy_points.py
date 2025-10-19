"""
Calculate actual fantasy points from match JSON (for evaluation)
Based on Dream11 scoring system
"""

def calculate_actual_fantasy_points(match_data, players):
    """
    Calculate actual fantasy points for all players based on match performance

    Dream11 Scoring:
    Batting: 1 run = 1pt, 4s = 1pt, 6s = 2pt, 50 = 8pt, 100 = 16pt, duck = -2pt
    Bowling: Wicket = 25pt, 4W = 8pt, 5W = 16pt, Maiden = 12pt
    Fielding: Catch = 8pt, Stumping = 12pt, Run out = 6pt

    Returns:
        dict: {player_id: actual_fp}
    """

    fp_dict = {}

    # Initialize all players with 0
    for p in players:
        fp_dict[p['player_id']] = 0.0

    # Extract player names to IDs mapping
    name_to_id = {p['player_name']: p['player_id'] for p in players}

    # Process each innings
    if 'innings' not in match_data:
        return fp_dict

    for innings in match_data.get('innings', []):
        deliveries = innings.get('overs', [])

        # Track batting stats
        batting_stats = {}  # {player_name: {runs, balls, fours, sixes, dismissed}}
        bowling_stats = {}  # {player_name: {wickets, maidens, balls}}
        fielding_stats = {}  # {player_name: {catches, stumpings, run_outs}}

        current_over_balls = []

        for over_data in deliveries:
            over_num = over_data.get('over', 0)

            for delivery in over_data.get('deliveries', []):
                batter = delivery.get('batter', '')
                bowler = delivery.get('bowler', '')
                runs_batter = delivery.get('runs', {}).get('batter', 0)
                runs_total = delivery.get('runs', {}).get('total', 0)

                # Initialize batter stats
                if batter not in batting_stats:
                    batting_stats[batter] = {'runs': 0, 'balls': 0, 'fours': 0, 'sixes': 0, 'dismissed': False}

                # Initialize bowler stats
                if bowler not in bowling_stats:
                    bowling_stats[bowler] = {'wickets': 0, 'maidens': 0, 'balls': 0, 'runs_conceded': 0}

                # Update batting stats
                batting_stats[batter]['runs'] += runs_batter
                batting_stats[batter]['balls'] += 1

                if runs_batter == 4:
                    batting_stats[batter]['fours'] += 1
                elif runs_batter == 6:
                    batting_stats[batter]['sixes'] += 1

                # Update bowling stats
                bowling_stats[bowler]['balls'] += 1
                bowling_stats[bowler]['runs_conceded'] += runs_total

                # Check for wickets
                if 'wickets' in delivery:
                    for wicket in delivery['wickets']:
                        batting_stats[batter]['dismissed'] = True
                        bowling_stats[bowler]['wickets'] += 1

                        # Fielding credits
                        fielder_name = wicket.get('fielders', [{}])[0].get('name', '') if wicket.get('fielders') else ''
                        kind = wicket.get('kind', '')

                        if fielder_name:
                            if fielder_name not in fielding_stats:
                                fielding_stats[fielder_name] = {'catches': 0, 'stumpings': 0, 'run_outs': 0}

                            if kind == 'caught':
                                fielding_stats[fielder_name]['catches'] += 1
                            elif kind == 'stumped':
                                fielding_stats[fielder_name]['stumpings'] += 1
                            elif kind == 'run out':
                                fielding_stats[fielder_name]['run_outs'] += 1

        # Calculate fantasy points
        for player_name, stats in batting_stats.items():
            if player_name in name_to_id:
                pid = name_to_id[player_name]

                # Runs (1 point per run)
                fp_dict[pid] += stats['runs']

                # Boundaries
                fp_dict[pid] += stats['fours'] * 1  # 1 bonus point for 4
                fp_dict[pid] += stats['sixes'] * 2  # 2 bonus points for 6

                # Milestones
                if stats['runs'] >= 100:
                    fp_dict[pid] += 16
                elif stats['runs'] >= 50:
                    fp_dict[pid] += 8

                # Duck penalty
                if stats['dismissed'] and stats['runs'] == 0 and stats['balls'] > 0:
                    fp_dict[pid] -= 2

        for player_name, stats in bowling_stats.items():
            if player_name in name_to_id:
                pid = name_to_id[player_name]

                # Wickets (25 points each)
                fp_dict[pid] += stats['wickets'] * 25

                # Milestones
                if stats['wickets'] >= 5:
                    fp_dict[pid] += 16
                elif stats['wickets'] >= 4:
                    fp_dict[pid] += 8

        for player_name, stats in fielding_stats.items():
            if player_name in name_to_id:
                pid = name_to_id[player_name]

                # Fielding
                fp_dict[pid] += stats['catches'] * 8
                fp_dict[pid] += stats['stumpings'] * 12
                fp_dict[pid] += stats['run_outs'] * 6

    return fp_dict
