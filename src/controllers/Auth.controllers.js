import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import DoSomeThing from '../subTasks/doSubTask.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { configDotenv } from 'dotenv';
configDotenv();

const SignUp = async (req, res) => {
    const { name, email, number, password } = req.body;

    async function generateUniqueReferralCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code;
        let isUnique = false;

        while (!isUnique) {
            code = '';
            for (let i = 0; i < 6; i++) {
                code += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            const existingCode = await prisma.user.findUnique({ where: { MyReferralCode: code } });
            if (!existingCode) {
                isUnique = true;
            }
        }
        return code;
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const MyReferralCode = await generateUniqueReferralCode();

        const user = await prisma.user.create({
            data: { name, email, number, password: hashedPassword, MyReferralCode },
        });

        // Do something
        DoSomeThing(req);

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).json({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const SignIn = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid email or password" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).json({ message: "Signed in successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { SignUp, SignIn };
