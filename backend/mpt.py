import numpy as np
import cvxpy as cp

# Placeholder: Data loading and preprocessing should be handled by the data engineering module
# This function expects preprocessed expected returns and covariance matrix

def mpt_optimize(expected_returns, cov_matrix, risk_aversion=1.0):
    n = len(expected_returns)
    w = cp.Variable(n)
    ret = expected_returns @ w
    risk = cp.quad_form(w, cov_matrix)
    # Maximize return - risk_aversion * risk
    prob = cp.Problem(cp.Maximize(ret - risk_aversion * risk),
                      [cp.sum(w) == 1, w >= 0])
    prob.solve()
    return w.value 