import type {
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";
import cloudinary from "../config/claudinary";

type CloudinaryUploadResult = {
  public_id: string;
  secure_url: string;
};

export const uploadImage = async (
  fileBuffer: Buffer,
  folder: string,
): Promise<{ publicId: string; url: string }> => {
  const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (
        error: UploadApiErrorResponse | undefined,
        uploadResult: UploadApiResponse | undefined,
      ) => {
        if (error || !uploadResult) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }

        resolve(uploadResult);
      },
    );

    (stream as any).end(fileBuffer);
  });

  return {
    publicId: result.public_id,
    url: result.secure_url,
  };
};

export const deleteImage = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
};
