import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { getCloudinaryConfig, signCloudinaryParams } from "@/lib/cloudinary";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function POST(request: Request) {
  await requireAdmin();

  const { cloudName, apiKey, apiSecret, folder } = getCloudinaryConfig();

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { message: "Cloudinary environment variables are missing" },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "File is required" }, { status: 400 });
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return NextResponse.json({ message: "Unsupported image format" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ message: "Image is too large" }, { status: 400 });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = signCloudinaryParams({ folder, timestamp }, apiSecret);
  const uploadForm = new FormData();

  uploadForm.append("file", file);
  uploadForm.append("api_key", apiKey);
  uploadForm.append("timestamp", String(timestamp));
  uploadForm.append("signature", signature);

  if (folder) {
    uploadForm.append("folder", folder);
  }

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: uploadForm
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { message: data?.error?.message ?? "Cloudinary upload failed" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height
  });
}
