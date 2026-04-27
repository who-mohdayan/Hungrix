const variants = {
  emerald: 'from-green-600 to-emerald-700',
  blue: 'from-indigo-600 to-blue-700',
  purple: 'from-fuchsia-600 to-violet-700',
  amber: 'from-orange-500 to-amber-600',
  red: 'from-rose-500 to-red-600',
  indigo: 'from-slate-700 to-slate-900',
};

const textColors = {
  emerald: 'text-emerald-50',
  blue: 'text-blue-50',
  purple: 'text-fuchsia-50',
  amber: 'text-amber-50',
  red: 'text-rose-50',
  indigo: 'text-slate-50',
};

export default function StatCard({ title, value, icon: Icon, color = 'emerald', subtitle }) {
  return (
    <article className={`relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white shadow-lg ${variants[color]}`}>
      <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 -translate-y-6 rounded-full bg-white/10" />
      <div className="flex items-start gap-4">
      {Icon && (
          <div className={`p-3 rounded-xl bg-white/15 ${textColors[color]}`}>
            <Icon size={20} />
          </div>
      )}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">{title}</p>
          <p className="mt-2 text-3xl font-semibold leading-none">{value}</p>
          {subtitle && <p className="mt-2 text-xs text-white/75">{subtitle}</p>}
        </div>
      </div>
    </article>
  );
}
