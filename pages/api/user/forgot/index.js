import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/helpers/sendMail";
import absoluteUrl from "next-absolute-url";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { origin } = absoluteUrl(req);
    const { email } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        email_address: email,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ error: "User with the provided email address was not found." });
    }

    const token = jwt.sign({ id: user.id }, process.env.NEXTAUTH_SECRET, {
      expiresIn: "1h",
    });

    await prisma.user.update({
      data: {
        reset_token: token,
      },
      where: {
        id: user.id,
      },
    });

    const link = `${origin}/reset-password/${token}`;
    const message = `<p style="font-family: arial, 'helvetica neue', helvetica, sans-serif; font-size: 20px;">Norėdami atkurti slaptažodį spauskite žemiau pateiktą nuorodą arbą mygtuką. Jeigu nuoroda neveikia - nukopijuokite ir įklijuokite į naršyklės paieškos lauką.</p>
    <p style="font-family: arial, 'helvetica neue', helvetica, sans-serif; font-size: 20px;"><br></p><a href="${link}">${link}</a>`;

    await sendEmail({
      to: user.email_address,
      subject: "Slaptažodžio atkūrimas",
      text: message,
    });

    return res.status(200).json({
      message: `Email sent to ${user.email_address}, please check your email!`,
    });
  }
}
