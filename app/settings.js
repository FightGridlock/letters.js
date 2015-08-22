// settings.js in /app/

module.exports = {
    devel: true,    // development boolean
    mongoURI: {
        production: "",
        development: "mongodb://writer:writer@ds060977.mongolab.com:60977/letters"
    },    // mongoDB URIs
    emailService:{
        name: "MailGun", // Does not affect operation of email service, write whatever you want here
        apiKey: "key-dcbd608a9ee026a1db30c148bca371ee",
        username: "",   // SMTP/Account User
        password: "",   // SMTP/Account Pass
        domain: "fightgridlock.anxgroup.com", // Domain to send emails from
        emailUser: "noreply",                   // the "user" in "user"@domain.com
        interval: 1 // Send emails every "interval" in minutes
    },        // Email Service Settings
    apiCredentials: {
        username: "fgl_user0001",
        password: "testpass1234"
    } // Master API Credentials required to access some API routes
};