import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { sendEmail } from "@/helpers/sendMail";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  if (session?.role !== "employee") {
    return res.status(403).json({ message: "You have no rights to do this!" });
  }

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

    const message = `<td align="left" class="esd-block-text">
    <p style="font-family: arial, 'helvetica neue', helvetica, sans-serif; font-size: 30px;">Sveiki,&nbsp;<strong>${req.body.client_name}</strong>!</p>
    <p style="font-family: arial, 'helvetica neue', helvetica, sans-serif; font-size: 20px;">Jums pateiktas naujas remonto&nbsp;<em><strong>${req.body.repair_title}</strong></em>&nbsp;pasiūlymas - <strong>${req.body.title}</strong>! Peržiūrėkite informaciją apie pasiūlymą ir patvirtinkite arba atmeskite.</p>
    </td>`;

    await sendEmail({
      to: req.body.client_email,
      subject: "(!) Naujas remonto pasiūlymas",
      text: message,
    });

    return res
      .status(201)
      .json({ message: "Repair offer successfully proposed!" });
  }
}
