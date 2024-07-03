import pandas as pd
import json

with open('ack_hacker_data.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

with open('ack_new_data.json', 'r', encoding='utf-8') as file:
    data1 = json.load(file)

with open('get_ai_tools_info.json', 'r', encoding='utf-8') as file:
    data2 = json.load(file)

with open('ack_conversation_data.json', 'r', encoding='utf-8') as file:
    data3 = json.load(file)

df = pd.DataFrame(data)
df1 = pd.DataFrame(data1)
df2 = pd.DataFrame(data2)
df3 = pd.DataFrame(data3)

df.to_csv('hacker.csv', index=False, encoding='utf-8')
df1.to_csv('new.csv', index=False, encoding='utf-8')
df2.to_csv('tool.csv', index=False, encoding='utf-8')
df3.to_csv('conversation.csv', index=False, encoding='utf-8')
