"use client";

import { useState, useEffect, useRef } from "react";
import { User, Bell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api, getStoredUser, setStoredUser } from "@/lib/api";
import { getStoredJobDescription } from "@/lib/resume-utils";
import { User as UserType } from "@/lib/types";
import { toast } from "sonner";

export default function SettingsPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<Partial<UserType>>({});
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, push: true, jobAlerts: true, marketingEmails: false });

  useEffect(() => {
    const stored = getStoredUser() as UserType | null;
    if (stored) setUser(stored);
    api.auth.me().then((r) => {
      const u = r.user as UserType;
      setUser(u);
      setStoredUser(u);
    }).catch(() => {});
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setUser((prev) => ({ ...prev, avatar_url: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const jobDesc = getStoredJobDescription();
      const result = await api.auth.updateProfile({
        full_name: user.full_name || undefined,
        avatar_url: user.avatar_url || undefined,
        bio: user.bio || jobDesc.slice(0, 300) || undefined,
        job_preference: jobDesc || user.job_preference || undefined,
        phone: user.phone || undefined,
      });
      const updated = result.user as UserType;
      setUser(updated);
      setStoredUser(updated);
      toast.success("Profile saved successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const initials = (user.full_name || "U").split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" />Profile</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" />Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your photo appears on your resume and profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar_url || undefined} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>Change Photo</Button>
                  <p className="text-xs text-muted-foreground mt-2">JPG, GIF or PNG. Max 2MB. Used on resume.</p>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 md:grid-cols-2">
                <div><Label>Full Name</Label><Input value={user.full_name || ""} onChange={(e) => setUser({ ...user, full_name: e.target.value })} className="mt-1.5" /></div>
                <div><Label>Email</Label><Input value={user.email || ""} disabled className="mt-1.5" /></div>
                <div><Label>Phone</Label><Input value={user.phone || ""} onChange={(e) => setUser({ ...user, phone: e.target.value })} className="mt-1.5" /></div>
              </div>
              <div>
                <Label>Bio</Label>
                <Textarea
                  value={user.bio || getStoredJobDescription().slice(0, 300) || ""}
                  onChange={(e) => setUser({ ...user, bio: e.target.value })}
                  className="mt-1.5 min-h-[100px]"
                  placeholder="Professional bio — auto-suggested from your job description in ATS Optimizer"
                />
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-500" onClick={handleSave} disabled={saving}>
                {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="border-border/50">
            <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {[
                { id: "email", label: "Email Notifications", description: "Receive updates via email" },
                { id: "push", label: "Push Notifications", description: "Browser push alerts" },
                { id: "jobAlerts", label: "Job Alerts", description: "New job matches based on your profile" },
                { id: "marketingEmails", label: "Marketing Emails", description: "News and product updates" },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div><p className="font-medium">{item.label}</p><p className="text-sm text-muted-foreground">{item.description}</p></div>
                  <Switch checked={notifications[item.id as keyof typeof notifications]} onCheckedChange={(c) => setNotifications((p) => ({ ...p, [item.id]: c }))} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
