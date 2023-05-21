import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  if (req.method === "POST") {
    const user = await prisma.user.findUnique({
      where: {
        id: req.body.user_id,
      },
    });

    if (bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(200).send();
    } else {
      return res.status(404).send();
    }
  }
}
