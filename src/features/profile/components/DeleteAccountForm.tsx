"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useAuthStore } from "@/stores/auth.store";
import { useUiStore } from "@/stores/ui.store";
import { ApiError } from "@/types/api";
import { authApi } from "../../auth/api";

const CONFIRM_PHRASE = "DELETE";

export function DeleteAccountForm() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const showToast = useUiStore((s) => s.showToast);
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const close = () => {
    if (isDeleting) return;
    setIsOpen(false);
    setConfirmText("");
  };

  const confirmDelete = async () => {
    if (confirmText !== CONFIRM_PHRASE || isDeleting) return;
    setIsDeleting(true);
    try {
      await authApi.deleteAccount();
      logout();
      showToast("Your account has been deleted", "success");
      router.replace("/login");
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Couldn't delete your account.",
        "error",
      );
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <p className="mb-4 text-body-sm text-neutral-500">
        Permanently delete your account, posts, and comments. This can&apos;t
        be undone.
      </p>
      <Button variant="danger" size="sm" onClick={() => setIsOpen(true)}>
        Delete account
      </Button>

      <Modal isOpen={isOpen} onClose={close} title="Delete your account?">
        <p className="text-body-sm text-neutral-600">
          This permanently deletes your account, posts, and comments. There&apos;s
          no way to undo this. Type{" "}
          <span className="font-semibold text-ink">{CONFIRM_PHRASE}</span> to
          confirm.
        </p>
        <Input
          className="mt-4"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={CONFIRM_PHRASE}
          disabled={isDeleting}
          autoFocus
        />
        <div className="mt-5 flex justify-end gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={close}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={confirmDelete}
            isLoading={isDeleting}
            disabled={confirmText !== CONFIRM_PHRASE}
          >
            Delete permanently
          </Button>
        </div>
      </Modal>
    </div>
  );
}
