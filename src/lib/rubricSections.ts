export type RubricArea = {
  title: string;
  subsections: string[];
};

const rubricSectionsByCategory: Record<string, RubricArea[]> = {
  "Business Operations Research": [
    { title: "I. Executive Summary", subsections: ["One- to three-page description of the project"] },
    { title: "II. Introduction", subsections: [
      "A. Description and purpose of the business or organization",
      "B. Primary products or services",
      "C. Target market: demographics and psychographics",
      "D. Current customer loyalty and repeat-engagement strategy",
    ] },
    { title: "III. Research Methods Used in the Study", subsections: [
      "A. Research methodologies selected and rationale",
      "B. Process used to conduct the selected research methods",
    ] },
    { title: "IV. Findings and Conclusions of the Study", subsections: [
      "A. Findings of the research study",
      "B. Conclusions based on the findings",
    ] },
    { title: "V. Proposed Strategic Plan", subsections: [
      "A. Objectives and rationale",
      "B. Proposed activities and timelines",
      "C. Metrics or key performance indicators",
    ] },
    { title: "VI. Proposed Budget", subsections: ["Costs, rationale, financial viability, and ROI"] },
    { title: "VII. Bibliography", subsections: ["Required: sources of information used in the written document"] },
    { title: "VIII. Appendix", subsections: ["Optional: exhibits, questionnaires, correspondence, background data, or meeting records"] },
  ],
  "Project Management": [
    { title: "I. Executive Summary", subsections: ["One- to three-page project overview", "Primary outcome and impact"] },
    { title: "II. Project Overview", subsections: ["Description of the business or organization", "Problem or opportunity addressed", "Project purpose and SMART objectives", "Stakeholders and target audience"] },
    { title: "III. Project Initiation and Planning", subsections: ["Project scope and deliverables", "Timeline and milestones", "Roles, responsibilities, and resources", "Risks and contingency controls"] },
    { title: "IV. Project Execution", subsections: ["Activities completed", "Communication and teamwork", "Project management tools used", "Monitoring and adjustments"] },
    { title: "V. Project Results and Evaluation", subsections: ["Evidence of results", "Objectives achieved", "Feedback and evaluation", "Reflection and lessons learned"] },
    { title: "VI. Sustainability and Next Steps", subsections: ["Long-term impact", "Maintenance or handoff plan", "Future recommendations"] },
    { title: "VII. Bibliography", subsections: ["Sources of information used in the written document"] },
    { title: "VIII. Appendix", subsections: ["Optional exhibits, schedules, forms, communications, or supporting evidence"] },
  ],
  Entrepreneurship: [
    { title: "I. Executive Summary", subsections: ["Business concept and opportunity", "Target customer and value proposition", "Financial and growth snapshot"] },
    { title: "II. Business Description", subsections: ["Business name, purpose, and ownership", "Products or services", "Mission and competitive advantage", "Current stage or launch plan"] },
    { title: "III. Market Analysis", subsections: ["Customer problem and target market", "Demographics and psychographics", "Market size and trends", "Competitors and differentiation"] },
    { title: "IV. Marketing and Sales Plan", subsections: ["Positioning and message", "Marketing channels and tactics", "Pricing and sales process", "Customer retention strategy"] },
    { title: "V. Operations and Management", subsections: ["Operating model and workflow", "Resources, suppliers, and technology", "Management team and staffing", "Legal, ethical, and risk considerations"] },
    { title: "VI. Financial Plan", subsections: ["Revenue model and assumptions", "Startup or operating costs", "Projections and break-even", "Funding needs, viability, and ROI"] },
    { title: "VII. Bibliography", subsections: ["Sources of information used in the written document"] },
    { title: "VIII. Appendix", subsections: ["Optional exhibits, research instruments, financial tables, or product materials"] },
  ],
  "Integrated Marketing Campaign": [
    { title: "I. Executive Summary", subsections: ["Campaign overview", "Primary objective and audience", "Expected result and investment"] },
    { title: "II. Situation Analysis", subsections: ["Business, product, service, or event context", "Market and competitive conditions", "Audience demographics and psychographics", "Research insights and opportunity"] },
    { title: "III. Campaign Strategy", subsections: ["Campaign objectives", "Target audience and positioning", "Core message and creative direction", "Integration across channels"] },
    { title: "IV. Integrated Campaign Plan", subsections: ["Tactics and deliverables", "Channel roles and customer journey", "Timeline and launch sequence", "Budget allocation"] },
    { title: "V. Implementation", subsections: ["Execution responsibilities", "Resources and production needs", "Contingencies and risk controls", "Brand and ethical standards"] },
    { title: "VI. Measurement and Optimization", subsections: ["KPIs and benchmarks", "Data collection and evaluation", "Expected ROI or impact", "Optimization and next steps"] },
    { title: "VII. Bibliography", subsections: ["Sources of information used in the written document"] },
    { title: "VIII. Appendix", subsections: ["Optional creative samples, media plans, research, schedules, or budget detail"] },
  ],
  "Professional Selling and Consulting": [
    { title: "I. Client and Market Context", subsections: ["Client or customer profile", "Business need and opportunity", "Relevant market conditions"] },
    { title: "II. Discovery Plan", subsections: ["Research and preparation", "Needs-discovery questions", "Decision criteria and buying motives"] },
    { title: "III. Solution Recommendation", subsections: ["Solution-to-need alignment", "Features, benefits, and evidence", "Value, alternatives, and tradeoffs"] },
    { title: "IV. Consultation and Objections", subsections: ["Likely objections", "Responses and supporting proof", "Risks, ethics, and trust"] },
    { title: "V. Presentation and Close", subsections: ["Professional delivery", "Call to action", "Negotiation or commitment path"] },
    { title: "VI. Follow-up Plan", subsections: ["Implementation or onboarding", "Success measures", "Relationship and repeat-engagement plan"] },
    { title: "VII. Supporting Sources", subsections: ["Sources, product information, or research used"] },
  ],
};

export function getRubricAreas(category: string): RubricArea[] {
  return rubricSectionsByCategory[category] ?? rubricSectionsByCategory.Entrepreneurship;
}

export function getRubricSubsections(category: string): string[] {
  return getRubricAreas(category).flatMap((area) => area.subsections);
}
