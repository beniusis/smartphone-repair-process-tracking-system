import { prisma } from "@/lib/prisma";
import { authOptions } from "../../../auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  if (session?.role !== "administrator") {
    return res.status(401).json({ message: "You have no rights to do this!" });
  }
}
