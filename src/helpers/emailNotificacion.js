const sgMail = require("@sendgrid/mail")

const emailNoti =  async (data) => {
    const {email,name} = data 
     sgMail.setApiKey(process.env.SENDGRID_API_KEY); // process.env.SENDGRID_API_KEY
     const msg = {
     to: email,
     from: 'music_app@tmails.net',
     subject: 'Notificación ReMusic',
     text: 'Te han dado me gusta en tu reseña',
     html: `<p>Hola ${name}, te han dado me gusta en tu cuenta en ReMusic.</p>
             <p> Si tu no creaste esta cuenta puedes ignorar este mensaje</p>
          `
 };
     await sgMail.send(msg);   
     console.log("MENSAJE ENVIADO CORRECTAMENTE");
 };

 module.exports = { emailNoti }
