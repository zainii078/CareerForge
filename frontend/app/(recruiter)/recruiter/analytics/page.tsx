"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { api, RecruiterAnalytics } from "@/lib/api";
import { TrendingUp, Users, Briefcase, Target } from "lucide-react";

export default function RecruiterAnalyticsPage() {
  const [data, setData] = useState<RecruiterAnalytics | null>(null);

  useEffect(() => {
    api.recruiter.analytics().then(setData).catch(() => {});
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Analytics</h1>
        <p className="text-gray-500 mt-1">Recruitment performance insights</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Open Jobs", value: data?.open_jobs ?? 0, icon: Briefcase },
          { label: "Applications", value: data?.total_applications ?? 0, icon: Users },
          { label: "Avg Match Score", value: `${data?.avg_match_score ?? 0}%`, icon: Target },
          { label: "Hire Rate", value: `${data?.hire_rate ?? 0}%`, icon: TrendingUp },
        ].map((stat) => (
          <Card key={stat.label} className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <stat.icon className="h-8 w-8 text-teal-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader><CardTitle className="text-white">Weekly Activity</CardTitle><CardDescription>Applications and screenings</CardDescription></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.weekly_activity || []}>
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
          <CardHeader><CardTitle className="text-white">Status Breakdown</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.status_breakdown || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="status" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
                <Bar dataKey="count" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader><CardTitle className="text-white">Candidate Status Summary</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {data?.status_breakdown?.map((s) => (
            <Badge key={s.status} variant="outline" className="border-gray-600 text-gray-300 px-4 py-2 capitalize">
              {s.status}: {s.count}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
