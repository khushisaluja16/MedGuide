from fastapi import FastAPI
from pydantic import BaseModel
from database import collection, db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class User(BaseModel):
    email: str
    username: str = ""
    password: str


@app.post("/register")
def register(user: User):
    try:
        existing = collection.find_one({"email": user.email})

        if existing:
            return {"success": False, "message": "User already exists"}

        collection.insert_one({
            "email": user.email,
            "username": user.username,
            "password": user.password
        })

        return {"success": True, "message": "Registered successfully"}

    except Exception as e:
        print("ERROR:", e)   # 🔥 THIS WILL SHOW ERROR IN TERMINAL
        return {"success": False, "message": "Backend error"}


@app.post("/login")
def login(user: User):
    existing = collection.find_one({
        "email": user.email,
        "password": user.password
    })

    if not existing:
        return {"success": False, "message": "Invalid credentials"}

    return {"success": True, "message": "Login successful"}

@app.get("/")
def test_connection():
    try:
        # This forces a DB call
        db.list_collection_names()
        return {"status": "Connected to MongoDB ✅"}
    except Exception as e:
        return {"status": "Connection failed ❌", "error": str(e)}
    
@app.get("/test-db")
async def test_db():
    collection = db["test_collection"]

    # Insert sample data
    data = {"name": "Khushi", "project": "MedGuide"}
    collection.insert_one(data)

    # Fetch data
    result = list(collection.find({}, {"_id": 0}))

    return {"data": result}