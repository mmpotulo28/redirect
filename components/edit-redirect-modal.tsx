"use client";

import { RedirectModal, Redirect } from "./redirect-modal";

export function EditRedirectModal({
  redirect,
  isOpen,
  onClose,
}: {
  redirect: Redirect;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <RedirectModal
      initialData={redirect}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
}
