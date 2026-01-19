import { NextResponse } from "next/server";

function generateHistoricalData(pipelineId: string, hours: number = 24) {
  const data = [];
  const now = new Date();
  
  const baseTemp = pipelineId === "A" ? 42 : 38;
  const basePressure = pipelineId === "A" ? 875 : 920;
  const baseThickness = pipelineId === "A" ? 1.73 : 1.45;

  for (let i = hours * 6; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 10 * 60 * 1000);
    const hourFactor = Math.sin((i / 6) * Math.PI / 12);
    
    data.push({
      timestamp: timestamp.toISOString(),
      temperature: Math.round((baseTemp + hourFactor * 3 + (Math.random() - 0.5) * 2) * 10) / 10,
      pressure: Math.round(basePressure + hourFactor * 20 + (Math.random() - 0.5) * 15),
      thickness_loss_mm: Math.round((baseThickness + i * 0.001 + (Math.random() - 0.5) * 0.05) * 100) / 100,
    });
  }

  return data;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ pipelineId: string }> }
) {
  const { pipelineId } = await params;
  const { searchParams } = new URL(request.url);
  const hours = parseInt(searchParams.get("hours") || "24");
  
  const validPipelines = ["A", "B", "C", "D"];
  const normalizedId = pipelineId.toUpperCase();
  
  if (!validPipelines.includes(normalizedId)) {
    return NextResponse.json(
      { error: "Invalid pipeline ID" },
      { status: 404 }
    );
  }

  const data = generateHistoricalData(normalizedId, hours);
  return NextResponse.json({
    pipeline_id: normalizedId,
    data,
  });
}
