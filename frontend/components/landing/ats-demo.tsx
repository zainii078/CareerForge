"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const scoreData = [
  { name: "Score", value: 87 },
  { name: "Gap", value: 13 },
];

const COLORS = ["hsl(221, 83%, 53%)", "hsl(214, 32%, 18%)"];

export function ATSDemo() {
  const { keywords, skills, format, content } = useMemo(() => ({
    keywords: { score: 92, found: ["React", "TypeScript", "Node.js"], missing: ["GraphQL"] },
    skills: { score: 85, found: ["Frontend", "Backend", "DevOps"], missing: ["Leadership"] },
    format: { score: 90, issues: ["Table headers could be simplified"] },
    content: { score: 82, suggestions: ["Add more quantifiable achievements"] },
  }), []);

  return (
    <section className="py-20 md:py-32 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-sm font-medium mb-6">
            ATS Optimization
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            See How Your Resume{" "}
            <span className="bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent">
              Scores
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our AI-powered ATS analyzer checks your resume against 50+ parameters
            used by top applicant tracking systems.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-2xl border border-border/50 p-8 shadow-xl"
          >
            <div className="flex items-center justify-center mb-8">
              <div className="relative w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={scoreData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {scoreData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index]}
                          strokeWidth={0}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-4xl font-bold">87</span>
                    <p className="text-sm text-muted-foreground">ATS Score</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Keyword Match</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                      style={{ width: `${keywords.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{keywords.score}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Skills Match</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
                      style={{ width: `${skills.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{skills.score}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Format Score</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
                      style={{ width: `${format.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{format.score}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Content Quality</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full"
                      style={{ width: `${content.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{content.score}%</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="bg-card rounded-xl border border-border/50 p-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Keywords Found
              </h4>
              <div className="flex flex-wrap gap-2">
                {keywords.found.map((kw) => (
                  <span
                    key={kw}
                    className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border/50 p-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Missing Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {keywords.missing.map((kw) => (
                  <span
                    key={kw}
                    className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm"
                  >
                    {kw}
                  </span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Adding these keywords could increase your score by 5-8%
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20 p-6">
              <h4 className="font-semibold mb-3">AI Suggestion</h4>
              <p className="text-sm text-muted-foreground">
                "Consider adding GraphQL to your skills section. This appears in{" "}
                <strong>67% of job postings</strong> for similar roles and could
                significantly boost your match rate."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
