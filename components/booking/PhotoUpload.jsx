"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { PHOTO_INPUT_ACCEPT, checkPhoto, readAsPreview } from "@/lib/photo-rules";

// Up to 3 photos per booking (file type and size rules are in lib/photo-rules.js)
const MAX_PHOTOS = 3;

// Photo upload: drag and drop or click to add photos, preview thumbnails with a remove button.
// photos = [{ id, file, previewUrl }], owned by the booking form.
export default function PhotoUpload({ photos, onPhotosChange }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Check new files against the rules, keep the good ones and explain why any were skipped
  async function handleNewFiles(fileList) {
    const newFiles = Array.from(fileList);
    let errorMessage = "";

    const allowedFiles = newFiles.filter((file) => {
      const fileError = checkPhoto(file);
      if (fileError) errorMessage = fileError;
      return fileError === "";
    });

    const freeSpots = MAX_PHOTOS - photos.length;
    if (allowedFiles.length > freeSpots) errorMessage = "You can add up to 3 photos.";

    setUploadError(errorMessage);
    const newPhotos = await Promise.all(allowedFiles.slice(0, freeSpots).map(readAsPreview));
    onPhotosChange([...photos, ...newPhotos]);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    handleNewFiles(event.dataTransfer.files);
  }

  function handleRemovePhoto(photoId) {
    setUploadError("");
    onPhotosChange(photos.filter((photo) => photo.id !== photoId));
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="field-label">Photos (optional)</p>

      {/* Drop zone: drop files here, or click to open the file picker */}
      {photos.length < MAX_PHOTOS && (
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          aria-describedby={uploadError ? "booking-photos-error" : undefined}
          className={`upload-dropzone ${isDragging ? "upload-dropzone-active" : ""} w-full px-4 py-6 text-center`}
        >
          Drop photos here or <span className="upload-link">browse</span>
          <span className="text-small mt-1 block">Up to 3 photos · JPG, PNG or WebP · max 5 MB each</span>
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept={PHOTO_INPUT_ACCEPT}
        multiple
        onChange={(event) => {
          handleNewFiles(event.target.files);
          event.target.value = "";
        }}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      {uploadError && (
        <p id="booking-photos-error" className="field-error">
          {uploadError}
        </p>
      )}

      {/* Thumbnails: one per added photo, with a remove button */}
      {photos.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {photos.map((photo, photoIndex) => (
            <div key={photo.id} className="relative">
              <Image src={photo.previewUrl} alt={`Photo ${photoIndex + 1}`} width={80} height={80} unoptimized className="upload-thumb h-20 w-20 object-cover" />
              <button
                type="button"
                onClick={() => handleRemovePhoto(photo.id)}
                aria-label={`Remove photo ${photoIndex + 1}`}
                className="clay-round-button absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
