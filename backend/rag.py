from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings

embeddings = OllamaEmbeddings(model="nomic-embed-text")

db = FAISS.load_local(
    "vector_db",
    embeddings,
    allow_dangerous_deserialization=True
)

retriever = db.as_retriever(search_kwargs={"k": 3})


def retrieve_context(question):
    docs = retriever.invoke(question)

    context = ""

    for doc in docs:
        context += doc.page_content + "\n\n"

    return context