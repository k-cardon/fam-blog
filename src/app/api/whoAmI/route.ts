export async function GET() {
  return new Response(JSON.stringify({ message: 'Hello, World!' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// import { getServerSession } from "next-auth";
// import { NextResponse } from "next/server";

// import { authOptions } from "../auth/[...nextauth]/route";

// export async function GET() {
//   const session = await getServerSession(authOptions);

//   return NextResponse.json({ name: session?.user?.name ?? "Not Logged In" });
// }