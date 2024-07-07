import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function DoSomeThing(req) {
    const { email, referral_code } = req.body;
    let id;
    if (referral_code) {
        const user = await prisma.user.findUnique({ where: { MyReferralCode: referral_code } });
        if (user) id = user.id;
    } else {
        const existingreferral = await prisma.referral.findUnique({ where: { email } });
        if (existingreferral) id = existingreferral.referrerId;
    }

    // Do Tasks like give commission to the referrer or give discount to the new user

}

export default DoSomeThing;