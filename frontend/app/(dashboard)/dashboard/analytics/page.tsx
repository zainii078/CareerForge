"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, Target, Briefcase, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { api, SeekerAnalytics } from "@/lib/api";

const COLORS = ["#3b82f6", "#14b8a6", "#f59e0b", "#ef4444", "#8b5cf6", "#22c55e"];

export default function AnalyticsPage() {
  const [data, setData] = useState<SeekerAnalytics | null>(null);

  useEffect(() => {
    api.dashboard.analytics().then(setData).catch(() => {});
  }, []);

  const statusData = data
    ? Object.entries(data.status_counts).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your job search performance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "ATS Score", value: `${data?.ats_score ?? 0}%`, icon: Target, color: "text-blue-500" },
          { label: "Resume Completion", value: `${data?.resume_completion ?? 0}%`, icon: BarChart3, color: "text-teal-500" },
          { label: "Applications", value: String(data?.total_applications ?? 0), icon: Briefcase, color: "text-purple-500" },
          { label: "Avg Match Score", value: `${data?.avg_match_score ?? 0}%`, icon: TrendingUp, color: "text-amber-500" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="border-border/50">
              <CardContent className="p-6">
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Monthly Applications</CardTitle>
            <CardDescription>Applications submitted over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.monthly_applications || []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="applications" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
            <CardDescription>Breakdown by status</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">No applications yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader><CardTitle>Profile Strength</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2"><span>Resume Completion</span><span>{data?.resume_completion ?? 0}%</span></div>
            <Progress value={data?.resume_completion ?? 0} />
          </div>
          <div className="flex gap-4">
            <Badge variant="secondary">{data?.skills_count ?? 0} Skills</Badge>
            <Badge variant="secondary">{data?.experience_count ?? 0} Experience Entries</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
