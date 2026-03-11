import React, { useMemo, useRef, useEffect, useState } from 'react';
import { format, parseISO, addMinutes, isValid } from 'date-fns';

type Props = {
  firstName?: string;
  surname?: string;
  email?: string;
  date?: Date | null;
  time?: string; // ISO
  meetLink?: string;
  onReschedule?: () => void;
};

function randomMeetCode() {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const rand = (n: number) => Array.from({ length: n }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
  return `${rand(3)}-${rand(4)}-${rand(3)}`;
}

const SuccessView: React.FC<Props> = ({ firstName, surname, email, date, time, meetLink, onReschedule }) => {
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const [copied, setCopied] = useState(false);

  const generatedLink = useMemo(() => `https://meet.google.com/${meetLink ?? randomMeetCode()}`, [meetLink]);

  const startDate = useMemo(() => {
    if (!time) return null;
    try {
      const dt = parseISO(time);
      return isValid(dt) ? dt : null;
    } catch { return null; }
  }, [time]);

  const endDate = useMemo(() => (startDate ? addMinutes(startDate, 15) : null), [startDate]);

  const gCalHref = useMemo(() => {
    if (!startDate || !endDate) return '#';
    const fmt = (d: Date) => format(d, "yyyyMMdd'T'HHmmss'Z'");
    const dates = `${fmt(startDate)}/${fmt(endDate)}`;
    const details = encodeURIComponent(`Google Meet: ${generatedLink}`);
    const text = encodeURIComponent(`Meeting with ${firstName ?? ''} ${surname ?? ''}`.trim());
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${encodeURIComponent(generatedLink)}`;
  }, [startDate, endDate, generatedLink, firstName, surname]);

  const copyLink = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Clipboard copy failed', e);
    }
  };

  // The "Self-Healing" logic to fix unclickable links
  useEffect(() => {
    if (typeof document === 'undefined' || !linkRef.current) return;
    const el = linkRef.current;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const top = document.elementFromPoint(centerX, centerY) as HTMLElement | null;

    if (top && top !== el) {
      const style = window.getComputedStyle(top);
      const topRect = top.getBoundingClientRect();
      const coversViewport = (style.position === 'fixed' || style.position === 'absolute') &&
                             topRect.width >= window.innerWidth - 2;

      if (coversViewport || top.tagName === 'CANVAS') {
        top.style.pointerEvents = 'none';
      }
    }
  }, [generatedLink]);

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-white p-4 shadow-sm border border-zinc-100">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="text-sm text-zinc-500 font-medium">Booking summary</div>
            <div className="mt-1 text-base font-bold text-zinc-900">
              {firstName || surname ? `${firstName ?? ''} ${surname ?? ''}`.trim() : 'Guest'}
            </div>
            <div className="mt-1 text-sm text-zinc-600 font-medium">
              {date ? format(date, 'EEE, MMM d, yyyy') : '—'} {startDate ? ` • ${format(startDate, 'h:mm a')}` : ''}
            </div>
            <div className="mt-2 text-sm text-zinc-500 italic">{email ?? 'No email provided'}</div>
          </div>

          <div className="text-sm border-l pl-4 border-zinc-100">
            <div className="mb-2 text-xs text-zinc-400 font-bold uppercase">Google Meet</div>
            <div className="flex flex-col gap-2">
              <a
                ref={linkRef}
                href={generatedLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ position: 'relative', zIndex: 2147483647, pointerEvents: 'auto' }}
                className="break-all text-sm font-semibold text-blue-600 underline hover:text-blue-800"
              >
                {generatedLink}
              </a>
              <button
                type="button"
                onClick={() => copyLink(generatedLink)}
                className={`text-xs px-2 py-1 rounded font-medium transition-colors ${copied ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
              >
                {copied ? '✓ Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md bg-zinc-50 p-4 border border-zinc-100">
        <h4 className="text-sm font-bold text-zinc-900">What happens next?</h4>
        <p className="mt-1 text-sm text-zinc-600 leading-relaxed">
          An invitation has been sent to your email. You can add it to your calendar or reschedule below.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <a
          href={gCalHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition shadow-sm"
        >
          Add to Google Calendar
        </a>

        <button
          onClick={() => onReschedule?.()}
          className="inline-flex items-center rounded-md border border-zinc-300 bg-white px-5 py-2.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition"
        >
          Reschedule
        </button>
      </div>
    </div>
  );
};

export default SuccessView;