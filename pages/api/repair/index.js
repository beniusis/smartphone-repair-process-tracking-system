import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  // const session = await getServerSession(req, res, authOptions);

  // if (!session) {
  //   return res.status(401).json({ message: "You must be logged in." });
  // }

  if (req.method === "POST") {
    const repair = await prisma.repair.findUnique({
      where: {
        id: req.body.id,
      },
    });

    return res.status(200).send(repair);
  }

  if (req.method === "PUT") {
    await prisma.repair.update({
      data: {
        title: req.body.title,
        started_at: req.body.started_at,
        finished_at: req.body.finished_at,
        estimated_time: req.body.estimated_time,
        total_cost: req.body.total_cost,
        status: req.body.status,
      },
      where: {
        id: req.body.id,
      },
    });

    return res
      .status(201)
      .json({ message: "Repair data has been successfully updated!" });
  }
}
