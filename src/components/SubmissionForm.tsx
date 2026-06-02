"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Challenge, MediaType } from "@/types";
import { ALL_CHALLENGES } from "@/lib/mockData";
import { supabase } from "@/lib/supabase";
import ShareButtons from "./ShareButtons";

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50 MB

interface SubmissionFormProps {
  challenge: Challenge;
  onSubmit: (name: string, challengeId: string, newIndex: number) => void;
  formRef: React.RefObject<HTMLElement | null>;
}

type Status = "idle" | "uploading" | "loading" | "success" | "error";

export default function SubmissionForm({ challenge, onSubmit, formRef }: SubmissionFormProps) {
  const [name, setName]               = useState("");
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge>(challenge);
  const [performedAt, setPerformedAt] = useState(() => new Date().toISOString().split("T")[0]);
  const [videoFile, setVideoFile]     = useState<File | null>(null);
  const [fileError, setFileError]     = useState<string | null>(null);
  const [status, setStatus]           = useState<Status>("idle");
  const [submittedName, setSubmittedName] = useState("");
  const [submittedIdx, setSubmittedIdx]   = useState(0);
  const [submittedNum, setSubmittedNum]   = useState(0);
  const fileRef  = useRef<HTMLInputElement>(null);
  const router   = useRouter();

  async function uploadMedia(file: File): Promise<{ url: string; type: MediaType }> {
    const isVideo = file.type.startsWith("video/");
    const type: MediaType = isVideo ? "video" : "image";
    const ext = file.name.split(".").pop()?.toLowerCase() || (isVideo ? "mp4" : "jpg");
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("submissions-media")
      .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
    if (upErr) throw upErr;
    const { data } = supabase.storage.from("submissions-media").getPublicUrl(path);
    return { url: data.publicUrl, type };
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      let media_url: string | null = null;
      let media_type: MediaType | null = null;
      if (videoFile) {
        setStatus("uploading");
        const uploaded = await uploadMedia(videoFile);
        media_url = uploaded.url;
        media_type = uploaded.type;
      }
      setStatus("loading");
      const res  = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          challenge_id: selectedChallenge.id,
          performed_at: performedAt,
          media_url,
          media_type,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSubmittedName(name.trim());
      setSubmittedIdx(data.puzzle_index);
      setSubmittedNum(data.puzzle_index + 1);
      setStatus("success");
      onSubmit(name.trim(), challenge.id, data.puzzle_index);
      setName("");
      setVideoFile(null);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <section ref={formRef as React.RefObject<HTMLElement>} className="px-4 sm:px-6 py-10 max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
        className="rounded-3xl p-6 sm:p-8"
        style={{ background: "linear-gradient(135deg, #160f00 0%, #0d0800 100%)", border: "1px solid rgba(251,191,36,0.2)", boxShadow: "0 0 40px rgba(251,191,36,0.06)" }}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">הוסף את האור שלך</h2>
          <p className="text-gray-400 text-sm mt-0.5">{challenge.title}</p>
        </div>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6"
            >
              <div className="text-6xl mb-4 candle-flicker">✨</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">האור שלך נדלק!</h3>
              <p className="text-gray-400 text-sm">תודה {submittedName}, אורך #{submittedNum.toLocaleString("he-IL")} מוסיף לפאזל.</p>

              <ShareButtons puzzleNumber={submittedNum} />

              <button
                onClick={() => router.push(`/my-light?name=${encodeURIComponent(submittedName)}&idx=${submittedIdx}&num=${submittedNum}`)}
                className="mt-5 w-full font-bold py-3.5 rounded-full text-base transition-all hover:scale-105"
                style={{ background: "rgba(251,191,36,1)", color: "#000", boxShadow: "0 0 24px rgba(251,191,36,0.4)" }}
              >
                ראה את האור שלי ←
              </button>
              <button
                onClick={() => setStatus("idle")}
                className="mt-3 text-amber-400/50 hover:text-yellow-400 transition-colors text-sm"
              >
                הוסיפו עוד אחד
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">השם שלך</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="יוסי לוי"
                  required
                  className="w-full rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition-all text-base"
                  style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.15)" }}
                  onFocus={e => (e.target.style.borderColor = "rgba(251,191,36,0.5)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(251,191,36,0.15)")}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">האתגר</label>
                <select
                  value={selectedChallenge.id}
                  onChange={e => setSelectedChallenge(ALL_CHALLENGES.find(c => c.id === e.target.value) ?? challenge)}
                  className="w-full rounded-xl px-4 py-3 text-yellow-400/90 focus:outline-none transition-all text-sm appearance-none"
                  style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.2)", colorScheme: "dark" }}
                  onFocus={e => (e.target.style.borderColor = "rgba(251,191,36,0.5)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(251,191,36,0.2)")}
                >
                  {ALL_CHALLENGES.map(c => (
                    <option key={c.id} value={c.id} style={{ background: "#1a0f00", color: "#fbbf24" }}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">תאריך ביצוע</label>
                <div
                  className="w-full rounded-xl overflow-hidden"
                  style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.15)" }}
                >
                  <input
                    type="date"
                    value={performedAt}
                    onChange={e => setPerformedAt(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full bg-transparent px-4 py-3 text-white focus:outline-none text-sm block"
                    style={{ colorScheme: "dark", minWidth: 0 }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">
                  וידאו או תמונה <span className="text-gray-600">(אופציונלי)</span>
                </label>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full border border-dashed border-white/15 rounded-xl px-4 py-5 text-gray-500 hover:border-yellow-400/30 hover:text-gray-400 active:bg-white/3 transition-all text-sm flex flex-col items-center gap-2"
                >
                  {videoFile ? (
                    <span className="text-yellow-400">✓ {videoFile.name}</span>
                  ) : (
                    <>
                      <span className="text-2xl">📎</span>
                      <span>לחץ להעלאת וידאו / תמונה</span>
                    </>
                  )}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="video/*,image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    if (f && f.size > MAX_UPLOAD_BYTES) {
                      setFileError("הקובץ גדול מ-50MB. נסה קובץ קטן יותר.");
                      setVideoFile(null);
                      return;
                    }
                    setFileError(null);
                    setVideoFile(f);
                  }}
                />
                {fileError && (
                  <p className="text-red-400 text-xs mt-1.5">{fileError}</p>
                )}
              </div>

              {status === "error" && (
                <p className="text-red-400 text-sm text-center">משהו השתבש. נסה שוב.</p>
              )}

              <button
                type="submit"
                disabled={status === "loading" || status === "uploading" || !name.trim()}
                className="w-full bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 disabled:bg-yellow-400/40 text-black font-bold py-4 rounded-full text-lg transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(251,191,36,.4)] disabled:cursor-not-allowed disabled:scale-100 select-none"
              >
                {status === "loading" || status === "uploading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    {status === "uploading" ? "מעלה מדיה..." : "שולח..."}
                  </span>
                ) : (
                  "הדליקו את האור שלכם ✨"
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
