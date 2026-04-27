import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';

const PIE_COLORS = ['#d67a2e', '#2f6f46', '#7e8b80'];

const trendLabelFormatter = (value) => {
  if (!value) return value;
  return value.slice(5);
};

export default function PredictionCharts({ comparisonData, trendData, distributionData }) {
  return (
    <section className="grid grid-cols-1 gap-5 xl:grid-cols-6">
      <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
        <h3 className="mb-1 text-base font-semibold text-slate-900">Forecast vs Current</h3>
        <p className="mb-3 text-xs text-slate-500">Instant comparison between model output and current live load.</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ececec" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#2f6f46" />
          </BarChart>
        </ResponsiveContainer>
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-4">
        <h3 className="mb-1 text-base font-semibold text-slate-900">14-Day Attendance Pattern</h3>
        <p className="mb-3 text-xs text-slate-500">Historical meal attendance trajectory used as forecast context.</p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ececec" />
            <XAxis dataKey="date" tickFormatter={trendLabelFormatter} tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Breakfast" stroke="#d67a2e" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Lunch" stroke="#2f6f46" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Dinner" stroke="#6c7a70" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-6">
        <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-2">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Meal Booking Distribution</h3>
            <p className="mt-1 text-sm text-slate-500">
              Share of bookings by meal type from recent records. Use this to gauge which slot drives demand pressure.
            </p>
            <div className="mt-4 space-y-2">
              {distributionData.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2">
                  <span className="text-sm font-medium text-slate-700">{item.name}</span>
                  <span className="text-sm font-semibold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={distributionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </article>
    </section>
  );
}
