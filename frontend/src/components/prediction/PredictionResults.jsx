const cards = [
  {
    key: 'predictedStudentsAttending',
    label: 'Predicted Attendance',
    suffix: 'students',
    accent: 'from-emerald-600 to-green-700',
  },
  {
    key: 'recommendedFoodPreparation',
    label: 'Preparation Target',
    suffix: 'meals',
    accent: 'from-teal-600 to-emerald-700',
  },
  {
    key: 'currentBookings',
    label: 'Current Bookings',
    suffix: 'bookings',
    accent: 'from-orange-500 to-amber-600',
  },
  {
    key: 'totalRegisteredStudents',
    label: 'Registered Students',
    suffix: 'students',
    accent: 'from-slate-700 to-slate-900',
  },
  {
    key: 'mealType',
    label: 'Meal Type',
    suffix: '',
    accent: 'from-indigo-600 to-sky-700',
  },
  {
    key: 'menuPopularityScore',
    label: 'Menu Popularity',
    suffix: '/10',
    accent: 'from-fuchsia-600 to-violet-700',
  },
];

export default function PredictionResults({ prediction }) {
  if (!prediction) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-7 text-center text-slate-500">
        Run a prediction to see attendance and preparation recommendations here.
      </section>
    );
  }

  const sourceText = prediction.menuPopularityScoreSource === 'history_auto'
    ? 'menu score source: historical popularity'
    : 'menu score source: default baseline';

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Prediction Output Summary</h2>
        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{sourceText}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {cards.map((card) => (
          <article key={card.key} className={`rounded-2xl bg-gradient-to-br p-4 text-white shadow-md ${card.accent}`}>
            <p className="text-[11px] uppercase tracking-[0.12em] text-white/70">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold leading-tight">
              {prediction[card.key]}{card.suffix ? ` ${card.suffix}` : ''}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
