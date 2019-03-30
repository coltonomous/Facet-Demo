const notifier = require('mail-notifier');
const request = require('request');
const credentials = require('./constants/credentials');

let inbox = {
    user: credentials.emailAddress,
    password: credentials.emailPassword,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: {rejectUnauthorized: false}
};

console.log("Starting mail client...");
notifier(inbox).on('mail', (mail) => {
    let mailObject = {
        from: mail.from[0].address,
        name: mail.from[0].name,
        date: mail.receiveDate,
        subject: mail.subject ? mail.subject : 'No Subject',
        message: mail.text && mail.text.replace(/\s/g, '').length > 0 ? mail.text : 'No Message Body'
    };
    request.put('http://localhost:3000/users/vendors').form(mailObject);
    console.info("Receieved email response.");
}).start();