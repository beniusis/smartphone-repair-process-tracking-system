import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import execute from "@/lib/db/db";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  if (session?.role !== "employee") {
    return res.status(403).json({ message: "You have no rights to do this!" });
  }

  if (req.method === "POST") {
    await execute({
      query:
        "INSERT INTO repair (title, registered_at, total_cost, status, fk_user_client, fk_user_employee) VALUES(?, ?, ?, ?, ?, ?)",
      values: [
        req.body.title,
        req.body.registered_at,
        req.body.total_cost,
        req.body.status,
        req.body.fk_user_client,
        req.body.fk_user_employee,
      ],
    });

    return res
      .status(201)
      .json({ message: "Repair has been successfully registered!" });
  }
}
