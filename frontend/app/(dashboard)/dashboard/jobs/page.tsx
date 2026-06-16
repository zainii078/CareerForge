"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, MapPin, Building2, Clock, TrendingUp, Briefcase, DollarSign, Sparkles, X, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sampleJobs } from "@/lib/demo-data";
import { api, PlatformStats } from "@/lib/api";
import { Job } from "@/lib/types";
import { getStoredJobDescription } from "@/lib/resume-utils";
import { toast } from "sonner";

export default function JobMatchesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [jobType, setJobType] = useState("all");
  const [jobs, setJobs] = useState<(Job & { match_score?: number })[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<(Job & { match_score?: number }) | null>(null);

  const jobDescription = getStoredJobDescription();

  useEffect(() => {
    api.dashboard.platformStats().then(setPlatformStats).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api.jobs
      .list({
        job_type: jobType === "all" ? undefined : jobType,
        search: searchQuery || undefined,
        job_description: jobDescription || undefined,
      })
      .then(setJobs)
      .catch(() => setJobs(sampleJobs.map((j, i) => ({ ...j, match_score: 90 - i * 5 }))))
      .finally(() => setLoading(false));
  }, [jobType, searchQuery, jobDescription]);

  const handleApply = async (jobId: string) => {
    try {
      await api.jobs.apply(jobId);
      toast.success("Application submitted!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Application failed");
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const highMatch = filteredJobs.filter((j) => (j.match_score ?? 0) >= 80).length;

  const stats = [
    { label: "Total Matches", value: String(filteredJobs.length), icon: Briefcase, color: "text-blue-500" },
    { label: "High Match (80%+)", value: String(highMatch), icon: TrendingUp, color: "text-green-500" },
    { label: "Active Jobs", value: String(platformStats?.active_jobs ?? filteredJobs.length), icon: Sparkles, color: "text-purple-500" },
    { label: "Platform Users", value: String(platformStats?.total_users ?? 0), icon: Users, color: "text-amber-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Job Matches</h1>
        <p className="text-muted-foreground mt-1">
          {jobDescription
            ? "Jobs matched to your ATS job description"
            : "AI-curated opportunities based on your resume — add a job description in ATS Optimizer for better matches"}
        </p>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search jobs, skills, or companies..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger className="w-full lg:w-[180px]"><SelectValue placeholder="Job Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="space-y-4">
        {loading && <p className="text-center text-muted-foreground py-8">Loading job matches...</p>}
        {!loading && filteredJobs.length === 0 && (
          <Card className="border-dashed"><CardContent className="py-12 text-center text-muted-foreground">No jobs found. Try adjusting your search or add a job description in ATS Optimizer.</CardContent></Card>
        )}
        {filteredJobs.map((job, index) => (
          <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <Card className="border-border/50 hover:border-primary/30 transition-all group">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xl font-bold shrink-0">
                    {job.company.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{job.company}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{job.job_type}</span>
                        </div>
                      </div>
                      <Badge className={`shrink-0 ${(job.match_score ?? 0) >= 80 ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"}`}>
                        {job.match_score ?? 0}% Match
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{job.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.skills_required?.map((skill) => <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>)}
                    </div>
                    {job.salary_min && job.salary_max && (
                      <div className="flex items-center gap-2 mt-3 text-sm">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="font-medium">PKR {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex lg:flex-col gap-2 shrink-0">
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-500" onClick={() => handleApply(job.id)}>Apply Now</Button>
                    <Button variant="outline" onClick={() => setSelectedJob(job)}>View Details</Button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Match Score</span>
                    <span className="font-medium">{job.match_score ?? 0}%</span>
                  </div>
                  <Progress value={job.match_score ?? 0} className="h-1.5" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedJob(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                  <p className="text-lg text-muted-foreground mt-1">{selectedJob.company} — {selectedJob.location}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedJob(null)}><X className="h-5 w-5" /></Button>
              </div>
              <Badge className="mb-4">{selectedJob.match_score ?? 0}% Match</Badge>
              <p className="text-base leading-relaxed whitespace-pre-wrap">{selectedJob.description}</p>
              {selectedJob.requirements?.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Requirements</h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    {selectedJob.requirements.map((r) => <li key={r}>{r}</li>)}
                  </ul>
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedJob.skills_required?.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
              </div>
              <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-500" onClick={() => { handleApply(selectedJob.id); setSelectedJob(null); }}>
                Apply to this Job
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
