from pydantic import BaseModel

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