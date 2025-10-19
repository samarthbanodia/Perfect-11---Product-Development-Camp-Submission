# Dataset - Perfect 11

This folder contains the IPL dataset used for training the fantasy cricket prediction models.

## 📊 Dataset Overview

- **Time Period**: 2008-2025 (17 years)
- **Total Matches**: 1,149
- **Player-Match Records**: 25,697
- **Unique Players**: ~800+
- **Data Source**: Cricsheet.org, ESPNcricinfo

## 📁 Files

### Main Dataset Files

#### 1. player_match_base.csv
**Description**: Core player-match performance data

**Columns**:
- `match_id`: Unique match identifier
- `player_id`: Unique player identifier
- `player_name`: Player name
- `team`: Team name
- `opponent`: Opponent team name
- `venue`: Match venue
- `match_date`: Date of match
- `runs`: Runs scored
- `balls_faced`: Balls faced
- `fours`: Number of fours
- `sixes`: Number of sixes
- `wickets`: Wickets taken
- `overs_bowled`: Overs bowled
- `maidens`: Maiden overs
- `runs_conceded`: Runs conceded while bowling
- `catches`: Catches taken
- `stumpings`: Stumpings made
- `runouts`: Run-outs effected
- `fantasy_points`: Total fantasy points (target variable)

**Size**: ~25,697 rows × 20 columns

**Sample**:
```csv
match_id,player_id,player_name,team,opponent,venue,match_date,runs,balls_faced,fours,sixes,wickets,overs_bowled,maidens,runs_conceded,catches,stumpings,runouts,fantasy_points
1082591,28081,MS Dhoni,CSK,MI,MA Chidambaram Stadium,2024-05-15,45,32,3,2,0,0,0,0,1,0,0,58.5
```

---

#### 2. player_roles_global.csv
**Description**: Overall player roles across entire career

**Columns**:
- `player_id`: Unique player identifier
- `player_name`: Player name
- `role`: Primary role (BAT, BOWL, AR, WK)

**Roles**:
- `BAT`: Batsman
- `BOWL`: Bowler
- `AR`: All-Rounder
- `WK`: Wicket-Keeper

**Size**: ~800 rows × 3 columns

**Sample**:
```csv
player_id,player_name,role
28081,MS Dhoni,WK
1413,Virat Kohli,BAT
253802,Jasprit Bumrah,BOWL
625371,Hardik Pandya,AR
```

---

#### 3. player_roles_by_season.csv
**Description**: Player roles for each season (roles can change over time)

**Columns**:
- `player_id`: Unique player identifier
- `player_name`: Player name
- `season`: IPL season/year
- `role`: Role in that specific season

**Use Case**: Some players change roles over time (e.g., wicket-keeper becomes batsman)

**Size**: ~3,500 rows × 4 columns

---

### Sample Data

#### sample/
Contains 3-5 sample match JSON files showing the structure for API requests.

**Example**: `1082591.json`
```json
{
  "match_id": "1082591",
  "match_info": {
    "venue": "MA Chidambaram Stadium",
    "date": "2024-05-15",
    "team1": "CSK",
    "team2": "MI"
  },
  "players": [
    {
      "player_id": "28081",
      "player_name": "MS Dhoni",
      "team": "CSK",
      "role": "WK"
    }
  ]
}
```

---

## 🎯 Fantasy Points Calculation

Fantasy points are calculated based on Dream11 scoring rules:

### Batting Points
- Run: 1 point
- Boundary (4s): 1 point
- Over Boundary (6s): 2 points
- 30-run bonus: 4 points
- Half-century bonus: 8 points
- Century bonus: 16 points
- Duck (out for 0): -2 points

### Bowling Points
- Wicket: 25 points
- LBW/Bowled bonus: 8 points
- 3-wicket haul: 4 points
- 4-wicket haul: 8 points
- 5-wicket haul: 16 points
- Maiden over: 12 points

### Fielding Points
- Catch: 8 points
- Stumping: 12 points
- Run-out (direct): 12 points
- Run-out (assist): 6 points

