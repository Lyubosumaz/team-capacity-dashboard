"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  deleteUser,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { useAuth } from "@/features/auth/AuthProvider";
import {
  TzarButton,
  TzarCommonLink,
  TzarDialog,
  TzarPageHeader,
  TzarTextField,
} from "@tzardom-ui/react";

export const AccountView = () => {
  const { user, loading } = useAuth();
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
            data-testid="user-guest-header"
            title="Account"
            description="You need to log in to view your account."
          />
          <TzarCommonLink
            as={Link}
            href="/login"
            variant="primary"
            data-testid="user-guest-login-link"
          >
            Go to login
          </TzarCommonLink>
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
          data-testid="user-header"
          title="Account"
          description="Your account details"
        />
        <form
          data-testid="user-email-form"
          onSubmit={handleChangeEmail}
          className="rounded-lg border border-border-subtle bg-background p-4 text-sm space-y-3"
        >
          <TzarTextField
            data-testid="user-email"
            label="Email"
            type="email"
            value={newEmail}
            onChange={(event) => setNewEmail(event.target.value)}
          />
          <div className="space-y-2">
            <TzarButton
              data-testid="user-update-email"
              variant="soft"
              size="md"
              className="w-full"
              type="submit"
              disabled={isUpdatingEmail}
            >
              {isUpdatingEmail ? "Updating email…" : "Change email"}
            </TzarButton>
            <TzarButton
              data-testid="user-delete-account"
              variant="danger"
              size="md"
              className="w-full"
              onClick={() => {
                setError(null);
                setIsDeleteDialogOpen(true);
              }}
            >
              Delete account
            </TzarButton>
          </div>
        </form>
        {error ? (
          <p data-testid="user-error" className="text-xs text-danger">
            {error}
          </p>
        ) : null}
      </div>

      <TzarDialog
        data-testid="user-delete-dialog"
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
        }}
        title="Delete account"
        confirmLabel={isDeleting ? "Deleting…" : "Delete"}
        confirmVariant="danger"
        confirmDisabled={isDeleting}
        onConfirm={handleDeleteAccount}
      >
        <p className="mb-2 text-xs text-muted">
          This will permanently delete your account. This action cannot be
          undone.
        </p>
        <TzarTextField
          data-testid="user-delete-password"
          label="Confirm with your password"
          type="password"
          value={deletePassword}
          onChange={(event) => setDeletePassword(event.target.value)}
        />
      </TzarDialog>
    </section>
  );
};
