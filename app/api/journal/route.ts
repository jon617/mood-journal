import { analyze } from "@/utils/ai";
import { getUserByClerkID } from "@/utils/auth"
import { prisma } from "@/utils/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const POST = async () => {
  const user = await getUserByClerkID();
  const entry = await prisma.journalEntry.create({
    data: {
      userId: user.id,
      // or another way to do this:
      // user: {
      //   connect: {
      //     id: user.id,
      //   }
      // }
      content: "My day was great!",
    }
  });

  // await analyze(`Today was an eh, ok day I guess.  I found a new coffee shop that was cool but then I got a flat tire. :)`)

  const analysis = await analyze( entry.content );
  await prisma.analysis.create({
    data: {
      userId: user.id,
      entryId: entry.id,
      ...analysis,
    }
  });

  revalidatePath("/journal");

  return NextResponse.json({ data: entry });
}