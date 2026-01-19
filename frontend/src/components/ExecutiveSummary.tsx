import { useState } from 'react';
import { FileText, Download, Calendar, FileCheck } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';

export function ExecutiveSummary() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);

  const generateReport = async () => {
    setIsGenerating(true);

    // Simulate report generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Title
            new Paragraph({
              text: 'PIPELINE INTEGRITY MONITORING REPORT',
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: 'IntegrityOS Platform',
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: `Generated: ${new Date(reportDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}`,
              alignment: AlignmentType.CENTER,
              spacing: { after: 600 },
            }),

            // Executive Summary
            new Paragraph({
              text: 'EXECUTIVE SUMMARY',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              text: 'This report provides a comprehensive analysis of pipeline integrity based on real-time sensor data and AI-powered predictive analytics. The IntegrityOS platform continuously monitors critical parameters to ensure safe and efficient pipeline operations.',
              spacing: { after: 400 },
            }),

            // Pipeline Parameters
            new Paragraph({
              text: 'PIPELINE PARAMETERS',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Pipeline ID: ', bold: true }),
                new TextRun('PL-2024-001'),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Pipe Size: ', bold: true }),
                new TextRun('24 inches (610 mm)'),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Material: ', bold: true }),
                new TextRun('Carbon Steel'),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Grade: ', bold: true }),
                new TextRun('API 5L X65'),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Initial Thickness: ', bold: true }),
                new TextRun('12.7 mm'),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Minimum Allowed Thickness: ', bold: true }),
                new TextRun('8.0 mm'),
              ],
              spacing: { after: 400 },
            }),

            // Sensor Data
            new Paragraph({
              text: 'REAL-TIME SENSOR DATA',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Current Temperature: ', bold: true }),
                new TextRun('68.5°C'),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Current Pressure: ', bold: true }),
                new TextRun('875 psi'),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Device Status: ', bold: true }),
                new TextRun('Online'),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Last Update: ', bold: true }),
                new TextRun(new Date().toLocaleString()),
              ],
              spacing: { after: 400 },
            }),

            // AI Prediction Results
            new Paragraph({
              text: 'AI PREDICTION RESULTS',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Predicted Thickness Loss: ', bold: true }),
                new TextRun('2.8 mm'),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Current Wall Thickness: ', bold: true }),
                new TextRun('9.9 mm'),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Remaining Life Estimate: ', bold: true }),
                new TextRun('6.3 years'),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Risk Level: ', bold: true }),
                new TextRun({ text: 'Medium', color: 'FF8C00' }),
              ],
              spacing: { after: 400 },
            }),

            // Risk Analysis
            new Paragraph({
              text: 'RISK ANALYSIS',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              text: 'The current analysis indicates a MEDIUM risk level for the monitored pipeline segment. Key findings include:',
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: '• Corrosion rate is within expected parameters for the material grade and operating conditions',
              bullet: { level: 0 },
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: '• Current wall thickness remains above minimum safety threshold',
              bullet: { level: 0 },
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: '• Temperature and pressure readings are stable and within normal operating ranges',
              bullet: { level: 0 },
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: '• Estimated remaining service life allows for planned maintenance scheduling',
              bullet: { level: 0 },
              spacing: { after: 400 },
            }),

            // Recommendations
            new Paragraph({
              text: 'RECOMMENDATIONS',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              text: '1. Schedule detailed ultrasonic thickness inspection within the next 6 months',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: '2. Continue continuous monitoring with current sensor array configuration',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: '3. Review and update corrosion mitigation strategies',
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: '4. Plan for pipeline segment replacement or reinforcement within 5-6 years',
              spacing: { after: 400 },
            }),

            // Conclusion
            new Paragraph({
              text: 'CONCLUSION',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              text: 'The pipeline integrity assessment indicates that the current segment is operating within acceptable safety parameters. The AI-powered predictive analytics provide valuable insights for proactive maintenance planning. Continued monitoring and timely implementation of recommended actions will ensure safe and reliable pipeline operations.',
              spacing: { after: 400 },
            }),

            // Footer
            new Paragraph({
              text: '___________________________________________',
              alignment: AlignmentType.CENTER,
              spacing: { before: 600, after: 200 },
            }),
            new Paragraph({
              text: 'IntegrityOS - Pipeline Integrity Monitoring Platform',
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: 'AI-Powered Predictive Maintenance for Critical Infrastructure',
              alignment: AlignmentType.CENTER,
              italics: true,
            }),
          ],
        },
      ],
    });

    // Generate and download
    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Pipeline_Integrity_Report_${reportDate}.docx`;
    link.click();
    window.URL.revokeObjectURL(url);

    setIsGenerating(false);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl mb-2">Executive Summary</h1>
        <p className="text-gray-500 text-sm">Generate comprehensive pipeline integrity reports</p>
      </div>

      <div className="max-w-4xl">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#e6ffe6' }}>
              <FileText className="w-8 h-8" style={{ color: '#008000' }} />
            </div>
            <div>
              <h2 className="text-xl mb-1">Pipeline Integrity Report</h2>
              <p className="text-gray-500 text-sm">Generate a detailed Word document with complete analysis</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="mb-4">Report Contents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FileCheck className="w-5 h-5 mt-0.5" style={{ color: '#008000' }} />
                <div>
                  <p className="text-sm mb-1">Pipeline Parameters</p>
                  <p className="text-xs text-gray-500">Size, material, grade, thickness specifications</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FileCheck className="w-5 h-5 mt-0.5" style={{ color: '#008000' }} />
                <div>
                  <p className="text-sm mb-1">Real-Time Sensor Data</p>
                  <p className="text-xs text-gray-500">Temperature, pressure, device status</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FileCheck className="w-5 h-5 mt-0.5" style={{ color: '#008000' }} />
                <div>
                  <p className="text-sm mb-1">AI Prediction Results</p>
                  <p className="text-xs text-gray-500">Thickness loss, remaining life, risk level</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FileCheck className="w-5 h-5 mt-0.5" style={{ color: '#008000' }} />
                <div>
                  <p className="text-sm mb-1">Risk Analysis & Recommendations</p>
                  <p className="text-xs text-gray-500">Detailed findings and action items</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm text-gray-600 mb-2">Report Date</label>
            <div className="relative max-w-xs">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={generateReport}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              style={{ backgroundColor: isGenerating ? '#d1d5db' : '#008000' }}
              onMouseEnter={(e) => !isGenerating && (e.currentTarget.style.backgroundColor = '#006600')}
              onMouseLeave={(e) => !isGenerating && (e.currentTarget.style.backgroundColor = '#008000')}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating Report...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Generate Word Report
                </>
              )}
            </button>
            {!isGenerating && (
              <p className="text-sm text-gray-500">Click to download .docx file</p>
            )}
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-3">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-900 mb-1">About the Report</p>
                <p className="text-sm text-blue-700">
                  The generated report includes comprehensive pipeline integrity analysis based on current sensor data and AI predictions. 
                  The document is formatted in Microsoft Word format (.docx) and includes executive summary, technical parameters, 
                  risk analysis, and actionable recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Reports Preview */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="mb-4">Recent Reports</h3>
          <div className="space-y-3">
            {[
              { date: '2026-01-19', pipeline: 'PL-2024-001', risk: 'Medium' },
              { date: '2026-01-12', pipeline: 'PL-2024-001', risk: 'Low' },
              { date: '2026-01-05', pipeline: 'PL-2024-002', risk: 'Medium' },
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm mb-1">Pipeline Integrity Report</p>
                    <p className="text-xs text-gray-500">
                      {report.pipeline} • {new Date(report.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs`} style={
                    report.risk === 'Low' 
                      ? { backgroundColor: '#e6ffe6', color: '#008000' } 
                      : { backgroundColor: '#ffedd5', color: '#ea580c' }
                  }>
                    {report.risk} Risk
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}