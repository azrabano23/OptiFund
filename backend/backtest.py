import numpy as np

def backtest_portfolio(weights, returns):
    # weights: (n_assets,)
    # returns: (n_days, n_assets)
    portfolio_returns = returns @ weights
    cumulative_returns = np.cumprod(1 + portfolio_returns) - 1
    return portfolio_returns, cumulative_returns

def sharpe_ratio(portfolio_returns, risk_free_rate=0.0):
    excess_returns = portfolio_returns - risk_free_rate / 252
    return np.mean(excess_returns) / np.std(excess_returns) * np.sqrt(252)

def volatility(portfolio_returns):
    return np.std(portfolio_returns) * np.sqrt(252)

def max_drawdown(cumulative_returns):
    peak = np.maximum.accumulate(cumulative_returns)
    drawdown = (cumulative_returns - peak) / peak
    return np.min(drawdown) 