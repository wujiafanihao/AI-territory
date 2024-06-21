from fastapi import HTTPException

API_KEY = "Wjf251605@"

def verify_api_key(api_key: str):
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Unauthorized")