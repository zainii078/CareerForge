import { Job, Application, Resume, DashboardStats, RecruiterDashboardStats } from "./types";

export const sampleJobs: Job[] = [
  {
    id: "1",
    recruiter_id: "rec1",
    title: "Senior Frontend Engineer",
    company: "TechCorp",
    location: "San Francisco, CA",
    description: "We're looking for a Senior Frontend Engineer to lead our web application development. You'll work with React, TypeScript, and modern tooling to build exceptional user experiences.",
    requirements: ["5+ years experience", "React/TypeScript expertise", "Leadership experience"],
    skills_required: ["React", "TypeScript", "Next.js", "GraphQL", "Tailwind CSS"],
    salary_min: 150000,
    salary_max: 200000,
    job_type: "full-time",
    status: "active",
    applications_count: 47,
    created_at: "2024-01-15",
  },
  {
    id: "2",
    recruiter_id: "rec1",
    title: "Full Stack Developer",
    company: "StartupXYZ",
    location: "Remote",
    description: "Join our fast-growing startup as a Full Stack Developer. You'll work on both frontend and backend systems using modern technologies.",
    requirements: ["3+ years experience", "Full stack capabilities", "Startup mindset"],
    skills_required: ["Node.js", "React", "PostgreSQL", "AWS", "Docker"],
    salary_min: 120000,
    salary_max: 160000,
    job_type: "remote",
    status: "active",
    applications_count: 89,
    created_at: "2024-01-20",
  },
  {
    id: "3",
    recruiter_id: "rec2",
    title: "Product Manager",
    company: "InnovateCo",
    location: "New York, NY",
    description: "We're seeking an experienced Product Manager to drive product strategy and work closely with engineering teams.",
    requirements: ["4+ years PM experience", "Technical background preferred", "Agile expertise"],
    skills_required: ["Product Strategy", "Agile", "Data Analysis", "User Research", "Figma"],
    salary_min: 130000,
    salary_max: 170000,
    job_type: "full-time",
    status: "active",
    applications_count: 63,
    created_at: "2024-01-18",
  },
];

export const sampleApplications: Application[] = [
  {
    id: "1",
    job_id: "1",
    applicant_id: "user1",
    resume_id: "resume1",
    status: "shortlisted",
    ats_match_score: 92,
    created_at: "2024-01-20",
    job: sampleJobs[0],
  },
  {
    id: "2",
    job_id: "2",
    applicant_id: "user2",
    resume_id: "resume2",
    status: "interviewed",
    ats_match_score: 87,
    created_at: "2024-01-22",
    job: sampleJobs[1],
  },
  {
    id: "3",
    job_id: "1",
    applicant_id: "user3",
    resume_id: "resume3",
    status: "pending",
    ats_match_score: 78,
    created_at: "2024-01-23",
    job: sampleJobs[0],
  },
  {
    id: "4",
    job_id: "3",
    applicant_id: "user4",
    resume_id: "resume4",
    status: "reviewed",
    ats_match_score: 95,
    created_at: "2024-01-24",
    job: sampleJobs[2],
  },
  {
    id: "5",
    job_id: "2",
    applicant_id: "user5",
    resume_id: "resume5",
    status: "rejected",
    ats_match_score: 65,
    created_at: "2024-01-25",
    job: sampleJobs[1],
  },
];

