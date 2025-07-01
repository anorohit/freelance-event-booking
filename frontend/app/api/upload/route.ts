// Server-side Cloudinary upload API route for Next.js (app/api/upload/route.ts)
// Usage: POST a file (as multipart/form-data) to this endpoint from your frontend.
// The server will upload it to Cloudinary using your API credentials and return the image URL.
//
// If you see module not found errors, install dependencies:
// pnpm add cloudinary multer next-connect
// pnpm add -D @types/multer @types/next-connect

import { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return new Response(JSON.stringify({ success: false, error: "No file uploaded" }), { status: 400 });
    }
    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "events", use_filename: true },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // @ts-ignore
    return new Response(JSON.stringify({ success: true, url: result.secure_url }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
};

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
}; 