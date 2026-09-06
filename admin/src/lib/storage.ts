import { supabaseAdmin, isSupabaseConfigured } from './supabaseAdmin.js';

export async function uploadImageToStorage(
  bucket: 'product-images' | 'category-images' | 'brand-images' | 'homepage-banners',
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  if (!isSupabaseConfigured) {
    // Return object URL for demo/offline preview
    return {
      success: true,
      url: URL.createObjectURL(file)
    };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      return { success: false, error: error.message };
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { success: true, url: publicUrlData.publicUrl };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Storage upload error' };
  }
}
