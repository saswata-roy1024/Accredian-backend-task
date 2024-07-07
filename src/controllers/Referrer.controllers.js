import { sendReferralMail } from "../config/nodemailer.config.js";
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();
import { configDotenv } from 'dotenv';
configDotenv();

async function getUserByToken(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await prisma.user.findUnique({ where: { id: decoded.id } });
}

const Refer = async (req, res) => {
    const { name, email, number } = req.body;

    try {
        const existingUser = await getUserByToken(req.cookies.token);
        if (!existingUser) return res.status(404).json({ error: 'Unkonwn User!!' });

        const existingUserReferree = await prisma.user.findUnique({ where: { email: email } });
        if (existingUserReferree) return res.status(409).json({ error: 'The Referree already has an account!' });

        const existingReferree = await prisma.referral.findUnique({ where: { email: email } });
        if (existingReferree) return res.status(409).json({ error: 'The Referree already being referred by Someone else!' });


        await prisma.referral.create({
            data: { name, email, number, referrerId: existingUser.id },
        });

        await sendReferralMail(email, name, existingUser.MyReferralCode);
        res.send('ok');
    } catch (error) {
        console.log(error)
        res.status(500).send('Something went wrong!');
    }
}



const GetReferralCode = async (req, res) => {
    const existingUser = await getUserByToken(req.cookies.token);
    if (!existingUser) return res.status(404).json({ error: 'Unkonwn User!!' });
    else res.send(existingUser.MyReferralCode);
}

export { Refer, GetReferralCode };