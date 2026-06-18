"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Sparkles,
  RefreshCw,
  Download,
  TrendingUp,
  AlertCircle,
  Check,
  FileText,
  Zap,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { sampleResume } from "@/lib/demo-data";
import { api, ATSAnalysisResponse, downloadBlob } from "@/lib/api";
import { Resume } from "@/lib/types";
import { calcResumeCompletion, getStoredJobDescription, setStoredJobDescription } from "@/lib/resume-utils";
import { toast } from "sonner";

export default function ATSPage() {
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysis, setAnalysis] = useState<ATSAnalysisResponse | null>(null);
  const [resume, setResume] = useState<Resume | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = getStoredJobDescription();
    if (stored) setJobDescription(stored);
    api.resumes.getPrimary().then(setResume).catch(() => setResume(sampleResume as unknown as Resume));
  }, []);

  const completion = useMemo(() => calcResumeCompletion(resume), [resume]);

  const radarData = useMemo(() => {
    if (!analysis?.breakdown) return [];
    return [
      { category: "Keywords", value: analysis.breakdown.keywords.score },
      { category: "Skills", value: analysis.breakdown.skills.score },
      { category: "Format", value: analysis.breakdown.format.score },
      { category: "Content", value: analysis.breakdown.content.score },
    ];
  }, [analysis]);

  const keywordDensityList = useMemo(() => {
    if (!analysis?.keyword_density) return [];
    return Object.entries(analysis.keyword_density).map(([keyword, count]) => ({
      keyword,
      count,
      recommended: count < 2 ? "2-4" : "3-5",
    }));
  }, [analysis]);

  const displayScore = analysis?.overall_score ?? resume?.ats_score ?? 0;

  const handleAnalyze = useCallback(async () => {
    if (jobDescription.trim().length < 50) {
      toast.error("Please paste a job description (at least 50 characters)");
      return;
    }
    setStoredJobDescription(jobDescription);
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    try {
      const result = await api.ats.analyze({ job_description: jobDescription });
      setAnalysis(result);
      setAnalysisComplete(true);
      if (resume) setResume({ ...resume, ats_score: result.overall_score || result.score });
      await api.auth.updateProfile({ job_preference: jobDescription.slice(0, 500) }).catch(() => {});
      toast.success("ATS analysis complete!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  }, [jobDescription, resume]);

  useEffect(() => {
    if (jobDescription.trim().length < 50) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      handleAnalyze();
    }, 2000);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [jobDescription]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApplySuggestion = async (index: number, suggestion: ATSAnalysisResponse["suggestions"][0]) => {
    if (suggestion.section === "Experience" || suggestion.type === "content") {
      router.push("/dashboard/resume");
      toast.info("Navigate to Resume Builder → Experience to add achievements");
      return;
    }
    if (!analysis) return;
    try {
      const updated = await api.ats.applySuggestions({ analysis_id: analysis.id, suggestion_indices: [index] });
      setResume(updated as Resume);
      toast.success("Suggestion applied to your resume!");
      handleAnalyze();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to apply suggestion");
    }
  };

  const handleApplyAll = async () => {
    if (!analysis) return;
    try {
      const updated = await api.ats.applySuggestions({ analysis_id: analysis.id });
      setResume(updated as Resume);
      toast.success("All applicable suggestions applied!");
      handleAnalyze();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to apply suggestions");
    }
  };

  const handleDownloadReport = () => {
    if (!analysis) return;
    const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: "application/json" });
    downloadBlob(blob, "ats-analysis-report.json");
  };

  const currentResume = resume || (sampleResume as unknown as Resume);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">ATS Optimizer</h1>
          <p className="text-muted-foreground mt-1">
            Analyze your resume against job descriptions for maximum compatibility
          </p>
        </div>
        <Button variant="outline" onClick={handleAnalyze} disabled={isAnalyzing}>
          {isAnalyzing ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Analyzing...</> : <><Sparkles className="h-4 w-4 mr-2" />Run Analysis</>}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Job Description</CardTitle>
              </div>
              <CardDescription>Paste the job description — analysis runs automatically as you type</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste the full job description here (e.g., Flutter Developer, Full Stack Developer)..."
                className="min-h-[200px] resize-none"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <div className="flex justify-between mt-4">
                <p className="text-xs text-muted-foreground">{jobDescription.length} characters</p>
                <Button size="sm" onClick={handleAnalyze} disabled={isAnalyzing || jobDescription.length < 50} className="bg-gradient-to-r from-blue-600 to-cyan-500">
                  <Target className="h-4 w-4 mr-2" />Analyze Resume
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Current Resume</CardTitle>
                <Badge variant="secondary">{currentResume.title}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-medium">{completion.percent}%</span>
                </div>
                <Progress value={completion.percent} className="h-2" />
                {completion.missing.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium text-amber-600 mb-1">Missing:</p>
                    <div className="flex flex-wrap gap-1">
                      {completion.missing.map((m) => <Badge key={m} variant="outline" className="text-xs">{m}</Badge>)}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Current ATS Score</span>
                  <span className="font-medium text-primary">{displayScore}%</span>
                </div>
                <Progress value={displayScore} className="h-2" />
              </div>
              <Separator className="my-4" />
              <div className="flex flex-wrap gap-2">
                {currentResume.skills.slice(0, 6).map((skill) => (
                  <Badge key={skill.id} variant="outline" className="text-xs">{skill.name}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {!isAnalyzing && !analysisComplete ? (
              <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Card className="border-dashed border-border/50 bg-muted/30">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Target className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Analysis Yet</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-sm">
                      Paste a job description (50+ characters) to get dynamic ATS scores and recommendations
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : isAnalyzing ? (
              <motion.div key="loading" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Card className="border-border/50">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <RefreshCw className="h-12 w-12 text-primary animate-spin mb-4" />
                    <h3 className="text-lg font-semibold">Analyzing Your Resume</h3>
                    <p className="text-sm text-muted-foreground">Comparing against job requirements...</p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : analysis && (
              <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <Card className="border-border/50 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="relative">
                        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 p-1">
                          <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                            <div className="text-center">
                              <span className="text-5xl font-bold">{analysis.overall_score || analysis.score}</span>
                              <p className="text-sm text-muted-foreground">ATS Score</p>
                            </div>
                          </div>
                        </div>
                        <Badge className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${(analysis.overall_score || analysis.score) >= 80 ? "bg-green-500" : (analysis.overall_score || analysis.score) >= 60 ? "bg-amber-500" : "bg-red-500"}`}>
                          {(analysis.overall_score || analysis.score) >= 80 ? "Good" : (analysis.overall_score || analysis.score) >= 60 ? "Fair" : "Needs Work"}
                        </Badge>
                      </div>
                      <div className="flex-1 w-full">
                        <h3 className="text-lg font-semibold mb-4">Score Breakdown</h3>
                        <div className="h-[180px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={radarData}>
                              <PolarGrid stroke="hsl(var(--border))" />
                              <PolarAngleAxis dataKey="category" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} />
                              <Radar name="Score" dataKey="value" stroke="hsl(221, 83%, 53%)" fill="hsl(221, 83%, 53%)" fillOpacity={0.3} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Tabs defaultValue="suggestions">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="suggestions"><Sparkles className="h-4 w-4 mr-2" />Suggestions</TabsTrigger>
                    <TabsTrigger value="keywords"><Target className="h-4 w-4 mr-2" />Keywords</TabsTrigger>
                    <TabsTrigger value="analysis"><BarChart3 className="h-4 w-4 mr-2" />Analysis</TabsTrigger>
                  </TabsList>

                  <TabsContent value="suggestions" className="mt-4">
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3 pr-4">
                        {analysis.suggestions.map((suggestion, index) => (
                          <Card key={index} className={`border-border/50 ${suggestion.priority === "high" ? "bg-red-500/5 border-red-500/20" : "bg-muted/50"}`}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className="capitalize">{suggestion.section}</Badge>
                                    <Badge variant="secondary" className="capitalize">{suggestion.priority} Priority</Badge>
                                  </div>
                                  <p className="text-sm">{suggestion.message || suggestion.suggested}</p>
                                  <p className="text-xs text-muted-foreground mt-1">Impact: {suggestion.impact}</p>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => handleApplySuggestion(index, suggestion)}>Apply</Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="keywords" className="mt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="border-border/50">
                        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Check className="h-4 w-4 text-green-500" />Found ({analysis.breakdown.keywords.found.length})</CardTitle></CardHeader>
                        <CardContent><div className="flex flex-wrap gap-2">{analysis.breakdown.keywords.found.map((kw) => <Badge key={kw} className="bg-green-500/10 text-green-600">{kw}</Badge>)}</div></CardContent>
                      </Card>
                      <Card className="border-border/50">
                        <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertCircle className="h-4 w-4 text-amber-500" />Missing ({analysis.breakdown.keywords.missing.length})</CardTitle></CardHeader>
                        <CardContent><div className="flex flex-wrap gap-2">{analysis.breakdown.keywords.missing.map((kw) => <Badge key={kw} variant="outline" className="border-amber-500/30 text-amber-600">{kw}</Badge>)}</div></CardContent>
                      </Card>
                      <Card className="border-border/50 md:col-span-2">
                        <CardHeader><CardTitle className="text-base">Keyword Density</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                          {keywordDensityList.map((item) => (
                            <div key={item.keyword} className="flex items-center gap-4">
                              <span className="w-24 text-sm font-medium">{item.keyword}</span>
                              <Progress value={Math.min((item.count / 8) * 100, 100)} className="flex-1 h-2" />
                              <span className="text-sm w-10">{item.count}x</span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="analysis" className="mt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="border-border/50">
                        <CardHeader><CardTitle className="text-base">Skills Match — {analysis.breakdown.skills.score}%</CardTitle></CardHeader>
                        <CardContent>
                          <Progress value={analysis.breakdown.skills.score} className="h-2 mb-3" />
                          <div className="flex flex-wrap gap-1">{analysis.breakdown.skills.matched.map((s) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}</div>
                        </CardContent>
                      </Card>
                      <Card className="border-border/50">
                        <CardHeader><CardTitle className="text-base">Content Quality — {analysis.breakdown.content.score}%</CardTitle></CardHeader>
                        <CardContent>
                          <Progress value={analysis.breakdown.content.score} className="h-2 mb-3" />
                          {analysis.breakdown.content.suggestions.map((s, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm mb-2"><TrendingUp className="h-4 w-4 text-primary shrink-0" />{s}</div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={handleAnalyze}><RefreshCw className="h-4 w-4 mr-2" />Regenerate</Button>
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-500" onClick={handleApplyAll}><Zap className="h-4 w-4 mr-2" />Apply All Suggestions</Button>
                  <Button variant="outline" onClick={handleDownloadReport}><Download className="h-4 w-4 mr-2" />Download Report</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
