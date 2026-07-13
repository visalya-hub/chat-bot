from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings

print("Loading documents...")

loader = DirectoryLoader(
    "kb",
    glob="*.txt",
    loader_cls=TextLoader
)

documents = loader.load()
print(f"Loaded {len(documents)} documents")

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)

docs = text_splitter.split_documents(documents)
print(f"Created {len(docs)} chunks")

print("Loading embedding model...")

embeddings = OllamaEmbeddings(model="nomic-embed-text")

print("Creating FAISS vector database...")

vectorstore = FAISS.from_documents(docs, embeddings)

vectorstore.save_local("vector_db")

print("✅ Vector database created successfully!")