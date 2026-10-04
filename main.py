import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import os

app = FastAPI(title="KaamSetu Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = "kaamsetu_db.json"

def load_db() -> Dict[str, Any]:
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, "r") as f:
                return json.load(f)
        except Exception:
            pass
    return {"users": {}, "companies": [], "jobseekers": [], "complaints": []}

def save_db(data: Dict[str, Any]):
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=2)

class UserSync(BaseModel):
    phone_or_email: str
    name: str
    role: str  # seeker | company | admin
    profile_data: Optional[Dict[str, Any]] = None
    applied_jobs: Optional[List[str]] = None
    posted_jobs: Optional[List[Dict[str, Any]]] = None

class LoginRequest(BaseModel):
    phone_or_email: str
    name: Optional[str] = None
    role: str

@app.get("/")
def read_root():
    return {"status": "ok", "service": "KaamSetu FastAPI Backend"}

@app.post("/api/login")
def login_user(req: LoginRequest):
    db = load_db()
    users = db.get("users", {})
    key = req.phone_or_email.lower().strip()
    
    if key in users:
        user_data = users[key]
        return {
            "status": "success",
            "is_new": False,
            "data": user_data
        }
    else:
        # Create fresh profile
        new_user = {
            "phone_or_email": req.phone_or_email,
            "name": req.name or "User",
            "role": req.role,
            "profile_data": {
                "name": req.name or "User",
                "loc": "Indore, MP",
                "role": "Electrician",
                "qual": "10th pass",
                "exp": 0,
                "skills": [],
                "resume": "",
                "fileName": ""
            },
            "applied_jobs": [],
            "posted_jobs": []
        }
        users[key] = new_user
        db["users"] = users
        save_db(db)
        return {
            "status": "success",
            "is_new": True,
            "data": new_user
        }

@app.post("/api/sync")
def sync_user_data(req: UserSync):
    db = load_db()
    users = db.get("users", {})
    key = req.phone_or_email.lower().strip()
    
    existing = users.get(key, {})
    existing["phone_or_email"] = req.phone_or_email
    existing["name"] = req.name
    existing["role"] = req.role
    if req.profile_data is not None:
        existing["profile_data"] = req.profile_data
    if req.applied_jobs is not None:
        existing["applied_jobs"] = req.applied_jobs
    if req.posted_jobs is not None:
        existing["posted_jobs"] = req.posted_jobs
        
    users[key] = existing
    db["users"] = users
    save_db(db)
    return {"status": "synced", "key": key}

@app.get("/api/user/{identifier}")
def get_user(identifier: str):
    db = load_db()
    users = db.get("users", {})
    key = identifier.lower().strip()
    if key in users:
        return users[key]
    raise HTTPException(status_code=404, detail="User not found")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
