import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  if (session?.role !== "administrator") {
    return res.status(403).json({ message: "You have no rights to do this!" });
  }

  if (req.method === "GET") {
    const employees = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        surname: true,
      },
      where: {
        role: "employee",
      },
    });

    return res.status(200).send(employees);
  }
}
