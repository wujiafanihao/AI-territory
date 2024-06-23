import json
import uuid
import os

def update_ids_to_uuid(file_path):
    if not os.path.exists(file_path):
        print(f"文件 {file_path} 不存在。")
        return

    # 读取JSON文件
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)

    # 更新每个条目的id为UUID
    for item in data:
        item['id'] = str(uuid.uuid4())

    # 将更新后的数据写回JSON文件
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

    print("ID更新完成")

# 设置文件路径
file_path = 'ack_hacker_data.json'

# 调用函数
update_ids_to_uuid(file_path)