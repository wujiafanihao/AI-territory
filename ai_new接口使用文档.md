### API 使用文档

#### 项目概述

该 API 提供了一个接口，用于根据指定日期获取知识库精选的内容。用户可以通过 GET 和 POST 请求访问相应的内容。

#### 快速开始

1. **安装依赖**
    ```sh
    pip install fastapi uvicorn requests pydantic
    ```

2. **运行应用**
    ```sh
    uvicorn main:app --reload
    ```

### API 端点

#### 获取知识库精选内容

- **URL:** `/v1/api/ai_new`
- **方法:** GET, POST
- **响应格式:** JSON

#### 请求模型

##### POST 请求体模型

```json
{
    "date": "string"
}
```

| 字段 | 类型   | 描述         |
| ---- | ------ | ------------ |
| date | string | 要查询的日期 |

##### 响应模型

```json
[
    {
        "id": "string",
        "date": "string",
        "category": "string",
        "title": "string",
        "lastEditedDate": "string",
        "image": "string",
        "url": "string",
        "summary": "string"
    }
]
```

| 字段           | 类型   | 描述         |
| -------------- | ------ | ------------ |
| id             | string | 唯一标识符   |
| date           | string | 日期         |
| category       | string | 类别         |
| title          | string | 标题         |
| lastEditedDate | string | 最后编辑日期 |
| image          | string | 缩略图URL    |
| url            | string | 文章URL      |
| summary        | string | 摘要         |

### 示例请求

#### GET 请求

- **描述:** 根据查询参数 `date` 获取对应日期的知识库精选内容。如果不提供日期参数，则返回成功消息。
- **示例请求:**
    ```sh
    curl -X 'GET' \
      'http://127.0.0.1:8000/v1/api/ai_new?date=20240417' \
      -H 'accept: application/json'
    ```
- **请求参数:**

| 参数 | 类型   | 描述         |
| ---- | ------ | ------------ |
| date | string | （可选）日期 |

- **成功响应:**
    ```json
    [
        {
            "id": "12345678-1234-5678-1234-567812345678",
            "date": "20240417",
            "category": "知识库精选",
            "title": "知识库精选- 4 月 17 日",
            "lastEditedDate": "2024-04-18T03:08:44.745Z",
            "image": "https://example.com/image.png",
            "url": "https://blog.waytoagi.com/article/news-20240417",
            "summary": "文章摘要内容"
        }
    ]
    ```
- **成功响应（无日期参数）:**
    ```json
    {
        "message": "成功"
    }
    ```
- **错误响应:**
    ```json
    {
        "detail": "No data found for the given date"
    }
    ```

#### POST 请求

- **描述:** 根据请求体中的 `date` 获取对应日期的知识库精选内容。
- **示例请求:**
    ```sh
    curl -X 'POST' \
      'http://127.0.0.1:8000/v1/api/ai_new' \
      -H 'accept: application/json' \
      -H 'Content-Type: application/json' \
      -d '{
      "date": "20240417"
    }'
    ```
- **请求体:**

| 字段 | 类型   | 描述         |
| ---- | ------ | ------------ |
| date | string | 要查询的日期 |

- **成功响应:**
    ```json
    [
        {
            "id": "12345678-1234-5678-1234-567812345678",
            "date": "20240417",
            "category": "知识库精选",
            "title": "知识库精选- 4 月 17 日",
            "lastEditedDate": "2024-04-18T03:08:44.745Z",
            "image": "https://example.com/image.png",
            "url": "https://blog.waytoagi.com/article/news-20240417",
            "summary": "文章摘要内容"
        }
    ]
    ```
- **错误响应:**
    ```json
    {
        "detail": "No data found for the given date"
    }
    ```
- **错误响应（请求体为空）:**
    ```json
    {
        "detail": "Date is required in POST request body"
    }
    ```

### 错误处理

1. **日期参数缺失 (POST 请求):**
    - 错误描述: POST 请求体中缺少 `date` 参数。
    - HTTP 状态码: 400
    - 响应示例:
      ```json
      {
          "detail": "Date is required in POST request body"
      }
      ```

2. **未找到数据:**
    - 错误描述: 根据提供的日期未找到对应的数据。
    - HTTP 状态码: 404
    - 响应示例:
      ```json
      {
          "detail": "No data found for the given date"
      }
      ```