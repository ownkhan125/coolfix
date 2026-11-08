// Photo rules shared by the booking form and the chat: JPG / PNG / WebP only, 5 MB or smaller

export const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

// Value for the file input's accept attribute, so the file picker only shows these types
export const PHOTO_INPUT_ACCEPT = ACCEPTED_PHOTO_TYPES.join(",");

// Checks one file. Returns a friendly error message, or "" when the file is fine.
export function checkPhoto(file) {
  if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) return "Only JPG, PNG or WebP images.";
  if (file.size > MAX_PHOTO_BYTES) return "Each photo must be 5 MB or smaller.";
  return "";
}

// Reads a file as a data URL, so it can be shown as a preview. Resolves to { id, file, previewUrl }.
export function readAsPreview(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ id: crypto.randomUUID(), file, previewUrl: reader.result });
    reader.readAsDataURL(file);
  });
}
