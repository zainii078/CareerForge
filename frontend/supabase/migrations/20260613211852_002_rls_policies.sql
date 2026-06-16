-- Profiles RLS policies
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR 
    (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin');
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Resumes RLS policies
CREATE POLICY "select_own_resumes" ON resumes FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "insert_own_resumes" ON resumes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_resumes" ON resumes FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_resumes" ON resumes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Jobs RLS policies (recruiters and admins can manage, everyone can view active)
CREATE POLICY "select_jobs" ON jobs FOR SELECT
  TO authenticated USING (
    recruiter_id = auth.uid() OR 
    status = 'active' OR
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "insert_jobs" ON jobs FOR INSERT
  TO authenticated WITH CHECK (
    recruiter_id = auth.uid() AND 
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('recruiter', 'admin'))
  );
CREATE POLICY "update_jobs" ON jobs FOR UPDATE
  TO authenticated USING (
    recruiter_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  ) WITH CHECK (
    recruiter_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "delete_jobs" ON jobs FOR DELETE
  TO authenticated USING (
    recruiter_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Applications RLS policies
CREATE POLICY "select_applications" ON applications FOR SELECT
  TO authenticated USING (
    applicant_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM jobs WHERE jobs.id = applications.job_id AND jobs.recruiter_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "insert_applications" ON applications FOR INSERT
  TO authenticated WITH CHECK (applicant_id = auth.uid());
CREATE POLICY "update_applications" ON applications FOR UPDATE
  TO authenticated USING (
    applicant_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM jobs WHERE jobs.id = applications.job_id AND jobs.recruiter_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "delete_applications" ON applications FOR DELETE
  TO authenticated USING (applicant_id = auth.uid());

-- ATS Analyses RLS policies
CREATE POLICY "select_own_analyses" ON ats_analyses FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM resumes WHERE resumes.id = ats_analyses.resume_id AND resumes.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "insert_own_analyses" ON ats_analyses FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM resumes WHERE resumes.id = ats_analyses.resume_id AND resumes.user_id = auth.uid())
  );
CREATE POLICY "delete_own_analyses" ON ats_analyses FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM resumes WHERE resumes.id = ats_analyses.resume_id AND resumes.user_id = auth.uid())
  );

-- Notifications RLS policies
CREATE POLICY "select_own_notifications" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_notifications" ON notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_notifications" ON notifications FOR DELETE
  TO authenticated USING (auth.uid() = user_id);