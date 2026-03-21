from fastapi import FastAPI
from database import db

app = FastAPI()

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