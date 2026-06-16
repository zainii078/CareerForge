"use client";

import { useState, useEffect, useRef } from "react";
import { User, Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { api, getStoredUser, setStoredUser } from "@/lib/api";
import { User as UserType } from "@/lib/types";
import { toast } from "sonner";

export default function RecruiterSettingsPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<Partial<UserType>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = getStoredUser() as UserType | null;
    if (stored) setUser(stored);
    api.auth.me().then((r) => { setUser(r.user as UserType); setStoredUser(r.user); }).catch(() => {});
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.size > 2 * 1024 * 1024) { toast.error("Image must be under 2MB"); return; }
    const reader = new FileReader();
    reader.onload = () => setUser((p) => ({ ...p, avatar_url: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await api.auth.updateProfile({
        full_name: user.full_name || undefined,
        avatar_url: user.avatar_url || undefined,
        bio: user.bio || undefined,
        company_name: user.company_name || undefined,
        phone: user.phone || undefined,
      });
      setUser(result.user as UserType);
      setStoredUser(result.user);
      toast.success("Profile saved!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const initials = (user.full_name || "HR").split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your recruiter profile</p>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2"><User className="h-5 w-5" />Recruiter Profile</CardTitle>
          <CardDescription>Pakistani recruiter profile for TechVentures Pakistan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback className="bg-teal-500/20 text-teal-400">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <Button variant="outline" size="sm" className="border-gray-700" onClick={() => fileRef.current?.click()}>Change Photo</Button>
            </div>
          </div>
          <Separator className="bg-gray-800" />
          <div className="grid gap-4 md:grid-cols-2">
            <div><Label className="text-gray-400">Full Name</Label><Input value={user.full_name || ""} onChange={(e) => setUser({ ...user, full_name: e.target.value })} className="mt-1.5 bg-gray-800 border-gray-700 text-white" /></div>
            <div><Label className="text-gray-400">Email</Label><Input value={user.email || ""} disabled className="mt-1.5 bg-gray-800 border-gray-700" /></div>
            <div><Label className="text-gray-400">Phone</Label><Input value={user.phone || ""} onChange={(e) => setUser({ ...user, phone: e.target.value })} placeholder="+92 300 1234567" className="mt-1.5 bg-gray-800 border-gray-700 text-white" /></div>
            <div><Label className="text-gray-400 flex items-center gap-1"><Building2 className="h-4 w-4" />Company</Label><Input value={user.company_name || ""} onChange={(e) => setUser({ ...user, company_name: e.target.value })} className="mt-1.5 bg-gray-800 border-gray-700 text-white" /></div>
          </div>
          <div>
            <Label className="text-gray-400">Bio</Label>
            <Textarea value={user.bio || ""} onChange={(e) => setUser({ ...user, bio: e.target.value })} className="mt-1.5 min-h-[100px] bg-gray-800 border-gray-700 text-white" placeholder="Senior HR Manager at TechVentures Pakistan..." />
          </div>
          <Button className="bg-teal-500 text-gray-900" onClick={handleSave} disabled={saving}>
            {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
