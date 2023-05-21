import { prisma } from "@/lib/prisma";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  if (req.method === "POST") {
    await prisma.offer.update({
      data: {
        status: req.body.status,
      },
      where: {
        id: req.body.offer_id,
      },
    });

    return res
      .status(200)
      .json({ message: "Repair offer status has been successfully changed!" });
  }
}
