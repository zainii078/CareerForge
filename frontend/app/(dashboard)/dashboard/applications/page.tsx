"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, XCircle, Calendar, Building2, MapPin, FileText, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { Application } from "@/lib/types";
import { sampleApplications } from "@/lib/demo-data";

const statusStyles: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  pending: { bg: "bg-blue-500/10", text: "text-blue-600", icon: Clock },
  reviewed: { bg: "bg-purple-500/10", text: "text-purple-600", icon: FileText },
  shortlisted: { bg: "bg-teal-500/10", text: "text-teal-600", icon: CheckCircle2 },
  interviewed: { bg: "bg-amber-500/10", text: "text-amber-600", icon: Calendar },
  rejected: { bg: "bg-red-500/10", text: "text-red-600", icon: XCircle },
  hired: { bg: "bg-green-500/10", text: "text-green-600", icon: CheckCircle2 },
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    api.applications.list().then(setApplications).catch(() => setApplications(sampleApplications));
  }, []);

  const applicationsByStatus = {
    all: applications,
    pending: applications.filter((a) => a.status === "pending"),
    shortlisted: applications.filter((a) => a.status === "shortlisted"),
    interviewed: applications.filter((a) => a.status === "interviewed"),
    rejected: applications.filter((a) => a.status === "rejected"),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Applications</h1>
        <p className="text-muted-foreground mt-1">Track all your job applications in one place</p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
        {[
          { status: "all", label: "Total", count: applications.length },
          { status: "pending", label: "Pending", count: applicationsByStatus.pending.length },
          { status: "shortlisted", label: "Shortlisted", count: applicationsByStatus.shortlisted.length },
          { status: "interviewed", label: "Interviews", count: applicationsByStatus.interviewed.length },
          { status: "rejected", label: "Rejected", count: applicationsByStatus.rejected.length },
        ].map((stat, index) => (
          <motion.div key={stat.status} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card className="border-border/50 text-center">
              <CardContent className="p-4">
                <p className="text-2xl font-bold">{stat.count}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
          <TabsTrigger value="interviewed">Interviewed</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        {["all", "pending", "shortlisted", "interviewed", "rejected"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <div className="space-y-4">
              {(applicationsByStatus[tab as keyof typeof applicationsByStatus] || []).length === 0 && (
                <Card className="border-dashed"><CardContent className="py-12 text-center text-muted-foreground">No applications in this category yet.</CardContent></Card>
              )}
              {(applicationsByStatus[tab as keyof typeof applicationsByStatus] || []).map((application, index) => {
                const status = statusStyles[application.status] || statusStyles.pending;
                const Icon = status.icon;
                return (
                  <motion.div key={application.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                    <Card className="border-border/50 hover:border-primary/30 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold">
                              {application.job?.company?.charAt(0) || "C"}
                            </div>
                            <div>
                              <h3 className="font-semibold">{application.job?.title || "Job Application"}</h3>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{application.job?.company}</span>
                                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{application.job?.location}</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">Applied on {new Date(application.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={`${status.bg} ${status.text} gap-1.5 capitalize`}><Icon className="h-3.5 w-3.5" />{application.status}</Badge>
                            <div className="flex items-center gap-1 text-sm mt-2 text-muted-foreground justify-end">
                              <Target className="h-4 w-4" />{application.ats_match_score}% Match
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
