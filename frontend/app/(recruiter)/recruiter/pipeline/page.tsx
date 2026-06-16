"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { api } from "@/lib/api";

const stageColors: Record<string, string> = {
  Pending: "#3b82f6", Reviewed: "#8b5cf6", Shortlisted: "#14b8a6",
  Interviewed: "#f59e0b", Hired: "#22c55e", Rejected: "#ef4444",
};

export default function PipelinePage() {
  const [pipeline, setPipeline] = useState<{ stage: string; count: number }[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    api.recruiter.pipeline().then((r) => {
      setPipeline(r.pipeline);
      setTotal(r.total);
    }).catch(() => {
      const fallback = [
        { stage: "Pending", count: 3 },
        { stage: "Reviewed", count: 2 },
        { stage: "Shortlisted", count: 1 },
        { stage: "Interviewed", count: 0 },
        { stage: "Hired", count: 0 },
        { stage: "Rejected", count: 0 },
      ];
      setPipeline(fallback);
      setTotal(fallback.reduce((sum, stage) => sum + stage.count, 0));
    });
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Hiring Pipeline</h1>
        <p className="text-gray-500 mt-1">{total} total candidates in pipeline</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pipeline.map((stage) => (
          <Card key={stage.stage} className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-sm">{stage.stage}</p>
                <Badge style={{ backgroundColor: `${stageColors[stage.stage] || "#6b7280"}20`, color: stageColors[stage.stage] || "#9ca3af" }}>
                  {stage.count}
                </Badge>
              </div>
              <p className="text-3xl font-bold text-white">{stage.count}</p>
              <Progress value={total ? (stage.count / total) * 100 : 0} className="h-2 mt-3" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader><CardTitle className="text-white">Pipeline Overview</CardTitle></CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pipeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="stage" stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
              <Bar dataKey="count" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
