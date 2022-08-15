const nodemailer = require("nodemailer")

const emailOlvidePassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    //Enviar Email
    const { email, name, token } = datos
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        from: 'music_app@tmails.net',
        to: email,
        subject: "Restablece tu Password en ReMusic",
        text: "Restablece tu Password en ReMusic",
        html: `<p>Hola ${name}, has solicitado reestablecer tu password.</p>

        <p>Sigue el siguiente enlace para reestablecer tu password:
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a> </p>

        <p> Si tu no creaste esta cuenta puedes ignorar este mensaje</p>
        
        `
    }
    await sgMail.send(msg);   
    console.log("MENSAJE ENVIADO CORRECTAMENTE");
    };

module.exports = { emailOlvidePassword }