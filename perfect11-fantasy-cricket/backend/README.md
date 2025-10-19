# Perfect 11 Backend

Flask backend API for Perfect 11 fantasy cricket prediction platform.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip

### Installation

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server
python app.py
```

Server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── app.py                  # Main Flask application
├── modules/                # Python modules
│   ├── predictor.py       # ML prediction logic
│   ├── team_optimizer.py  # Team optimization
│   └── explainer.py       # Model explanations
├── model_artifacts/        # Trained models
│   ├── ProductUI_Model.pkl
│   ├── scaler.pkl
│   └── encoders.pkl
└── requirements.txt        # Dependencies
```

## 🔌 API Endpoints

### Health Check
```bash
curl http://localhost:5000/health
```

### Predict Fantasy Points
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d @sample_request.json
```

### Get Explanation
```bash
curl -X POST http://localhost:5000/explain \
  -H "Content-Type: application/json" \
  -d '{...}'
```

## 🤖 ML Models

- **Primary Model**: Linear Regression
- **Fallback Models**: Ridge, Random Forest
- **Features**: 40+ engineered features
- **Performance**: MAE ~24-26 points

## 📊 Model Artifacts

The `model_artifacts/` folder contains:
- Trained models (`.pkl` files)
- Feature scalers
- Label encoders
- Feature importance data

## 🧪 Testing

```bash
# Run tests
python test_backend.py

# Test with sample match
python -c "
import requests
response = requests.post('http://localhost:5000/health')
print(response.json())
"
```

## 🔧 Configuration

Environment variables (optional):
- `FLASK_ENV`: development/production
- `PORT`: Server port (default: 5000)
- `HOST`: Server host (default: 0.0.0.0)

## 🤝 Contributing

See main [README.md](../README.md) for contribution guidelines.
