import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Slider,
  Chip,
  useTheme,
  alpha,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
} from '@mui/material';
import {
  TrendingUp,
  ShowChart,
  Analytics,
  Psychology,
  AcUnit,
  Speed,
  Security,
  AttachMoney,
  AccountBalance,
  Timeline,
  PieChart,
  BarChart,
  Refresh,
  Info,
  CheckCircle,
  Warning,
  Error,
  Star,
  StarBorder,
} from '@mui/icons-material';

const Dashboard = () => {
  const theme = useTheme();
  const [risk, setRisk] = useState(1.0);
  const [esg, setEsg] = useState(0);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [portfolioValue, setPortfolioValue] = useState(100000);
  const [favorites, setFavorites] = useState([]);

  const handleOptimize = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch('http://localhost:5000/api/optimize/mpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          risk, 
          esg, 
          portfolioValue
        })
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError('Failed to optimize portfolio. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskLabel = (value) => {
    if (value <= 0.5) return 'Conservative';
    if (value <= 1.5) return 'Moderate';
    if (value <= 2.5) return 'Aggressive';
    return 'Very Aggressive';
  };

  const getRiskColor = (value) => {
    if (value <= 0.5) return theme.palette.success.main;
    if (value <= 1.5) return theme.palette.warning.main;
    if (value <= 2.5) return theme.palette.error.main;
    return theme.palette.error.dark;
  };

  const getEsgLabel = (value) => {
    if (value <= -0.3) return 'Traditional';
    if (value <= 0.3) return 'Balanced';
    return 'ESG Focused';
  };

  const toggleFavorite = (symbol) => {
    setFavorites(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const getPerformanceColor = (value) => {
    if (value > 0) return theme.palette.success.main;
    if (value < 0) return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
      py: 3
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <AccountBalance sx={{ fontSize: 48, color: theme.palette.primary.main, mr: 2 }} />
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 800,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              OptiFund Pro
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, mb: 3 }}>
            AI-Powered Portfolio Optimization for Institutional Investors
          </Typography>
          
          {/* Status Indicators */}
          <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
            <Grid item>
              <Chip 
                icon={<CheckCircle />} 
                label="Live Market Data" 
                color="success" 
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Grid>
            <Grid item>
              <Chip 
                icon={<Analytics />} 
                label="MPT Algorithm" 
                color="primary" 
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Grid>
            <Grid item>
              <Chip 
                icon={<AcUnit />} 
                label="ESG Integration" 
                color="secondary" 
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Grid>
            <Grid item>
              <Chip 
                icon={<Security />} 
                label="Risk Management" 
                color="info" 
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={4}>
          {/* Controls Panel */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ 
              height: 'fit-content', 
              position: 'sticky', 
              top: 24,
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.paper, 0.9)})`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Timeline sx={{ mr: 2, color: theme.palette.primary.main }} />
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Portfolio Configuration
                  </Typography>
                </Box>

                {/* Portfolio Value */}
                <Box sx={{ mb: 4, p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main }}>
                    Portfolio Value
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
                    ${portfolioValue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Total investment amount
                  </Typography>
                </Box>

                {/* Risk Tolerance */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Psychology sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Risk Tolerance
                    </Typography>
                    <Tooltip title="Higher values indicate higher risk tolerance">
                      <IconButton size="small" sx={{ ml: 1 }}>
                        <Info fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Slider
                    min={0.1}
                    max={3}
                    step={0.1}
                    value={risk}
                    onChange={(_, v) => setRisk(v)}
                    valueLabelDisplay="auto"
                    sx={{
                      '& .MuiSlider-thumb': {
                        backgroundColor: getRiskColor(risk),
                        width: 24,
                        height: 24,
                      },
                      '& .MuiSlider-track': {
                        backgroundColor: getRiskColor(risk),
                        height: 6,
                      },
                      '& .MuiSlider-rail': {
                        height: 6,
                      },
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {getRiskLabel(risk)}
                    </Typography>
                    <Chip 
                      label={risk.toFixed(1)} 
                      size="small" 
                      sx={{ 
                        backgroundColor: alpha(getRiskColor(risk), 0.1),
                        color: getRiskColor(risk),
                        fontWeight: 700,
                        fontSize: '0.875rem'
                      }} 
                    />
                  </Box>
                </Box>

                {/* ESG Preference */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AcUnit sx={{ mr: 1, color: theme.palette.secondary.main }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      ESG Preference
                    </Typography>
                    <Tooltip title="Positive values favor ESG-focused investments">
                      <IconButton size="small" sx={{ ml: 1 }}>
                        <Info fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Slider
                    min={-1}
                    max={1}
                    step={0.1}
                    value={esg}
                    onChange={(_, v) => setEsg(v)}
                    valueLabelDisplay="auto"
                    sx={{
                      '& .MuiSlider-thumb': {
                        backgroundColor: theme.palette.secondary.main,
                        width: 24,
                        height: 24,
                      },
                      '& .MuiSlider-track': {
                        backgroundColor: theme.palette.secondary.main,
                        height: 6,
                      },
                      '& .MuiSlider-rail': {
                        height: 6,
                      },
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {getEsgLabel(esg)}
                    </Typography>
                    <Chip 
                      label={esg.toFixed(1)} 
                      size="small" 
                      sx={{ 
                        backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                        color: theme.palette.secondary.main,
                        fontWeight: 700,
                        fontSize: '0.875rem'
                      }} 
                    />
                  </Box>
                </Box>

                {/* Optimize Button */}
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleOptimize}
                  disabled={loading}
                  sx={{
                    py: 2.5,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[8],
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    <>
                      <Analytics sx={{ mr: 1 }} />
                      Optimize Portfolio
                    </>
                  )}
                </Button>

                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            {!results ? (
              <Card sx={{ 
                height: 500, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.paper, 0.9)})`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <ShowChart sx={{ fontSize: 120, color: alpha(theme.palette.primary.main, 0.2), mb: 3 }} />
                  <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 500, mb: 2 }}>
                    Ready to Optimize Your Portfolio?
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
                    Configure your risk tolerance and ESG preferences, then click "Optimize Portfolio" to generate your personalized investment strategy.
                  </Typography>
                </Box>
              </Card>
            ) : (
              <Box>
                {/* Portfolio Overview Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                      textAlign: 'center', 
                      p: 3,
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.main, 0.1)})`,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                    }}>
                      <AttachMoney sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
                      <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
                        ${portfolioValue.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Portfolio Value
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                      textAlign: 'center', 
                      p: 3,
                      background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)}, ${alpha(theme.palette.success.main, 0.1)})`,
                      border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                    }}>
                      <TrendingUp sx={{ fontSize: 48, color: theme.palette.success.main, mb: 2 }} />
                      <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.success.main }}>
                        {results.metrics?.sharpe?.toFixed(2) || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Sharpe Ratio
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                      textAlign: 'center', 
                      p: 3,
                      background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.05)}, ${alpha(theme.palette.warning.main, 0.1)})`,
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
                    }}>
                      <Speed sx={{ fontSize: 48, color: theme.palette.warning.main, mb: 2 }} />
                      <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.warning.main }}>
                        {results.metrics?.volatility ? (results.metrics.volatility * 100).toFixed(1) : 'N/A'}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Volatility
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                      textAlign: 'center', 
                      p: 3,
                      background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.05)}, ${alpha(theme.palette.error.main, 0.1)})`,
                      border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
                    }}>
                      <Security sx={{ fontSize: 48, color: theme.palette.error.main, mb: 2 }} />
                      <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.error.main }}>
                        {results.metrics?.drawdown ? (results.metrics.drawdown * 100).toFixed(1) : 'N/A'}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Max Drawdown
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>

                {/* Portfolio Composition */}
                <Card sx={{ 
                  mb: 4,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.paper, 0.9)})`,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <PieChart sx={{ mr: 2, color: theme.palette.primary.main }} />
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Portfolio Composition
                      </Typography>
                      <IconButton onClick={handleOptimize} sx={{ ml: 'auto' }}>
                        <Refresh />
                      </IconButton>
                    </Box>
                    
                    {results.composition && (
                      <Grid container spacing={2}>
                        {results.composition.slice(0, 8).map((asset, index) => (
                          <Grid item xs={12} sm={6} md={4} key={asset.symbol}>
                            <Card sx={{ 
                              p: 3,
                              background: alpha(theme.palette.background.paper, 0.5),
                              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: theme.shadows[4],
                                transition: 'all 0.3s ease',
                              }
                            }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box>
                                  <Typography variant="h6" fontWeight={700} sx={{ color: theme.palette.primary.main }}>
                                    {asset.symbol}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    {asset.name}
                                  </Typography>
                                  <Chip 
                                    label={asset.sector} 
                                    size="small" 
                                    sx={{ mt: 1, fontSize: '0.75rem' }}
                                  />
                                </Box>
                                <IconButton 
                                  size="small" 
                                  onClick={() => toggleFavorite(asset.symbol)}
                                  sx={{ color: favorites.includes(asset.symbol) ? theme.palette.warning.main : theme.palette.text.secondary }}
                                >
                                  {favorites.includes(asset.symbol) ? <Star /> : <StarBorder />}
                                </IconButton>
                              </Box>
                              
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Allocation
                                </Typography>
                                <Typography variant="h6" fontWeight={700}>
                                  {(asset.weight * 100).toFixed(1)}%
                                </Typography>
                              </Box>
                              
                              <LinearProgress 
                                variant="determinate" 
                                value={asset.weight * 100} 
                                sx={{ 
                                  height: 8, 
                                  borderRadius: 4,
                                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                  '& .MuiLinearProgress-bar': {
                                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                  }
                                }} 
                              />
                              
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Value
                                </Typography>
                                <Typography variant="body1" fontWeight={600}>
                                  ${asset.value?.toLocaleString()}
                                </Typography>
                              </Box>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </CardContent>
                </Card>

                {/* Risk-Return Chart */}
                <Card sx={{ 
                  p: 4,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.paper, 0.9)})`,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <BarChart sx={{ mr: 2, color: theme.palette.primary.main }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Risk-Return Profile
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    position: 'relative', 
                    height: 400, 
                    background: alpha(theme.palette.primary.main, 0.02), 
                    borderRadius: 3, 
                    p: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                  }}>
                    <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                      {/* Grid lines */}
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <line
                          key={`grid-${i}`}
                          x1={0}
                          y1={i * 66.67}
                          x2="100%"
                          y2={i * 66.67}
                          stroke={alpha(theme.palette.text.primary, 0.1)}
                          strokeWidth={1}
                        />
                      ))}
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <line
                          key={`grid-v-${i}`}
                          x1={i * 20}
                          y1={0}
                          x2={i * 20}
                          y2="100%"
                          stroke={alpha(theme.palette.text.primary, 0.1)}
                          strokeWidth={1}
                        />
                      ))}
                      
                      {/* Risk-Return points */}
                      {results.riskReturn?.map((pt, i) => (
                        <circle
                          key={i}
                          cx={`${(pt.risk / 0.05) * 20}%`}
                          cy={`${100 - (pt.return / 0.3) * 100}%`}
                          r={6}
                          fill={theme.palette.primary.main}
                          opacity={0.7}
                        />
                      ))}
                      
                      {/* Current portfolio point */}
                      <circle
                        cx={`${(results.metrics?.volatility / 0.05) * 20}%`}
                        cy={`${100 - ((results.metrics?.expected_return || 0.1) / 0.3) * 100}%`}
                        r={12}
                        fill={theme.palette.secondary.main}
                        stroke={theme.palette.secondary.dark}
                        strokeWidth={3}
                      />
                      
                      {/* Labels */}
                      <text x="50%" y="95%" textAnchor="middle" fontSize={14} fill={theme.palette.text.secondary} fontWeight={600}>
                        Risk (Volatility)
                      </text>
                      <text x="5%" y="50%" textAnchor="middle" fontSize={14} fill={theme.palette.text.secondary} fontWeight={600} transform="rotate(-90, 5%, 50%)">
                        Return (Annualized)
                      </text>
                    </svg>
                  </Box>
                </Card>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard; 