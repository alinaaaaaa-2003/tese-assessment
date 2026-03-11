import React, { useMemo, useState } from 'react';

type Props = {
  date: Date;
  onTimeSelect?: (dateTime: Date) => void;
};

const TimeSlots: React.FC<Props> = ({ date, onTimeSelect }) => {
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [timezone, setTimezone] = useState<string>('UK, Central European Time');

  // generate 15-minute slots from 09:00 to 18:00 (last slot 17:45)
  const slots = useMemo(() => {
    const list: Date[] = [];
    const startMinutes = 9 * 60; // 09:00
    const endMinutes = 18 * 60; // 18:00

    for (let m = startMinutes; m < endMinutes; m += 15) {
      const h = Math.floor(m / 60);
      const mm = m % 60;
      const dt = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, mm, 0, 0);
      list.push(dt);
    }
    return list;
  }, [date]);

  const select = (dt: Date) => {
    setSelectedTime(dt);
    onTimeSelect?.(dt);
  };

  const fmt = (d: Date) => {
    const h = d.getHours();
    const m = d.getMinutes();
    const hh = ((h + 11) % 12) + 1;
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${hh}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-zinc-600">Available times for {date.toDateString()}</div>
        <div className="flex items-center gap-2">
          <label className="whitespace-nowrap text-sm text-zinc-500">Timezone</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm"
          >
            <option>UK, Central European Time</option>
            <option>Europe/London</option>
            <option>Europe/Berlin</option>
            <option>UTC</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {slots.map((s) => {
          const isSelected = selectedTime ? s.getTime() === selectedTime.getTime() : false;
          return (
            <button
              key={s.toISOString()}
              onClick={() => select(s)}
              className={`px-3 py-2 rounded-md text-sm border transition-colors ${
                isSelected ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              {fmt(s)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlots;
