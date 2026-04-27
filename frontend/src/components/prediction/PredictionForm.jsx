import LoadingSpinner from '../LoadingSpinner';

const MEAL_OPTIONS = ['Breakfast', 'Lunch', 'Dinner'];

export default function PredictionForm({
  schema,
  formData,
  menuOptions,
  loading,
  error,
  onChange,
  onToggle,
  onMenuItemChange,
  onSubmit,
  onReset,
}) {
  const renderField = (key) => {
    if (key === 'meal_type') {
      return (
        <select
          id={key}
          value={formData.meal_type}
          onChange={(event) => onChange('meal_type', event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm"
        >
          {MEAL_OPTIONS.map((option) => (
            <option key={option} value={option.toLowerCase()}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    if (key === 'day_of_week') {
      return (
        <div>
          <input
          id={key}
          type="number"
          min="0"
          max="6"
          value={Number(formData.day_of_week)}
          onChange={(event) => onChange(key, Number(event.target.value))}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm"
          />
        </div>
      );
    }

    if (key === 'menu_items') {
      return (
        <div className="space-y-2">
          <select
            id={key}
            multiple
            value={formData.menu_items}
            onChange={onMenuItemChange}
            className="h-32 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm"
          >
            {menuOptions.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          {menuOptions.length === 0 ? <p className="text-xs text-orange-600">No menu found for the selected meal today.</p> : null}
        </div>
      );
    }

    if (key === 'menu_popularity_score') {
      return (
        <div>
          <input
            id={key}
            type="number"
            min="1"
            max="10"
            value={formData[key]}
            readOnly
            className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-700"
          />
        </div>
      );
    }

    if (key === 'holiday_flag' || key === 'exam_period_flag') {
      return (
        <label className="inline-flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={Boolean(formData[key])}
            onChange={() => onToggle(key)}
            className="h-4 w-4 rounded border-slate-300 text-emerald-600"
          />
          <span className="text-sm text-slate-700">Enable</span>
        </label>
      );
    }

    return (
      <input
        id={key}
        type="number"
        min="0"
        value={formData[key]}
        onChange={(event) => onChange(key, Number(event.target.value))}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm"
      />
    );
  };

  const labels = {
    meal_type: 'Meal Type',
    day_of_week: 'Day Of Week',
    menu_popularity_score: 'Menu Popularity Score',
    holiday_flag: 'Holiday Flag',
    exam_period_flag: 'Exam Period Flag',
    total_registered_students: 'Total Registered Students',
    current_bookings: 'Current Bookings',
    last_7_day_avg_attendance: 'Last 7 Day Avg Attendance',
    menu_items: 'Menu Items',
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Forecast Input Workspace</h2>
          <p className="text-sm text-slate-500">Tune demand drivers and run the model to get attendance and preparation targets.</p>
        </div>
        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Model controls
        </span>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {schema.map((key) => (
            <div key={key} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
              <label htmlFor={key} className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                {labels[key] || key}
              </label>
              {renderField(key)}
            </div>
          ))}
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-700 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <LoadingSpinner size="sm" color="white" /> : null}
            {loading ? 'Generating prediction...' : 'Run Prediction'}
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Reset Inputs
          </button>
        </div>
      </form>
    </section>
  );
}
