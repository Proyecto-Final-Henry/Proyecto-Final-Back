const nodemailer = require ("nodemailer")

// Configuracion
const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

// const transport = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//       user: 'startupabastoz@gmail.com', 
//       pass: 'zhesoxlpsctpjcdt',
//     },
// });

const emailRegistro = async (data) => {
    
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
const emailContact = async (data) => {
    
    //Envio de Email
    const emailContact = 'cjfernandez29@gmail.com';
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

// transport.verify().then(()=>{
//     console.log('Ready for send emailss');
// });

module.exports = { emailRegistro, emailContact }
