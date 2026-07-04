"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/stores/auth.store";
import { useUiStore } from "@/stores/ui.store";
import { ApiError } from "@/types/api";
import { authApi } from "../../auth/api";

export function AvatarUploadForm() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const showToast = useUiStore((s) => s.showToast);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Object URL lives only as long as an upload is in flight - once it
  // resolves we fall back to the real user.profilePic from the store.
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await authApi.updateProfile(formData);
      setUser(res.date.updatedUser);
      showToast("Profile photo updated", "success");
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Couldn't update your photo.",
        "error",
      );
    } finally {
      setIsUploading(false);
      setPreview(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <Avatar name={user.userName} src={preview ?? user.profilePic} size="lg" />
      <div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          isLoading={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          Change photo
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />
      </div>
    </div>
  );
}
