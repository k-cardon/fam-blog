import { NextResponse } from 'next/server';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3 } from '@aws-sdk/client-s3';

// Initialize S3 client
const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Set up multer storage with S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME!,
    acl: 'public-read',
    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now().toString()}_${file.originalname}`);
    },
  }),
});

// Define the API route
export async function POST(req: Request) {
  return new Promise((resolve, reject) => {
    // Create a new multipart form request
    upload.single('image')(
      req as any,
      {} as any,
      (error: any) => {
        if (error) {
          console.error('Error uploading file:', error);
          return resolve(NextResponse.json({ error: 'Failed to upload image' }, { status: 500 }));
        }

        // Access the uploaded file information
        const file = (req as any).file;

        // Check if file is present
        if (!file) {
          return resolve(NextResponse.json({ error: 'File not found' }, { status: 400 }));
        }

        // Return the file URL
        return resolve(NextResponse.json({ url: file.location }, { status: 200 }));
      }
    );
  });
}
