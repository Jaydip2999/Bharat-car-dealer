import React, { useState } from 'react';
import { CheckCircle2, CircleHelp, RotateCcw } from 'lucide-react';
import { INDIAN_CARS } from '../data/cars';

const getTodayKey = () => new Date().toISOString().slice(0, 10);

export const DailyCarQuiz: React.FC = () => {
  const todayKey = getTodayKey();
  const dayNumber = Math.floor(Date.parse(`${todayKey}T00:00:00Z`) / 86400000);
  const targetCar = INDIAN_CARS[dayNumber % INDIAN_CARS.length];
  const optionCars = [0, 1, 2, 3]
    .map((offset) => INDIAN_CARS[(dayNumber + offset * 3) % INDIAN_CARS.length])
    .sort((first, second) => first.id.localeCompare(second.id));
  const [selectedCarId, setSelectedCarId] = useState<string | null>(() => {
    try {
      return typeof window === 'undefined'
        ? null
        : window.localStorage.getItem(`bharat_wheels_daily_quiz_${todayKey}`);
    } catch {
      return null;
    }
  });

  const handleAnswer = (carId: string) => {
    if (selectedCarId) return;
    setSelectedCarId(carId);
    try {
      window.localStorage.setItem(`bharat_wheels_daily_quiz_${todayKey}`, carId);
    } catch {
    }
  };

  const isCorrect = selectedCarId === targetCar.id;

  return (
    <section aria-labelledby="daily-quiz-title" className="bg-slate-900 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-8 lg:py-12">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
            <CircleHelp className="h-3.5 w-3.5" />
            DAILY CAR CHALLENGE
          </div>
          <h2 id="daily-quiz-title" className="text-2xl font-extrabold sm:text-3xl">
            Can you name this car?
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-6 text-slate-300">
            Use today&apos;s clues to pick the right ride. A fresh challenge arrives tomorrow.
          </p>
          <dl className="mt-6 grid max-w-md grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <dt className="text-[11px] font-semibold uppercase text-slate-400">Model year</dt>
              <dd className="mt-1 text-sm font-bold">{targetCar.year}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase text-slate-400">Body type</dt>
              <dd className="mt-1 text-sm font-bold">{targetCar.bodyType}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase text-slate-400">Fuel</dt>
              <dd className="mt-1 text-sm font-bold">{targetCar.fuelType}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase text-slate-400">Transmission</dt>
              <dd className="mt-1 text-sm font-bold">{targetCar.transmission}</dd>
            </div>
          </dl>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold uppercase text-slate-400">Choose your answer</p>
          <div className="grid grid-cols-2 gap-3">
            {optionCars.map((car) => {
              const isSelected = selectedCarId === car.id;
              const isAnswer = car.id === targetCar.id;
              const optionStyle = selectedCarId
                ? isAnswer
                  ? 'border-emerald-400 bg-emerald-400/10 text-emerald-200'
                  : isSelected
                    ? 'border-rose-400 bg-rose-400/10 text-rose-200'
                    : 'border-slate-700 bg-slate-800/60 text-slate-400'
                : 'border-slate-700 bg-slate-800 hover:border-amber-400 hover:bg-slate-800/80 text-white';

              return (
                <button
                  key={car.id}
                  type="button"
                  onClick={() => handleAnswer(car.id)}
                  disabled={selectedCarId !== null}
                  className={`flex min-h-14 items-center justify-between gap-2 rounded-lg border px-3 py-3 text-left text-sm font-bold transition-colors disabled:cursor-default ${optionStyle}`}
                >
                  <span>{car.brand} {car.model}</span>
                  {selectedCarId && isAnswer && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                </button>
              );
            })}
          </div>
          <p aria-live="polite" className="mt-4 flex min-h-5 items-center gap-2 text-sm font-semibold">
            {selectedCarId ? (
              <>
                {isCorrect ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <RotateCcw className="h-4 w-4 text-amber-400" />
                )}
                <span className={isCorrect ? 'text-emerald-300' : 'text-amber-200'}>
                  {isCorrect
                    ? 'Correct! You know your cars.'
                    : `Not quite. Today\'s car is the ${targetCar.brand} ${targetCar.model}.`}
                </span>
              </>
            ) : (
              <span className="text-slate-400">One guess per day. Your answer stays on this device.</span>
            )}
          </p>
        </div>
      </div>
    </section>
  );
};