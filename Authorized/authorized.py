from fastapi import HTTPException
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.environ.get('API_KEY')

def verify_api_key(api_key: str):
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Unauthorized")

