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
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        surname: true,
        email_address: true,
        phone_number: true,
        address: true,
        role: true,
      },
    });

    return res.status(200).send(users);
  } else if (req.method === "POST") {
    await prisma.user.update({
      where: {
        id: req.body.id,
      },
      data: {
        role: req.body.role,
      },
    });

    return res
      .status(200)
      .json({ message: "User role has been successfully changed!" });
  }
}
