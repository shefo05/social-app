import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AvatarUploadForm } from "@/features/profile/components/AvatarUploadForm";
import { ProfileSettingsForm } from "@/features/profile/components/ProfileSettingsForm";
import { ChangePasswordForm } from "@/features/profile/components/ChangePasswordForm";
import { DeleteAccountForm } from "@/features/profile/components/DeleteAccountForm";

export const metadata: Metadata = { title: "Settings — Social" };

export default async function SettingsPage() {
  const t = await getTranslations();
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-h1 font-semibold text-ink">{t("settings.title")}</h1>
      <section className="rounded-2xl border border-neutral-200 bg-surface p-6">
        <h2 className="mb-4 text-h2 font-semibold text-ink">
          {t("settings.profilePhoto")}
        </h2>
        <AvatarUploadForm />
      </section>
      <section className="rounded-2xl border border-neutral-200 bg-surface p-6">
        <h2 className="mb-4 text-h2 font-semibold text-ink">
          {t("settings.profileDetails")}
        </h2>
        <ProfileSettingsForm />
      </section>
      <section className="rounded-2xl border border-neutral-200 bg-surface p-6">
        <h2 className="mb-4 text-h2 font-semibold text-ink">
          {t("settings.password")}
        </h2>
        <ChangePasswordForm />
      </section>
      <section className="rounded-2xl border border-danger-bg bg-danger-bg/20 p-6">
        <h2 className="mb-4 text-h2 font-semibold text-danger">
          {t("profile.deleteAccount.sectionTitle")}
        </h2>
        <DeleteAccountForm />
      </section>
    </div>
  );
}
