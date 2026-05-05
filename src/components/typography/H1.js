export function H1({ element, children }) {
  switch (element) {
    case "p":
      return <p className="text-4xl font-semibold ">{children}</p>;
    case "h1":
      return <h1 className="text-4xl font-semibold block ">{children}</h1>;
  }
}
