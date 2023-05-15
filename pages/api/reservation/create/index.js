import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import execute from "@/lib/db/db";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  if (session?.role !== "client") {
    return res.status(403).json({ message: "You have no rights to do this!" });
  }

  if (req.method === "POST") {
    await execute({
      query: "INSERT INTO reservation (date, time, fk_user) VALUES(?, ?, ?)",
      values: [req.body.date, req.body.time, req.body.fk_user],
    });

    return res.status(201).json({ message: "Remontas sėkmingai rezervuotas!" });
  }
}
