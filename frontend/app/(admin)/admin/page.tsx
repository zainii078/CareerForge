"use client";

import { motion } from "framer-motion";
import {
  Users,
  Building2,
  Briefcase,
  TrendingUp,
  DollarSign,
  Cpu,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Globe,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  LineChart,
  Line,
  Treemap,
} from "recharts";

const stats = [
  {
    title: "Total Users",
    value: "12,459",
    change: "+14.5%",
    trend: "up",
    icon: Users,
    color: "from-blue-500 to-cyan-400",
    description: "All registered users",
  },
  {
    title: "Recruiters",
    value: "892",
    change: "+8.2%",
    trend: "up",
    icon: Building2,
    color: "from-purple-500 to-pink-400",
    description: "Active recruiter accounts",
  },
  {
    title: "Active Jobs",
    value: "2,341",
    change: "+23.1%",
    trend: "up",
    icon: Briefcase,
    color: "from-emerald-500 to-teal-400",
    description: "Currently posted positions",
  },
  {
    title: "MRR",
    value: "$89,420",
    change: "+18.7%",
    trend: "up",
    icon: DollarSign,
    color: "from-amber-500 to-orange-400",
    description: "Monthly recurring revenue",
  },
];

const userGrowth = [
  { month: "Jan", users: 8000, recruiters: 600 },
  { month: "Feb", users: 9200, recruiters: 650 },
  { month: "Mar", users: 9800, recruiters: 720 },
  { month: "Apr", users: 10500, recruiters: 780 },
  { month: "May", users: 11200, recruiters: 840 },
  { month: "Jun", users: 12459, recruiters: 892 },
];

const resumeMetrics = [
  { day: "Mon", created: 120, optimized: 85 },
  { day: "Tue", created: 145, optimized: 98 },
  { day: "Wed", created: 168, optimized: 112 },
  { day: "Thu", created: 182, optimized: 134 },
  { day: "Fri", created: 210, optimized: 156 },
  { day: "Sat", created: 95, optimized: 62 },
  { day: "Sun", created: 78, optimized: 48 },
];

const aiUsageData = [
  { name: "ATS Analyses", value: 4520, fill: "#6366f1" },
  { name: "Resume Writes", value: 3890, fill: "#8b5cf6" },
  { name: "Suggestions", value: 12450, fill: "#a855f7" },
  { name: "Matches", value: 8920, fill: "#d946ef" },
];

const regionData = [
  { name: "North America", value: 5420 },
  { name: "Europe", value: 3890 },
  { name: "Asia Pacific", value: 2120 },
  { name: "Latin America", value: 680 },
  { name: "Others", value: 349 },
];

const COLORS = ["#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899"];

const recentActivity = [
  { type: "user", message: "New user registration: john.doe@email.com", time: "2 min ago", severity: "info" },
  { type: "recruiter", message: "TechCorp upgraded to Enterprise plan", time: "15 min ago", severity: "success" },
  { type: "ai", message: "AI usage spike: 1,240 requests in last hour", time: "32 min ago", severity: "warning" },
  { type: "job", message: "New job posted: Senior Engineer at StartupXYZ", time: "1 hour ago", severity: "info" },
  { type: "payment", message: "Payment received: $299 Pro subscription", time: "2 hours ago", severity: "success" },
  { type: "error", message: "Failed ATS analysis for user ID 4521", time: "3 hours ago", severity: "error" },
];

const severityColors: Record<string, string> = {
  info: "bg-blue-500",
  success: "bg-green-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Platform overview and system health
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            System Operational
          </Badge>
          <Badge variant="secondary" className="gap-1.5">
            <Clock className="h-3 w-3" />
            Last updated: 2 min ago
          </Badge>
        </div>
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
            <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`}
              />
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm text-green-500 font-medium">
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground">vs last month</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-500" />
                User Growth
              </CardTitle>
              <CardDescription>Monthly user acquisition trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userGrowth}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorRecruiters" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#d946ef" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="#6366f1"
                      strokeWidth={2}
                      fill="url(#colorUsers)"
                    />
                    <Area
                      type="monotone"
                      dataKey="recruiters"
                      stroke="#d946ef"
                      strokeWidth={2}
                      fill="url(#colorRecruiters)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Usage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-purple-500" />
                AI Service Usage
              </CardTitle>
              <CardDescription>API calls breakdown by service type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={aiUsageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {aiUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {aiUsageData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-sm">{item.name}</span>
                    <span className="text-sm font-medium ml-auto">
                      {item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Second Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Resume Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-teal-500" />
                Resume Generation & Optimization
              </CardTitle>
              <CardDescription>Daily activity trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={resumeMetrics}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="created" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="optimized" fill="#d946ef" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-indigo-500" />
                  <span className="text-sm text-muted-foreground">Resumes Created</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-fuchsia-500" />
                  <span className="text-sm text-muted-foreground">ATS Optimizations</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest platform events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${severityColors[activity.severity]}`} />
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-cyan-500" />
                Geographic Distribution
              </CardTitle>
              <CardDescription>Users by region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionData.map((region, index) => (
                  <div key={region.name} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{region.name}</span>
                        <span className="text-sm font-medium">{region.value.toLocaleString()}</span>
                      </div>
                      <Progress
                        value={(region.value / 5420) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Platform Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Card className="border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
            <CardHeader>
              <CardTitle>Platform Health</CardTitle>
              <CardDescription>Current system status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "API Response", value: "99.9%", status: "good" },
                  { name: "Database", value: "Healthy", status: "good" },
                  { name: "AI Services", value: "Operational", status: "good" },
                  { name: "CDN", value: "Active", status: "good" },
                  { name: "Email Queue", value: "Normal", status: "good" },
                  { name: "Payment Gateway", value: "Connected", status: "good" },
                ].map((service) => (
                  <div
                    key={service.name}
                    className="p-4 rounded-lg bg-white/50 dark:bg-slate-900/50"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm text-muted-foreground">{service.name}</span>
                    </div>
                    <p className="font-semibold mt-1">{service.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
