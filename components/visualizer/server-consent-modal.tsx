"use client";

interface ServerConsentModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ServerConsentModal({ open, onCancel, onConfirm }: ServerConsentModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/70 px-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="server-consent-title"
        className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
      >
        <h2 id="server-consent-title" className="text-xl font-bold text-text-dark">
          Process on our servers?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-text-light">
          Your device does not support fast local processing. We can process your photo on
          our secure servers instead. This means your photo will be temporarily uploaded,
          processed for floor segmentation only, and deleted immediately afterward.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className="btn-outline">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="btn-dark">
            I understand, process on server
          </button>
        </div>
      </div>
    </div>
  );
}
