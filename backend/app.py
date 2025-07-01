from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import pandas as pd
from mpt import mpt_optimize
from backtest import backtest_portfolio, sharpe_ratio, volatility, max_drawdown
import json
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Global variables for caching
PORTFOLIO_CACHE = {}
ASSET_DATA = {}

# Sample asset universe based on the Yahoo Finance dataset
ASSET_UNIVERSE = [
    {'symbol': 'AAPL', 'name': 'Apple Inc.', 'sector': 'Technology', 'base_return': 0.12, 'base_vol': 0.25},
    {'symbol': 'MSFT', 'name': 'Microsoft Corp.', 'sector': 'Technology', 'base_return': 0.15, 'base_vol': 0.28},
    {'symbol': 'GOOGL', 'name': 'Alphabet Inc.', 'sector': 'Technology', 'base_return': 0.14, 'base_vol': 0.30},
    {'symbol': 'AMZN', 'name': 'Amazon.com Inc.', 'sector': 'Consumer Discretionary', 'base_return': 0.18, 'base_vol': 0.35},
    {'symbol': 'TSLA', 'name': 'Tesla Inc.', 'sector': 'Consumer Discretionary', 'base_return': 0.25, 'base_vol': 0.45},
    {'symbol': 'JPM', 'name': 'JPMorgan Chase & Co.', 'sector': 'Financials', 'base_return': 0.08, 'base_vol': 0.22},
    {'symbol': 'JNJ', 'name': 'Johnson & Johnson', 'sector': 'Healthcare', 'base_return': 0.06, 'base_vol': 0.18},
    {'symbol': 'V', 'name': 'Visa Inc.', 'sector': 'Financials', 'base_return': 0.12, 'base_vol': 0.24},
    {'symbol': 'PG', 'name': 'Procter & Gamble Co.', 'sector': 'Consumer Staples', 'base_return': 0.07, 'base_vol': 0.16},
    {'symbol': 'UNH', 'name': 'UnitedHealth Group Inc.', 'sector': 'Healthcare', 'base_return': 0.14, 'base_vol': 0.26},
    {'symbol': 'HD', 'name': 'Home Depot Inc.', 'sector': 'Consumer Discretionary', 'base_return': 0.10, 'base_vol': 0.20},
    {'symbol': 'MA', 'name': 'Mastercard Inc.', 'sector': 'Financials', 'base_return': 0.13, 'base_vol': 0.25},
    {'symbol': 'DIS', 'name': 'Walt Disney Co.', 'sector': 'Communication Services', 'base_return': 0.09, 'base_vol': 0.28},
    {'symbol': 'PYPL', 'name': 'PayPal Holdings Inc.', 'sector': 'Financials', 'base_return': 0.16, 'base_vol': 0.32},
    {'symbol': 'NFLX', 'name': 'Netflix Inc.', 'sector': 'Communication Services', 'base_return': 0.20, 'base_vol': 0.40}
]

