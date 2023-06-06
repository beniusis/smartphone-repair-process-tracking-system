import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { token } = req.query;
    const { newPassword } = req.body;

    if (token) {
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
      req.user = decoded;
    }

    const user = await prisma.user.findFirst({
      where: {
        id: req.user.id,
      },
    });

    if (user) {
      await prisma.user.update({
        data: {
          password: bcrypt.hashSync(newPassword, 10),
          reset_token: null,
        },
        where: {
          id: user.id,
        },
      });
      return res.status(200).json({
        message: `Password for ${user.email_address} was changed successfully!`,
      });
    }
  }
}
