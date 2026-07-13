from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings
from langchain_community.vectorstores import FAISS

# Load all .txt files from the kb folder
loader = DirectoryLoader(
    "kb",
    glob="*.txt",
    loader_cls=TextLoader
)

documents = loader.load()

print(f"Loaded {len(documents)} documents.")

# Split documents into chunks
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)

docs = text_splitter.split_documents(documents)

print(f"Created {len(docs)} chunks.")

# Create embeddings using Ollama
embeddings = OllamaEmbeddings(model="nomic-embed-text")

# Build FAISS index
vectorstore = FAISS.from_documents(docs, embeddings)

# Save vector database
vectorstore.save_local("vector_db")

print("✅ Vector database created successfully!")