def generate_realistic_data(n_assets=15, n_days=252*3):
    """Generate realistic market data for portfolio optimization"""
    np.random.seed(42)  # For reproducibility
    
    # Extract base returns and volatilities from global ASSET_UNIVERSE
    base_returns = np.array([asset['base_return'] for asset in ASSET_UNIVERSE])
    base_volatilities = np.array([asset['base_vol'] for asset in ASSET_UNIVERSE])
    
    # Generate correlation matrix with realistic structure
    correlation_matrix = np.eye(n_assets)
    
    # Add sector-based correlations
    sectors = [asset['sector'] for asset in ASSET_UNIVERSE]
    for i in range(n_assets):
        for j in range(i+1, n_assets):
            if sectors[i] == sectors[j]:
                # Same sector: higher correlation
                correlation_matrix[i, j] = correlation_matrix[j, i] = np.random.uniform(0.3, 0.6)
            else:
                # Different sectors: lower correlation
                correlation_matrix[i, j] = correlation_matrix[j, i] = np.random.uniform(0.1, 0.3)
    
    # Ensure correlation matrix is positive-semidefinite
    # Add small diagonal elements to ensure positive definiteness
    correlation_matrix += np.eye(n_assets) * 0.01
    
    # Generate covariance matrix
    cov_matrix = np.zeros((n_assets, n_assets))
    for i in range(n_assets):
        for j in range(n_assets):
            cov_matrix[i, j] = correlation_matrix[i, j] * base_volatilities[i] * base_volatilities[j] / np.sqrt(252)
    
    # Ensure covariance matrix is positive-semidefinite
    eigenvals, eigenvecs = np.linalg.eigh(cov_matrix)
    eigenvals = np.maximum(eigenvals, 1e-8)  # Ensure positive eigenvalues
    cov_matrix = eigenvecs @ np.diag(eigenvals) @ eigenvecs.T
    
    # Generate daily returns using Cholesky decomposition for numerical stability
    try:
        L = np.linalg.cholesky(cov_matrix)
        z = np.random.standard_normal((n_days, n_assets))
        returns = (base_returns / 252).reshape(1, -1) + z @ L.T
    except np.linalg.LinAlgError:
        # Fallback: use eigenvalue decomposition
        eigenvals, eigenvecs = np.linalg.eigh(cov_matrix)
        eigenvals = np.maximum(eigenvals, 1e-8)
        L = eigenvecs @ np.diag(np.sqrt(eigenvals))
        z = np.random.standard_normal((n_days, n_assets))
        returns = (base_returns / 252).reshape(1, -1) + z @ L.T
    
    return base_returns, cov_matrix, returns

@app.route('/')
def index():
    return jsonify({
        "message": "OptiFund backend is running.",
        "version": "2.0.0",
        "endpoints": {
            "optimize": "/api/optimize/mpt",
            "assets": "/api/assets",
            "portfolio": "/api/portfolio/<id>",
            "compare": "/api/compare",
            "metrics": "/api/metrics"
        }
    })

@app.route('/api/assets')
def get_assets():
    """Get available assets for portfolio construction"""
    return jsonify({
        'assets': ASSET_UNIVERSE,
        'total': len(ASSET_UNIVERSE),
        'sectors': list(set([asset['sector'] for asset in ASSET_UNIVERSE]))
    })

