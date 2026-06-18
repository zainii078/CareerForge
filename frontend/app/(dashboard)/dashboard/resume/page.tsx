"use client";

import React, { useState, useCallback, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  GripVertical,
  Trash2,
  Edit3,
  Save,
  X,
  User,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  FolderGit,
  Languages,
  Download,
  Eye,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { sampleResume, sampleResume as initialResume } from "@/lib/demo-data";
import { api, downloadBlob } from "@/lib/api";
import { Resume } from "@/lib/types";
import { calcResumeCompletion } from "@/lib/resume-utils";
import { SectionEditor } from "@/components/resume/section-editor";
import { toast } from "sonner";

type ResumeSectionType =
  | "personal"
  | "education"
  | "experience"
  | "skills"
  | "certifications"
  | "projects"
  | "languages";

interface ResumeSectionItem {
  id: string;
  type: ResumeSectionType;
  title: string;
  icon: React.ElementType;
}

const resumeSections: ResumeSectionItem[] = [
  { id: "personal", type: "personal", title: "Personal Information", icon: User },
  { id: "education", type: "education", title: "Education", icon: GraduationCap },
  { id: "experience", type: "experience", title: "Experience", icon: Briefcase },
  { id: "skills", type: "skills", title: "Skills", icon: Code },
  { id: "certifications", type: "certifications", title: "Certifications", icon: Award },
  { id: "projects", type: "projects", title: "Projects", icon: FolderGit },
  { id: "languages", type: "languages", title: "Languages", icon: Languages },
];

const ItemTypes = {
  SECTION: "section",
};

interface DragItem {
  id: string;
  index: number;
}

function DraggableSection({
  section,
  index,
  moveSection,
  isActive,
  onClick,
}: {
  section: ResumeSectionItem;
  index: number;
  moveSection: (dragIndex: number, hoverIndex: number) => void;
  isActive: boolean;
  onClick: () => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>({
    type: ItemTypes.SECTION,
    item: { id: section.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop<DragItem>({
    accept: ItemTypes.SECTION,
    hover(item: DragItem) {
      if (item.index !== index) {
        moveSection(item.index, index);
        item.index = index;
      }
    },
  });

  drag(drop(ref));

  return (
    <motion.div
      ref={ref}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-muted hover:bg-muted/80"
      } ${isDragging ? "opacity-50" : ""}`}
      onClick={onClick}
      whileHover={{ x: 4 }}
    >
      <GripVertical className="h-4 w-4 opacity-50" />
      <section.icon className="h-4 w-4" />
      <span className="text-sm font-medium">{section.title}</span>
    </motion.div>
  );
}

const personalInfoSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone number"),
  location: z.string().min(2, "Location is required"),
  linkedin: z.string().optional(),
  website: z.string().optional(),
  github: z.string().optional(),
  avatar_base64: z.string().optional(),
  summary: z.string().min(10, "Summary is required"),
});

type PersonalInfoForm = z.infer<typeof personalInfoSchema>;

const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  location: z.string().min(1, "Location is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional().or(z.literal("")),
  current: z.boolean(),
  description: z.string().min(1, "Description is required"),
});

const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().min(1, "Field is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  gpa: z.string().optional(),
});

const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  category: z.string().min(1, "Category is required"),
});

export default function ResumeBuilderPage() {
  const [sections, setSections] = useState<ResumeSectionItem[]>(resumeSections);
  const [activeSection, setActiveSection] = useState<string>("personal");
  const [resume, setResume] = useState<Resume>(initialResume as unknown as Resume);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const personalForm = useForm<PersonalInfoForm>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: resume.personal_info,
  });

  useEffect(() => {
    api.resumes
      .getPrimary()
      .then((data) => {
        setResume(data);
        personalForm.reset(data.personal_info);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [personalForm]);

  const saveResume = async (updated: Resume) => {
    if (!loaded) return;
    setIsSaving(true);
    try {
      const saved = await api.resumes.update(updated.id, updated);
      setResume(saved);
      toast.success("Resume saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      await saveResume(resume);
      const blob = await api.resumes.exportPdf(resume.id, resume.template);
      const name = resume.personal_info.full_name || "resume";
      downloadBlob(blob, `${name.replace(/\s+/g, "_")}.pdf`);
      toast.success("PDF downloaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "PDF download failed");
    } finally {
      setIsDownloading(false);
    }
  };

  const moveSection = useCallback((dragIndex: number, hoverIndex: number) => {
    setSections((prev) => {
      const result = [...prev];
      const [removed] = result.splice(dragIndex, 1);
      result.splice(hoverIndex, 0, removed);
      return result;
    });
  }, []);

  const handleSavePersonalInfo = (data: PersonalInfoForm) => {
    const updated = { ...resume, personal_info: data };
    setResume(updated);
    saveResume(updated);
    setIsEditing(false);
  };

  const handleSectionSave = (updated: Resume) => {
    setResume(updated);
    saveResume(updated);
  };

  const completion = calcResumeCompletion(resume);

  const renderSectionForm = () => {
    switch (activeSection) {
      case "personal":
        return (
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Personal Information</CardTitle>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false);
                        personalForm.reset();
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={personalForm.handleSubmit(handleSavePersonalInfo)}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      disabled={!isEditing}
                      {...personalForm.register("full_name")}
                      className={personalForm.formState.errors.full_name ? "border-destructive" : ""}
                    />
                    {personalForm.formState.errors.full_name && (
                      <p className="text-xs text-destructive mt-1">
                        {personalForm.formState.errors.full_name.message}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <Label>Profile Picture</Label>
                    <div className="flex items-center gap-4 mt-1">
                      {personalForm.watch("avatar_base64") ? (
                        <div className="relative h-16 w-16 rounded-full overflow-hidden border">
                          <img src={personalForm.watch("avatar_base64")} alt="Profile" className="object-cover h-full w-full" />
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => personalForm.setValue("avatar_base64", "", { shouldDirty: true })}
                              className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center border">
                          <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      {isEditing && (
                        <Input
                          type="file"
                          accept="image/*"
                          className="flex-1"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                personalForm.setValue("avatar_base64", reader.result as string, { shouldDirty: true });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      disabled={!isEditing}
                      type="email"
                      {...personalForm.register("email")}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input disabled={!isEditing} {...personalForm.register("phone")} />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input disabled={!isEditing} {...personalForm.register("location")} />
                  </div>
                  <div>
                    <Label>LinkedIn</Label>
                    <Input disabled={!isEditing} {...personalForm.register("linkedin")} />
                  </div>
                  <div>
                    <Label>GitHub</Label>
                    <Input disabled={!isEditing} {...personalForm.register("github")} />
                  </div>
                  <div>
                    <Label>Website</Label>
                    <Input disabled={!isEditing} {...personalForm.register("website")} />
                  </div>
                </div>
                <div>
                  <Label>Professional Summary</Label>
                  <Textarea
                    disabled={!isEditing}
                    className="min-h-[100px]"
                    {...personalForm.register("summary")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "experience":
        return <SectionEditor resume={resume} section="experience" onSave={handleSectionSave} />;

      case "education":
        return <SectionEditor resume={resume} section="education" onSave={handleSectionSave} />;

      case "skills":
        return <SectionEditor resume={resume} section="skills" onSave={handleSectionSave} />;

      case "certifications":
        return <SectionEditor resume={resume} section="certifications" onSave={handleSectionSave} />;

      case "projects":
        return <SectionEditor resume={resume} section="projects" onSave={handleSectionSave} />;

      case "languages":
        return <SectionEditor resume={resume} section="languages" onSave={handleSectionSave} />;

      default:
        return null;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Resume Builder</h1>
            <p className="text-muted-foreground mt-1">
              Build your professional resume with our drag-and-drop editor
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "edit" ? "preview" : "edit")}>
              {viewMode === "edit" ? (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-cyan-500"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
            >
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? "Generating..." : "Download PDF"}
            </Button>
            {isSaving && <span className="text-xs text-muted-foreground self-center">Saving...</span>}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Section List */}
          <div className="lg:col-span-1">
            <Card className="border-border/50 sticky top-24">
              <CardHeader>
                <CardTitle className="text-base">Resume Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section, index) => (
                  <DraggableSection
                    key={section.id}
                    section={section}
                    index={index}
                    moveSection={moveSection}
                    isActive={activeSection === section.id}
                    onClick={() => setActiveSection(section.id)}
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Section Editor */}
          <div className="lg:col-span-2">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              {renderSectionForm()}
            </ScrollArea>
          </div>

          {/* Right Sidebar - Live Preview */}
          <div className="lg:col-span-1">
            <Card className="border-border/50 sticky top-24">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Live Preview</CardTitle>
                  <Button variant="ghost" size="icon">
                    <Printer className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-[8.5/11] bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg p-4 text-xs">
                  <div className="text-center mb-3">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      {resume.personal_info.full_name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-[10px]">
                      {resume.personal_info.email} | {resume.personal_info.phone}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-[10px]">
                      {resume.personal_info.location}
                    </p>
                  </div>
                  <Separator className="my-2" />
                  <div className="space-y-2">
                    <div className="text-[9px] font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <User className="h-2 w-2" />
                      SUMMARY
                    </div>
                    <p className="text-[8px] text-gray-600 dark:text-gray-400 line-clamp-2">
                      {resume.personal_info.summary}
                    </p>
                    <div className="text-[9px] font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <Briefcase className="h-2 w-2" />
                      EXPERIENCE
                    </div>
                    {resume.experience.slice(0, 2).map((exp) => (
                      <div key={exp.id} className="text-[8px] text-gray-600 dark:text-gray-400">
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {exp.position}
                        </span>{" "}
                        - {exp.company}
                      </div>
                    ))}
                    <div className="text-[9px] font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <Code className="h-2 w-2" />
                      SKILLS
                    </div>
                    <div className="flex flex-wrap gap-0.5">
                      {resume.skills.slice(0, 6).map((skill) => (
                        <span
                          key={skill.id}
                          className="text-[7px] px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-bold text-primary">{completion.percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all" style={{ width: `${completion.percent}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-sm mt-3">
                    <span className="text-muted-foreground">ATS Score</span>
                    <span className="font-bold text-primary">{resume.ats_score || 0}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all" style={{ width: `${resume.ats_score || 0}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
