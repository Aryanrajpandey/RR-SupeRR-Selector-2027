# SupeRR Selector 2027 — Pressure. Proof. Picks.

An interactive Rajasthan Royals 2027 scouting dashboard with a **separate static frontend and Python FastAPI backend**, based on the 11-page independent methodology report (analysis cut: 12 Nov 2026).

## Folder structure

```text
RR_SupeRR_Selector_2027_GitHub_Ready/
├── frontend/
│   ├── index.html             # dashboard, no build step
│   ├── config.js              # optional deployed API URL
│   ├── assets/
│   │   ├── styles.css
│   │   └── app.js
│   └── data/
│       ├── players.json       # bundled snapshot; GitHub Pages ready
│       └── metadata.json
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI routes
│   │   ├── players.json
│   │   └── metadata.json
│   ├── tests/test_data.py
│   ├── requirements.txt
│   ├── .env.example
│   └── Procfile
├── .github/workflows/pages.yml
├── render.yaml
└── README.md
```

## Deploy the dashboard on GitHub Pages (no backend required)

1. Create a **public GitHub repository**, e.g. `rr-superr-selector-2027`.
2. Upload the **contents** of this project directory, including the hidden `.github` folder, to the repository's **main** branch. You can use GitHub's **Add file → Upload files**, or `git add . && git commit -m "Initial dashboard" && git push -u origin main`.
3. Go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Go to **Actions** and verify the **Deploy frontend to GitHub Pages** workflow completed successfully; if required, manually run it with **Run workflow**.
5. Your site will be at `https://YOUR_USERNAME.github.io/rr-superr-selector-2027/` (replace with your real username and repository name). Paste this URL into the challenge dashboard-link field.

The frontend includes bundled JSON and works **even if you don't deploy the backend**. It has no npm or external runtime dependencies. GitHub Pages hosts static websites only — it cannot run Python.

## Optional backend (Render)

1. Push the same repository to GitHub.
2. In Render, create a **Blueprint** from this GitHub repo using `render.yaml`, or create a Python Web Service with **Root Directory: `backend`**, **Build Command: `pip install -r requirements.txt`**, **Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`**.
3. Once deployed, check `https://YOUR-SERVICE.onrender.com/api/health` and `/docs`.
4. Set `window.RR_API_BASE = "https://YOUR-SERVICE.onrender.com";` in `frontend/config.js`, commit/push to `main`, and the GitHub Pages site will fetch live data. If the API is unavailable, the frontend falls back to bundled data.
5. For tighter CORS control, set backend `ALLOWED_ORIGINS=https://YOUR_USERNAME.github.io` in your service environment (the exact origin, without a trailing path).

**Note:** Render's free services may sleep when idle. The bundled static fallback prevents blank dashboards. Backend is read-only and returns report-derived summary data (no proprietary ball-by-ball source files).

## Run locally

Frontend: from the repo root, run `python -m http.server 5500 --directory frontend` and open `http://localhost:5500`.

Backend (separate terminal):

```bash
cd backend
python -m venv .venv
# macOS/Linux: source .venv/bin/activate
# Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API documentation: `http://127.0.0.1:8000/docs`. To connect local UI to local API, set `window.RR_API_BASE = "http://127.0.0.1:8000";` in `frontend/config.js`.

### API routes

| Route | Purpose |
| --- | --- |
| `GET /api/health` | health check |
| `GET /api/summary` | source/pressure summary |
| `GET /api/players` | all 20 players; `?kind=Bowler&q=nar&sort=score` |
| `GET /api/players/{player_name}` | individual player lookup |
| `GET /api/watchlist` | six conditional RR watchlist suggestions |

Run data integrity tests: `cd backend && python -m unittest discover -s tests -v`.

## Important analysis notes

- Figures are reproduced from the supplied **RR_2027_SupeRR_Selector_Methodology_Report (2).pdf** and should not be treated as independently updated predictions.
- The original report includes 200,999 source deliveries, 195,303 analysed deliveries, 819 valid matches, and 41.2% pressure-flagged events.
- Batting and bowling top 10 are **performance rankings**, not confirmed IPL 2027 auction availability or price recommendations.
- Some players have zero IPL exposure in the provided pack; this matters when interpreting cross-competition results.
- The original proprietary ball-by-ball CSV files are **not included** in this public-ready repository, only aggregated derived player metrics.
- Dashboard is an independent student analysis, **not an official Rajasthan Royals product or endorsed website**.
