from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import List, Optional
from utils.load_data import load_data
from Authorized.authorized import verify_api_key
from models import Acknowledge_conversation_Element, Acknowledge_hacker_Element, Acknowledge_new_Element, AITools
from utils.search_bot import rag_csv_bot_stream
import time
from loguru import logger
from fastapi.responses import StreamingResponse

Acknowledge_new_dict_data = 'utils/ack_new_data.json'
Acknowledge_new_dict_list = load_data(Acknowledge_new_dict_data)
Acknowledge_conversation_dict_data = 'utils/ack_conversation_data.json'
Acknowledge_conversation_dict_list = load_data(Acknowledge_conversation_dict_data)
Acknowledge_hacker_dict_data = 'utils/ack_hacker_data.json'
Acknowledge_hacker_dict_list = load_data(Acknowledge_hacker_dict_data)
AItools_dict_data = 'utils/get_ai_tools_info.json'
AItools_dict_list = load_data(AItools_dict_data)

app = FastAPI()

# 配置日志记录
logger.add("access.log", rotation="1 day", retention="7 days", level="INFO")

# 添加中间件来记录访问日志
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(f"{request.client.host} - {request.method} {request.url} - {response.status_code} - {process_time:.2f}s")
    return response

# 添加中间件来记录爬虫行为
@app.middleware("http")
async def log_crawlers(request: Request, call_next):
    response = await call_next(request)
    if "User-Agent" in request.headers and "bot" in request.headers["User-Agent"].lower():
        logger.warning(f"Crawler detected: {request.client.host} - {request.method} {request.url} - {response.status_code}")
    return response

app.mount("/news_images", StaticFiles(directory="utils/new_images"), name="images")
app.mount("/tools_images", StaticFiles(directory="utils/tools_images"), name="images")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.api_route("/v1/api/new", methods=["GET", "POST"], response_model=Optional[List[Acknowledge_new_Element]])
async def get_acknowledge_new(request: Request, date: Optional[str] = Query(None, description="The date to filter the results by"), api_key: str = Query(None)):
    verify_api_key(api_key)
    if request.method == "POST":
        body = await request.json()
        api_key = body.get('api')
        date = body.get("date")

    if not date:
        return Acknowledge_new_dict_list

    result = [item for item in Acknowledge_new_dict_list if item["date"] == date]
    if not result:
        raise HTTPException(status_code=404, detail="No data found for the given date")
    return result

@app.api_route("/v1/api/conversation", methods=["GET", "POST"], response_model=Optional[List[Acknowledge_conversation_Element]])
async def get_acknowledge_conversation(request: Request, id: Optional[str] = Query(None, description="The id to filter the results by"), api_key: str = Query(None)):
    verify_api_key(api_key)
    
    if request.method == "POST":
        body = await request.json()
        api_key = body.get('api')
        id = body.get("id")
    
    if not id:
        return Acknowledge_conversation_dict_list

    result = [item for item in Acknowledge_conversation_dict_list if item["id"] == id ]
    if not result:
        raise HTTPException(status_code=404, detail="No data found for the given date")
    return result

@app.api_route("/v1/api/hacker", methods=["GET", "POST"], response_model=Optional[List[Acknowledge_hacker_Element]])
async def get_acknowledge_hacker(request: Request, id: Optional[str] = Query(None, description="The id to filter the results by"), api_key: str = Query(None)):
    verify_api_key(api_key)
    
    if request.method == "POST":
        body = await request.json()
        api_key = body.get('api')
        id = body.get("id")
    
    if not id:
        return Acknowledge_hacker_dict_list

    result = [item for item in Acknowledge_hacker_dict_list if item["id"] == id ]
    if not result:
        raise HTTPException(status_code=404, detail="No data found for the given date")
    return result

@app.api_route("/v1/api/tools_info", methods=["GET", "POST"], response_model=Optional[List[AITools]])
async def get_AI_Tools(request: Request, title: Optional[str] = Query(None, description="The date to filter the results by"), api_key: str = Query(None)):
    verify_api_key(api_key)

    if request.method == "POST":
        body = await request.json()
        api_key = body.get('api')
        title = body.get("title")

    if not title:
        return AItools_dict_list

    result = [item for item in AItools_dict_list if item["title"] == title]
    if not result:
        raise HTTPException(status_code=404, detail="No data found for the given date")
    return result

@app.post("/v1/chat/completions", response_class=StreamingResponse)
async def ask(body: dict):
    async def print_and_stream(query):
        async for response in rag_csv_bot_stream(query):
            print(response)  # 打印回复的值
            yield response

    return StreamingResponse(print_and_stream(body['query']), media_type="text/event-stream")

import uvicorn

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=1551, reload=True)
