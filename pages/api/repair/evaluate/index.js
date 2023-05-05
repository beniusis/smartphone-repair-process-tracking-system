import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  if (session?.role !== "client") {
    return res.status(403).json({ message: "You have no rights to do this!" });
  }

  if (req.method === "POST") {
    await prisma.repair.update({
      data: {
        rating: req.body.rating,
        review: req.body.review,
      },
      where: {
        id: req.body.repair_id,
      },
    });

    return res.status(201).json({ message: "Remontas sėkmingai įvertintas!" });
  }
}
