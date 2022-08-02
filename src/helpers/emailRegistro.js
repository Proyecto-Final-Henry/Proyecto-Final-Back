const nodemailer = require ("nodemailer")

const emailRegistro = async (data) => {
    //Configuracion
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
    //Envio de Email
    const {email,name,token} = data
    const info = await transport.sendMail({
        from: "MUSIC APP",
        to: email,
        subject: "Comprueba tu cuenta en MUSIC APP",
        text: "Comprueba tu cuenta en MUSIC APP",
        html: `<p>Hola: ${name}, comprueba tu cuenta en APV.</p>
        <p> Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a> </p>

        <p> Si tu no creaste esta cuenta puedes ignorar este mensaje</p>
        
        `
    })
    console.log("Mensaje enviado: %s", info.messageId)
}

module.exports = { emailRegistro }