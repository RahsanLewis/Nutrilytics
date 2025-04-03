from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI()

# Allow frontend origin
origins = ["http://127.0.0.1:5500", "http://localhost:5500"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = "2RJFz4agPvZJN6rwuFiGxegfeU0zfPQkVm6WLkJ3"

@app.post("/api/nutrition")
async def get_nutrition(request: Request):
    req_body = await request.json()
    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://api.nal.usda.gov/fdc/v1/foods/search",
            headers={
                "Content-Type": "application/json",
                "X-Api-Key": API_KEY,
            },
            json=req_body,
        )
    return res.json()