export const sampleResume: Resume = {
  id: "resume1",
  user_id: "user1",
  title: "Software Engineer Resume",
  personal_info: {
    full_name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexjohnson",
    github: "github.com/alexjohnson",
    summary: "Experienced software engineer with 6+ years of expertise in building scalable web applications. Passionate about clean code, user experience, and mentoring junior developers.",
  },
  education: [
    {
      id: "edu1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      start_date: "2014-09",
      end_date: "2018-05",
      gpa: "3.8",
      achievements: ["Dean's List", "Hackathon Winner 2017"],
    },
  ],
  experience: [
    {
      id: "exp1",
      company: "TechGiant Inc.",
      position: "Senior Software Engineer",
      location: "San Francisco, CA",
      start_date: "2022-03",
      end_date: null,
      current: true,
      description: "Lead development of customer-facing dashboard application serving 2M+ users.",
      achievements: [
        "Improved application performance by 40% through code optimization",
        "Led team of 5 engineers on critical product launch",
        "Implemented CI/CD pipeline reducing deployment time by 60%",
      ],
    },
    {
      id: "exp2",
      company: "StartupCo",
      position: "Software Engineer",
      location: "San Francisco, CA",
      start_date: "2018-06",
      end_date: "2022-02",
      current: false,
      description: "Full stack development for fintech platform.",
      achievements: [
        "Built REST APIs handling 100K+ daily requests",
        "Developed real-time analytics dashboard using React and D3.js",
        "Reduced customer onboarding time by 35%",
      ],
    },
  ],
  skills: [
    { id: "skill1", name: "React", level: "expert", category: "Frontend" },
    { id: "skill2", name: "TypeScript", level: "expert", category: "Languages" },
    { id: "skill3", name: "Node.js", level: "advanced", category: "Backend" },
    { id: "skill4", name: "PostgreSQL", level: "advanced", category: "Database" },
    { id: "skill5", name: "AWS", level: "intermediate", category: "Cloud" },
    { id: "skill6", name: "Docker", level: "intermediate", category: "DevOps" },
    { id: "skill7", name: "GraphQL", level: "advanced", category: "APIs" },
    { id: "skill8", name: "Python", level: "intermediate", category: "Languages" },
  ],
  certifications: [
    {
      id: "cert1",
      name: "AWS Solutions Architect Associate",
      issuer: "Amazon Web Services",
      date: "2023-06",
      does_expire: true,
      expiry_date: "2026-06",
    },
    {
      id: "cert2",
      name: "Google Cloud Professional Developer",
      issuer: "Google",
      date: "2022-09",
      does_expire: false,
    },
  ],
  projects: [
    {
      id: "proj1",
      name: "OpenResume Builder",
      description: "Open source resume builder with real-time preview and export",
      technologies: ["React", "TypeScript", "Tailwind CSS"],
      github: "github.com/alexjohnson/open-resume",
      start_date: "2023-01",
      end_date: "2023-06",
    },
    {
      id: "proj2",
      name: "DevMetrics Dashboard",
      description: "Analytics dashboard for developer productivity metrics",
      technologies: ["Next.js", "PostgreSQL", "Chart.js"],
      url: "devmetrics.io",
      start_date: "2022-08",
    },
  ],
  languages: [
    { id: "lang1", name: "English", proficiency: "native" },
    { id: "lang2", name: "Spanish", proficiency: "professional" },
  ],
  template: "modern",
  ats_score: 87,
  is_primary: true,
  created_at: "2024-01-01",
  updated_at: "2024-01-15",
};

export const jobSeekerStats: DashboardStats = {
  ats_score: 87,
  resume_completion: 92,
  total_applications: 24,
  interview_rate: 33,
  job_match_percentage: 78,
};

export const recruiterStats: RecruiterDashboardStats = {
  open_jobs: 8,
  total_applications: 156,
  shortlisted: 23,
  hired: 4,
};

export const trustedCompanies = [
  { name: "Google", logo: "G" },
  { name: "Microsoft", logo: "M" },
  { name: "Amazon", logo: "A" },
  { name: "Meta", logo: "F" },
  { name: "Apple", logo: "A" },
  { name: "Netflix", logo: "N" },
  { name: "Spotify", logo: "S" },
  { name: "Stripe", logo: "S" },
];

export const testimonials = [
  {
    name: "Fatima Khan",
    role: "Software Engineer at Systems Limited",
    image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
    quote: "CareerForge helped me land my dream job at Systems Limited in Lahore. The ATS optimization feature increased my interview calls by 4x within just 2 weeks!",
    rating: 5,
  },
  {
    name: "Ahmed Hassan",
    role: "Product Manager at TechAbout",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
    quote: "The AI suggestions were incredibly accurate and relevant to the Pakistani job market. It identified gaps in my resume I never noticed before. Highly recommended!",
    rating: 5,
  },
  {
    name: "Zainab Malik",
    role: "HR Manager at Ibex",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
    quote: "As an HR professional in Karachi, the candidate matching feature has saved me countless hours of manual resume screening. A true game changer for our recruitment process!",
    rating: 5,
  },
  {
    name: "Bilal Raza",
    role: "Senior Developer at 10Pearls",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
    quote: "From resume creation to landing multiple interviews at top tech companies in Islamabad, CareerForge was instrumental in my job search. The ATS score helped me optimize perfectly.",
    rating: 5,
  },
  {
    name: "Ayesha Siddiqui",
    role: "Data Analyst at NETSOL",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
    quote: "The resume templates are beautiful and ATS-friendly. I received interview calls from 6 major companies in Lahore within my first month of using CareerForge.",
    rating: 5,
  },
];

