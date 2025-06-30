from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
from mpt import mpt_optimize
from backtest import backtest_portfolio, sharpe_ratio, volatility, max_drawdown

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return jsonify({"message": "OptiFund backend is running."})

@app.route('/api/optimize/mpt', methods=['POST'])
def optimize_mpt():
    data = request.get_json()
    risk = float(data.get('risk', 1.0))
    esg = float(data.get('esg', 0))

    # === STUB: Replace with real data engineering ===
    np.random.seed(42)
    n_assets = 5
    n_days = 252 * 3
    expected_returns = np.random.uniform(0.05, 0.15, n_assets)
    cov_matrix = np.random.uniform(0.01, 0.03, (n_assets, n_assets))
    cov_matrix = (cov_matrix + cov_matrix.T) / 2 + n_assets * np.eye(n_assets) * 0.01
    # Simulate daily returns
    returns = np.random.normal(expected_returns / 252, 0.01, (n_days, n_assets))
    # === END STUB ===

    weights = mpt_optimize(expected_returns, cov_matrix, risk_aversion=risk)
    port_returns, cum_returns = backtest_portfolio(weights, returns)
    sharpe = sharpe_ratio(port_returns)
    vol = volatility(port_returns)
    draw = max_drawdown(cum_returns)
    # Risk-return map (simulate efficient frontier)
    risk_return = []
    for r in np.linspace(0.5, 3, 7):
        w = mpt_optimize(expected_returns, cov_matrix, risk_aversion=r)
        pr, _ = backtest_portfolio(w, returns)
        risk_return.append({
            'risk': float(volatility(pr)),
            'return': float(np.mean(pr) * 252)
        })
    return jsonify({
        'weights': weights.tolist(),
        'sharpe': float(sharpe),
        'volatility': float(vol),
        'drawdown': float(draw),
        'riskReturn': risk_return
    })

# Placeholder for RL optimization endpoint
@app.route('/api/optimize/rl', methods=['POST'])
def optimize_rl():
    # TODO: Integrate with RL module for agent-based optimization
    return jsonify({"message": "RL optimization endpoint (to be implemented)"})

if __name__ == '__main__':
    app.run(debug=True) 