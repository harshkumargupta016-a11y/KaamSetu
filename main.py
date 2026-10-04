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

DEFAULT_DB = {
    "users": {},
    "companies": [
        ["Shree Power Works", "Indore", "Electrical", 6, 90, "Gemini Verified 95%"],
        ["QuickKart Logistics", "Indore", "Logistics", 14, 75, "Gemini Verified 88%"],
        ["Apex Precision Ltd", "Pithampur", "Manufacturing", 9, 88, "Gemini Verified 91%"],
        ["MegaMart", "Indore", "Retail", 12, 70, "Admin Verified"],
        ["BrightByte Tech", "Indore", "IT", 5, 92, "Gemini Verified 96%"],
        ["Delhivery Hub", "Indore", "Logistics", 8, 85, "Gemini Verified 90%"],
        ["HomeFix Services", "Indore", "Services", 3, 64, "Pending Check"],
        ["Sharma & Co.", "Indore", "Finance", 2, 80, "Gemini Verified 89%"],
        ["QuickJobs Agency", "Bhopal", "Agency", 1, 22, "Flagged Scam"]
    ],
    "jobseekers": [
        ["Ramesh Kumar", "Wiring, MCB, Safety", "Indore", 3, "ITI", "Active"],
        ["Aman Patel", "CNC, G-code", "Bhopal", 2, "Diploma", "Hired"],
        ["Sunita Devi", "Billing, POS", "Ujjain", 1, "12th pass", "Active"],
        ["Mohan Lal", "Navigation, Customer service", "Dewas", 4, "10th pass", "Active"]
    ],
    "complaints": [
        ["QuickJobs Agency", "Asked for a registration fee", "Open (Gemini 94%)"],
        ["FastHire Co.", "Fake offer letter", "Under review"],
        ["Unknown Recruiter", "Salary not paid", "Resolved"]
    ],
    "jobs": [
        ["Electrician", "Shree Power Works", 3, 22000, 22.73, 75.88, 90, "Indore", "Gemini Verified 95%"],
        ["Delivery Partner", "QuickKart Logistics", 0, 16000, 22.70, 75.83, 75, "Indore", "Gemini Verified 88%"],
        ["CNC Operator", "Apex Precision Ltd", 2, 28000, 22.62, 75.69, 88, "Pithampur", "Gemini Verified 91%"],
        ["Retail Associate", "MegaMart", 0, 14000, 22.75, 75.90, 70, "Indore", "Admin Verified"],
        ["Software Tester", "BrightByte Tech", 2, 35000, 22.71, 75.87, 92, "Indore", "Gemini Verified 96%"],
        ["Warehouse Supervisor", "Delhivery Hub", 5, 42000, 22.58, 75.80, 85, "Indore", "Gemini Verified 90%"],
        ["Plumber", "HomeFix Services", 4, 20000, 22.68, 75.95, 64, "Indore", "Pending Admin"],
        ["Accountant", "Sharma & Co.", 3, 30000, 22.74, 75.84, 80, "Indore", "Gemini Verified 89%"]
    ],
    "applications": [],
    "sync_log": []
}

def load_db() -> Dict[str, Any]:
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, "r") as f:
                data = json.load(f)
                # Ensure missing keys are initialized
                for key, default in DEFAULT_DB.items():
                    if key not in data or not data[key]:
                        data[key] = default
                return data
        except Exception:
            pass
    save_db(DEFAULT_DB)
    return DEFAULT_DB

def save_db(data: Dict[str, Any]):
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=2)

class UserSync(BaseModel):
    phone_or_email: str
    name: str
    role: str  # seeker | company | admin
    profile_data: Optional[Dict[str, Any]] = None
    applied_jobs: Optional[List[str]] = None
    posted_jobs: Optional[List[Any]] = None

class LoginRequest(BaseModel):
    phone_or_email: str
    name: Optional[str] = None
    role: str

class SyncAction(BaseModel):
    type: str  # company_add, company_status, complaint_add, complaint_status, job_add, application_add, profile_sync
    payload: Dict[str, Any]

class OfflineSyncRequest(BaseModel):
    actions: List[SyncAction]

@app.get("/")
def read_root():
    return {"status": "ok", "service": "KaamSetu FastAPI Backend", "version": "1.0"}

@app.get("/api/data")
def get_global_data():
    db = load_db()
    return {
        "status": "success",
        "companies": db.get("companies", []),
        "jobseekers": db.get("jobseekers", []),
        "complaints": db.get("complaints", []),
        "jobs": db.get("jobs", []),
        "applications": db.get("applications", []),
        "users_count": len(db.get("users", {}))
    }

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

@app.post("/api/companies")
def add_company(company: List[Any]):
    db = load_db()
    companies = db.get("companies", [])
    companies.insert(0, company)
    db["companies"] = companies
    save_db(db)
    return {"status": "success", "companies": companies}

