-- Update avatars bucket file size limit to 25MB (26214400 bytes)
-- For existing deployments where the bucket was created with 10MB limit

UPDATE storage.buckets
SET file_size_limit = 26214400
WHERE id = 'avatars';
