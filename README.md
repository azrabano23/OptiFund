# OptiFund - AI-Powered Portfolio Optimization

A modern, sleek web application for AI-powered portfolio optimization using Modern Portfolio Theory (MPT) and machine learning algorithms.

## Features

- 🎯 **Modern Portfolio Theory Optimization** - Advanced portfolio optimization using MPT
- 🎨 **Sleek Modern UI** - Beautiful, responsive design with Material-UI
- 📊 **Interactive Charts** - Real-time risk-return visualization
- ⚡ **Real-time Optimization** - Instant portfolio optimization results
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🌱 **ESG Integration** - Environmental, Social, and Governance preferences

## Tech Stack

### Backend
- **Python 3.x** - Core programming language
- **Flask** - Web framework
- **CVXPY** - Convex optimization library
- **NumPy** - Numerical computing
- **Flask-CORS** - Cross-origin resource sharing

### Frontend
- **React 19** - Modern React with latest features
- **Material-UI 5** - Beautiful component library
- **React Router** - Client-side routing
- **Inter Font** - Modern typography

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the backend server:
```bash
python app.py
```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be running on `http://localhost:3000`

## Usage

1. Open your browser and go to `http://localhost:3000`
2. Adjust the **Risk Tolerance** slider (0.1 - 3.0)
3. Adjust the **ESG Preference** slider (-1.0 to 1.0)
4. Click **"Optimize Portfolio"** to generate your optimal portfolio
5. View the results including:
   - Sharpe Ratio
   - Volatility
   - Maximum Drawdown
   - Risk-Return Profile Chart

## API Endpoints

### POST `/api/optimize/mpt`
Optimizes portfolio using Modern Portfolio Theory.

**Request Body:**
```json
{
  "risk": 1.0,
  "esg": 0.0
}
```

**Response:**
```json
{
  "weights": [0.2, 0.3, 0.1, 0.25, 0.15],
  "sharpe": 1.25,
  "volatility": 0.15,
  "drawdown": 0.08,
  "riskReturn": [...]
}
```

## Project Structure

```
OptiFund/
├── backend/
│   ├── app.py          # Flask application
│   ├── mpt.py          # MPT optimization logic
│   ├── backtest.py     # Backtesting functions
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.js      # Main application component
│   │   ├── pages/
│   │   │   └── Dashboard.js  # Main dashboard
│   │   └── App.css     # Global styles
│   └── package.json
└── README.md
```

## Development

### Backend Development
- The backend uses Flask with CORS enabled for frontend communication
- MPT optimization is implemented in `mpt.py`
- Backtesting functions are in `backtest.py`

### Frontend Development
- Built with React 19 and Material-UI 5
- Modern responsive design with smooth animations
- Real-time data visualization
- Mobile-first approach

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue on GitHub. 