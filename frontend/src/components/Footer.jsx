export default function Footer() {
  return (
    <footer className="bg-white/80 border-t border-slate-200 py-4 mt-auto backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
        <p>🍽️ <span className="font-semibold">Hungrix</span> &copy; {new Date().getFullYear()}</p>
        <p className="text-xs mt-1 text-slate-400">Where Dining Meets Prediction</p>
      </div>
    </footer>
  );
}
