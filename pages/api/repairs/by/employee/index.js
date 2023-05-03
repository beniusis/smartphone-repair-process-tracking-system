import { prisma } from "@/lib/prisma";
import { authOptions } from "../../../auth/[...nextauth]";
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
    const repairsByEmployee = await prisma.repair.findMany({
      where: {
        fk_user_employee: req.body.employee_id,
      },
    });

    return res.status(200).send(repairsByEmployee);
  }
}
