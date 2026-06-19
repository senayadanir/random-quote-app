import { useState } from "react";

//NOT USED VERY OFTEN İN NEXTJS (But may be needed for complex logic, e.g. like prefilling dropdowns with information you pull from API while user is filling the form - User select country, then you update city dropdown to only show cities in that country)

// export default function ControlledForm() {
//   const [quote, setQuote] = useState("");
//   const [author, setAuthor] = useState("");

//   return (
//     <form>
//       <label htmlFor="author">Author</label>
//       <input
//         id="author"
//         type="text"
//         placeholder="Author's name"
//         value={author}
//         onChange={(e) => {
//           setAuthor(e.target.value);
//         }}
//       ></input>
//       <label htmlFor="quote">Quote</label>
//       <textarea
//         id="quote"
//         placeholder="Type the new quote here."
//         value={author}
//         onChange={(e) => {
//           setQuote(e.target.value);
//         }}
//       ></textarea>
//     </form>
//   );
// }
