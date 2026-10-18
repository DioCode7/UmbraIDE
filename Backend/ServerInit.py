from fastapi import FastAPI,requests,Request,HTTPException
from fastapi.responses import JSONResponse

from fastapi.middleware.cors import CORSMiddleware
from Tables import Base, engine, inspect



app = FastAPI()

SecretKey = 'DSJAAPPKEY'




# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


