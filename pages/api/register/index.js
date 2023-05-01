import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const body = req.body;

    // check whether the user with the exact email address already exists
    const checkIfUserExists = await prisma.user.findFirst({
      where: {
        email_address: body.email_address,
      },
    });

    // if it does exist - send a 400 response code with the message
    if (checkIfUserExists !== null) {
      return res
        .status(200)
        .send("User with that email address already exists!");
    }

    // if it doesn't exists, create the user and send the 201 response code with the message
    await prisma.user.create({
      data: {
        name: body.name,
        surname: body.surname,
        email_address: body.email_address,
        password: bcrypt.hashSync(body.password, 10),
        phone_number: body.phone_number,
        address: body.address,
        role: body.role,
      },
    });
    return res.status(201).send("User successfully created!");
  }
}
