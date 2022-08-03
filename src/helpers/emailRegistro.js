const nodemailer = require ("nodemailer")


const emailRegistro = async (data) => {
    //Configuracion
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, //"smtp.gmail.com",
        port: process.env.EMAIL_PORT,  // 465,
       // secure: true,
        auth: {
            user: process.env.EMAIL_USER, //"mauricio.corzo47@gmail.com" CREAR UNA CUENTA DE GMAIL EXCLUSIVA PARA ESTE TRABAJO SI NO LO PERMITE EL DEPLOY  
            pass: process.env.EMAIL_PASS //"sttnqwbeedfnyhfv"
        }
    })
    
    //Envio de Email
    const {email,name,token} = data
    const info = await transport.sendMail({
        from: "MUSIC APP",
        to: email,
        subject: "Comprueba tu cuenta en MUSIC APP",
        text: "Comprueba tu cuenta en MUSIC APP",
        html: `<p>Hola: ${name}, comprueba tu cuenta en MUSIC APP.</p>
        <p> Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a> </p>

        <p> Si tu no creaste esta cuenta puedes ignorar este mensaje</p>
        `
    })
    console.log("Mensaje enviado: %s", info.messageId)
}
const emailContact = async (data) => {
    
    //Envio de Email
    const emailContact = 'cjfernandez29@gmail.com'; // Email unificado nuevo
    const {email,name,message} = data
    const info = await transport.sendMail({
        from: "MUSIC APP",
        to: emailContact,
        subject: "Mensaje de contacto",
        html: `
            <b> Mensaje del formulario de Contacto </b>
            <div><b>Nombre:</b> ${name}</div>
            <div><b>Email:</b> ${email}</div>
            <div><b>Mensaje:</b> ${message}</div>
        `
    })
}

module.exports = { emailRegistro, emailContact }
