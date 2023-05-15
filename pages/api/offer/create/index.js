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
      to: "atlepuha@inbox.lt",
      subject: "(!) Jums pateiktas naujas remonto pasiūlymas",
      text: `Sveiki!
      Jums pateiktas naujas remonto ${req.body.repair_title} pasiūlymas! Peržiūrėkite jį ir patvirtinkite arba atmeskite.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    return res.status(201).json({ message: "Remonto pasiūlymas pateiktas!" });
  }
}
