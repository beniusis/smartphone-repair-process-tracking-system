import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: "rokuuutas@gmail.com",
      pass: process.env.MAIL_PASSWORD,
    },
  });

  if (req.method === "POST") {
    await prisma.offer.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        cost: req.body.cost,
        status: "proposed",
        fk_repair: req.body.repair_id,
      },
    });

    let mailOptions = {
      from: "rokuuutas@gmail.com",
      to: req.body.client_email,
      subject: "(!) Jums pateiktas naujas remonto pasiūlymas",
      text: `Sveiki!
      Jums pateiktas naujas remonto ${req.body.repair_title} pasiūlymas! Peržiūrėkite jį ir patvirtinkite arba atmeskite.`,
    };

    transporter.sendMail(mailOptions);

    return res
      .status(201)
      .json({ message: "Repair offer successfully proposed!" });
  }
}
