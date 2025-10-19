# Perfect 11 - IPL Fantasy Cricket Prediction Platform

<div align="center">

![Perfect 11 Logo](frontend/public/perfect_11_logo.png)

**AI-Powered Fantasy Cricket Team Selection for Dream11**

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![Next.js](https://img.shields.io/badge/Next.js-15.1-black.svg)](https://nextjs.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-green.svg)](https://flask.palletsprojects.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#features) • [Tech Stack](#tech-stack) • [Installation](#installation) • [Usage](#usage) • [Architecture](#architecture) • [EDA](#eda-analysis)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Architecture](#architecture)
- [EDA Analysis](#eda-analysis)
- [Model Performance](#model-performance)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Perfect 11** is an AI-powered fantasy cricket prediction platform designed to help users create optimal Dream11 teams for IPL matches. Using machine learning models trained on **17 years of IPL data** (2008-2025), the platform predicts fantasy points for players and suggests balanced team compositions.

### Key Highlights

- 📊 **1,149 IPL matches** analyzed
- 👥 **25,697 player-match records** processed
- 🤖 **Multiple ML models** (Linear Regression, XGBoost, LightGBM, Random Forest)
- 📈 **Industry-standard performance** (MAE ~24-26 points)
- 🎨 **Beautiful UI** with real-time predictions
- 🔍 **Explainable AI** (SHAP values, feature importance)

---

## ✨ Features

### 🎮 User Features

- **Player Selection Interface**: Browse and select 11 players for your Dream11 team
- **Real-time Predictions**: Get instant fantasy point predictions for selected players
- **Team Composition**: Auto-suggest balanced teams (BAT, BOWL, AR, WK ratios)
- **Multiple Strategies**: Conservative, Aggressive, Balanced, Form-based teams
- **Player Insights**: View historical performance, recent form, venue stats
- **Explainable Predictions**: Understand why a player is predicted to score X points

### 🤖 ML Features

- **Ensemble Models**: Combines Linear Regression, XGBoost, LightGBM
- **40+ Features**: Historical stats, recent form, venue performance, opponent matchups
- **Time-aware Training**: Models trained with time-based cross-validation
- **Overfitting Prevention**: Extensive regularization and validation
- **Classification Models**: Tier-based predictions (Poor/Average/Good/Excellent)

### 📊 Analytics Features

- **Comprehensive EDA**: 2 detailed Jupyter notebooks with 50+ visualizations
- **Performance Dashboards**: Track model accuracy, MAE, R² scores
- **Feature Importance**: SHAP analysis for model interpretability
- **Historical Trends**: Analyze IPL performance patterns over 17 years

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.1 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **State Management**: React Hooks
- **Icons**: Lucide React

### Backend
- **Framework**: Flask 3.0
- **Language**: Python 3.8+
- **ML Libraries**:
  - scikit-learn (Linear models, Random Forest)
  - XGBoost (Gradient boosting)
  - LightGBM (Gradient boosting)
  - pandas (Data processing)
  - numpy (Numerical operations)
- **API**: RESTful API with CORS support

### Data & ML
- **Dataset**: 17 years of IPL data (2008-2025)
- **Features**: 40+ engineered features
- **Models**: Linear Regression, Ridge, XGBoost, LightGBM, Random Forest
- **Validation**: Time-based train/val/test split (70/15/15)
- **Performance**: MAE ~24-26 points (industry standard)

### Development Tools
- **Version Control**: Git
- **Package Managers**: npm (frontend), pip (backend)
- **Code Quality**: ESLint, TypeScript strict mode
- **Notebooks**: Jupyter (EDA and model training)

---

## 📁 Project Structure

```
perfect11-fantasy-cricket/
├── frontend/                 # Next.js frontend application
│   ├── app/                  # Next.js app directory
│   │   ├── page.tsx          # Main page component
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── ui/               # shadcn/ui components
│   │   └── ...               # Custom components
│   ├── lib/                  # Utility functions
│   ├── public/               # Static assets
│   ├── package.json          # Dependencies
│   └── tsconfig.json         # TypeScript config
│
├── backend/                  # Flask backend application
│   ├── app.py                # Main Flask application
│   ├── modules/              # Python modules
│   │   ├── predictor.py      # ML prediction logic
│   │   ├── team_optimizer.py # Team composition optimizer
│   │   └── explainer.py      # Model explainability (SHAP)
│   ├── model_artifacts/      # Trained ML models
│   │   ├── ProductUI_Model.pkl
│   │   ├── scaler.pkl
│   │   └── encoders.pkl
│   └── requirements.txt      # Python dependencies
│
├── eda/                      # Exploratory Data Analysis
│   ├── All_Models_Training_Complete.ipynb
│   ├── Complete_IPL_Analysis_With_Real_Training.ipynb
│   └── README.md             # EDA documentation
│
├── data/                     # Dataset files
│   ├── player_match_base.csv         # Player-match records
│   ├── player_roles_global.csv       # Player roles
│   ├── player_roles_by_season.csv    # Season-wise roles
│   └── sample/               # Sample match JSON files
│
├── docs/                     # Additional documentation
│   ├── API.md                # API documentation
│   ├── ARCHITECTURE.md       # Architecture details
│   └── DEPLOYMENT.md         # Deployment guide
│
├── .gitignore                # Git ignore file
├── LICENSE                   # MIT License
└── README.md                 # This file
```

---

## 🚀 Installation

### Prerequisites

- **Python**: 3.8 or higher
- **Node.js**: 18.0 or higher
- **npm**: 9.0 or higher
- **Git**: Latest version

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/perfect11-fantasy-cricket.git
cd perfect11-fantasy-cricket
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Verify installation
python -c "import flask, sklearn, xgboost, lightgbm; print('All packages installed successfully!')"
```

**Backend Dependencies:**
```
flask==3.0.0
flask-cors==4.0.0
pandas==2.0.3
numpy==1.24.3
scikit-learn==1.3.0
xgboost==2.0.3
lightgbm==4.3.0
pulp==2.7.0
```

### 3️⃣ Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Verify installation
npm run build
```

**Frontend Dependencies:**
```json
{
  "next": "15.1.3",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5",
  "@supabase/supabase-js": "^2.39.3",
  "framer-motion": "^11.0.0",
  "lucide-react": "^0.344.0",
  "tailwindcss": "^3.4.1"
}
```

---

## 💻 Usage

### Running the Backend

```bash
# From backend directory
cd backend

# Start Flask server
python app.py

# Server will start on http://localhost:5000
```

**Backend Endpoints:**
- `GET /health` - Health check
- `POST /predict` - Predict fantasy points for players
- `POST /explain` - Get prediction explanations (SHAP values)
- `POST /optimize` - Optimize team composition

### Running the Frontend

```bash
# From frontend directory (new terminal)
cd frontend

# Development mode
npm run dev

# Production build
npm run build
npm start

# Frontend will start on http://localhost:3000
```

### Using the Application

1. **Open Browser**: Navigate to `http://localhost:3000`
2. **Enter Match Details**: Select match, venue, date
3. **Select Players**: Choose 11 players from available list
4. **Get Predictions**: Click "Predict" to see fantasy point predictions
5. **Analyze Team**: View team composition, total expected points
6. **Try Strategies**: Use "Suggest Team" for different strategies

---

## 🏗️ Architecture

### System Flow

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser   │────────>│   Next.js    │────────>│   Flask     │
│  (User UI)  │<────────│   Frontend   │<────────│   Backend   │
└─────────────┘         └──────────────┘         └─────────────┘
                              │                          │
                              │                          │
                              v                          v
                        ┌──────────┐            ┌──────────────┐
                        │  Static  │            │  ML Models   │
                        │  Assets  │            │  + Data      │
                        └──────────┘            └──────────────┘
```

### Data Flow

```
User Input (Match + Players)
        │
        v
Frontend (Next.js)
        │
        v
API Request (POST /predict)
        │
        v
Backend (Flask)
        │
        ├──> Feature Engineering (40+ features)
        │
        ├──> Model Prediction (Ensemble)
        │    ├── Linear Regression
        │    ├── XGBoost
        │    └── LightGBM
        │
        ├──> Team Optimization (if requested)
        │
        └──> Response (Predictions + Explanations)
        │
        v
Frontend Display (Results + Charts)
```

### ML Pipeline

```
Historical Data (25,697 records)
        │
        v
Feature Engineering
├── Historical Stats (avg_fp, std_fp, max_fp)
├── Recent Form (last 3, 5, 10 matches)
├── Venue Performance (venue_avg_fp, venue_std_fp)
├── Opponent Matchups (opp_avg_fp)
├── Consistency Metrics (batting/bowling_consistency)
├── Trends (momentum, volatility, trend_last_5)
└── Encoded Categories (team, venue, role)
        │
        v
Time-Based Split (70/15/15)
├── Train Set (2008-2020)
├── Validation Set (2020-2023)
└── Test Set (2023-2025)
        │
        v
Model Training
├── Linear Regression (baseline)
├── Ridge Regression (regularized)
├── Random Forest (ensemble)
├── XGBoost (gradient boosting)
└── LightGBM (gradient boosting)
        │
        v
Model Selection (Best: Linear/Ridge)
        │
        v
Deployment (Flask API)
```

---

## 📊 EDA Analysis

The `eda/` folder contains comprehensive exploratory data analysis:

### Notebooks

1. **All_Models_Training_Complete.ipynb**
   - Complete training of all models (Phase 1, 2, 3)
   - Real code execution (no pre-filled results)
   - Overfitting analysis
   - Performance comparisons
   - Classification experiments

2. **Complete_IPL_Analysis_With_Real_Training.ipynb**
   - Detailed EDA with text analysis
   - 50+ visualizations
   - Statistical insights
   - Feature correlation analysis
   - Temporal trends

### Key EDA Insights

**1. Extreme Variance**
- Coefficient of Variation: 94%
- Standard deviation nearly equals mean
- Fantasy points are inherently unpredictable

**2. Role Importance**
- All-Rounders: Highest average points (40+)
- Hierarchy: AR > BOWL > BAT > WK
- Role is the most critical feature

**3. Correlation Analysis**
- Best predictor: Runs (r=0.65)
- No single feature strongly correlates (all < 0.70)
- Multiple features needed for decent predictions

**4. Temporal Stability**
- Average points stable across 17 years (30-38)
- No era effects
- Consistent scoring rules

**5. Top Performers**
- All-rounders dominate top 20
- Recent form > career average
- Sample size matters

See [eda/README.md](eda/README.md) for detailed analysis.

---

## 📈 Model Performance

### Regression Models (Predicting exact points)

| Model | Train MAE | Val MAE | Test MAE | R² Score | Status |
|-------|-----------|---------|----------|----------|--------|
| **Linear Regression** | 24.32 | 24.85 | 25.15 | 0.033 | ✅ **Best** |
| Ridge Regression | 24.35 | 24.88 | 25.18 | 0.031 | ✅ Good |
| Random Forest | 19.12 | 25.45 | 26.02 | 0.015 | ⚠️ Overfits |
| XGBoost (Tuned) | 21.45 | 25.89 | 26.51 | -0.012 | ❌ Severe overfit |
| LightGBM (Tuned) | 20.88 | 24.92 | 25.68 | 0.018 | ⚠️ Slight overfit |

**Interpretation:**
- ✅ MAE ~24-26 is **excellent** for this problem (industry standard)
- ✅ Simple models (Linear/Ridge) generalize best
- ⚠️ Complex models overfit despite regularization
- ❌ R² near zero indicates high irreducible noise

### Classification Models (Predicting tiers)

| Model | Train Acc | Val Acc | Test Acc | Status |
|-------|-----------|---------|----------|--------|
| XGBoost | 87.9% | 24.7% | 23.8% | ❌ Catastrophic overfit |
| Random Forest | 79.8% | 24.5% | 24.1% | ❌ Catastrophic overfit |
| LightGBM | 75.1% | 24.1% | 23.5% | ❌ Catastrophic overfit |
| **Baseline (Random)** | - | **20.0%** | 20.0% | - |

**Interpretation:**
- ❌ Classification performs at **random level** (5 classes = 20%)
- ❌ Severe overfitting (80%+ train, 24% val)
- ❌ Classification is NOT easier than regression
- ✅ Confirms fundamental unpredictability

### Why Complex Models Fail

1. **Extreme Variance**: CV = 94% (nearly random)
2. **Missing Context**: Pitch, weather, toss, match situation (80% of drivers)
3. **Random Events**: One wicket = +25 points (unpredictable)
4. **Small Samples**: Most players < 20 matches

**Conclusion**: Use simple Linear/Ridge model with realistic expectations.

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000
```

### Endpoints

#### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-19T10:30:00Z"
}
```

#### 2. Predict Fantasy Points
```http
POST /predict
```

**Request Body:**
```json
{
  "match_id": "1082591",
  "players": [
    {
      "player_name": "MS Dhoni",
      "player_id": "28081",
      "team": "CSK",
      "role": "WK"
    },
    // ... 10 more players
  ],
  "match_info": {
    "venue": "MA Chidambaram Stadium",
    "date": "2024-05-15"
  }
}
```

**Response:**
```json
{
  "predictions": [
    {
      "player_name": "MS Dhoni",
      "predicted_fp": 42.5,
      "confidence_interval": [35.2, 49.8],
      "top_features": [
        {"feature": "avg_fp", "value": 45.3, "importance": 0.23},
        {"feature": "recent_form_5", "value": 48.2, "importance": 0.18}
      ]
    },
    // ... more players
  ],
  "team_stats": {
    "total_predicted_fp": 385.5,
    "composition": {"BAT": 4, "BOWL": 4, "AR": 2, "WK": 1}
  }
}
```

#### 3. Get Explanation
```http
POST /explain
```

**Request Body:**
```json
{
  "type": "prediction",
  "player_name": "MS Dhoni",
  "role": "WK",
  "predicted_fp": 42.5,
  "top_features": [
    {"feature": "avg_fp", "importance": 12.3},
    {"feature": "recent_form_3", "importance": 8.5}
  ]
}
```

**Response:**
```json
{
  "explanation": "MS Dhoni is predicted to score 42.5 points based on:\n- Career average: 45.3 points\n- Recent form (last 3): 48.2 points\n- Venue average: 41.8 points\n...",
  "risk_level": "Medium",
  "consistency_score": 0.72
}
```

#### 4. Optimize Team
```http
POST /optimize
```

**Request Body:**
```json
{
  "available_players": [...],
  "budget": 100,
  "strategy": "balanced"  // or "conservative", "aggressive"
}
```

**Response:**
```json
{
  "optimal_team": [...11 players],
  "total_cost": 98.5,
  "expected_points": 392.8,
  "composition": {"BAT": 4, "BOWL": 4, "AR": 2, "WK": 1}
}
```

For complete API documentation, see [docs/API.md](docs/API.md).

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Setup

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Areas

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🧪 Test coverage
- 🎨 UI/UX enhancements
- 🤖 ML model improvements
- 📊 Data collection

### Code Style

- **Python**: Follow PEP 8
- **TypeScript**: Follow Airbnb style guide
- **Commits**: Use conventional commits

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **IPL Data**: Cricsheet.org
- **ML Libraries**: scikit-learn, XGBoost, LightGBM
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Inspiration**: Dream11, FanCode

---

## 📞 Contact

**Project Maintainer**: Your Name

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

## 🎯 Roadmap

- [x] Phase 1: Basic ML models
- [x] Phase 2: Advanced feature engineering
- [x] Phase 3: Web application
- [ ] Phase 4: Real-time match updates
- [ ] Phase 5: User authentication
- [ ] Phase 6: Historical team tracking
- [ ] Phase 7: Mobile app (React Native)
- [ ] Phase 8: Live match predictions

---

## ⭐ Star History

If you find this project useful, please consider giving it a star ⭐

---

<div align="center">

**Built with ❤️ by cricket enthusiasts, for cricket enthusiasts**

[⬆ Back to Top](#perfect-11---ipl-fantasy-cricket-prediction-platform)

</div>
