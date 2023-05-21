import { prisma } from "@/lib/prisma";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  if (req.method === "POST") {
    const client = await prisma.user.findUnique({
      select: {
        name: true,
        surname: true,
        email_address: true,
      },
      where: {
        id: req.body.client_id,
      },
    });

    return res.status(200).send(client);
  }
}
