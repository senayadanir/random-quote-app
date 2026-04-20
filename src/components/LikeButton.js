export function LikeButton({ symbol, counter, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-2 p-2 cursor-pointer border border-slate-100/50 hover:bg-slate-200 rounded-md w-fit transition-all"
    >
      <span className="text-xl text-red-500">{symbol}</span>
      <span className="text-slate-600 font-bold">{counter}</span>
    </div>
  );
}
