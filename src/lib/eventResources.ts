import type { PreparedEvent } from "@/lib/preparedEvents";

export type EventResource = { label: string; type: "PDF" | "WEB"; url: string; description?: string };

export function getEventResources(event: PreparedEvent): EventResource[] {
  const penaltyPointChecklistPdf =
    "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c6ee3d2b16972cb29b095_HS_PenaltyPointChecklist.pdf";
  const statementOfAssurancesPdf =
    "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c6a10f1b290dde7b30b67_HS_Fillable-PreparedStatement.pdf";
  const competitionAdviceUrl = "https://www.decadirect.org/subcategories/prepared-events";
  const eventSpecificResources: Record<string, EventResource[]> = {
    BOR: [
      { label: "BOR introduction 2026-2027", type: "PDF", url: "/resources/BOR-introduction-2026-2027.pdf", description: "Orientation and event context for Business Operations Research." },
      { label: "BOR advisor guide", type: "PDF", url: "/resources/BOR-advisor-guide.pdf", description: "Teacher and advisor guidance for building the written entry." },
    ],
    "IMC-E": [{ label: "IMCE advisor tips", type: "PDF", url: "/resources/IMCE-advisor-tips.pdf", description: "Advisor guidance for the Integrated Marketing Campaign - Event entry." }],
    "IMC-P": [{ label: "IMCP advisor tips", type: "PDF", url: "/resources/IMCP-advisor-tips.pdf", description: "Advisor guidance for the Integrated Marketing Campaign - Product entry." }],
    "IMC-S": [{ label: "IMCS advisor tips", type: "PDF", url: "/resources/IMCS-advisor-tips.pdf", description: "Advisor guidance for the Integrated Marketing Campaign - Service entry." }],
  };

  return [
    { label: "Official event page", type: "WEB", url: event.eventPage, description: "DECA's source page for this event." },
    { label: "2026-2027 DECA Guide", type: "PDF", url: "/resources/DECA-26-HS-Guide.pdf", description: "The complete high school competitive events guide." },
    ...(eventSpecificResources[event.code] ?? []),
    { label: "Guidelines", type: "PDF", url: event.resources.guidelinesPdf, description: "Official event structure, requirements, and instructions." },
    { label: "Statement of assurances & integrity", type: "PDF", url: statementOfAssurancesPdf, description: "Required prepared-event assurances and integrity form." },
    ...(event.category === "Professional Selling and Consulting" ? [] : [
      { label: "Penalty point checklist", type: "PDF" as const, url: penaltyPointChecklistPdf, description: "Common submission and presentation penalties to avoid." },
      { label: "Competition advice", type: "WEB" as const, url: competitionAdviceUrl, description: "DECA Direct advice for preparing a competitive entry." },
    ]),
    ...(event.resources.evaluationFormPdf ? [{ label: "Completed sample event", type: "PDF" as const, url: event.resources.evaluationFormPdf, description: "A completed, well-done sample event for studying structure and execution." }] : []),
    ...(event.resources.performanceIndicatorsPdf ? [{ label: "Performance indicators", type: "PDF" as const, url: event.resources.performanceIndicatorsPdf, description: "Relevant performance indicators for the event category." }] : []),
  ];
}
