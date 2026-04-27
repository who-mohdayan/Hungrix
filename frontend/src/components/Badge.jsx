const variants = {
  Attended: 'bg-green-100 text-green-700',
  Upcoming: 'bg-orange-100 text-orange-700',
  Cancelled: 'bg-gray-100 text-gray-600',
  Missed: 'bg-red-100 text-red-700',
  high: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-red-100 text-red-700',
  admin: 'bg-green-100 text-green-800',
  student: 'bg-green-100 text-green-700',
};

export default function Badge({ label, variant }) {
  const cls = variants[variant] || variants[label] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}
