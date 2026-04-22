export function H1({ element, children }) {
  switch (element) {
    case "p":
      return (
        <p className="text-4xl font-semibold text-slate-900">{children}</p>
      );
    case "h1":
      return (
        <h1 className="text-4xl font-semibold text-slate-900 block ">
          {children}
        </h1>
      );
  }
}
