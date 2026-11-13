"""Read-only SupeRR Selector API. All player figures come from the attached analysis report."""
import json
import os
from pathlib import Path
from typing import Literal

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

HERE = Path(__file__).resolve().parent
PLAYERS = json.loads((HERE / "players.json").read_text(encoding="utf-8"))
METADATA = json.loads((HERE / "metadata.json").read_text(encoding="utf-8"))
WATCHLIST = ["Naman Dhir", "Rinku Singh", "Tim David", "Rasikh Salam", "Matheesha Pathirana", "Sunil Narine"]

app = FastAPI(title="SupeRR Selector 2027 API", version="1.0.0", description="Read-only pressure-performance data from independent student analysis.")
origins = [v.strip() for v in os.getenv("ALLOWED_ORIGINS", "*").split(",") if v.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=False, allow_methods=["GET"], allow_headers=["*"])

@app.get("/")
def root():
    return {"message": "SupeRR Selector API", "docs": "/docs", "health": "/api/health"}

@app.get("/api/health")
def health():
    return {"status": "ok", "players": len(PLAYERS)}

@app.get("/api/summary")
def summary():
    return {**METADATA, "ranked_batters": 10, "ranked_bowlers": 10}

@app.get("/api/players")
def players(kind: Literal["Batter", "Bowler"] | None = None, q: str = Query(default="", max_length=120), sort: Literal["rank", "score", "balls", "matches", "consistency", "ipl"] = "rank"):
    result = [p for p in PLAYERS if (kind is None or p["kind"] == kind) and q.casefold() in p["name"].casefold()]
    result.sort(key=(lambda p: (p["kind"], p["rank"])) if sort == "rank" else (lambda p: (-p[sort], p["rank"])))
    return result

@app.get("/api/players/{player_name}")
def player(player_name: str):
    match = next((p for p in PLAYERS if p["name"].casefold() == player_name.casefold()), None)
    if not match:
        raise HTTPException(status_code=404, detail="Player not present in report top-10 rankings")
    return match

@app.get("/api/watchlist")
def watchlist():
    return [p for name in WATCHLIST for p in PLAYERS if p["name"] == name]
