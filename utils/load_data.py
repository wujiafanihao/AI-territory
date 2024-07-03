import json

def load_data(file_path: str):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return json.load(file)
    except Exception as e:
        print(f"An unexpected error occurred while reading {file_path}: {e}")
        return None
    
    
