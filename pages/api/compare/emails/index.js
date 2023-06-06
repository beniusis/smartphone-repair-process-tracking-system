import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  if (req.method === "POST") {
    const user = await prisma.user.findFirst({
      where: {
        email_address: req.body.email_address,
      },
    });

    if (user) {
      return res.status(302).send();
    } else {
      return res.status(404).send();
    }
  }
}
