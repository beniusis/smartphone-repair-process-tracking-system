import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const checkIfUserExists = await prisma.user.findFirst({
      where: {
        email_address: req.body.email_address,
      },
    });

    if (checkIfUserExists === null) {
      await prisma.user.create({
        data: {
          name: req.body.name,
          surname: req.body.surname,
          email_address: req.body.email_address,
          password: bcrypt.hashSync(req.body.password, 10),
          phone_number: req.body.phone_number,
          address: req.body.address,
          role: req.body.role,
        },
      });
      return res.status(201).json({
        message:
          "User account has been successfully created! You can log in now.",
      });
    } else {
      return res.status(302).json({
        message: "User with provided email already exists! Try to log in.",
      });
    }
  }
}
