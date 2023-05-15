import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  if (req.method === "POST") {
    await prisma.user.update({
      data: {
        password: bcrypt.hashSync(req.body.password, 10),
      },
      where: {
        id: req.body.user_id,
      },
    });

    return res
      .status(200)
      .json({ message: "Paskyros slaptažodis sėkmingai pakeistas!" });
  }
}
