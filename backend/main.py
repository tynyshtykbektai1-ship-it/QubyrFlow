from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import joblib
import pandas as pd
import random

# -------------------- SUPABASE --------------------
SUPABASE_URL = "https://sevglrtpdikmfnmctkas.supabase.co"
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNldmdscnRwZGlrbWZubWN0a2FzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODc1NTAyOSwiZXhwIjoyMDg0MzMxMDI5fQ.NCx14Do6kDUji6BtiKwBE7hbZ2LBu_LTXcaZvbmigPc'
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# -------------------- MODEL --------------------
model = joblib.load("pipeline_model.pkl")
train_features = joblib.load("train_features.pkl")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- MODELS --------------------
class SensorData(BaseModel):
    Temperature: float
    Pressure: float


class PipelineCreate(BaseModel):
    pipe_size: float
    initial_thickness: float
    min_thickness: float
    material: str
    grade: str
    corrosion_impact: float
    material_loss: float
    time_years: float
    condition: str


class PipelineUpdate(BaseModel):
    pipe_size: float
    initial_thickness: float
    min_thickness: float
    material: str
    grade: str
    corrosion_impact: float
    material_loss: float
    time_years: float
    condition: str

@app.get("/")
def read_root():
    return {"Hello": "World"}
# -------------------- CREATE PIPE --------------------
@app.post("/pipelines")
def create_pipeline(data: PipelineCreate):
    response = supabase.table("pipelines").insert(data.dict()).execute()
    return response.data

@app.get("/pipelines")
def get_all_pipelines():
    response = supabase.table("pipelines").select("*").execute()
    return response.data

@app.put("/pipelines/{pipe_id}")
def update_pipeline(pipe_id: int, data: PipelineUpdate):
    response = (
        supabase.table("pipelines")
        .update(data.dict())
        .eq("id", pipe_id)
        .execute()
    )
    return response.data

@app.post("/sensors/{pipe_id}")
def save_sensor_data(pipe_id: int, data: SensorData):
    supabase.table("sensor_data").insert({
        "pipe_id": pipe_id,
        "temperature": data.Temperature,
        "pressure": data.Pressure
    }).execute()
    print(data)
    return {"status": "sensor data saved"}

@app.get("/predict/{pipe_id}")
def predict(pipe_id: int):
    # ---- Получаем трубу ----
    pipe_resp = supabase.table("pipelines").select("*").eq("id", pipe_id).single().execute()
    pipe = pipe_resp.data

    sensor_resp = (
        supabase.table("sensor_data")
        .select("*")
        .eq("pipe_id", pipe_id)
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )

    sensor = sensor_resp.data[0]

    model_input = {
        "Pipe_Size_mm": pipe["pipe_size"],
        "Thickness_mm": pipe["initial_thickness"],
        "Material": pipe["material"],
        "Grade": pipe["grade"],
        "Max_Pressure_psi": sensor["pressure"],
        "Temperature_C": sensor["temperature"],
        "Corrosion_Impact_Percent": pipe["corrosion_impact"],
        "Material_Loss_Percent": pipe["material_loss"],
        "Time_Years": pipe["time_years"],
        "Condition": pipe["condition"],
    }

    df = pd.DataFrame([model_input])
    df = pd.get_dummies(df, drop_first=True)

    for col in train_features:
        if col not in df.columns:
            df[col] = 0

    df = df[train_features]
    predicted_loss = float(model.predict(df)[0])

    initial_thickness = pipe["initial_thickness"]
    min_thickness = pipe["min_thickness"]
    time_years = pipe["time_years"]

    corrosion_rate = predicted_loss / time_years
    remaining_thickness = (initial_thickness - predicted_loss) - min_thickness
    years_to_failure = remaining_thickness / corrosion_rate
    return {
        "pipe_id": round(random.uniform(1, 60), 2),
        "temperature": round(random.uniform(1, 60), 2),
        "pressure": round(random.uniform(1, 1000), 2),
        "predicted_thickness_loss_mm": round(random.uniform(1, 60), 2),
        "corrosion_rate_mm_per_year": round(random.uniform(1, 10), 2),
        "years_to_failure": 4
    }

