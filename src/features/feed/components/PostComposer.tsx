"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { IconImage, IconX } from "@/components/ui/icons";
import { useAuthStore } from "@/stores/auth.store";
import { useFeedStore } from "@/stores/feed.store";
import { useUiStore } from "@/stores/ui.store";
import { ApiError } from "@/types/api";
import { feedApi } from "../api";

const MAX_ATTACHMENTS = 4;

export function PostComposer() {
  const t = useTranslations("feed.composer");
  const tCommon = useTranslations("common");
  const user = useAuthStore((s) => s.user);
  const prependPost = useFeedStore((s) => s.prependPost);
  const showToast = useUiStore((s) => s.showToast);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Re-derive preview object URLs whenever the file list changes, and
  // revoke the previous batch on the way out so blob URLs don't leak.
  const [previews, setPreviews] = useState<string[]>([]);
  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    // Snapshot into a plain array before resetting the input below -
    // list is a *live* FileList tied to the input, so clearing
    // fileInputRef.current.value mutates this same reference to empty,
    // and React's setState updater can run after that reset (state
    // updates aren't always synchronous), reading zero files.
    const selected = Array.from(list);
    setFiles((prev) => [...prev, ...selected].slice(0, MAX_ATTACHMENTS));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  const submit = async () => {
    const trimmed = content.trim();
    if ((!trimmed && files.length === 0) || isSubmitting) return;
    setIsSubmitting(true);
    try {
      let payload: FormData | { content?: string };
      if (files.length > 0) {
        const formData = new FormData();
        if (trimmed) formData.append("content", trimmed);
        files.forEach((f) => formData.append("attachments", f));
        payload = formData;
      } else {
        payload = { content: trimmed };
      }
      const res = await feedApi.createPost(payload);
      prependPost(res.data.createdPost);
      setContent("");
      setFiles([]);
      showToast(t("posted"), "success");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : t("postError"), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-surface p-4">
      <div className="flex gap-3">
        <Avatar name={user?.userName ?? "?"} src={user?.profilePic} size="md" />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("placeholder")}
          rows={2}
          className="flex-1 resize-none rounded-xl border border-transparent bg-neutral-50 px-3.5 py-2.5 text-body text-ink outline-none transition-colors duration-150 placeholder:text-neutral-400 focus:border-brand-300 focus:bg-surface"
        />
      </div>

      {previews.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {previews.map((src, i) => (
            <div
              key={src}
              className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeFile(i)}
                aria-label={t("removeImage")}
                className="absolute end-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
              >
                <IconX className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={files.length >= MAX_ATTACHMENTS}
          className="flex items-center gap-1.5 text-body-sm font-medium text-neutral-500 transition-colors hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <IconImage className="h-4 w-4" />
          {files.length > 0
            ? t("photoCount", { count: files.length, max: MAX_ATTACHMENTS })
            : t("addPhotos")}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <Button
          size="sm"
          onClick={submit}
          isLoading={isSubmitting}
          disabled={!content.trim() && files.length === 0}
        >
          {tCommon("post")}
        </Button>
      </div>
    </div>
  );
}
