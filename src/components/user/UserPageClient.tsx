"use client";

import type { FC, FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  deleteUser,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { useAuth } from "@/providers/AuthProvider";
import { useLocalization } from "@/providers/LocalizationProvider";
import { TzarPageHeader } from "@tzardom-ui/react";

export const UserPageClient: FC = () => {
  const { user, loading } = useAuth();
  const { t } = useLocalization();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(user?.email ?? "");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <section className="flex w-full flex-col items-center justify-center py-10">
        <div className="w-full max-w-sm text-center space-y-3">
          <TzarPageHeader
            data-testid="guest"
            title="Account"
            description="You need to log in to view your account."
          />
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-secondary-soft hover:bg-accent/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Go to login
          </Link>
        </div>
      </section>
    );
  }

  const handleDeleteAccount = async () => {
    if (!user) return;

    if (!deletePassword) {
      setError("Please enter your password to confirm account deletion.");
      return;
    }

    setError(null);
    setIsDeleting(true);

    try {
      const credential = EmailAuthProvider.credential(
        user.email ?? "",
        deletePassword,
      );
      await reauthenticateWithCredential(user, credential);
      await deleteUser(user);
      setIsDeleteDialogOpen(false);
      setDeletePassword("");
      router.push("/login");
    } catch (err) {
      console.error("Delete account failed", err);
      setError("Unable to delete account. Check your password and try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChangeEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    if (!newEmail || newEmail === user.email) {
      return;
    }

    setError(null);
    setIsUpdatingEmail(true);

    try {
      await updateEmail(user, newEmail);
    } catch (err) {
      console.error("Update email failed", err);
      setError(
        "Unable to change email. You may need to log in again and try once more.",
      );
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  return (
    <section className="flex w-full flex-col items-center justify-center py-10">
      <div className="w-full max-w-sm space-y-4">
        <TzarPageHeader
          data-testid="account"
          title={t("auth.login.title")}
          description="Your account details"
        />
        <form
          onSubmit={handleChangeEmail}
          className="rounded-lg border border-border-subtle bg-background p-4 text-sm space-y-3"
        >
          <div className="space-y-1">
            <label className="block text-xs font-medium">Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(event) => setNewEmail(event.target.value)}
              className="w-full rounded-md border border-border-subtle bg-background px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted">User ID</span>
            <span className="truncate max-w-[200px] text-xs">{user.uid}</span>
          </div>
          <div className="space-y-2">
            <button
              type="submit"
              disabled={isUpdatingEmail}
              className="inline-flex w-full items-center justify-center rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-secondary-soft hover:bg-accent/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              data-testid="user-update-email"
            >
              {isUpdatingEmail ? "Updating email…" : "Change email"}
            </button>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setIsDeleteDialogOpen(true);
              }}
              className="inline-flex w-full items-center justify-center rounded-md bg-danger px-3 py-1.5 text-sm font-medium text-secondary-soft hover:bg-danger/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
              data-testid="user-delete-account"
            >
              Delete account
            </button>
          </div>
        </form>
        {error ? (
          <p className="text-xs text-danger" data-testid="user-delete-error">
            {error}
          </p>
        ) : null}
      </div>

      {isDeleteDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-lg border border-border-subtle bg-background p-4 shadow-lg">
            <h2 className="mb-2 text-sm font-semibold">Delete account</h2>
            <p className="mb-2 text-xs text-muted">
              This will permanently delete your account. This action cannot be
              undone.
            </p>
            <div className="mb-3 space-y-1">
              <label className="block text-xs font-medium">
                Confirm with your password
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(event) => setDeletePassword(event.target.value)}
                className="w-full rounded-md border border-border-subtle bg-background px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="inline-flex items-center justify-center rounded-md border border-border-subtle bg-background px-3 py-1.5 text-xs font-medium text-secondary hover:bg-main-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="inline-flex items-center justify-center rounded-md bg-danger px-3 py-1.5 text-xs font-medium text-secondary-soft hover:bg-danger/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger disabled:opacity-60"
              >
                {isDeleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};
