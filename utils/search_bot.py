from langchain.document_loaders.csv_loader import CSVLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores.faiss import FAISS
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.chains.retrieval_qa.base import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain_core.messages import AIMessageChunk
from langchain_openai import ChatOpenAI

csv_files =  {
    '新闻': ['utils/new.csv', 'utils/hacker.csv'],
    'AI工具': ['utils/tool.csv'],
}

# 加载CSV文件并添加类别标签
def get_csv_to_vectorstore(csv_files: dict):
    all_documents = []
    for category, file_paths in csv_files.items():
        for file_path in file_paths:
            try:
                loader = CSVLoader(file_path=file_path, encoding='utf-8')
                documents = loader.load()
                for doc in documents:
                    doc.metadata['category'] = category  
                all_documents.extend(documents)
            except Exception as e:
                try:
                    loader = CSVLoader(file_path=file_path, encoding='gbk')
                    documents = loader.load()
                    for doc in documents:
                        doc.metadata['category'] = category  
                    all_documents.extend(documents)
                except Exception as e:
                    print(f"Error loading {file_path}: {e}")

    # 分割文档
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    split_documents = text_splitter.split_documents(all_documents)
    return split_documents

ack_knowledge = get_csv_to_vectorstore(csv_files)

def create_db(ack_knowledge:list):
    # 创建嵌入
    embeddings = OpenAIEmbeddings(base_url='https://api.chatanywhere.cn/v1/', api_key='sk-dw366zNMWe7tTmmRfzr0NTVMCjegXOCTU1PRdT3wTFvHjr4X', model='text-embedding-3-small')

    # 创建向量存储
    vectorstore = FAISS.from_documents(ack_knowledge, embeddings)
    vectorstore.save_local("faiss_index")
    return vectorstore


# 创建自定义提示模板
template = """
从现在开始你是Bug网站的网站向导,基于GPT4模型.

对于技术问题，请详细解释并提供相关链接。
对于一般问题，请简洁明了地回答。
对于导航问题，请提供清晰的路径和步骤。

当有用户向你提问{question}的时候,你需要从context: {context}里面抽取结果回答用户的{question},如果context为空或者是无法从context抽取答案回答用户的，则只需要跟用户强调自己的能力有限，无法回答这种问题.
记住先记得总结context在回复用户,给用户的回复会带上对于的网站链接
question: {question}
AI:
"""
prompt = PromptTemplate(template=template, input_variables=["question", "context"])

# 创建问答链
qa_chain = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(temperature=0, base_url='https://api.chatanywhere.cn/v1/', api_key='sk-J5SBZ1hgnvUwJ4tfclSiET53pGaxP3m7mnIKfy3eoFXOGOEt'),
    chain_type="stuff",
    retriever=create_db(ack_knowledge).as_retriever(search_type="mmr",search_kwargs={'k': 10}),
    return_source_documents=True,
    chain_type_kwargs={"prompt": prompt}
)

generated_texts = []

def serialize_aimessagechunk(chunk):
    if isinstance(chunk,AIMessageChunk):
        return chunk.content
    else:
        raise TypeError(
            f"Object of type {type(chunk.__name__)} is not a AIMessageChunk."
        )

async def rag_csv_bot_stream(query):
    async for event in qa_chain.astream_events({'query':query},version="v1"):
        if event["event"] == "on_chat_model_stream":
            chunk_content = serialize_aimessagechunk(event["data"]["chunk"])
            generated_texts.append(chunk_content)
            yield f"{chunk_content}"
        elif event["event"] == "on_chat_model_end":
            print("Chat model has completed its response.")

