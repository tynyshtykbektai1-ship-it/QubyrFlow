import { NextResponse } from "next/server";

// Simulated sensor data for pipelines
function generateSensorData(pipelineId: string) {
  const baseTemp = pipelineId === "A" ? 42 : 38;
  const basePressure = pipelineId === "A" ? 875 : 920;
  const baseThickness = pipelineId === "A" ? 1.73 : 1.45;

  // Add some realistic variation
  const temperature = baseTemp + (Math.random() - 0.5) * 6;
  const pressure = basePressure + (Math.random() - 0.5) * 50;
  const thickness_loss_mm = baseThickness + (Math.random() - 0.5) * 0.3;

  return {
    pipeline_id: pipelineId.toUpperCase(),
    temperature: Math.round(temperature * 10) / 10,
    pressure: Math.round(pressure),
    thickness_loss_mm: Math.round(thickness_loss_mm * 100) / 100,
    timestamp: new Date().toISOString(),
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ pipelineId: string }> }
) {
  const { pipelineId } = await params;
  
  // Validate pipeline ID
  const validPipelines = ["A", "B", "C", "D"];
  const normalizedId = pipelineId.toUpperCase();
  
  if (!validPipelines.includes(normalizedId)) {
    return NextResponse.json(
      { error: "Invalid pipeline ID" },
      { status: 404 }
    );
  }

  const data = generateSensorData(normalizedId);
  return NextResponse.json(data);
}
