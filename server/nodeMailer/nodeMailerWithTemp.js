var Email = require('email-templates');
var nodemailer = require('nodemailer');
var pass = require('./sensitiveData')

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: "matoebisu@gmail.com",
        pass: pass
    }
}
);

const email = new Email({
    template: '../../templates/verifyEmail',
    transport,
    message: {
        from: 'LocalLibrary@gmail.com',
        subject: 'Подтверждение учетной записи'
    },
    send: true,
    views: {
        options: {
            extension: 'ejs'
        }
    },
    preview: false
});

exports.sendVerify = function (adress, firstName, tokenUrl) {
    return email.send({
        template: '../../templates/verifyEmail',
        message: {
            to: adress
        },
        transport,
        locals: {
            firstName: firstName,
            tokenUrl: tokenUrl
        }
    })
        .then(
            result => {
                return true
            },
            error => {
                return false
            })
        .catch(console.error)
};