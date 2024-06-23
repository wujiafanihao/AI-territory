import requests
from bs4 import BeautifulSoup
import json
import os
import uuid
import time

def get_dict(url: str, headers: dict):
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()  # 检查请求是否成功
    except requests.exceptions.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return []

    html_doc = response.content
    soup = BeautifulSoup(html_doc, 'html.parser')
    title_spans = soup.find_all('span', class_='titleline')

    apis = []
    for span in title_spans:
        a_tag = span.find('a')
        if a_tag:
            href = a_tag.get('href')
            text = a_tag.text.strip()
            api = {
                'title': text,
                'url': href
            }
            apis.append(api)
    return apis

def initialize_data(single_page: bool = False):
    page_number = 1
    all_data = []

    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as file:
            existing_data = json.load(file)
        all_data.extend(existing_data)

    while True:
        url = f'https://news.ycombinator.com/news?p={page_number}'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
        }
        page_data = get_dict(url, headers)
        if not page_data:
            break
        for data in page_data:
            data['id'] = str(uuid.uuid4())
        all_data = page_data + all_data  # 将新的数据添加到头部
        if single_page:
            break
        page_number += 1
        time.sleep(1)  # 添加延迟以避免过多请求

    return all_data

def update_json_file(file_path: str):
    if os.path.exists(file_path):
        all_data = initialize_data(single_page=True)  # 只获取第一页的数据
    else:
        all_data = initialize_data()  # 获取所有页面的数据

    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(all_data, file, ensure_ascii=False, indent=4)

file_path = 'ack_hacker_data.json'
update_json_file(file_path)