export const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for job seekers starting out",
    price: 0,
    billing: "Free forever",
    features: [
      "1 Resume Template",
      "Basic ATS Scan",
      "Limited AI Suggestions",
      "PDF Export",
      "Email Support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    description: "For serious job seekers",
    price: 19,
    billing: "per month",
    features: [
      "Unlimited Resumes",
      "Advanced ATS Analysis",
      "Full AI Optimization",
      "20+ Premium Templates",
      "LinkedIn Integration",
      "Priority Support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For teams and recruiters",
    price: 99,
    billing: "per month",
    features: [
      "Everything in Professional",
      "Team Collaboration",
      "Custom Branding",
      "API Access",
      "Dedicated Account Manager",
      "Custom Integrations",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export const faqs = [
  {
    question: "How does the ATS optimization work?",
    answer:
      "Our AI analyzes your resume against job descriptions and industry standards. It identifies missing keywords, skills gaps, and formatting issues that could hurt your ATS score. You'll receive specific suggestions to improve each section.",
  },
  {
    question: "Can I export my resume in different formats?",
    answer:
      "Yes! You can export your resume as PDF, DOCX, or plain text. Our templates are optimized for each format to ensure your resume looks professional everywhere.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use enterprise-grade encryption for all data. Your resumes are stored securely and never shared with third parties. You can delete your data at any time.",
  },
  {
    question: "What makes CareerForge different from other resume builders?",
    answer:
      "CareerForge combines beautiful design with powerful AI. Unlike basic builders, we provide real ATS optimization, industry-specific keyword analysis, and intelligent suggestions that actually improve your chances of landing interviews.",
  },
  {
    question: "Can I use CareerForge if I'm changing careers?",
    answer:
      "Absolutely! Our AI is designed to help career changers highlight transferable skills and position their experience for new industries. We provide tailored suggestions based on your target role.",
  },
];

export const atsScoreHistory = [
  { date: "Jan", score: 65 },
  { date: "Feb", score: 72 },
  { date: "Mar", score: 78 },
  { date: "Apr", score: 82 },
  { date: "May", score: 87 },
];

export const applicationAnalytics = [
  { month: "Jan", applications: 5, interviews: 1, offers: 0 },
  { month: "Feb", applications: 8, interviews: 2, offers: 0 },
  { month: "Mar", applications: 6, interviews: 3, offers: 1 },
  { month: "Apr", applications: 12, interviews: 4, offers: 1 },
  { month: "May", applications: 10, interviews: 5, offers: 2 },
];

export const skillsDistribution = [
  { name: "Technical", value: 45, fill: "hsl(221, 83%, 53%)" },
  { name: "Soft Skills", value: 25, fill: "hsl(173, 58%, 39%)" },
  { name: "Leadership", value: 15, fill: "hsl(197, 37%, 24%)" },
  { name: "Tools", value: 15, fill: "hsl(43, 74%, 66%)" },
];

export const candidates = [
  {
    id: "c1",
    name: "Jennifer Williams",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
    position: "Senior Software Engineer",
    experience: "7 years",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    match_score: 95,
    status: "shortlisted",
    location: "San Francisco, CA",
    summary: "Experienced full-stack developer with a strong background in building scalable web applications. Led multiple teams and delivered high-impact projects.",
  },
  {
    id: "c2",
    name: "Michael Brown",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
    position: "Full Stack Developer",
    experience: "5 years",
    skills: ["Vue.js", "Python", "PostgreSQL", "Docker"],
    match_score: 87,
    status: "interviewed",
    location: "Remote",
    summary: "Versatile developer specializing in Vue.js and Python. Strong focus on clean architecture and testing.",
  },
  {
    id: "c3",
    name: "Amanda Martinez",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
    position: "Frontend Engineer",
    experience: "4 years",
    skills: ["React", "TypeScript", "Tailwind CSS", "Figma"],
    match_score: 78,
    status: "pending",
    location: "Austin, TX",
    summary: "UI-focused developer passionate about creating beautiful and accessible user interfaces.",
  },
  {
    id: "c4",
    name: "Robert Taylor",
    avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150",
    position: "Backend Developer",
    experience: "6 years",
    skills: ["Go", "Kubernetes", "Microservices", "Redis"],
    match_score: 82,
    status: "reviewed",
    location: "Seattle, WA",
    summary: "Backend specialist with expertise in distributed systems and cloud-native architecture.",
  },
];
