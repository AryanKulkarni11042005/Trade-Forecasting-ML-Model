# TradeCast: Macro-Economic Trade Forecasting AI

TradeCast is an advanced, full-stack application designed to forecast India's trade deficit using machine learning and historical macro-economic data. Built with an intuitive single-page, minimalist interface, it transforms complex trade dynamics into a readable narrative of economic health.

## 🚀 Features

- **Live Market Integration**: Fetches real-time USD/INR exchange rates and Brent crude oil prices to keep models accurate.
- **Interactive Simulator**: Adjust core macroeconomic indicators (Oil Prices, USD/INR, specific country imports) and instantly see the simulated impact on India's trade deficit.
- **Model Explainability**: Visual breakdowns showing exactly which features (like `usd_oil_interaction`, lags, or rolling means) most strongly influence the current prediction.
- **Data Explorer**: A historical view of all the trade and macro features the model was trained on.
- **Dark/Light Mode**: Fully responsive, sleek UI using custom design tokens and smooth Framer Motion animations.

## 🛠 Tech Stack

### Frontend
- **React 19** & **Vite**: Ultra-fast frontend framework and bundler.
- **Tailwind CSS v4**: For highly customized, utility-first styling and neumorphic design components.
- **Framer Motion**: For fluid layout transitions, fade-ins, and complex animations.
- **Recharts**: For dynamic, interactive data visualization (Forecast and Explainability charts).
- **Zustand**: Lightweight global state management for UI themes and navigation states.

### Backend
- **FastAPI**: High-performance Python backend handling real-time prediction routing and simulation logic.
- **CatBoost**: Powerful gradient-boosting ML model trained to forecast the trade deficit utilizing deep feature engineering.
- **Pandas & NumPy**: For extensive data wrangling, rolling statistics, and feature generation.
- **yfinance**: For fetching live, real-time USD/INR market data.

## 📂 Project Structure

```text
Trade-Forecasting-ML-Model/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI Application Entrypoint
│   │   ├── routes/                 # API Endpoints (dashboard, forecast, simulate, etc.)
│   │   ├── utils/                  # Model loaders and feature engineering logic
│   │   ├── schemas/                # Pydantic schemas for request validation
│   │   └── model/                  # Trained CatBoost model (.cbm) & pickeled features
│   ├── dataset_creation/           # Scripts for generating raw market data
│   ├── requirements.txt            # Python dependencies
│   └── .env                        # Backend environment variables
├── trade-forecast-frontend/
│   ├── src/
│   │   ├── components/             # Reusable UI components (Sidebar, TopBar, Cards)
│   │   ├── pages/                  # Main views (Dashboard, Forecast, Simulate, etc.)
│   │   ├── services/               # Axios API client setup
│   │   ├── store/                  # Zustand state slices
│   │   └── index.css               # Core Tailwind layer and Design Tokens
│   ├── package.json                # Frontend dependencies
│   └── vite.config.ts              # Vite configuration
├── final_dataset_2011_2025.csv     # The cleaned dataset used for training/baseline
└── README.md                       # You are here!
```

## ⚙️ Local Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/AryanKulkarni11042005/Trade-Forecasting-ML-Model.git
cd Trade-Forecasting-ML-Model
```

### 2. Backend Setup
Navigate to the backend folder and set up a Python virtual environment:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

Install the dependencies:
```bash
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:
```bash
# backend/.env
UNCOMTRADE_API_KEY=your_api_key_here
EIA_API_KEY=your_api_key_here
EXCHANGE_RATE_API_KEY=your_api_key_here
```

Start the FastAPI server:
```bash
uvicorn app.main:app --reload --port 8000
```
*The API will be running at `http://localhost:8000`*

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend folder:
```bash
cd trade-forecast-frontend
```

Install Node.js dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```
*The application will be running at `http://localhost:5173`*

## 🧠 Machine Learning Details

The core intelligence engine uses a **CatBoostRegressor**. Extensive feature engineering was performed on raw trade data to capture the non-linear dynamics of macro-economics:
- **Lags & Rolling Statistics**: Capturing momentum in trade deficits (1-month, 3-month, 6-month, 12-month rolling means).
- **Macro Interactions**: Features like `usd_oil_interaction` account for the compounded effect of a weak rupee and high oil prices.
- **Regime Flags**: Dummy variables tracking significant global shifts (e.g., COVID-19 pandemic, geopolitical wars) to contextualize drastic market movements.

---
*Made with ❤️ and Hardwork by Aryan Kulkarni*
