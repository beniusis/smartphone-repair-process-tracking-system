import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // check whether the user with the exact email address already exists
    const checkIfUserExists = await prisma.user.findFirst({
      where: {
        email_address: req.body.email_address,
      },
    });

    // if it doesn't exist - create the user
    // if it does exist - send response message with the code of 400
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
      return res
        .status(201)
        .send("Paskyra sėkmingai sukurta! Galite prisijungti.");
    } else {
      return res
        .status(302)
        .send(
          "Naudotojas tokiu el. paštu jau egzistuoja! Bandykite prisijungti."
        );
    }
  }
}
