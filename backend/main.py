from fastapi import FastAPI as API
from pydantic import BaseModel
from supabase import 

app = API()

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

@app.post("/web-server")
async def dataofpipelines(Static_features: Static_features_of_pipelines):
    supabase.tab
    
