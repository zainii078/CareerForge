"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Briefcase,
  Star,
  Clock,
  Mail,
  Phone,
  X,
  Brain,
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { candidates as demoCandidates, sampleJobs } from "@/lib/demo-data";
import { api, Candidate } from "@/lib/api";

const skillsFilter = [
  "React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "Kubernetes", "GraphQL", "PostgreSQL", "MongoDB"
];

const experienceLevels = [
  { label: "Entry Level (0-2 years)", value: "entry" },
  { label: "Mid Level (3-5 years)", value: "mid" },
  { label: "Senior Level (5+ years)", value: "senior" },
  { label: "Lead/Manager", value: "lead" },
];

const matchColors: Record<string, string> = {
  high: "bg-green-500/20 text-green-400 border-green-500/30",
  medium: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

function getMatchLevel(score: number): "high" | "medium" | "low" {
  if (score >= 85) return "high";
  if (score >= 70) return "medium";
  return "low";
}

function CandidatePanel({
  candidate,
  onClose,
}: {
  candidate: Candidate;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="fixed right-0 top-0 h-screen w-full max-w-md bg-gray-900 border-l border-gray-800 z-50 overflow-hidden"
    >
      <ScrollArea className="h-full">
        <div className="p-6">
          {/* Close Button */}
          <div className="flex justify-end mb-4">
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Candidate Header */}
          <div className="flex items-start gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={candidate.avatar} />
              <AvatarFallback className="text-lg">{candidate.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-white">{candidate.name}</h2>
              <p className="text-gray-400">{candidate.position}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <MapPin className="h-3 w-3" />
                {candidate.location}
                <Briefcase className="h-3 w-3 ml-2" />
                {candidate.experience}
              </div>
            </div>
          </div>

          {/* Match Score */}
          <Card className="bg-gray-800/50 border-gray-700 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">ATS Match Score</span>
                <span className={`text-2xl font-bold ${
                  candidate.match_score >= 85 ? "text-green-400" :
                  candidate.match_score >= 70 ? "text-teal-400" : "text-blue-400"
                }`}>
                  {candidate.match_score}%
                </span>
              </div>
              <Progress
                value={candidate.match_score}
                className="h-3 bg-gray-700"
              />
              <Badge className={`mt-3 ${matchColors[getMatchLevel(candidate.match_score)]}`}>
                {candidate.match_score >= 85 ? "Excellent Match" :
                 candidate.match_score >= 70 ? "Good Match" : "Potential Fit"}
              </Badge>
            </CardContent>
          </Card>

          {/* Skills */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">TOP SKILLS</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-gray-800 text-gray-300">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">SUMMARY</h3>
            <p className="text-gray-300 text-sm">{candidate.summary}</p>
          </div>

          <Separator className="bg-gray-800 my-6" />

          {/* AI Analysis */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-teal-400" />
              <h3 className="text-lg font-semibold text-white">AI Analysis</h3>
            </div>

            {/* Strengths */}
            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <h4 className="font-medium text-green-400">Strengths</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-300">
                  {(candidate.ai_insights?.length ? candidate.ai_insights : [
                    `Strong technical background with ${candidate.experience} of experience`,
                    "Proficient in key technologies matching job requirements",
                  ]).slice(0, 4).map((insight, i) => (
                    <li key={i}>- {insight}</li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-4 w-4 text-amber-400" />
                  <h4 className="font-medium text-amber-400">Areas to Explore</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>- Limited experience with cloud infrastructure (AWS/GCP)</li>
                  <li>- No mention of specific performance metrics</li>
                  <li>- Gap year between positions needs explanation</li>
                </ul>
              </div>

              {/* Recommendation */}
              <div className="p-4 rounded-lg bg-teal-500/10 border border-teal-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="h-4 w-4 text-teal-400" />
                  <h4 className="font-medium text-teal-400">Hiring Recommendation</h4>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-400">Confidence Score</span>
                  <span className="text-lg font-bold text-teal-400">{candidate.match_score}%</span>
                </div>
                <p className="text-sm text-gray-300">
                  Based on the analysis, this candidate is a strong match for the Senior Engineer role.
                  Recommend proceeding to phone screen. Focus on discussing cloud experience and
                  quantifiable achievements.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-6">
            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-gray-900 font-medium"
                onClick={() => onUpdateStatus(candidate.id, "shortlisted")}
              >
                Shortlist
              </Button>
              <Button 
                className="flex-1 bg-green-500 hover:bg-green-600 text-gray-900 font-medium"
                onClick={() => onUpdateStatus(candidate.id, "interviewed")}
              >
                Interview
              </Button>
            </div>
            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium"
                onClick={() => onUpdateStatus(candidate.id, "hired")}
              >
                Hire
              </Button>
              <Button 
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium"
                onClick={() => onUpdateStatus(candidate.id, "rejected")}
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </motion.div>
  );
}

export default function CandidatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState("all");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [recruiterJobs, setRecruiterJobs] = useState(sampleJobs);
  const [filters, setFilters] = useState({
    skills: [] as string[],
    experience: "",
    location: "",
    minScore: 0,
  });

  useEffect(() => {
    api.recruiter.jobs().then(setRecruiterJobs).catch(() => {});
  }, []);

  useEffect(() => {
    const params: { min_match?: number; job_id?: string } = {};
    if (filters.minScore > 0) params.min_match = filters.minScore;
    if (selectedJob !== "all") params.job_id = selectedJob;

    api.recruiter
      .candidates(params)
      .then(setCandidates)
      .catch(() => setCandidates(demoCandidates as unknown as Candidate[]));
  }, [filters.minScore, selectedJob]);

  const filteredCandidates = candidates.filter((candidate) => {
    if (searchQuery && !candidate.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.minScore > 0 && candidate.match_score < filters.minScore) {
      return false;
    }
    return true;
  });

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.recruiter.updateStatus(id, status);
      setCandidates(candidates.map(c => c.id === id ? { ...c, status } as Candidate : c));
      if (selectedCandidate?.id === id) {
        setSelectedCandidate({ ...selectedCandidate, status } as Candidate);
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Candidate Pipeline</h1>
        <p className="text-gray-500 mt-1">Smart matching powered by AI analysis</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search candidates..."
              className="pl-10 bg-gray-800 border-gray-700 text-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedJob} onValueChange={setSelectedJob}>
            <SelectTrigger className="w-full lg:w-[250px] bg-gray-800 border-gray-700 text-gray-200">
              <SelectValue placeholder="Filter by Job" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Jobs</SelectItem>
              {recruiterJobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>
                  {job.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.experience} onValueChange={(value) => setFilters({ ...filters, experience: value })}>
            <SelectTrigger className="w-full lg:w-[200px] bg-gray-800 border-gray-700 text-gray-200">
              <SelectValue placeholder="Experience Level" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {experienceLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.minScore.toString()}
            onValueChange={(value) => setFilters({ ...filters, minScore: parseInt(value) })}
          >
            <SelectTrigger className="w-full lg:w-[150px] bg-gray-800 border-gray-700 text-gray-200">
              <SelectValue placeholder="Min Score" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="0">All Scores</SelectItem>
              <SelectItem value="80">80%+</SelectItem>
              <SelectItem value="85">85%+</SelectItem>
              <SelectItem value="90">90%+</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-gray-700 text-gray-400 hover:text-white">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-400">{filteredCandidates.length} candidates found</p>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-teal-400">List</Button>
          <Button variant="ghost" size="sm" className="text-gray-500">Kanban</Button>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredCandidates.map((candidate, index) => (
          <motion.div
            key={candidate.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card
              className="bg-gray-900 border-gray-800 hover:border-teal-500/50 transition-all cursor-pointer"
              onClick={() => setSelectedCandidate(candidate)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={candidate.avatar} />
                    <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-white">{candidate.name}</h3>
                        <p className="text-sm text-gray-400">{candidate.position}</p>
                      </div>
                      <Badge className={matchColors[getMatchLevel(candidate.match_score)]}>
                        {candidate.match_score}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {candidate.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {candidate.experience}
                      </span>
                      {candidate.status && (
                        <Badge variant="outline" className="text-xs capitalize border-gray-700">
                          {candidate.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {candidate.skills.slice(0, 4).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs bg-gray-800 text-gray-400">
                      {skill}
                    </Badge>
                  ))}
                  {candidate.skills.length > 4 && (
                    <Badge variant="outline" className="text-xs border-gray-700 text-gray-500">
                      +{candidate.skills.length - 4}
                    </Badge>
                  )}
                </div>

                <Button
                  className="w-full mt-4 bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 border border-teal-500/30"
                  variant="outline"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  View AI Analysis
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Candidate Detail Panel */}
      <AnimatePresence>
        {selectedCandidate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSelectedCandidate(null)}
            />
            <CandidatePanel
              candidate={selectedCandidate}
              onClose={() => setSelectedCandidate(null)}
              onUpdateStatus={handleUpdateStatus}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