### Economy/Strike Rate Bonuses
- Strike rate > 170 (min 10 balls): 6 points
- Strike rate 150-170: 4 points
- Strike rate 130-150: 2 points
- Economy rate < 5 (min 2 overs): 6 points
- Economy rate 5-6: 4 points
- Economy rate 6-7: 2 points

---

## 📊 Dataset Statistics

### Fantasy Points Distribution
- **Mean**: 34.8 points
- **Median**: 28.0 points
- **Std Dev**: 32.7 points
- **Coefficient of Variation**: 94% (extremely high!)
- **Min**: 0 points
- **Max**: 215 points
- **25th percentile**: 14 points
- **75th percentile**: 45 points

### Role Distribution
| Role | Count | Avg FP | Std FP |
|------|-------|--------|--------|
| BAT  | 9,876 | 33.5   | 26.7   |
| BOWL | 8,123 | 36.8   | 28.5   |
| AR   | 3,245 | 40.2   | 32.1   |
| WK   | 4,453 | 31.2   | 25.3   |

### Temporal Distribution
- **2008-2012**: ~5,000 records
- **2013-2017**: ~8,000 records
- **2018-2022**: ~9,500 records
- **2023-2025**: ~3,200 records

---

## 🔒 Data Privacy

- All data is publicly available from Cricsheet and ESPNcricinfo
- No personal or sensitive information
- Only match performance statistics
- Suitable for academic and commercial use

---

## 📥 Data Sources

### Primary Source
**Cricsheet**: https://cricsheet.org/
- Ball-by-ball data for all IPL matches
- Match results and scorecards
- Free and open-source

### Secondary Sources
- **ESPNcricinfo**: Player statistics and profiles
- **IPLT20.com**: Official IPL website
- **Dream11**: Fantasy scoring rules

---

## 🛠️ Data Processing

The raw data has been processed through:

1. **Data Extraction**: Parsing JSON match files
2. **Feature Engineering**: Creating 40+ derived features
3. **Data Cleaning**: Handling missing values, outliers
4. **Role Assignment**: Mapping players to roles
5. **Validation**: Ensuring data quality and consistency

Processing scripts are available in the EDA notebooks.

---

## 📈 Using the Data

### Loading in Python

```python
import pandas as pd

# Load main dataset
player_matches = pd.read_csv('data/player_match_base.csv')
player_matches['match_date'] = pd.to_datetime(player_matches['match_date'])

# Load roles
roles_global = pd.read_csv('data/player_roles_global.csv')
roles_by_season = pd.read_csv('data/player_roles_by_season.csv')

# Merge roles
df = player_matches.merge(roles_global, on='player_id', how='left')

print(f"Total records: {len(df)}")
print(f"Date range: {df['match_date'].min()} to {df['match_date'].max()}")
```

### Basic Analysis

```python
# Fantasy points summary
print(player_matches['fantasy_points'].describe())

# Top performers
top_players = player_matches.groupby('player_name')['fantasy_points'].mean().sort_values(ascending=False).head(10)
print(top_players)

# Role-wise performance
role_stats = df.groupby('role')['fantasy_points'].agg(['mean', 'median', 'std'])
print(role_stats)
```

---

## ⚠️ Data Limitations

1. **High Variance**: Fantasy points are extremely variable (CV = 94%)
2. **Missing Context**: No pitch conditions, weather, toss data
3. **Small Samples**: Many players have < 20 matches
4. **Role Changes**: Some players changed roles over time
5. **Incomplete Records**: Some older matches may have missing data

---

## 🤝 Contributing

To add more data:
1. Download latest IPL data from Cricsheet
2. Run data processing scripts (see EDA notebooks)
3. Validate new records
4. Submit pull request

---

## 📞 Questions?

For data-related questions:
- Check EDA notebooks in `eda/` folder
- Review main [README.md](../README.md)
- Open an issue on GitHub

---

**Data last updated**: January 2025
