import { NextResponse } from "next/server";

import { syncCurrentUser } from "@/src/lib/auth";
import { getPinataGatewayUrl, pinata } from "@/src/lib/pinata";

export async function POST(req: Request) {
  const user = await syncCurrentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return new NextResponse("File is required", { status: 400 });
    }

    const upload = await pinata.upload.public.file(file);
    const gatewayUrl = getPinataGatewayUrl(upload.cid);

    return NextResponse.json({
      id: upload.id,
      cid: upload.cid,
      name: upload.name,
      size: upload.size,
      mimeType: upload.mime_type || file.type || "application/octet-stream",
      createdAt: upload.created_at,
      gatewayUrl,
    });
  } catch (error) {
    console.error("Failed to upload file to Pinata", error);
    return new NextResponse("Failed to upload file", { status: 500 });
  }
}
