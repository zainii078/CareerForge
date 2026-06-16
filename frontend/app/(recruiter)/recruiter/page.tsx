"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Briefcase, Users, Star, TrendingUp, ArrowUpRight, CheckCircle2, Building2, MapPin, Plus,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from "recharts";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, Candidate } from "@/lib/api";
import { Job, RecruiterDashboardStats } from "@/lib/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const sampleRecruiterCandidates: Candidate[] = [
  {
    id: "c-ayesha",
    name: "Ayesha Khan",
    avatar: "https://images.pexels.com/photos/3763208/pexels-photo-3763208.jpeg?auto=compress&cs=tinysrgb&w=150",
    position: "Flutter Developer",
    experience: "3 years",
    skills: ["Flutter", "Dart", "Firebase", "REST APIs"],
    match_score: 88,
    status: "shortlisted",
    location: "Lahore, Pakistan",
    summary: "Mobile developer with experience building fintech and ecommerce applications.",
    ai_insights: ["Strong Flutter expertise", "Great API integration experience"],
  },
  {
    id: "c-bilal",
    name: "Bilal Ahmed",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
    position: "Full Stack Developer",
    experience: "4 years",
    skills: ["React", "Node.js", "MongoDB", "AWS"],
    match_score: 82,
    status: "reviewed",
    location: "Karachi, Pakistan",
    summary: "Experienced full-stack engineer delivering scalable web apps.",
    ai_insights: ["Good backend experience", "Needs stronger cloud exposure"],
  },
  {
    id: "c-fatima",
    name: "Fatima Noor",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
    position: "Frontend Engineer",
    experience: "2 years",
    skills: ["React", "TypeScript", "Tailwind CSS", "Figma"],
    match_score: 75,
    status: "pending",
    location: "Islamabad, Pakistan",
    summary: "Frontend developer building polished user interfaces for SaaS products.",
    ai_insights: ["Strong UI skills", "Needs more backend collaboration examples"],
  },
];

const samplePipelineFallback = [
  { stage: "Pending", count: 2 },
  { stage: "Reviewed", count: 1 },
  { stage: "Shortlisted", count: 1 },
  { stage: "Interviewed", count: 0 },
  { stage: "Hired", count: 0 },
  { stage: "Rejected", count: 0 },
];

