import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  if (req.method === "POST") {
    const reservationTimes = await prisma.reservation.findMany({
      where: {
        date: req.body.date,
      },
    });

    return res.status(200).send(reservationTimes);
  }
}
