
CREATE POLICY "Anyone can read resumes"
ON storage.objects FOR SELECT
USING (bucket_id = 'resumes');

CREATE POLICY "Anyone can upload resumes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Anyone can update resumes"
ON storage.objects FOR UPDATE
USING (bucket_id = 'resumes');

CREATE POLICY "Anyone can delete resumes"
ON storage.objects FOR DELETE
USING (bucket_id = 'resumes');
