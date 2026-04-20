export function Button({ variant, onClick, children }) {
  let buttonStyle = "";
  switch (variant) {
    case "primary":
      buttonStyle =
        "bg-slate-400/50 hover:bg-slate-500/50 text-slate-900 hover:text-slate-900";
      break;
    case "secondary":
      buttonStyle = "bg-slate-200/50 text-slate-800";
      break;
    default:
      buttonStyle =
        "bg-slate-400/50 hover:bg-slate-500/50 text-slate-700 hover:text-slate-800 ";
      break;
  }

  return (
    <button
      className={`text-md font-semibold border border-transparent shadow-sm p-2 rounded-md ${buttonStyle}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
