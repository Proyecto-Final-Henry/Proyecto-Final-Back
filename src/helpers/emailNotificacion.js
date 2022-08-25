const sgMail = require("@sendgrid/mail")


const emailNoti =  async (data) => {
    const {email,name} = data 
     sgMail.setApiKey(process.env.SENDGRID_API_KEY); // process.env.SENDGRID_API_KEY
     const msg = {
     to: email,
     from: 'music_app@tmails.net',
     subject: 'Comprueba tu cuenta en ReMusic',
     text: 'Comprueba tu cuenta en ReMusic',
     html: `<p>Hola ${name}, te han dado like en tu cuenta en ReMusic.</p>
             <p> Si tu no creaste esta cuenta puedes ignorar este mensaje</p>
          `
 };
     await sgMail.send(msg);   
     console.log("MENSAJE ENVIADO CORRECTAMENTE");
 };

 module.exports = { emailNoti }
