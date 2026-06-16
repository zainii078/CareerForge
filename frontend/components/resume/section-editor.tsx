"use client";

import { useState } from "react";
import { Plus, Edit3, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateId } from "@/lib/resume-utils";
import {
  Resume,
  Experience,
  Education,
  Skill,
  Certification,
  Project,
  Language,
} from "@/lib/types";

interface SectionEditorProps {
  resume: Resume;
  section: string;
  onSave: (updated: Resume) => void;
}

export function SectionEditor({ resume, section, onSave }: SectionEditorProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});

  const openAdd = () => {
    setEditId(null);
    setForm(getDefaultForm(section));
    setDialogOpen(true);
  };

  const openEdit = (item: { id: string }) => {
    setEditId(item.id);
    setForm({ ...item });
    setDialogOpen(true);
  };

  const handleDelete = (id: string, field: keyof Resume) => {
    const arr = (resume[field] as { id: string }[]) || [];
    const updated = { ...resume, [field]: arr.filter((i) => i.id !== id) };
    onSave(updated);
  };

  const handleSubmit = () => {
    const id = editId || generateId();
    const item = { ...form, id };

    switch (section) {
      case "experience": {
        const arr = [...resume.experience];
        const idx = arr.findIndex((e) => e.id === id);
        const exp = item as unknown as Experience;
        if (idx >= 0) arr[idx] = exp;
        else arr.push(exp);
        onSave({ ...resume, experience: arr });
        break;
      }
      case "education": {
        const arr = [...resume.education];
        const idx = arr.findIndex((e) => e.id === id);
        const edu = item as unknown as Education;
        if (idx >= 0) arr[idx] = edu;
        else arr.push(edu);
        onSave({ ...resume, education: arr });
        break;
      }
      case "skills": {
        const arr = [...resume.skills];
        const idx = arr.findIndex((e) => e.id === id);
        const skill = item as unknown as Skill;
        if (idx >= 0) arr[idx] = skill;
        else arr.push(skill);
        onSave({ ...resume, skills: arr });
        break;
      }
      case "certifications": {
        const arr = [...resume.certifications];
        const idx = arr.findIndex((e) => e.id === id);
        const cert = item as unknown as Certification;
        if (idx >= 0) arr[idx] = cert;
        else arr.push(cert);
        onSave({ ...resume, certifications: arr });
        break;
      }
      case "projects": {
        const arr = [...resume.projects];
        const idx = arr.findIndex((e) => e.id === id);
        const proj = item as unknown as Project;
        if (idx >= 0) arr[idx] = proj;
        else arr.push(proj);
        onSave({ ...resume, projects: arr });
        break;
      }
      case "languages": {
        const arr = [...resume.languages];
        const idx = arr.findIndex((e) => e.id === id);
        const lang = item as unknown as Language;
        if (idx >= 0) arr[idx] = lang;
        else arr.push(lang);
        onSave({ ...resume, languages: arr });
        break;
      }
    }
    setDialogOpen(false);
  };

  const titles: Record<string, string> = {
    experience: "Work Experience",
    education: "Education",
    skills: "Skills",
    certifications: "Certifications",
    projects: "Projects",
    languages: "Languages",
  };

  return (
    <>
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{titles[section]}</CardTitle>
            <Button size="sm" onClick={openAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add {titles[section].replace("Work ", "")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {section === "experience" &&
            resume.experience.map((exp) => (
              <ItemCard key={exp.id} onEdit={() => openEdit(exp)} onDelete={() => handleDelete(exp.id, "experience")}>
                <h4 className="font-semibold">{exp.position}</h4>
                <p className="text-sm text-muted-foreground">{exp.company} - {exp.location}</p>
                <p className="text-xs text-muted-foreground mt-1">{exp.start_date} - {exp.current ? "Present" : exp.end_date}</p>
                <p className="text-sm mt-3">{exp.description}</p>
                {exp.achievements?.map((a, i) => (
                  <p key={i} className="text-sm text-muted-foreground flex items-start gap-2 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />{a}
                  </p>
                ))}
              </ItemCard>
            ))}

          {section === "education" &&
            resume.education.map((edu) => (
              <ItemCard key={edu.id} onEdit={() => openEdit(edu)} onDelete={() => handleDelete(edu.id, "education")}>
                <h4 className="font-semibold">{edu.degree} in {edu.field}</h4>
                <p className="text-sm text-muted-foreground">{edu.institution}</p>
                <p className="text-xs text-muted-foreground mt-1">{edu.start_date} - {edu.end_date}{edu.gpa && ` | GPA: ${edu.gpa}`}</p>
              </ItemCard>
            ))}

          {section === "skills" && (
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill) => (
                <Badge key={skill.id} variant="secondary" className="px-3 py-1.5 text-sm gap-2">
                  {skill.name} <span className="opacity-60">({skill.level})</span>
                  <button onClick={() => openEdit(skill)} className="hover:text-primary"><Edit3 className="h-3 w-3" /></button>
                  <button onClick={() => handleDelete(skill.id, "skills")} className="hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
                </Badge>
              ))}
            </div>
          )}

          {section === "certifications" &&
            resume.certifications.map((cert) => (
              <ItemCard key={cert.id} onEdit={() => openEdit(cert)} onDelete={() => handleDelete(cert.id, "certifications")}>
                <h4 className="font-semibold">{cert.name}</h4>
                <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                <p className="text-xs text-muted-foreground mt-1">Issued: {cert.date}{cert.does_expire && ` | Expires: ${cert.expiry_date}`}</p>
              </ItemCard>
            ))}

          {section === "projects" &&
            resume.projects.map((proj) => (
              <ItemCard key={proj.id} onEdit={() => openEdit(proj)} onDelete={() => handleDelete(proj.id, "projects")}>
                <h4 className="font-semibold">{proj.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">{proj.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {proj.technologies?.map((t) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                </div>
              </ItemCard>
            ))}

          {section === "languages" &&
            resume.languages.map((lang) => (
              <div key={lang.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="font-medium">{lang.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{lang.proficiency}</Badge>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(lang)}><Edit3 className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(lang.id, "languages")}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}

          {getListLength(resume, section) === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No items yet. Click Add to get started.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit" : "Add"} {titles[section]}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {section === "experience" && <ExperienceForm form={form} setForm={setForm} />}
            {section === "education" && <EducationForm form={form} setForm={setForm} />}
            {section === "skills" && <SkillForm form={form} setForm={setForm} />}
            {section === "certifications" && <CertForm form={form} setForm={setForm} />}
            {section === "projects" && <ProjectForm form={form} setForm={setForm} />}
            {section === "languages" && <LanguageForm form={form} setForm={setForm} />}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}><X className="h-4 w-4 mr-2" />Cancel</Button>
            <Button onClick={handleSubmit}><Save className="h-4 w-4 mr-2" />Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ItemCard({ children, onEdit, onDelete }: { children: React.ReactNode; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="p-4 rounded-lg border border-border/50 bg-muted/50">
      <div className="flex items-start justify-between">
        <div className="flex-1">{children}</div>
        <div className="flex gap-2 ml-4">
          <Button variant="ghost" size="icon" onClick={onEdit}><Edit3 className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="text-destructive" onClick={onDelete}><Trash2 className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}

function getDefaultForm(section: string): Record<string, unknown> {
  switch (section) {
    case "experience": return { company: "", position: "", location: "", start_date: "", end_date: "", current: false, description: "", achievements: [] };
    case "education": return { institution: "", degree: "", field: "", start_date: "", end_date: "", gpa: "", achievements: [] };
    case "skills": return { name: "", level: "intermediate", category: "Technical" };
    case "certifications": return { name: "", issuer: "", date: "", does_expire: false, expiry_date: "" };
    case "projects": return { name: "", description: "", technologies: [], start_date: "", url: "", github: "" };
    case "languages": return { name: "", proficiency: "conversational" };
    default: return {};
  }
}

function getListLength(resume: Resume, section: string) {
  const map: Record<string, unknown[]> = {
    experience: resume.experience, education: resume.education, skills: resume.skills,
    certifications: resume.certifications, projects: resume.projects, languages: resume.languages,
  };
  return map[section]?.length || 0;
}

function ExperienceForm({ form, setForm }: { form: Record<string, unknown>; setForm: (f: Record<string, unknown>) => void }) {
  const achievements = (form.achievements as string[]) || [];
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Position</Label><Input value={form.position as string} onChange={(e) => setForm({ ...form, position: e.target.value })} /></div>
        <div><Label>Company</Label><Input value={form.company as string} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
        <div><Label>Location</Label><Input value={form.location as string} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
        <div><Label>Start Date</Label><Input value={form.start_date as string} onChange={(e) => setForm({ ...form, start_date: e.target.value })} placeholder="2020" /></div>
        <div><Label>End Date</Label><Input value={(form.end_date as string) || ""} onChange={(e) => setForm({ ...form, end_date: e.target.value })} disabled={!!form.current} placeholder="2024" /></div>
        <div className="flex items-center gap-2 pt-6">
          <Checkbox checked={!!form.current} onCheckedChange={(c) => setForm({ ...form, current: c, end_date: c ? null : form.end_date })} />
          <Label>Currently working here</Label>
        </div>
      </div>
      <div><Label>Description</Label><Textarea value={form.description as string} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-[80px]" /></div>
      <div>
        <Label>Achievements (one per line)</Label>
        <Textarea value={achievements.join("\n")} onChange={(e) => setForm({ ...form, achievements: e.target.value.split("\n").filter(Boolean) })} className="min-h-[80px]" placeholder="Reduced costs by 30%..." />
      </div>
    </>
  );
}

function EducationForm({ form, setForm }: { form: Record<string, unknown>; setForm: (f: Record<string, unknown>) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="col-span-2"><Label>Institution</Label><Input value={form.institution as string} onChange={(e) => setForm({ ...form, institution: e.target.value })} /></div>
      <div><Label>Degree</Label><Input value={form.degree as string} onChange={(e) => setForm({ ...form, degree: e.target.value })} /></div>
      <div><Label>Field</Label><Input value={form.field as string} onChange={(e) => setForm({ ...form, field: e.target.value })} /></div>
      <div><Label>Start Date</Label><Input value={form.start_date as string} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></div>
      <div><Label>End Date</Label><Input value={form.end_date as string} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /></div>
      <div><Label>GPA (optional)</Label><Input value={(form.gpa as string) || ""} onChange={(e) => setForm({ ...form, gpa: e.target.value })} /></div>
    </div>
  );
}

function SkillForm({ form, setForm }: { form: Record<string, unknown>; setForm: (f: Record<string, unknown>) => void }) {
  return (
    <div className="space-y-3">
      <div><Label>Skill Name</Label><Input value={form.name as string} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
      <div><Label>Category</Label><Input value={form.category as string} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
      <div><Label>Level</Label>
        <Select value={form.level as string} onValueChange={(v) => setForm({ ...form, level: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {["beginner", "intermediate", "advanced", "expert"].map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function CertForm({ form, setForm }: { form: Record<string, unknown>; setForm: (f: Record<string, unknown>) => void }) {
  return (
    <div className="space-y-3">
      <div><Label>Certification Name</Label><Input value={form.name as string} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
      <div><Label>Issuer</Label><Input value={form.issuer as string} onChange={(e) => setForm({ ...form, issuer: e.target.value })} /></div>
      <div><Label>Date</Label><Input value={form.date as string} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
      <div className="flex items-center gap-2">
        <Checkbox checked={!!form.does_expire} onCheckedChange={(c) => setForm({ ...form, does_expire: c })} />
        <Label>Expires</Label>
      </div>
      {!!form.does_expire && <div><Label>Expiry Date</Label><Input value={(form.expiry_date as string) || ""} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} /></div>}
    </div>
  );
}

function ProjectForm({ form, setForm }: { form: Record<string, unknown>; setForm: (f: Record<string, unknown>) => void }) {
  const techs = (form.technologies as string[]) || [];
  return (
    <div className="space-y-3">
      <div><Label>Project Name</Label><Input value={form.name as string} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
      <div><Label>Description</Label><Textarea value={form.description as string} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
      <div><Label>Technologies (comma separated)</Label><Input value={techs.join(", ")} onChange={(e) => setForm({ ...form, technologies: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Start Date</Label><Input value={form.start_date as string} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></div>
        <div><Label>URL</Label><Input value={(form.url as string) || ""} onChange={(e) => setForm({ ...form, url: e.target.value })} /></div>
      </div>
    </div>
  );
}

function LanguageForm({ form, setForm }: { form: Record<string, unknown>; setForm: (f: Record<string, unknown>) => void }) {
  return (
    <div className="space-y-3">
      <div><Label>Language</Label><Input value={form.name as string} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
      <div><Label>Proficiency</Label>
        <Select value={form.proficiency as string} onValueChange={(v) => setForm({ ...form, proficiency: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {["basic", "conversational", "professional", "native"].map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
