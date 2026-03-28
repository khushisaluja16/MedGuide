from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)

# your database name
db = client["medguide"]

# your collection name
collection = db["users"]

reports_col = db["report"]