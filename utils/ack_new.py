import urllib.parse
import requests
import json
import os
import socket

def translate_ASCII(name: str) -> str:
    return urllib.parse.quote(name)

def get_Acknowledge_element(url: str, headers: dict, limit: int = None):
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        json_start = response.text.find('<script id="__NEXT_DATA__" type="application/json">') + len('<script id="__NEXT_DATA__" type="application/json">')
        json_end = response.text.find('</script>', json_start)
        json_data = response.text[json_start:json_end]
        
        data = json.loads(json_data)
        
        all_nav_pages = data['props']['pageProps']['allNavPages']
        results = []
        for page in all_nav_pages:
            if '知识库精选-' in page['title']:
                result = {
                    'id': page['id'],
                    'date': page['slug'].split('news-')[-1],
                    'category': page['category'],
                    'title': page['title'],
                    'lastEditedDate': page['lastEditedDate'],
                    'image_url': page['pageCoverThumbnail'],
                    'image': page['pageCoverThumbnail'],
                    'url': f'https://blog.waytoagi.com/{page["slug"]}',
                    'summary': page['summary']
                }
                results.append(result)
                if limit and len(results) >= limit:
                    break
        return results
    else:
        return []

def download_image(url: str, save_path: str):
    if os.path.exists(save_path):
        return save_path  # 如果图片已经存在，则跳过下载
    response = requests.get(url)
    if response.status_code == 200:
        with open(save_path, 'wb') as file:
            file.write(response.content)
        return save_path
    else:
        return None

def initialize_data(limit: int = None):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
    }
    url_parse = translate_ASCII('知识库精选')
    url = f'https://blog.waytoagi.com/category/{url_parse}'
    return get_Acknowledge_element(url, headers, limit)

def get_local_ip():
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    return local_ip

def update_json_file(file_path: str, image_dir: str, port: int):
    if not os.path.exists(image_dir):
        os.makedirs(image_dir)

    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as file:
            existing_data = json.load(file)
        new_data = initialize_data(limit=5) 
    else:
        existing_data = []
        new_data = initialize_data()  

    existing_ids = {item['id'] for item in existing_data}
    updated_data = []

    local_ip = get_local_ip()
    base_url = f'http://{local_ip}:{port}'

    for item in new_data:
        if item['id'] not in existing_ids:
            image_url = item['image']
            image_name = f"{item['id']}.jpg"
            image_path = os.path.join(image_dir, image_name)
            if download_image(image_url, image_path):
                item['image'] = f"{base_url}/news_images/{image_name}"  
            else:
                item['image'] = None
            updated_data.append(item)

    updated_data += existing_data

    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(updated_data, file, ensure_ascii=False, indent=4)

file_path = 'ack_new_data.json'
image_dir = 'new_images'  
port = 1551  
update_json_file(file_path, image_dir, port)