import React, { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isBefore,
  format,
  parseISO,
  isWeekend,
  isToday,
} from "date-fns";

type Props = {
  onDateSelect: (date: Date) => void;
};

const Calendar: React.FC<Props> = ({ onDateSelect }) => {
  // Fixed month: March 2026
  const year = 2026;
  const monthIndex = 2; // March (0-based)

  const monthStart = startOfMonth(new Date(year, monthIndex));
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const today = new Date();

  const [selected, setSelected] = useState<Date | null>(null);

  const rows: Date[][] = [];
  let day = startDate;
  let week: Date[] = [];

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      week.push(day);
      day = addDays(day, 1);
    }
    rows.push(week);
    week = [];
  }

  const handleSelect = (d: Date) => {
    // disabled if weekend or before today or not in month
    if (isWeekend(d)) return;
    if (isBefore(d, today) && !isToday(d)) return;
    if (!isSameMonth(d, monthStart)) return;

    setSelected(d);
    onDateSelect(d);
  };

  return (
    <div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs text-zinc-500">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-7 gap-2">
        {rows.map((week, wi) => (
          <React.Fragment key={wi}>
            {week.map((d) => {
              const disabled = isWeekend(d) || (isBefore(d, today) && !isToday(d)) || !isSameMonth(d, monthStart);
              const isSelected = selected ? isSameDay(d, selected) : false;

              return (
                <button
                  key={d.toISOString()}
                  onClick={() => handleSelect(d)}
                  disabled={disabled}
                  className={`h-10 w-10 flex items-center justify-center rounded-full transition-colors ${
                    disabled ? "text-zinc-300" : "text-zinc-700 hover:bg-zinc-100"
                  } ${isSelected ? "bg-blue-900 text-white" : "bg-transparent"}`}
                >
                  <span className="text-sm">{format(d, 'd')}</span>
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
