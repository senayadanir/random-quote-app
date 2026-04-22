export function Button({ variant, onClick, children, className = "" }) {
  let buttonStyle = "";
  switch (variant) {
    case "primary":
      buttonStyle =
        "bg-slate-400/50  shadow-sm hover:bg-slate-500/50 text-slate-900 hover:text-slate-900";
      break;
    case "secondary":
      buttonStyle = "bg-slate-200/50 text-slate-800 shadow-sm";
      break;
    case "icon":
      buttonStyle = "cursor-pointer hover:bg-slate-200";
      break;
    default:
      buttonStyle =
        "bg-slate-400/50 hover:bg-slate-500/50 text-slate-700 hover:text-slate-800 shadow-sm";
      break;
  }

  return (
    <button
      className={`text-md font-semibold border border-transparent p-2 transition-all rounded-md ${buttonStyle} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
