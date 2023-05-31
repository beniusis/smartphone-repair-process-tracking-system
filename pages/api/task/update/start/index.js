import { prisma } from "@/lib/prisma";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  if (session?.role !== "employee") {
    return res.status(403).json({ message: "You have no rights to do this!" });
  }

  if (req.method === "POST") {
    await prisma.$executeRaw`UPDATE task SET status = ${req.body.status}, started_at = ${req.body.started_at} WHERE id = ${req.body.task_id};`;
    return res
      .status(200)
      .json({ message: "Repair task successfully updated!" });
  }
}
