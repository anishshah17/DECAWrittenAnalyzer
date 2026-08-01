export type RubricResources = {
  guidelinesPdf: string;
  evaluationFormPdf?: string;
  performanceIndicatorsPdf?: string;
};

export type PreparedEvent = {
  code: string;
  slug: string;
  name: string;
  category: string;
  eventPage: string;
  resources: RubricResources;
};

export const preparedEvents: PreparedEvent[] = [
  {
    code: "BOR",
    slug: "business-services-operations-research",
    name: "Business Services Operations Research",
    category: "Business Operations Research",
    eventPage: "https://www.deca.org/compete/business-services-operations-research",
    resources: {
      guidelinesPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c6eb1eae4bc1087206b96_HS_BOR_Guidelines.pdf",
      evaluationFormPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3dbb41e0cf1045ce1e33e9_BOR_1.pdf",
    },
  },
  {
    code: "BOR-BM",
    slug: "buying-and-merchandising-operations-research",
    name: "Buying and Merchandising Operations Research",
    category: "Business Operations Research",
    eventPage: "https://www.deca.org/compete/buying-and-merchandising-operations-research",
    resources: {
      guidelinesPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c6eb1eae4bc1087206b96_HS_BOR_Guidelines.pdf",
      evaluationFormPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3dbb2578e60ce037e51bf3_BMOR_1.pdf",
    },
  },
  {
    code: "BOR-FIN",
    slug: "finance-operations-research",
    name: "Finance Operations Research",
    category: "Business Operations Research",
    eventPage: "https://www.deca.org/compete/finance-operations-research",
    resources: {
      guidelinesPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c6eb1eae4bc1087206b96_HS_BOR_Guidelines.pdf",
      evaluationFormPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3dbde8a339a464255b58ea_FOR_1.pdf",
    },
  },
  {
    code: "BOR-HT",
    slug: "hospitality-and-tourism-operations-research",
    name: "Hospitality and Tourism Operations Research",
    category: "Business Operations Research",
    eventPage: "https://www.deca.org/compete/hospitality-and-tourism-operations-research",
    resources: {
      guidelinesPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c6eb1eae4bc1087206b96_HS_BOR_Guidelines.pdf",
      evaluationFormPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3dbdfffce679d6c7b35320_HTOR_1.pdf",
    },
  },
  {
    code: "BOR-SEM",
    slug: "sports-and-entertainment-marketing-operations-research",
    name: "Sports and Entertainment Marketing Operations Research",
    category: "Business Operations Research",
    eventPage: "https://www.deca.org/compete/sports-and-entertainment-marketing-operations-research",
    resources: {
      guidelinesPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c6eb1eae4bc1087206b96_HS_BOR_Guidelines.pdf",
      evaluationFormPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3dbf2dcb392341760100db_SEOR_1.pdf",
    },
  },
  {
    code: "PM-BSP",
    slug: "business-solutions-project",
    name: "Business Solutions Project",
    category: "Project Management",
    eventPage: "https://www.deca.org/compete/business-solutions-project",
    resources: {
      guidelinesPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c755acdcc788f56c5a001_HS_PM_Guidelines.pdf",
      evaluationFormPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3dbeb773121ba5e09b0cd2_PMBS_1.pdf",
    },
  },
  {
    code: "PM-CDP",
    slug: "career-development-project",
    name: "Career Development Project",
    category: "Project Management",
    eventPage: "https://www.deca.org/compete/career-development-project",
    resources: {
      guidelinesPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c755acdcc788f56c5a001_HS_PM_Guidelines.pdf",
      evaluationFormPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3dbee7fce679d6c7b35681_PMCD_1.pdf",
    },
  },
  {
    code: "PM-CA",
    slug: "community-awareness-project",
    name: "Community Awareness Project",
    category: "Project Management",
    eventPage: "https://www.deca.org/compete/community-awareness-project",
    resources: {
      guidelinesPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c755acdcc788f56c5a001_HS_PM_Guidelines.pdf",
      evaluationFormPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3dbed0be215d6547dd1404_PMCA_1.pdf",
    },
  },
  {
    code: "PM-CG",
    slug: "community-giving-project",
    name: "Community Giving Project",
    category: "Project Management",
    eventPage: "https://www.deca.org/compete/community-giving-project",
    resources: {
      guidelinesPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c755acdcc788f56c5a001_HS_PM_Guidelines.pdf",
      evaluationFormPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3dbef5be215d6547dd30b4_PMCG_1.pdf",
    },
  },
  {
    code: "PM-FLP",
    slug: "financial-literacy-project",
    name: "Financial Literacy Project",
    category: "Project Management",
    eventPage: "https://www.deca.org/compete/financial-literacy-project",
    resources: {
      guidelinesPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c755acdcc788f56c5a001_HS_PM_Guidelines.pdf",
      evaluationFormPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3dbf06b466246d88678b78_PMFL_1.pdf",
    },
  },
  {
    code: "PM-SP",
    slug: "sales-project",
    name: "Sales Project",
    category: "Project Management",
    eventPage: "https://www.deca.org/compete/sales-project",
    resources: {
      guidelinesPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c755acdcc788f56c5a001_HS_PM_Guidelines.pdf",
      evaluationFormPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3dbf1c41c602eb2959f8e0_PMSP_1.pdf",
    },
  },
  {
    code: "ENT-EBG",
    slug: "business-growth-plan",
    name: "Business Growth Plan",
    category: "Entrepreneurship",
    eventPage: "https://www.deca.org/compete/business-growth-plan",
    resources: {
      guidelinesPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c70bccdcc788f56c50075_HS_EBG_Guidelines.pdf",
      evaluationFormPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3dbb6678e60ce037e53f69_EBG_1.pdf",
    },
  },
  {
    code: "ENT-EFB",
    slug: "franchise-business-plan",
    name: "Franchise Business Plan",
    category: "Entrepreneurship",
    eventPage: "https://www.deca.org/compete/franchise-business-plan",
    resources: {
      guidelinesPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c713c8e4955853e3f76f0_HS_EFB_Guidelines.pdf",
      evaluationFormPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3dbbd219c6f91e8faa09e4_EFB_1.pdf",
    },
  },
  {
    code: "ENT-EIB",
    slug: "independent-business-plan",
    name: "Independent Business Plan",
    category: "Entrepreneurship",
    eventPage: "https://www.deca.org/compete/independent-business-plan",
    resources: {
      guidelinesPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c722ce4784af00229b066_HS_EIB_Guidelines.pdf",
      evaluationFormPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3dbbe8eed309249cc568c6_EIB_1.pdf",
    },
  },
  {
    code: "ENT-EIP",
    slug: "innovation-plan",
    name: "Innovation Plan",
    category: "Entrepreneurship",
    eventPage: "https://www.deca.org/compete/innovation-plan",
    resources: {
      guidelinesPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c727b824720be717aa59f_HS_EIP_Guidelines.pdf",
      evaluationFormPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3dbc00481c117d7b55372a_EIP_1.pdf",
    },
  },
  {
    code: "ENT-EIBP",
    slug: "international-business-plan",
    name: "International Business Plan",
    category: "Entrepreneurship",
    eventPage: "https://www.deca.org/compete/international-business-plan",
    resources: {
      guidelinesPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c731318258905c9bcace9_HS_IBP_Guidelines.pdf",
      evaluationFormPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3dbe119becbb3527bd25c1_IBP_1.pdf",
    },
  },
  {
    code: "ENT-ESB",
    slug: "start-up-business-plan",
    name: "Start-Up Business Plan",
    category: "Entrepreneurship",
    eventPage: "https://www.deca.org/compete/start-up-business-plan",
    resources: {
      guidelinesPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c72b99c21bd0cc6a58841_HS_ESB_Guidelines.pdf",
      evaluationFormPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3dbdd3fce679d6c7b34fde_ESB_1.pdf",
    },
  },
  {
    code: "IMC-E",
    slug: "integrated-marketing-campaign-event",
    name: "Integrated Marketing Campaign - Event",
    category: "Integrated Marketing Campaign",
    eventPage: "https://www.deca.org/compete/integrated-marketing-campaign-event",
    resources: {
      guidelinesPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c735b9a806700f706652b_HS_IMC_Guidelines.pdf",
      evaluationFormPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3dbe280b47be6fab11bd04_IMCE_1.pdf",
      performanceIndicatorsPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c7392af68506b6dfcde04_2026-27-HS-DECA-Marketing.pdf",
    },
  },
  {
    code: "IMC-P",
    slug: "integrated-marketing-campaign-product",
    name: "Integrated Marketing Campaign - Product",
    category: "Integrated Marketing Campaign",
    eventPage: "https://www.deca.org/compete/integrated-marketing-campaign-product",
    resources: {
      guidelinesPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c735b9a806700f706652b_HS_IMC_Guidelines.pdf",
      performanceIndicatorsPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c7392af68506b6dfcde04_2026-27-HS-DECA-Marketing.pdf",
    },
  },
  {
    code: "IMC-S",
    slug: "integrated-marketing-campaign-service",
    name: "Integrated Marketing Campaign - Service",
    category: "Integrated Marketing Campaign",
    eventPage: "https://www.deca.org/compete/integrated-marketing-campaign-service",
    resources: {
      guidelinesPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c735b9a806700f706652b_HS_IMC_Guidelines.pdf",
      evaluationFormPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3dbe9d0b47be6fab11fa96_IMCS_1.pdf",
      performanceIndicatorsPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c7392af68506b6dfcde04_2026-27-HS-DECA-Marketing.pdf",
    },
  },
  {
    code: "PSC-FC",
    slug: "financial-consulting",
    name: "Financial Consulting",
    category: "Professional Selling and Consulting",
    eventPage: "https://www.deca.org/compete/financial-consulting",
    resources: {
      guidelinesPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c771dcc9f1c5e613efc57_HS_PSC_Guidelines.pdf",
      performanceIndicatorsPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c77411732c3dfeb201332_2026-27-HS-DECA-Finance.pdf",
    },
  },
  {
    code: "PSC-HTPS",
    slug: "hospitality-and-tourism-professional-selling",
    name: "Hospitality and Tourism Professional Selling",
    category: "Professional Selling and Consulting",
    eventPage: "https://www.deca.org/compete/hospitality-and-tourism-professional-selling",
    resources: {
      guidelinesPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c771dcc9f1c5e613efc57_HS_PSC_Guidelines.pdf",
    },
  },
  {
    code: "PSC-PS",
    slug: "professional-selling",
    name: "Professional Selling",
    category: "Professional Selling and Consulting",
    eventPage: "https://www.deca.org/compete/professional-selling",
    resources: {
      guidelinesPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c771dcc9f1c5e613efc57_HS_PSC_Guidelines.pdf",
      performanceIndicatorsPdf: "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6a3c7392af68506b6dfcde04_2026-27-HS-DECA-Marketing.pdf",
    },
  },
];

export const reviewCriteriaByCategory: Record<string, string[]> = {
  "Business Operations Research": [
    "Problem framing and scope",
    "Research quality and reliability",
    "Strategic recommendation fit",
    "Feasibility and implementation controls",
  ],
  "Project Management": [
    "Community or business objective clarity",
    "Project plan and execution detail",
    "Evidence of outcomes and impact",
    "Reflection, iteration, and sustainability",
  ],
  Entrepreneurship: [
    "Customer problem and value proposition",
    "Market validation and competitive logic",
    "Operations and go-to-market readiness",
    "Financial assumptions and viability",
  ],
  "Integrated Marketing Campaign": [
    "Audience insight and objective precision",
    "Channel integration and creative cohesion",
    "Budget, timeline, and tactical realism",
    "Measurement model and optimization path",
  ],
  "Professional Selling and Consulting": [
    "Needs discovery and consultative approach",
    "Solution alignment to client goals",
    "Evidence, objections, and recommendation quality",
    "Professional delivery and call to action",
  ],
};
