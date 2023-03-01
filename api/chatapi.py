from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from models import Response
from valdiai.chatbot import Chatbot
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

chatbots = {}


@app.post("/chat")
async def new_chat(prompt: Response):
    print(chatbots)
    session_id = str(uuid.uuid4())

    chatbot = Chatbot(prompt.text)
    chatbots[session_id] = chatbot

    return Response(session_id=session_id, text=chatbot.break_the_ice())


@app.post("/chat/response")
async def follow_up(response: Response):
    if response.session_id is None:
        raise HTTPException(status_code=400, detail="Session ID required")

    if response.session_id not in chatbots:
        raise HTTPException(status_code=404, detail="Invalid Session ID")

    chatbot = chatbots[response.session_id]

    return Response(session_id=response.session_id, text=chatbot.respond(response.text))


@app.get("/sessions")
async def get_sessions():
    return {"sessions": list(chatbots.keys())}


@app.delete("/session/{session_id}")
async def delete_session(session_id: str):
    if session_id not in chatbots:
        raise HTTPException(status_code=404, detail="Session ID not found")

    del chatbots[session_id]

    return {"session_id": session_id}

app.mount("/", StaticFiles(directory="static", html=True), name="static")
