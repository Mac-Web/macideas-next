import { cookies } from "next/headers";
import { prisma } from "./prisma";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore
    .get(
      `${process.env.NODE_ENV === "development" ? "" : "__Secure-"}better-auth.session_token`,
    )
    ?.value.split(".")[0];
  if (!token) return null;

  const existingSession = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!existingSession || existingSession.expiresAt < new Date()) {
    return null;
  }

  return { session: existingSession, user: existingSession.user };
}
