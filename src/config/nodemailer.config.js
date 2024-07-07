import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_NODEMAILER_PASSWORD
    }
});


const sendReferralMail = async (email, name) => {

    const mailOptions = {
        from: process.env.EMAIL_ID,
        to: email,
        subject: 'Referral',
        html: `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background-color: #1A73E8;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
        }

        .content {
            padding: 20px;
            color: #333333;
        }

        .footer {
            background-color: #f4f4f4;
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #777777;
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
        }

        .btn {
            display: inline-block;
            padding: 10px 20px;
            margin: 10px 0;
            font-size: 16px;
            color: #ffffff;
            background-color: #1A73E8;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Refer a Friend</h1>
        </div>
        <div class="content">
            <p>Hi ${name},</p>
            <p>Join now and start enjoying exclusive benefits:</p>
            <a href=${process.env.ORIGIN_URL} class="btn">Join Now</a>
            <p>Thank you for considering our service.</p>
            <p>Best regards,<br>Accredian Team</p>
        </div>
        <div class="footer">
            <p>If you have any questions, feel free to contact us at [Your Contact Information].</p>
        </div>
    </div>
</body>

</html>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            reject(error);
        } else {
            console.log(`Email sent: ${info.response}`);
            resolve(info);
        }
    });

}

export { sendReferralMail };