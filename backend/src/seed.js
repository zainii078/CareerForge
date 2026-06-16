require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");
const Resume = require("./models/Resume");
const Job = require("./models/Job");

async function seed() {
  await connectDB();

  await Promise.all([User.deleteMany({}), Resume.deleteMany({}), Job.deleteMany({})]);

  const recruiterPass = await bcrypt.hash("recruiter123", 10);
  const seekerPass = await bcrypt.hash("seeker123", 10);

  const recruiter = await User.create({
    email: "recruiter@careerforge.com",
    password: recruiterPass,
    full_name: "Hassan Raza",
    role: "recruiter",
    company_name: "TechVentures Pakistan",
    bio: "Senior HR Manager at TechVentures Pakistan with 10+ years of experience in tech recruitment across Lahore, Karachi, and Islamabad.",
    phone: "+92 300 1234567",
  });

  const seeker = await User.create({
    email: "seeker@careerforge.com",
    password: seekerPass,
    full_name: "Ahmed Hassan",
    role: "job_seeker",
    phone: "+92 321 9876543",
    bio: "Full-stack developer passionate about building scalable web and mobile applications.",
    job_preference: "Full Stack Developer with React, Node.js, and MongoDB experience",
  });

  await Resume.create({
    user_id: seeker._id,
    title: "My Resume",
    personal_info: {
      full_name: "Ahmed Hassan",
      email: "seeker@careerforge.com",
      phone: "+92 321 9876543",
      location: "Lahore, Pakistan",
      linkedin: "linkedin.com/in/ahmedhassan",
      github: "github.com/ahmedhassan",
      summary:
        "Full-stack software engineer with 4+ years of experience building scalable web and mobile applications using React, Node.js, Flutter, and cloud technologies.",
    },
    education: [
      {
        id: "edu1",
        institution: "University of Engineering and Technology, Lahore",
        degree: "B.S.",
        field: "Computer Science",
        start_date: "2016",
        end_date: "2020",
        gpa: "3.6",
        achievements: ["Dean's List", "Final Year Project Award"],
      },
    ],
    experience: [
      {
        id: "exp1",
        company: "Systems Limited",
        position: "Senior Full Stack Developer",
        location: "Lahore, Pakistan",
        start_date: "2022",
        end_date: null,
        current: true,
        description: "Lead development of enterprise web applications for banking clients.",
        achievements: [
          "Reduced API response time by 35% through query optimization",
          "Led team of 3 engineers on microservices migration",
        ],
      },
      {
        id: "exp2",
        company: "VentureDive",
        position: "Full Stack Developer",
        location: "Karachi, Pakistan",
        start_date: "2020",
        end_date: "2022",
        current: false,
        description: "Built MVPs and scaled platforms for startups.",
        achievements: ["Implemented CI/CD pipeline reducing deployment time by 50%"],
      },
    ],
    skills: [
      { id: "s1", name: "React", level: "expert", category: "Frontend" },
      { id: "s2", name: "TypeScript", level: "expert", category: "Frontend" },
      { id: "s3", name: "Node.js", level: "advanced", category: "Backend" },
      { id: "s4", name: "MongoDB", level: "advanced", category: "Database" },
      { id: "s5", name: "Flutter", level: "intermediate", category: "Mobile" },
      { id: "s6", name: "AWS", level: "intermediate", category: "Cloud" },
    ],
    projects: [
      {
        id: "p1",
        name: "CareerForge",
        description: "AI-powered resume builder and ATS optimizer for Pakistani job market.",
        technologies: ["React", "Node.js", "FastAPI", "MongoDB"],
        github: "github.com/ahmedhassan/careerforge",
        start_date: "2024",
      },
    ],
    certifications: [
      {
        id: "c1",
        name: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        date: "2023",
        does_expire: true,
        expiry_date: "2026",
      },
    ],
    languages: [
      { id: "l1", name: "English", proficiency: "professional" },
      { id: "l2", name: "Urdu", proficiency: "native" },
    ],
    template: "modern",
    ats_score: 0,
    is_primary: true,
  });

  const jobList = [
    {
      recruiter_id: recruiter._id,
      title: "Senior Flutter Developer",
      company: "TechVentures Pakistan",
      location: "Lahore, Pakistan",
      department: "Mobile Engineering",
      description:
        "We are looking for a Senior Flutter Developer to build cross-platform mobile applications. Requirements: 3+ years Flutter/Dart experience, state management (Bloc/Riverpod), REST API integration, Firebase, and CI/CD. You will work on fintech and e-commerce apps for Pakistani market.",
      requirements: ["3+ years Flutter experience", "Dart expertise", "Mobile app deployment"],
      skills_required: ["Flutter", "Dart", "Firebase", "REST API", "Bloc", "CI/CD"],
      salary_min: 1500000,
      salary_max: 2500000,
      job_type: "full-time",
      status: "active",
    },
    {
      recruiter_id: recruiter._id,
      title: "Full Stack Developer",
      company: "TechVentures Pakistan",
      location: "Karachi, Pakistan",
      department: "Engineering",
      description:
        "Join our team as a Full Stack Developer. Build scalable web applications using React, Node.js, MongoDB, and AWS. Experience with TypeScript, Next.js, and microservices architecture preferred. Remote-friendly with office in Karachi.",
      requirements: ["3+ years full stack experience", "React and Node.js"],
      skills_required: ["React", "Node.js", "MongoDB", "TypeScript", "Next.js", "AWS"],
      salary_min: 1200000,
      salary_max: 2000000,
      job_type: "full-time",
      status: "active",
    },
    {
      recruiter_id: recruiter._id,
      title: "React Frontend Engineer",
      company: "TechVentures Pakistan",
      location: "Islamabad, Pakistan",
      department: "Frontend",
      description:
        "Frontend engineer needed to build modern React applications. Must know TypeScript, Tailwind CSS, Redux, and responsive design. Experience with Next.js and performance optimization is a plus.",
      requirements: ["2+ years React experience", "TypeScript"],
      skills_required: ["React", "TypeScript", "Tailwind CSS", "Redux", "Next.js"],
      salary_min: 1000000,
      salary_max: 1800000,
      job_type: "full-time",
      status: "active",
    },
    {
      recruiter_id: recruiter._id,
      title: "Backend Node.js Developer",
      company: "TechVentures Pakistan",
      location: "Lahore, Pakistan",
      department: "Backend",
      description:
        "Backend developer to design and implement RESTful APIs using Node.js, Express, and MongoDB. Knowledge of authentication, microservices, Docker, and cloud deployment required.",
      requirements: ["3+ years Node.js", "API design experience"],
      skills_required: ["Node.js", "Express", "MongoDB", "Docker", "REST API", "JWT"],
      salary_min: 1100000,
      salary_max: 1900000,
      job_type: "full-time",
      status: "active",
    },
    {
      recruiter_id: recruiter._id,
      title: "DevOps Engineer",
      company: "TechVentures Pakistan",
      location: "Remote",
      department: "Infrastructure",
      description:
        "DevOps engineer to manage CI/CD pipelines, Kubernetes clusters, and AWS infrastructure. Experience with Terraform, monitoring, and security best practices.",
      requirements: ["2+ years DevOps", "AWS certification preferred"],
      skills_required: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Linux"],
      salary_min: 1400000,
      salary_max: 2200000,
      job_type: "remote",
      status: "active",
    },
    {
      recruiter_id: recruiter._id,
      title: "Junior Flutter Developer",
      company: "TechVentures Pakistan",
      location: "Lahore, Pakistan",
      department: "Mobile Engineering",
      description:
        "Entry-level Flutter developer for mobile app development. Fresh graduates with Flutter portfolio projects welcome. Training provided on Bloc pattern and Firebase.",
      requirements: ["Flutter basics", "Computer Science degree"],
      skills_required: ["Flutter", "Dart", "Git", "Firebase"],
      salary_min: 600000,
      salary_max: 1000000,
      job_type: "full-time",
      status: "active",
    },
    {
      recruiter_id: recruiter._id,
      title: "Python FastAPI Developer",
      company: "TechVentures Pakistan",
      location: "Karachi, Pakistan",
      department: "AI/ML",
      description:
        "Python developer to build AI-powered APIs using FastAPI. Work on NLP, resume parsing, and recommendation systems. ML experience is a bonus.",
      requirements: ["2+ years Python", "API development"],
      skills_required: ["Python", "FastAPI", "MongoDB", "REST API", "Machine Learning"],
      salary_min: 1300000,
      salary_max: 2100000,
      job_type: "full-time",
      status: "active",
    },
    {
      recruiter_id: recruiter._id,
      title: "UI/UX Designer",
      company: "TechVentures Pakistan",
      location: "Islamabad, Pakistan",
      department: "Design",
      description:
        "Creative UI/UX designer for web and mobile products. Proficiency in Figma, design systems, and user research. Portfolio required.",
      requirements: ["2+ years design experience", "Figma portfolio"],
      skills_required: ["Figma", "UI Design", "UX Research", "Prototyping"],
      salary_min: 800000,
      salary_max: 1500000,
      job_type: "full-time",
      status: "active",
    },
  ];

  await Job.create(jobList);

  // Create Pakistani applicant users with resumes and applications (dummy data)
  const pakNames = [
    { full_name: "Ayesha Khan", email: "ayesha.khan@example.com" },
    { full_name: "Bilal Ahmed", email: "bilal.ahmed@example.com" },
    { full_name: "Sara Ali", email: "sara.ali@example.com" },
    { full_name: "Usman Iqbal", email: "usman.iqbal@example.com" },
    { full_name: "Fatima Noor", email: "fatima.noor@example.com" },
    { full_name: "Zain Malik", email: "zain.malik@example.com" },
  ];

  const applicants = [];
  for (const p of pakNames) {
    const password = await bcrypt.hash("seeker123", 10);
    const user = await User.create({
      email: p.email,
      password,
      full_name: p.full_name,
      role: "job_seeker",
      phone: "+92 300 0000000",
      bio: "Experienced professional interested in tech opportunities in Pakistan.",
    });

    const resume = await Resume.create({
      user_id: user._id,
      title: `${p.full_name} - Resume`,
      personal_info: {
        full_name: p.full_name,
        email: p.email,
        phone: "+92 300 0000000",
        location: "Pakistan",
        summary: "Results-driven professional with relevant experience. Open to new opportunities.",
      },
      education: [],
      experience: [],
      skills: [{ id: "s1", name: "Communication", level: "intermediate", category: "Soft" }],
      projects: [],
      certifications: [],
      languages: [],
      template: "modern",
      ats_score: 0,
      is_primary: true,
    });

    applicants.push({ user, resume });
  }

  // Create applications for some jobs to populate recruiter pipeline
  const Application = require("./models/Application");
  const jobs = await Job.find({}).limit(6);
  for (let i = 0; i < applicants.length; i++) {
    const job = jobs[i % jobs.length];
    const applicant = applicants[i];
    await Application.create({
      job_id: job._id,
      applicant_id: applicant.user._id,
      resume_id: applicant.resume._id,
      cover_letter: `I am interested in the ${job.title} role and believe my skills are a good fit.`,
      status: i % 3 === 0 ? "shortlisted" : i % 3 === 1 ? "reviewed" : "pending",
      ats_match_score: 60 + (i * 5),
      ai_insights: ["Good experience", "Needs more keywords"],
    });
  }

  console.log("Seed complete!");
  console.log("Recruiter: recruiter@careerforge.com / recruiter123");
  console.log("Job Seeker: seeker@careerforge.com / seeker123");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