@app.route('/api/optimize/mpt', methods=['POST'])
def optimize_mpt():
    try:
        data = request.get_json()
        risk = float(data.get('risk', 1.0))
        esg = float(data.get('esg', 0))
        portfolio_value = float(data.get('portfolioValue', 100000))
        timeframe = data.get('timeframe', '1Y')

        # Generate realistic market data
        expected_returns, cov_matrix, returns = generate_realistic_data()
        
        # Apply ESG adjustments if needed
        if esg != 0:
            # Simple ESG adjustment - in practice, this would use real ESG scores
            esg_adjustment = esg * 0.02  # 2% adjustment for ESG preference
            expected_returns += esg_adjustment

        # Optimize portfolio
        weights = mpt_optimize(expected_returns, cov_matrix, risk_aversion=risk)
        
        # Backtest the portfolio
        port_returns, cum_returns = backtest_portfolio(weights, returns)
        
        # Calculate metrics
        sharpe = sharpe_ratio(port_returns)
        vol = volatility(port_returns)
        drawdown = max_drawdown(cum_returns)
        
        # Generate efficient frontier points
        risk_return = []
        for r in np.linspace(0.5, 3, 10):
            w = mpt_optimize(expected_returns, cov_matrix, risk_aversion=r)
            pr, _ = backtest_portfolio(w, returns)
            risk_return.append({
                'risk': float(volatility(pr)),
                'return': float(np.mean(pr) * 252),
                'sharpe': float(sharpe_ratio(pr))
            })

        # Calculate portfolio composition
        portfolio_composition = []
        for i, asset in enumerate(ASSET_UNIVERSE):
            portfolio_composition.append({
                'symbol': asset['symbol'],
                'name': asset['name'],
                'sector': asset['sector'],
                'weight': float(weights[i]),
                'value': float(weights[i] * portfolio_value),
                'expectedReturn': float(expected_returns[i]),
                'risk': float(np.sqrt(cov_matrix[i, i] * 252))
            })

        # Calculate sector allocation
        sector_allocation = {}
        for asset in portfolio_composition:
            sector = asset['sector']
            if sector not in sector_allocation:
                sector_allocation[sector] = {'weight': 0, 'value': 0, 'assets': []}
            sector_allocation[sector]['weight'] += asset['weight']
            sector_allocation[sector]['value'] += asset['value']
            sector_allocation[sector]['assets'].append(asset['symbol'])

        # Generate portfolio ID for caching
        portfolio_id = f"portfolio_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Cache the portfolio
        PORTFOLIO_CACHE[portfolio_id] = {
            'weights': weights.tolist(),
            'composition': portfolio_composition,
            'sector_allocation': sector_allocation,
            'parameters': {'risk': risk, 'esg': esg, 'portfolio_value': portfolio_value},
            'created_at': datetime.now().isoformat()
        }

        return jsonify({
            'portfolio_id': portfolio_id,
            'weights': weights.tolist(),
            'composition': portfolio_composition,
            'sector_allocation': sector_allocation,
            'metrics': {
                'sharpe': float(sharpe),
                'volatility': float(vol),
                'drawdown': float(drawdown),
                'expected_return': float(np.mean(port_returns) * 252),
                'var_95': float(np.percentile(port_returns, 5) * np.sqrt(252)),
                'beta': 0.85,  # Placeholder - would be calculated vs market
                'correlation': 0.72  # Placeholder - would be calculated
            },
            'riskReturn': risk_return,
            'performance': {
                'total_return': float(cum_returns[-1]),
                'annualized_return': float(np.mean(port_returns) * 252),
                'best_day': float(np.max(port_returns)),
                'worst_day': float(np.min(port_returns)),
                'positive_days': int(np.sum(port_returns > 0)),
                'total_days': len(port_returns)
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/portfolio/<portfolio_id>')
def get_portfolio(portfolio_id):
    """Get cached portfolio details"""
    if portfolio_id in PORTFOLIO_CACHE:
        return jsonify(PORTFOLIO_CACHE[portfolio_id])
    else:
        return jsonify({'error': 'Portfolio not found'}), 404

@app.route('/api/compare', methods=['POST'])
def compare_portfolios():
    """Compare multiple portfolios"""
    try:
        data = request.get_json()
        portfolio_ids = data.get('portfolio_ids', [])
        
        portfolios = []
        for pid in portfolio_ids:
            if pid in PORTFOLIO_CACHE:
                portfolios.append({
                    'id': pid,
                    'data': PORTFOLIO_CACHE[pid]
                })
        
        if not portfolios:
            return jsonify({'error': 'No valid portfolios found'}), 400
            
        return jsonify({
            'comparison': portfolios,
            'summary': {
                'total_portfolios': len(portfolios),
                'best_sharpe': max(p['data']['metrics']['sharpe'] for p in portfolios),
                'lowest_volatility': min(p['data']['metrics']['volatility'] for p in portfolios)
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/metrics')
def get_metrics():
    """Get overall system metrics"""
    return jsonify({
        'total_portfolios': len(PORTFOLIO_CACHE),
        'active_since': min([p['created_at'] for p in PORTFOLIO_CACHE.values()]) if PORTFOLIO_CACHE else None,
        'available_assets': len(ASSET_UNIVERSE),
        'sectors': list(set([asset['sector'] for asset in ASSET_UNIVERSE]))
    })

# Placeholder for RL optimization endpoint
@app.route('/api/optimize/rl', methods=['POST'])
def optimize_rl():
    # TODO: Integrate with RL module for agent-based optimization
    return jsonify({
        "message": "RL optimization endpoint (to be implemented)",
        "status": "coming_soon"
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 