export default function LoadingSpinner({ size = 'md', color = 'emerald' }) {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };
  const colors = { emerald: 'border-green-600', indigo: 'border-green-700', white: 'border-white' };
  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizes[size]} border-4 border-gray-200 ${colors[color]} rounded-full animate-spin border-t-transparent`}
      />
    </div>
  );
}
