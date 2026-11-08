"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { PHOTO_INPUT_ACCEPT, checkPhoto, readAsPreview } from "@/lib/photo-rules";

// Chat composer: photo attach button, message input and send button. Enter sends.
// One photo per message (same type and size rules as the booking form). onSend(text, photo) gets the message.
export default function ChatComposer({ onSend }) {
  const fileInputRef = useRef(null);
  const [messageText, setMessageText] = useState("");
  const [attachedPhoto, setAttachedPhoto] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const canSend = messageText.trim() !== "" || attachedPhoto !== null;

  async function handlePhotoChoice(event) {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;

    const errorMessage = checkPhoto(file);
    setPhotoError(errorMessage);
    if (errorMessage) return;
    setAttachedPhoto(await readAsPreview(file));
  }

  function handleMessageSubmit(event) {
    event.preventDefault();
    if (!canSend) return;
    onSend(messageText.trim(), attachedPhoto);
    setMessageText("");
    setAttachedPhoto(null);
    setPhotoError("");
  }

  return (
    <form onSubmit={handleMessageSubmit} className="chat-composer flex flex-col gap-2 px-4 py-3">
      {/* Attached photo: small preview with a remove button */}
      {attachedPhoto && (
        <div className="relative self-start">
          <Image src={attachedPhoto.previewUrl} alt="Photo to send" width={64} height={64} unoptimized className="upload-thumb h-16 w-16 object-cover" />
          <button
            type="button"
            onClick={() => setAttachedPhoto(null)}
            aria-label="Remove attached photo"
            className="clay-round-button absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      )}

      {photoError && (
        <p id="chat-photo-error" className="field-error">
          {photoError}
        </p>
      )}

      {/* Input row: attach, message, send */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          aria-label="Attach a photo"
          aria-describedby={photoError ? "chat-photo-error" : undefined}
          className="clay-round-button flex h-10 w-10 shrink-0 items-center justify-center"
        >
          {/* Camera icon */}
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
            <circle cx="12" cy="13" r="3.5" />
          </svg>
        </button>
        <input ref={fileInputRef} type="file" accept={PHOTO_INPUT_ACCEPT} onChange={handlePhotoChoice} className="sr-only" tabIndex={-1} aria-hidden="true" />

        <label htmlFor="chat-message-input" className="sr-only">
          Message
        </label>
        <input
          id="chat-message-input"
          type="text"
          autoComplete="off"
          placeholder="Type your message…"
          value={messageText}
          onChange={(event) => setMessageText(event.target.value)}
          className="clay-input min-w-0 flex-1 px-4 py-2.5"
        />

        <button type="submit" disabled={!canSend} aria-label="Send message" className="clay-send-button flex h-10 w-10 shrink-0 items-center justify-center">
          {/* Send icon: paper plane */}
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 3L10 14M21 3l-7 18-4-7-7-4z" />
          </svg>
        </button>
      </div>
    </form>
  );
}
