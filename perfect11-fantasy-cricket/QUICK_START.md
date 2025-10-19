# Quick Start Guide - Perfect 11

Get up and running with Perfect 11 in 5 minutes!

## 🚀 Prerequisites

Make sure you have:
- ✅ Python 3.8+
- ✅ Node.js 18+
- ✅ npm 9+
- ✅ Git

## 📦 Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/perfect11-fantasy-cricket.git
cd perfect11-fantasy-cricket
```

## 🐍 Step 2: Setup Backend (3 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start server
python app.py
```

✅ Backend should now be running on `http://localhost:5000`

**Test it**:
```bash
curl http://localhost:5000/health
# Should return: {"status": "healthy"}
```

---

## 💻 Step 3: Setup Frontend (2 minutes)

Open a **new terminal** (keep backend running):

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend should now be running on `http://localhost:3000`

**Test it**: Open browser and go to `http://localhost:3000`

---

## 🎮 Step 4: Use the App

1. **Open**: http://localhost:3000 in your browser
2. **Select Match**: Choose venue, date
3. **Pick Players**: Select 11 players
4. **Predict**: Click "Get Predictions"
5. **Analyze**: View predicted fantasy points

---

## 🔍 Step 5: Explore EDA (Optional)

```bash
# Install Jupyter
pip install jupyter

# Start Jupyter
jupyter notebook

# Navigate to eda/ folder
# Open: Complete_IPL_Analysis_With_Real_Training.ipynb
```

---

## 🐛 Troubleshooting

### Backend Issues

**Error**: "Module not found: flask"
```bash
# Make sure virtual environment is activated
pip install -r requirements.txt
```

**Error**: "Port 5000 already in use"
```bash
# Kill existing process or change port in app.py
```

### Frontend Issues

**Error**: "Module not found"
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Error**: "Port 3000 already in use"
```bash
# Change port in package.json or kill existing process
```

---

## 📚 Next Steps

- Read full [README.md](README.md)
- Explore [EDA notebooks](eda/README.md)
- Check [API documentation](docs/API.md)
- Review [Architecture](docs/ARCHITECTURE.md)

---

## 🎯 Common Tasks

### Run Backend Tests
```bash
cd backend
python test_backend.py
```

### Build Frontend for Production
```bash
cd frontend
npm run build
npm start
```

### View EDA Notebooks
```bash
jupyter notebook eda/
```

---

## 💡 Tips

- Keep backend and frontend running in separate terminals
- Backend changes require restart
- Frontend has hot-reload (no restart needed)
- Check browser console for errors
- Use `ctrl+c` to stop servers

---

**Happy Coding! 🏏⚾**
