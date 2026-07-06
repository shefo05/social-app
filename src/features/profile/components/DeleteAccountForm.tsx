"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useAuthStore } from "@/stores/auth.store";
import { useUiStore } from "@/stores/ui.store";
import { getErrorMessage } from "@/lib/utils";
import { authApi } from "../../auth/api";

const CONFIRM_PHRASE = "DELETE";

export function DeleteAccountForm() {
  const t = useTranslations("profile.deleteAccount");
  const tCommon = useTranslations("common");
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
      showToast(t("deleted"), "success");
      router.replace("/login");
    } catch (err) {
      showToast(getErrorMessage(err, t("deleteError")), "error");
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <p className="mb-4 text-body-sm text-neutral-500">{t("description")}</p>
      <Button variant="danger" size="sm" onClick={() => setIsOpen(true)}>
        {t("trigger")}
      </Button>

      <Modal isOpen={isOpen} onClose={close} title={t("modalTitle")}>
        <p className="text-body-sm text-neutral-600">
          {t.rich("modalDescription", {
            phrase: (chunks) => (
              <span className="font-semibold text-ink">{chunks}</span>
            ),
          })}
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
            {tCommon("cancel")}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={confirmDelete}
            isLoading={isDeleting}
            disabled={confirmText !== CONFIRM_PHRASE}
          >
            {t("confirm")}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
