import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import execute from "@/lib/db/db";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  if (req.method === "GET") {
    const reservationHours = await prisma.reservation_hours.findMany();

    return res.status(200).send(reservationHours);
  }

  if (req.method === "POST" && session?.role === "administrator") {
    await execute({
      query:
        "UPDATE reservation_hours SET opening_time = ?, closing_time = ?, `interval` = ? WHERE id = ?",
      values: [
        req.body.opening_time,
        req.body.closing_time,
        req.body.interval,
        1,
      ],
    });

    return res
      .status(201)
      .json({ message: "Bussiness hours has been successfully updated!" });
  } else {
    return res.status(403).json({ message: "You have no rights to do this!" });
  }
}
