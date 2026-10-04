export const VERIFICATION_KPIS = {
  totalCandidates: 1284,
  employmentVerified: 842,
  epfoSignals: 731,
  highlyReady: 318
};

export const MOCK_CANDIDATES = [
  {
    id: "cand-001",
    name: "Rahul Sharma",
    role: "CNC Operator",
    experienceYears: 4,
    location: "Pithampur, MP",
    readinessScore: 92,
    immediatelyAvailable: true,
    verification: {
      epfoStatus: "Verified",
      esicStatus: "Verified",
      continuity: "Consistent",
      overallStatus: "Verified Employment Signal"
    },
    trustScore: 88,
    trustBreakdown: {
      employmentVerification: 35,
      experienceConsistency: 20,
      skillEvidence: 18,
      profileCompleteness: 10,
      recentActivity: 5
    },
    employmentHistory: [
      { company: "Apex Precision Ltd", role: "CNC Operator", duration: "2022 - Present (2 yrs)", epfoMatched: true, esicMatched: true },
      { company: "Indore Engineering Works", role: "Assistant CNC Operator", duration: "2020 - 2022 (2 yrs)", epfoMatched: true, esicMatched: true }
    ]
  },
  {
    id: "cand-002",
    name: "Amit Verma",
    role: "CNC Operator",
    experienceYears: 2,
    location: "Bhopal, MP",
    readinessScore: 85,
    immediatelyAvailable: true,
    verification: {
      epfoStatus: "Verified",
      esicStatus: "Pending",
      continuity: "Consistent",
      overallStatus: "Partially Verified"
    },
    trustScore: 78,
    trustBreakdown: {
      employmentVerification: 30,
      experienceConsistency: 18,
      skillEvidence: 16,
      profileCompleteness: 9,
      recentActivity: 5
    },
    employmentHistory: [
      { company: "Bhopal Toolings & Gears", role: "Junior CNC Operator", duration: "2022 - 2024 (2 yrs)", epfoMatched: true, esicMatched: false }
    ]
  },
  {
    id: "cand-003",
    name: "Pooja Patel",
    role: "Industrial Electrician",
    experienceYears: 5,
    location: "Indore, MP",
    readinessScore: 95,
    immediatelyAvailable: true,
    verification: {
      epfoStatus: "Verified",
      esicStatus: "Verified",
      continuity: "Consistent",
      overallStatus: "Verified Employment Signal"
    },
    trustScore: 94,
    trustBreakdown: {
      employmentVerification: 40,
      experienceConsistency: 20,
      skillEvidence: 19,
      profileCompleteness: 10,
      recentActivity: 5
    },
    employmentHistory: [
      { company: "Shree Power Works", role: "Industrial Electrician", duration: "2021 - Present (3 yrs)", epfoMatched: true, esicMatched: true },
      { company: "MP Electrical Solutions", role: "Electrical Apprentice", duration: "2019 - 2021 (2 yrs)", epfoMatched: true, esicMatched: true }
    ]
  },
  {
    id: "cand-004",
    name: "Suresh Kumar",
    role: "MIG / TIG Welder",
    experienceYears: 3,
    location: "Dewas, MP",
    readinessScore: 79,
    immediatelyAvailable: false,
    verification: {
      epfoStatus: "Verified",
      esicStatus: "Verified",
      continuity: "Gaps Detected",
      overallStatus: "Partially Verified"
    },
    trustScore: 75,
    trustBreakdown: {
      employmentVerification: 32,
      experienceConsistency: 14,
      skillEvidence: 15,
      profileCompleteness: 9,
      recentActivity: 5
    },
    employmentHistory: [
      { company: "Dewas Auto Fabricators", role: "Senior Welder", duration: "2023 - Present (1 yr)", epfoMatched: true, esicMatched: true },
      { company: "Central Steel Works", role: "MIG Welder", duration: "2021 - 2022 (1 yr)", epfoMatched: true, esicMatched: false }
    ]
  },
  {
    id: "cand-005",
    name: "Vikram Singh",
    role: "Warehouse Supervisor",
    experienceYears: 6,
    location: "Indore, MP",
    readinessScore: 90,
    immediatelyAvailable: true,
    verification: {
      epfoStatus: "Verified",
      esicStatus: "Verified",
      continuity: "Consistent",
      overallStatus: "Verified Employment Signal"
    },
    trustScore: 91,
    trustBreakdown: {
      employmentVerification: 38,
      experienceConsistency: 20,
      skillEvidence: 18,
      profileCompleteness: 10,
      recentActivity: 5
    },
    employmentHistory: [
      { company: "Delhivery Logistics Hub", role: "Warehouse Supervisor", duration: "2020 - Present (4 yrs)", epfoMatched: true, esicMatched: true },
      { company: "QuickKart Logistics", role: "Inventory Lead", duration: "2018 - 2020 (2 yrs)", epfoMatched: true, esicMatched: true }
    ]
  }
];
