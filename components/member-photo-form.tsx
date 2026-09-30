"use client";
import { FormEvent, useState } from "react";
export function MemberPhotoForm({ hasPhoto }: { hasPhoto: boolean }) {
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setMessage("Uploading..."); const response = await fetch("/api/membership/photo", { method: "POST", body: new FormData(event.currentTarget) }); const data = await response.json(); if (!response.ok) return setMessage(data.error ?? "Photo upload failed."); window.location.reload(); }
  return <form className="photo-form" onSubmit={submit}><label>Membership photo<input name="photo" type="file" accept="image/jpeg,image/png,image/webp" required /></label><p>Use a clear, recent head-and-shoulders photograph. Maximum size: 3 MB.</p><button className="button" type="submit">{hasPhoto ? "Replace photo" : "Upload photo"}</button>{message && <div className="form-notice" role="status">{message}</div>}</form>;
}