@app.put("/api/companies/{index}")
def update_company(index: int, payload: Dict[str, Any]):
    db = load_db()
    companies = db.get("companies", [])
    if 0 <= index < len(companies):
        status = payload.get("status")
        if status:
            companies[index][5] = status
            comp_name = companies[index][0]
            # Sync company status in jobs
            jobs = db.get("jobs", [])
            for j in jobs:
                if len(j) > 1 and j[1] == comp_name:
                    j[8] = status
            db["jobs"] = jobs
        db["companies"] = companies
        save_db(db)
        return {"status": "updated", "company": companies[index]}
    raise HTTPException(status_code=404, detail="Company index not found")

@app.put("/api/jobseekers/{index}")
def update_jobseeker(index: int, payload: Dict[str, Any]):
    db = load_db()
    jobseekers = db.get("jobseekers", [])
    if 0 <= index < len(jobseekers):
        status = payload.get("status")
        if status:
            jobseekers[index][5] = status
        db["jobseekers"] = jobseekers
        save_db(db)
        return {"status": "updated", "jobseeker": jobseekers[index]}
    raise HTTPException(status_code=404, detail="Jobseeker index not found")
def add_complaint(complaint: List[Any]):
    db = load_db()
    complaints = db.get("complaints", [])
    complaints.insert(0, complaint)
    db["complaints"] = complaints
    save_db(db)
    return {"status": "success", "complaints": complaints}

@app.put("/api/complaints/{index}")
def update_complaint(index: int, payload: Dict[str, Any]):
    db = load_db()
    complaints = db.get("complaints", [])
    if 0 <= index < len(complaints):
        status = payload.get("status")
        if status:
            complaints[index][2] = status
        db["complaints"] = complaints
        save_db(db)
        return {"status": "updated", "complaint": complaints[index]}
    raise HTTPException(status_code=404, detail="Complaint index not found")

@app.get("/api/jobs")
def get_jobs():
    db = load_db()
    return {"status": "success", "jobs": db.get("jobs", [])}

@app.post("/api/jobs")
def add_job(job: List[Any]):
    db = load_db()
    jobs = db.get("jobs", [])
    jobs.insert(0, job)
    db["jobs"] = jobs
    save_db(db)
    return {"status": "success", "jobs": jobs}

@app.post("/api/applications")
def add_application(app_data: Dict[str, Any]):
    db = load_db()
    applications = db.get("applications", [])
    applications.insert(0, app_data)
    db["applications"] = applications
    save_db(db)
    return {"status": "success", "applications": applications}

@app.post("/api/offline-sync")
def process_offline_sync(req: OfflineSyncRequest):
    db = load_db()
    processed_count = 0
    
    for action in req.actions:
        a_type = action.type
        p = action.payload
        
        if a_type == "company_add" and "company" in p:
            db["companies"].insert(0, p["company"])
            processed_count += 1
        elif a_type == "company_status" and "index" in p and "status" in p:
            idx = p["index"]
            if 0 <= idx < len(db["companies"]):
                db["companies"][idx][5] = p["status"]
                comp_name = db["companies"][idx][0]
                for j in db.get("jobs", []):
                    if len(j) > 1 and j[1] == comp_name:
                        j[8] = p["status"]
                processed_count += 1
        elif a_type == "jobseeker_status" and "status" in p:
            st = p["status"]
            if "index" in p:
                idx = p["index"]
                if 0 <= idx < len(db["jobseekers"]):
                    db["jobseekers"][idx][5] = st
                    processed_count += 1
            elif "name" in p:
                s_name = p["name"].lower().strip()
                for sk in db.get("jobseekers", []):
                    if len(sk) > 0 and sk[0].lower().strip() == s_name:
                        sk[5] = st
                        processed_count += 1
        elif a_type == "complaint_add" and "complaint" in p:
            db["complaints"].insert(0, p["complaint"])
            processed_count += 1
        elif a_type == "complaint_status" and "index" in p and "status" in p:
            idx = p["index"]
            if 0 <= idx < len(db["complaints"]):
                db["complaints"][idx][2] = p["status"]
                processed_count += 1
        elif a_type == "job_add" and "job" in p:
            db["jobs"].insert(0, p["job"])
            processed_count += 1
        elif a_type == "application_add" and "application" in p:
            db["applications"].insert(0, p["application"])
            processed_count += 1
        elif a_type == "user_sync" and "user" in p:
            u = p["user"]
            key = u.get("phone_or_email", "").lower().strip()
            if key:
                db["users"][key] = u
                processed_count += 1

    save_db(db)
    return {
        "status": "success",
        "processed_actions": processed_count,
        "companies": db["companies"],
        "complaints": db["complaints"],
        "jobs": db["jobs"]
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
