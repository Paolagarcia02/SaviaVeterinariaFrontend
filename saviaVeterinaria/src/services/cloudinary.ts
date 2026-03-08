import api from '@/api/axios';

const pickUploadedUrl = (data: unknown): string => {
  if (typeof data === 'string' && data.trim().length > 0) return data.trim();

  const obj = (typeof data === 'object' && data !== null) ? (data as Record<string, any>) : {};

  const candidates = [
    obj.url,
    obj.photo_url,
    obj.photoUrl,
    obj.secure_url,
    obj.secureUrl,
    obj.data?.url,
    obj.data?.photo_url,
    obj.data?.photoUrl,
    obj.data?.secure_url,
    obj.data?.secureUrl
  ];

  const found = candidates.find((value) => typeof value === 'string' && value.trim().length > 0);
  return typeof found === 'string' ? found : '';
};

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const uploadEndpoint = (import.meta.env.VITE_PET_IMAGE_UPLOAD_ENDPOINT || '/Pet/upload').trim();
  const formData = new FormData();

  formData.append('file', file);
  formData.append('photo', file);
  formData.append('image', file);

  const response = await api.post(uploadEndpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  const uploadedUrl = pickUploadedUrl(response.data);
  if (!uploadedUrl) {
    throw new Error('El backend no devolvió la URL de la imagen subida.');
  }

  return uploadedUrl;
};
