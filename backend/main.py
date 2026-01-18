from fastapi import FastAPI as API
from pydantic import BaseModel

app = API()

@app.get("/")
def read_root():
    return {"Hello": "World"}

class SensorData(BaseModel):
    Temperature: float
    Pressure: float
    

@app.post("/sensors")
async def prediction(dataSensorData: SensorData):
    print(dataSensorData)
    return {"prediction": "ok"}


