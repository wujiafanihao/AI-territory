import requests
from lxml import html
import json
import os

def get_dict(url: str, headers: dict):
    response = requests.get(url, headers=headers).text
    tree = html.fromstring(response)
    
    titles = tree.xpath('/html/body/div/div/div/div/a/div/span/text()')
    contents = tree.xpath('/html/body/div[1]/div/div[2]/div/a/div[2]/text()')
    links = tree.xpath('/html/body/div/div/div/div/a')
    dates = tree.xpath('/html/body/div/div/div/div/a/div[3]/text()')  # 假设日期在div标签中

    a_elements = []
    for link in links:
        href = link.get('href')
        if href:
            a = f'https://www.waytoagi.com{href}'
            a_elements.append(a) 
    
    apis = []
    for title, content, a_element, date in zip(titles, contents, a_elements, dates):
        id = a_element.split('https://www.waytoagi.com/question/')[1]
        api = {
            'id': id,
            'title': title,
            'date': date,
            'url': a_element,
            'response': content
        }
        apis.append(api)
    return apis

def initialize_data(single_page: bool = False):
    page_number = 1
    all_data = []
    while True:
        url = f'https://www.waytoagi.com/question?page={page_number}'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
        }
        page_data = get_dict(url, headers)
        if not page_data:
            break
        all_data.extend(page_data)
        if single_page:
            break
        page_number += 1
    return all_data

def update_json_file(file_path: str):
    if os.path.exists(file_path):
        new_data = initialize_data(single_page=True)  # 只获取第一页的数据
        with open(file_path, 'r', encoding='utf-8') as file:
            existing_data = json.load(file)
    else:
        new_data = initialize_data()  # 获取所有页面的数据
        existing_data = []

    existing_ids = {item['id'] for item in existing_data}
    updated_data = [item for item in new_data if item['id'] not in existing_ids] + existing_data

    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(updated_data, file, ensure_ascii=False, indent=4)

file_path = 'ack_conversation_data.json'
update_json_file(file_path)