export default function RecruiterDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<RecruiterDashboardStats | null>(null);
  const [pipeline, setPipeline] = useState<{ stage: string; count: number }[]>([]);
  const [activity, setActivity] = useState<{ type: string; message: string; time: string }[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<{ day: string; applications: number; screenings: number }[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [postOpen, setPostOpen] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: "", company: "", location: "", department: "", description: "",
    requirements: "", skills_required: "", salary_min: "", salary_max: "", job_type: "full-time",
  });

  useEffect(() => {
    api.recruiter.stats().then(setStats).catch(() => {});
    api.recruiter.pipeline().then((r) => setPipeline(r.pipeline)).catch(() => setPipeline(samplePipelineFallback));
    api.recruiter.activity().then(setActivity).catch(() => {});
    api.recruiter.analytics().then((r) => setWeeklyActivity(r.weekly_activity)).catch(() => {
      setWeeklyActivity([
        { day: "Mon", applications: 1, screenings: 0 },
        { day: "Tue", applications: 2, screenings: 1 },
        { day: "Wed", applications: 1, screenings: 0 },
        { day: "Thu", applications: 0, screenings: 0 },
        { day: "Fri", applications: 1, screenings: 1 },
        { day: "Sat", applications: 0, screenings: 0 },
        { day: "Sun", applications: 0, screenings: 0 },
      ]);
    });
    api.recruiter.candidates().then(setCandidates).catch(() => setCandidates(sampleRecruiterCandidates));
    api.recruiter.jobs().then(setJobs).catch(() => {});
  }, []);

  const handlePostJob = async () => {
    if (!jobForm.title || !jobForm.company || !jobForm.description) {
      toast.error("Title, company, and description are required");
      return;
    }
    try {
      const createdJob = await api.jobs.create({
        title: jobForm.title,
        company: jobForm.company,
        location: jobForm.location,
        department: jobForm.department,
        description: jobForm.description,
        requirements: jobForm.requirements.split("\n").filter(Boolean),
        skills_required: jobForm.skills_required.split(",").map((s) => s.trim()).filter(Boolean),
        salary_min: jobForm.salary_min ? parseInt(jobForm.salary_min) : undefined,
        salary_max: jobForm.salary_max ? parseInt(jobForm.salary_max) : undefined,
        job_type: jobForm.job_type as Job["job_type"],
        status: "active",
      });
      toast.success("Job posted successfully!");
      setPostOpen(false);
      setJobForm({ title: "", company: "", location: "", department: "", description: "", requirements: "", skills_required: "", salary_min: "", salary_max: "", job_type: "full-time" });
      setJobs((prev) => [createdJob, ...prev]);
      api.recruiter.stats().then(setStats);
      api.recruiter.pipeline().then((r) => setPipeline(r.pipeline)).catch(() => {});
      api.recruiter.candidates().then(setCandidates).catch(() => {});
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to post job");
    }
  };

  const statCards = [
    { title: "Open Positions", value: stats?.open_jobs ?? 0, change: `+${stats?.applications_this_week ?? 0}`, icon: Briefcase, color: "text-blue-400", bg: "bg-blue-500/10" },
    { title: "Applications", value: stats?.total_applications ?? 0, change: "total", icon: Users, color: "text-teal-400", bg: "bg-teal-500/10" },
    { title: "Shortlisted", value: stats?.shortlisted ?? 0, change: "candidates", icon: Star, color: "text-amber-400", bg: "bg-amber-500/10" },
    { title: "Hired", value: stats?.hired ?? 0, change: "this cycle", icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10" },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Recruiter Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your hiring pipeline — TechVentures Pakistan</p>
        </div>
        <Button className="bg-teal-500 hover:bg-teal-600 text-gray-900 font-semibold" onClick={() => setPostOpen(true)}>
          <Briefcase className="h-4 w-4 mr-2" />Post New Job
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">{stat.title}</p>
                    <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                    <p className="text-teal-400 text-sm mt-1 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" />{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bg}`}><stat.icon className={`h-6 w-6 ${stat.color}`} /></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-gray-900 border-gray-800 lg:col-span-2">
          <CardHeader><CardTitle className="text-white">Weekly Activity</CardTitle><CardDescription>Applications and screenings this week</CardDescription></CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
                <Area type="monotone" dataKey="applications" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.2} />
                <Area type="monotone" dataKey="screenings" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader><CardTitle className="text-white">Hiring Pipeline</CardTitle></CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipeline} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis dataKey="stage" type="category" width={80} stroke="#9ca3af" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
                <Bar dataKey="count" fill="#14b8a6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Top Candidates</CardTitle>
            <Button variant="ghost" size="sm" className="text-teal-400" onClick={() => router.push("/recruiter/candidates")}>View All</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {candidates.slice(0, 4).map((c) => (
              <div key={c.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/50">
                <Avatar><AvatarImage src={c.avatar} /><AvatarFallback>{c.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{c.name}</p>
                  <p className="text-sm text-gray-500 truncate">{c.position}</p>
                </div>
                <Badge className="bg-teal-500/20 text-teal-400">{c.match_score}%</Badge>
              </div>
            ))}
            {candidates.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No applicants yet. Post a job to get candidates.</p>}
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader><CardTitle className="text-white">Recent Activity</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {activity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50">
                <div className="w-2 h-2 rounded-full bg-teal-400 mt-2 shrink-0" />
                <div>
                  <p className="text-sm text-gray-300">{item.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader><CardTitle className="text-white">Your Job Postings</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
              <div>
                <p className="font-medium text-white">{job.title}</p>
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{job.company}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="border-gray-600 text-gray-300">{job.applications_count} applicants</Badge>
                <Badge className="ml-2 bg-teal-500/20 text-teal-400">{job.status}</Badge>
              </div>
            </div>
          ))}
          {jobs.length === 0 && <p className="text-gray-500 text-center py-4">No jobs posted yet.</p>}
        </CardContent>
      </Card>

      <Dialog open={postOpen} onOpenChange={setPostOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
          <DialogHeader><DialogTitle>Post New Job</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Job Title *</Label><Input value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} className="bg-gray-800 border-gray-700" /></div>
              <div><Label>Company *</Label><Input value={jobForm.company} onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })} className="bg-gray-800 border-gray-700" /></div>
              <div><Label>Location</Label><Input value={jobForm.location} onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })} placeholder="Lahore, Pakistan" className="bg-gray-800 border-gray-700" /></div>
              <div><Label>Department / Field</Label><Input value={jobForm.department} onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })} placeholder="Engineering, Mobile, etc." className="bg-gray-800 border-gray-700" /></div>
              <div><Label>Job Type</Label>
                <Select value={jobForm.job_type} onValueChange={(v) => setJobForm({ ...jobForm, job_type: v })}>
                  <SelectTrigger className="bg-gray-800 border-gray-700"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["full-time", "part-time", "contract", "internship", "remote"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label>Salary Min (PKR)</Label><Input type="number" value={jobForm.salary_min} onChange={(e) => setJobForm({ ...jobForm, salary_min: e.target.value })} className="bg-gray-800 border-gray-700" /></div>
                <div><Label>Salary Max (PKR)</Label><Input type="number" value={jobForm.salary_max} onChange={(e) => setJobForm({ ...jobForm, salary_max: e.target.value })} className="bg-gray-800 border-gray-700" /></div>
              </div>
            </div>
            <div><Label>Full Job Description *</Label><Textarea value={jobForm.description} onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })} className="min-h-[120px] bg-gray-800 border-gray-700" placeholder="Describe role, responsibilities, what you offer..." /></div>
            <div><Label>Requirements (one per line)</Label><Textarea value={jobForm.requirements} onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })} className="bg-gray-800 border-gray-700" /></div>
            <div><Label>Skills Required (comma separated)</Label><Input value={jobForm.skills_required} onChange={(e) => setJobForm({ ...jobForm, skills_required: e.target.value })} placeholder="Flutter, Dart, Firebase" className="bg-gray-800 border-gray-700" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPostOpen(false)}>Cancel</Button>
            <Button className="bg-teal-500 text-gray-900" onClick={handlePostJob}><Plus className="h-4 w-4 mr-2" />Post Job</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
