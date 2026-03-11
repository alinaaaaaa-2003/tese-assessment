import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import confetti from 'canvas-confetti';
// helper to ensure a top-layer canvas exists and is pointer-events:none
function getOrCreateConfettiCanvas() {
  if (typeof document === 'undefined') return null;
  let existing = document.getElementById('confetti-canvas') as HTMLCanvasElement | null;
  if (existing) return existing;

  const canvas = document.createElement('canvas');
  canvas.id = 'confetti-canvas';
  // mark that we created and manage this canvas so we can safely remove it later
  canvas.dataset.confettiManaged = 'true';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);
  return canvas;
}

type Props = {
  selectedDate: Date | null;
  selectedTime: string; // ISO string
  onConfirm?: (payload: { firstName: string; surname: string; email: string; date: Date | null; time: string }) => void;
};

const BookingForm: React.FC<Props> = ({ selectedDate, selectedTime, onConfirm }) => {
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const formatDate = () => {
    if (!selectedDate) return 'No date selected';
    try {
      return format(selectedDate, 'EEE, MMM d, yyyy');
    } catch {
      return selectedDate.toDateString();
    }
  };

  const formatTime = () => {
    if (!selectedTime) return 'No time selected';
    try {
      const dt = parseISO(selectedTime);
      return format(dt, 'h:mm a');
    } catch {
      return selectedTime;
    }
  };

  const validateEmail = (e: string) => /\S+@\S+\.\S+/.test(e);

  const handleSubmit = async (ev?: React.FormEvent) => {
    ev?.preventDefault();
    setError('');

    if (!firstName.trim() || !surname.trim() || !email.trim()) {
      setError('Please complete all fields.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    setIsSubmitting(true);
    // simulate network
    await new Promise((r) => setTimeout(r, 700));
    setIsSubmitting(false);
    setIsSuccess(true);
    // fire a visible confetti burst on a top-layer canvas that doesn't capture pointer events
    try {
      const canvas = getOrCreateConfettiCanvas();
      if (canvas) {
        const myConfetti = confetti.create(canvas, { resize: true });
        myConfetti({ particleCount: 120, spread: 70, origin: { y: 0.35 } });

        // If we created and manage the canvas, remove it after 5s so it never interferes later
        try {
          if (canvas.dataset.confettiManaged === 'true') {
            setTimeout(() => {
              const c = document.getElementById('confetti-canvas');
              if (c && (c as HTMLCanvasElement).dataset.confettiManaged === 'true') {
                c.remove();
              }
            }, 5000);
          }
        } catch (e) {
          // ignore errors in cleanup
        }
      } else {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.4 } });
      }
    } catch (e) {
      // ignore if confetti fails in non-browser environments
    }

    onConfirm?.({ firstName: firstName.trim(), surname: surname.trim(), email: email.trim(), date: selectedDate, time: selectedTime });
  };

  if (isSuccess) {
    return (
      <div className="rounded-md border border-green-100 bg-green-50 p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h4 className="text-lg font-semibold text-green-800">Success</h4>
  <p className="mt-1 text-sm text-green-700">Your meeting is confirmed.</p>
  <p className="mt-2 text-sm text-green-700">A calendar invitation has been sent to your email.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-md bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-zinc-500">Selected</div>
            <div className="mt-1 text-base font-medium text-zinc-900">{formatDate()} — {formatTime()}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">First Name</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm bg-white"
            aria-label="First Name"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Surname</label>
          <input
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm bg-white"
            aria-label="Surname"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm bg-white"
          aria-label="Email"
          type="email"
        />
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 disabled:opacity-50"
        >
          {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
