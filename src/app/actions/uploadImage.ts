'use server'

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    throw new Error('No file uploaded');
  }

  const fileBuffer = await file.arrayBuffer();
  const key = `uploads/${Date.now()}-${file.name}`;

  // Generate a pre-signed URL for PUT operation
  const putCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    ContentType: file.type,
  });
  const putUrl = await getSignedUrl(s3Client, putCommand, { expiresIn: 3600 }); // 1 hour to upload

  // Upload the file using the pre-signed URL
  const putResponse = await fetch(putUrl, {
    method: 'PUT',
    body: fileBuffer,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!putResponse.ok) {
    throw new Error('Failed to upload image');
  }

  // Generate a public URL for the uploaded object
  const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return { url: publicUrl };
}