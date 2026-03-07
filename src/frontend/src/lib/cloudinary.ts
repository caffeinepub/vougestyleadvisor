export const CLOUDINARY_NAME = "doj0aeuvi";
export const CLOUDINARY_PRESET = "vougestyleadvisor";

export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`,
    { method: "POST", body: formData },
  );

  if (!response.ok) throw new Error("Upload failed");
  const data = await response.json();
  return data.secure_url as string;
}
