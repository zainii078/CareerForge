"use client";

import { useState, useEffect } from "react";
import { Briefcase, MapPin, Building2, Users, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Job } from "@/lib/types";
import Link from "next/link";

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    api.recruiter.jobs().then(setJobs).catch(() => {});
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Jobs</h1>
          <p className="text-gray-500 mt-1">Manage your job postings</p>
        </div>
        <Link href="/recruiter"><Button className="bg-teal-500 text-gray-900"><Plus className="h-4 w-4 mr-2" />Post New Job</Button></Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="bg-gray-900 border-gray-800"><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-white">{jobs.length}</p><p className="text-gray-500 text-sm">Total Jobs</p></CardContent></Card>
        <Card className="bg-gray-900 border-gray-800"><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-teal-400">{jobs.filter((j) => j.status === "active").length}</p><p className="text-gray-500 text-sm">Active</p></CardContent></Card>
        <Card className="bg-gray-900 border-gray-800"><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-white">{jobs.reduce((s, j) => s + j.applications_count, 0)}</p><p className="text-gray-500 text-sm">Total Applicants</p></CardContent></Card>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id} className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                    <span className="flex items-center gap-1"><Building2 className="h-4 w-4" />{job.company}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>
                    <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" />{job.job_type}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-3 line-clamp-2">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.skills_required?.map((s) => <Badge key={s} variant="outline" className="border-gray-600 text-gray-300">{s}</Badge>)}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <Badge className={job.status === "active" ? "bg-teal-500/20 text-teal-400" : "bg-gray-700 text-gray-400"}>{job.status}</Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-400 mt-2 justify-end"><Users className="h-4 w-4" />{job.applications_count} applicants</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {jobs.length === 0 && (
          <Card className="bg-gray-900 border-gray-800 border-dashed"><CardContent className="py-12 text-center text-gray-500">No jobs posted yet. Go to dashboard to post your first job.</CardContent></Card>
        )}
      </div>
    </div>
  );
}
