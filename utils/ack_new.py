import urllib.parse
import requests
import json
import os

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

def initialize_data(limit: int = None):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
    }
    url_parse = translate_ASCII('知识库精选')
    url = f'https://blog.waytoagi.com/category/{url_parse}'
    return get_Acknowledge_element(url, headers, limit)

def update_json_file(file_path: str):
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as file:
            existing_data = json.load(file)
        new_data = initialize_data(limit=5) 
    else:
        existing_data = []
        new_data = initialize_data()  

    existing_ids = {item['id'] for item in existing_data}
    updated_data = [item for item in new_data if item['id'] not in existing_ids] + existing_data

    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(updated_data, file, ensure_ascii=False, indent=4)

file_path = 'ack_new_data.json'
update_json_file(file_path)
