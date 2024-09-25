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

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/${Date.now()}-${file.name}`,
    Body: Buffer.from(fileBuffer),
    ContentType: file.type,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  return { url: signedUrl };
}
