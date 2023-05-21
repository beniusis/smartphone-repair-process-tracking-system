import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  if (req.method === "POST") {
    const users = await prisma.user.findUnique({
      select: {
        name: true,
        surname: true,
        email_address: true,
        phone_number: true,
        address: true,
      },
      where: {
        id: req.body.id,
      },
    });

    return res.status(200).send(users);
  } else if (req.method === "PUT") {
    await prisma.user.update({
      data: {
        name: req.body.name,
        surname: req.body.surname,
        email_address: req.body.email_address,
        phone_number: req.body.phone_number,
        address: req.body.address,
      },
      where: {
        id: req.body.id,
      },
    });

    return res.status(200).json({ message: "User account data updated!" });
  }
}
