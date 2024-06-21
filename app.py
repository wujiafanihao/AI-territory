from fastapi import FastAPI, HTTPException, Query, Request
from pydantic import BaseModel
from typing import List, Optional
from utils.load_data import load_data

Acknowledge_new_dict_data = 'utils/ack_new_data.json'
Acknowledge_new_dict_list = load_data(Acknowledge_new_dict_data)
Acknowledge_conversation_dict_data = 'utils/ack_conversation_data.json'
Acknowledge_conversation_dict_list = load_data(Acknowledge_conversation_dict_data)
Acknowledge_hacker_dict_data = 'utils/ack_hacker_data.json'
Acknowledge_hacker_dict_list = load_data(Acknowledge_hacker_dict_data)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,  
    allow_methods=["*"],  
    allow_headers=["*"],  
)

class DateRequest(BaseModel):
    date: str

class Acknowledge_new_Element(BaseModel):
    id: str
    date: str
    category: str
    title: str
    lastEditedDate: str
    image: str
    url: str
    summary: str

class Acknowledge_conversation_Element(BaseModel):
    id : str
    title : str
    date : str
    url : str
    response : str

class Acknowledge_hacker_Element(BaseModel):
    id : str
    title : str
    url : str

@app.api_route("/v1/api/new", methods=["GET", "POST"], response_model=Optional[List[Acknowledge_new_Element]])
async def get_acknowledge_new(request: Request, date: Optional[str] = Query(None, description="The date to filter the results by")):
    if request.method == "POST":
        body = await request.json()
        date = body.get("date")
    
    if not date:
        return Acknowledge_new_dict_list

    result = [item for item in Acknowledge_new_dict_list if item["date"] == date]
    if not result:
        raise HTTPException(status_code=404, detail="No data found for the given date")
    return result

@app.api_route("/v1/api/conversation", methods=["GET", "POST"], response_model=Optional[List[Acknowledge_conversation_Element]])
async def get_acknowledge_conversation(request: Request, id: Optional[str] = Query(None, description="The id to filter the results by")):
    if request.method == "POST":
        body = await request.json()
        id = body.get("id")
    
    if not id:
        return Acknowledge_conversation_dict_list

    result = [item for item in Acknowledge_conversation_dict_list if item["id"] == id ]
    if not result:
        raise HTTPException(status_code=404, detail="No data found for the given date")
    return result

@app.api_route("/v1/api/hacker", methods=["GET", "POST"], response_model=Optional[List[Acknowledge_hacker_Element]])
async def get_acknowledge_hacker(request: Request, id: Optional[str] = Query(None, description="The id to filter the results by")):
    if request.method == "POST":
        body = await request.json()
        id = body.get("id")
    
    if not id:
        return Acknowledge_hacker_dict_list

    result = [item for item in Acknowledge_hacker_dict_list if item["id"] == id ]
    if not result:
        raise HTTPException(status_code=404, detail="No data found for the given date")
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=1551)
