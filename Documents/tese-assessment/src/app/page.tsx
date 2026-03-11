"use client";

import { useState } from "react";
import Calendar from './components/Calendar';
import TimeSlots from './components/TimeSlots';
import BookingForm from './components/BookingForm';
import SuccessView from './components/SuccessView';
export default function Home() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const next = () => setCurrentStep((s) => Math.min(3, s + 1));

  const stepLabel = currentStep === 1 ? "Date" : currentStep === 2 ? "Time" : "Form";

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [bookingData, setBookingData] = useState<any>(null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] font-sans">
      <div className="w-full max-w-4xl p-8">
        <div className="mx-auto rounded-2xl bg-white shadow-md ring-1 ring-black/5 overflow-hidden">
          <div className="flex">
            {/* Left sidebar */}
            <aside className="w-72 border-r border-black/5 p-6 bg-white">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900">Climatiq</h2>
                  <p className="mt-2 text-sm text-zinc-600">15 Min Meeting</p>
                </div>
                <div className="mt-4">
                  <div className="inline-flex items-center gap-2 rounded-md bg-zinc-50 px-3 py-1 text-sm text-zinc-700">
                    <svg className="h-4 w-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z"></path></svg>
                    Google Meet
                  </div>
                </div>
              </div>
            </aside>

            {/* Right content (calendar + steps) */}
            <section className="flex-1 p-6">
              {currentStep > 1 && (
                <div className="mb-3">
                  <button
                    onClick={() => {
                      if (currentStep === 2) {
                        setCurrentStep(1);
                        setSelectedDate(null);
                      } else if (currentStep === 3) {
                        setCurrentStep(2);
                        setSelectedTime('');
                      }
                    }}
                    className="text-sm text-zinc-600 hover:underline"
                    aria-label="Go back"
                  >
                    ← Back
                  </button>
                </div>
              )}
              {/* Progress indicator */}
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className={currentStep === 1 ? 'font-semibold text-zinc-900' : 'text-zinc-500'} aria-current={currentStep === 1}>
                    Date
                  </span>
                  <span className="text-zinc-300">&gt;</span>
                  <span className={currentStep === 2 ? 'font-semibold text-zinc-900' : 'text-zinc-500'} aria-current={currentStep === 2}>
                    Time
                  </span>
                  <span className="text-zinc-300">&gt;</span>
                  {!isConfirmed && (
                    <span className={currentStep === 3 ? 'font-semibold text-zinc-900' : 'text-zinc-500'} aria-current={currentStep === 3}>
                      Form
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-zinc-900">Schedule a meeting</h3>
                  {!isConfirmed && <p className="mt-1 text-sm text-zinc-600">Step: {currentStep} — {stepLabel}</p>}
                </div>
                <div className="text-sm text-zinc-500">Timezone: Local</div>
              </div>

              <div className="mt-6 relative z-10">
                {!isConfirmed ? (
                  <>
                    {currentStep === 1 && (
                      <Calendar
                        onDateSelect={(date) => {
                          setSelectedDate(date);
                          setSelectedTime('');
                          setCurrentStep(2);
                        }}
                      />
                    )}

                    {currentStep === 2 && selectedDate && (
                      <TimeSlots
                        date={selectedDate}
                        onTimeSelect={(dt) => {
                          setSelectedTime(dt.toISOString());
                          setCurrentStep(3);
                        }}
                      />
                    )}

                    {currentStep === 3 && (
                      <div className="mt-2">
                        <BookingForm
                          selectedDate={selectedDate}
                          selectedTime={selectedTime}
                          onConfirm={(payload) => {
                            setBookingData(payload);
                            setIsConfirmed(true);
                          }}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <SuccessView
                    firstName={bookingData?.firstName}
                    surname={bookingData?.surname}
                    email={bookingData?.email}
                    date={selectedDate}
                    time={selectedTime}
                    onReschedule={() => {
                      setIsConfirmed(false);
                      setBookingData(null);
                    }}
                  />
                )}
              </div>

              <div className="mt-6 flex items-center justify-end">
                {!isConfirmed && (
                  <button
                    onClick={next}
                    className="ml-auto inline-flex items-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 focus:outline-none"
                  >
                    Next
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
