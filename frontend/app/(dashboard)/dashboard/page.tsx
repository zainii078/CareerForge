"use client";

import { motion } from "framer-motion";
import {
  Target,
  FileText,
  Briefcase,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  jobSeekerStats,
  atsScoreHistory,
  applicationAnalytics,
  sampleApplications,
  skillsDistribution,
} from "@/lib/demo-data";

const stats = [
  {
    title: "ATS Score",
    value: `${jobSeekerStats.ats_score}%`,
    change: "+12%",
    trend: "up",
    icon: Target,
    gradient: "from-blue-500 to-cyan-400",
    description: "Resume quality",
  },
  {
    title: "Profile Completion",
    value: `${jobSeekerStats.resume_completion}%`,
    change: "+5%",
    trend: "up",
    icon: FileText,
    gradient: "from-teal-500 to-emerald-400",
    description: "Resume progress",
  },
  {
    title: "Applications",
    value: jobSeekerStats.total_applications.toString(),
    change: "+8",
    trend: "up",
    icon: Briefcase,
    gradient: "from-orange-500 to-amber-400",
    description: "Total submitted",
  },
  {
    title: "Interview Rate",
    value: `${jobSeekerStats.interview_rate}%`,
    change: "+5%",
    trend: "up",
    icon: TrendingUp,
    gradient: "from-pink-500 to-rose-400",
    description: "Response rate",
  },
];

const COLORS = ["hsl(221, 83%, 53%)", "hsl(173, 58%, 39%)", "hsl(197, 37%, 24%)", "hsl(43, 74%, 66%)"];

export default function DashboardPage() {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Welcome back, John</h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your job search progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden border-border/50">
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`}
              />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription className="text-sm font-medium">
                  {stat.title}
                </CardDescription>
                <div
                  className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient}`}
                >
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={
                      stat.trend === "up"
                        ? "text-sm text-green-500 font-medium"
                        : "text-sm text-red-500 font-medium"
                    }
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    vs last month
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ATS Score Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                ATS Score Progress
              </CardTitle>
              <CardDescription>
                Your resume optimization journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={atsScoreHistory}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="hsl(221, 83%, 53%)"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(221, 83%, 53%)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis domain={[0, 100]} className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(221, 83%, 53%)"
                      strokeWidth={2}
                      fill="url(#colorScore)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Application Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Application Analytics
              </CardTitle>
              <CardDescription>
                Applications, interviews, and offers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={applicationAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="applications"
                      fill="hsl(221, 83%, 53%)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="interviews"
                      fill="hsl(173, 58%, 39%)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="offers"
                      fill="hsl(142, 76%, 36%)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Applications
                </CardTitle>
                <CardDescription>Your latest job applications</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleApplications.slice(0, 3).map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold">
                        {application.job?.company.charAt(0) || "C"}
                      </div>
                      <div>
                        <p className="font-medium">{application.job?.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {application.job?.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {application.ats_match_score}% Match
                        </p>
                        <Badge
                          variant={
                            application.status === "shortlisted"
                              ? "default"
                              : application.status === "interviewed"
                              ? "secondary"
                              : "outline"
                          }
                          className="capitalize"
                        >
                          {application.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Skills Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Skills Breakdown
              </CardTitle>
              <CardDescription>Your skill distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={skillsDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {skillsDistribution.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {skillsDistribution.map((skill, index) => (
                  <div
                    key={skill.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span>{skill.name}</span>
                    </div>
                    <span className="font-medium">{skill.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Job Match Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card className="border-border/50 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Your Job Match Score
            </CardTitle>
            <CardDescription>
              Based on your resume and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {jobSeekerStats.job_match_percentage}%
                </div>
                <p className="text-muted-foreground mt-2">
                  Average match rate with recommended jobs
                </p>
              </div>
              <div className="flex-1 max-w-md">
                <Progress value={jobSeekerStats.job_match_percentage} className="h-3" />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>Low match</span>
                  <span>High match</span>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
                Find Matching Jobs
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
