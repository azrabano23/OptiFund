# OptiFund Backend

## Setup

1. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Server

```bash
python app.py
```

## Endpoints
- `/` : Health check
- `/api/optimize/mpt` : (POST) Placeholder for MPT optimization
- `/api/optimize/rl` : (POST) Placeholder for RL optimization

## Notes
- Data engineering and RL modules will be integrated via the respective endpoints. 