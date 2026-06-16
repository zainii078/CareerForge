"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Star, Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api, downloadBlob } from "@/lib/api";
import { Resume } from "@/lib/types";
import { toast } from "sonner";

const templates = [
  { id: "modern", name: "Modern", description: "Clean and contemporary design", category: "Popular", popular: true, previewImage: "https://images.pexels.com/photos/3183165/pexels-photo-3183165.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "professional", name: "Professional", description: "Traditional corporate style", category: "Popular", popular: true, previewImage: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "minimal", name: "Minimal", description: "Simple and focused layout", category: "ATS Friendly", popular: false, previewImage: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "creative", name: "Creative", description: "Bold design for creative roles", category: "Design", popular: false, previewImage: "https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "executive", name: "Executive", description: "Premium look for senior roles", category: "Premium", popular: true, previewImage: "https://images.pexels.com/photos/3815586/pexels-photo-3815586.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "technical", name: "Technical", description: "Optimized for engineering roles", category: "ATS Friendly", popular: false, previewImage: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "clean", name: "Clean", description: "Minimal whitespace-first resume", category: "ATS Friendly", popular: false, previewImage: "https://images.pexels.com/photos/3184324/pexels-photo-3184324.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "classic", name: "Classic", description: "Executive layout with strong hierarchy", category: "Premium", popular: false, previewImage: "https://images.pexels.com/photos/3184464/pexels-photo-3184464.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "bold", name: "Bold", description: "High-impact resume for stand-out profiles", category: "Design", popular: false, previewImage: "https://images.pexels.com/photos/3184653/pexels-photo-3184653.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "elegant", name: "Elegant", description: "Soft palette with a refined structure", category: "Premium", popular: false, previewImage: "https://images.pexels.com/photos/3182745/pexels-photo-3182745.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "startup", name: "Startup", description: "Modern design built for founders and builders", category: "Popular", popular: true, previewImage: "https://images.pexels.com/photos/3184420/pexels-photo-3184420.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: "consultant", name: "Consultant", description: "Clean layout that emphasizes experience", category: "Professional", popular: false, previewImage: "https://images.pexels.com/photos/3184417/pexels-photo-3184417.jpeg?auto=compress&cs=tinysrgb&w=800" },
];

export default function TemplatesPage() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [selected, setSelected] = useState("modern");
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    api.resumes.getPrimary().then((r) => {
      setResume(r);
      setSelected(r.template || "modern");
    }).catch(() => {});
  }, []);

  const handleUseTemplate = async (templateId: string) => {
    if (!resume) {
      toast.error("Create a resume first in Resume Builder");
      return;
    }
    try {
      const updated = await api.resumes.update(resume.id, { template: templateId });
      setResume(updated);
      setSelected(templateId);
      toast.success(`${templates.find((t) => t.id === templateId)?.name} template selected!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save template");
    }
  };

  const handleDownload = async (templateId: string) => {
    if (!resume) {
      toast.error("Create a resume first");
      return;
    }
    setLoading(templateId);
    try {
      const updated = await api.resumes.update(resume.id, { template: templateId });
      setResume(updated);
      setSelected(templateId);
      const blob = await api.resumes.exportPdf(resume.id, templateId);
      const name = updated.personal_info?.full_name || "resume";
      downloadBlob(blob, `${name.replace(/\s+/g, "_")}_${templateId}.pdf`);
      toast.success("Resume downloaded!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Download failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Resume Templates</h1>
          <p className="text-muted-foreground mt-1">Choose a template and download your resume as PDF</p>
        </div>
        <Badge variant="secondary" className="gap-1.5"><Sparkles className="h-4 w-4" />{templates.length} Templates</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template, index) => (
          <motion.div key={template.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card className={`border-border/50 overflow-hidden group hover:border-primary/30 transition-all ${selected === template.id ? "ring-2 ring-primary" : ""}`}>
              <div className="aspect-[8.5/11] relative overflow-hidden bg-muted">
                <img src={template.previewImage} alt={`${template.name} preview`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-20 transition-opacity" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button className="bg-white text-black hover:bg-gray-100" onClick={() => handleUseTemplate(template.id)}>Use Template</Button>
                  <Button variant="outline" className="bg-white/90" onClick={() => handleDownload(template.id)} disabled={loading === template.id}>
                    {loading === template.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  </Button>
                </div>
                {selected === template.id && (
                  <div className="absolute top-3 left-3"><Badge className="bg-primary gap-1"><Check className="h-3 w-3" />Active</Badge></div>
                )}
                {template.popular && (
                  <div className="absolute top-3 right-3"><Badge className="bg-amber-500 text-black gap-1"><Star className="h-3 w-3 fill-current" />Popular</Badge></div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
                <Button className="w-full mt-3" variant="outline" size="sm" onClick={() => handleDownload(template.id)} disabled={loading === template.id}>
                  {loading === template.id ? "Generating PDF..." : "Download with this Template"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
