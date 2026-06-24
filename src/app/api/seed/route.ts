//INSERT seed-data.json TO MONGODB DATABASE

// import { getDb, Collections } from "@/lib/db";
// import { NextResponse } from "next/server";
// import { promises as fs } from "fs";
// import path from "path";

// interface RawQuote {
//   quote: string;
//   author: string;
//   category: string;
//   createdBy: string;
//   likedBy: string[];
//   adminApproved: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// export async function GET() {
//   try {
//     const db = await getDb();
//     const collection = db.collection(Collections.quotes);

//     // 1. Resolve path and read seed data file securely
//     const filePath = path.resolve(process.cwd(), "src/lib/seed-data.json");
//     const fileContents = await fs.readFile(filePath, "utf8");
//     const rawQuotes: RawQuote[] = JSON.parse(fileContents);

//     // 2. Map and normalize data types (convert ISO string dates to native JavaScript Dates)
//     const normalizedQuotes = rawQuotes.map((item) => ({
//       ...item,
//       createdAt: new Date(item.createdAt),
//       updatedAt: new Date(item.updatedAt),
//     }));

//     // 3. Purge existing collection to prevent duplicates
//     await collection.deleteMany({});

//     // 4. Perform bulk insertion into MongoDB
//     const result = await collection.insertMany(normalizedQuotes);

//     return NextResponse.json({
//       success: true,
//       message: `Successfully populated database with ${result.insertedCount} quotes.`,
//     });
//   } catch (error: unknown) {
//     const errorMessage =
//       error instanceof Error ? error.message : "An unexpected error occurred";

//     console.error("[SEED_ROUTE_FAILURE]:", error);

//     return NextResponse.json(
//       { error: "Failed to seed database", details: errorMessage },
//       { status: 500 },
//     );
//   }
// }
