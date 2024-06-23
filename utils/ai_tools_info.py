import requests
from lxml import html
import re
import json
import os

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
}

def get_ai_tools_links(url: str, headers: dict):
    response = requests.get(url, headers=headers).content.decode('utf-8')
    tree = html.fromstring(response)
    links = tree.xpath('/html/body/div/div/div/a')
    a_elements = []
    for link in links:
        href = link.get('href')
        if href:
            a = f'https://www.waytoagi.com{href}'
            a_elements.append(a)
    return a_elements

def get_ai_tools_info(url: str, headers: dict):
    response = requests.get(url, headers=headers).content.decode('utf-8')
    tree = html.fromstring(response)
    title = tree.xpath('/html/body/div/div/div/div/h1/text()')
    a_url = tree.xpath('/html/body/div/div/div/div/a')
    urls = [url.get('href') for url in a_url if url.get('href')]
    image = tree.xpath('/html/body/div/div/div/img')
    images = [img.get('src') for img in image if img.get('src')]
    tags = tree.xpath('/html/body/div/div/div[3]/div/div/text()')
    tags = ''.join(tags).strip()
    tags = re.sub(r'[^\w\s]', '', tags)
    tags = ','.join(tags.split())
    introduce = tree.xpath('/html/body/div/div[1]/div[3]/text()')
    content = tree.xpath('/html/body/div/div/div/div/div/p/text()')
    result = {
        'title': title[0] if title else None,
        'url': urls[0] if urls else None,
        'img': images[0] if images else None,
        'introduce': introduce[0] if introduce else None,
        'content': content[0] if content else None,
        'tags': tags
    }
    return result

def update_json_file(file_path: str, all_tools_info: list):
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as file:
            existing_data = json.load(file)
        existing_titles = {item['title'] for item in existing_data}
        new_data = [item for item in all_tools_info if item['title'] not in existing_titles]
        updated_data = new_data + existing_data
    else:
        updated_data = all_tools_info

    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(updated_data, file, ensure_ascii=False, indent=4)

file_path = 'get_ai_tools_info.json'

if os.path.exists(file_path):
    page = 1
    all_tools_info = []
    url = f'https://www.waytoagi.com/sites?page={page}'
    tools_links = get_ai_tools_links(url, headers)
    for link in tools_links:
        tool_info = get_ai_tools_info(link, headers)
        all_tools_info.append(tool_info)
else:
    page = 1
    all_tools_info = []
    while True:
        url = f'https://www.waytoagi.com/sites?page={page}'
        tools_links = get_ai_tools_links(url, headers)
        if not tools_links:
            break
        for link in tools_links:
            tool_info = get_ai_tools_info(link, headers)
            all_tools_info.append(tool_info)
        page += 1

update_json_file(file_path, all_tools_info)