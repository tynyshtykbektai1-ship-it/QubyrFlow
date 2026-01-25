from fastapi import FastAPI as API
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = API()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

class SensorData(BaseModel):
    Temperature: float
    Pressure: float

class Static_features_of_pipelines(BaseModel):
    pipe_size: float
    initial_thickness: float
    min_thickness: float
    material: str
    grade: str
    corrosion_impact: float
    material_loss: float
    time_years: float
    condition: str
    

@app.post("/sensors")
async def prediction(dataSensorData: SensorData):
    print(dataSensorData)
    return {"prediction": "ok"}

@app.get("/sensor-data")
async def get_sensor_data():
    """Получить текущие данные датчиков"""
    import random
    return {
        "temperature": round(65 + random.random() * 10, 1),
        "pressure": round(850 + random.random() * 50),
        "thicknessLoss": round(1.2 + random.random() * 0.3, 2),
        "timestamp": "2026-01-19T10:00:00Z"
    }


    
