// settings.js in /app/

module.exports = {
    devel: false,    // development boolean
    mongoURI: {
        production: "mongodb://" + process.env.DBUSER + ":" + process.env.DBPASS + "@ds042188-a0.mongolab.com:42188,ds042188-a1.mongolab.com:42186/onebrampton?replicaSet=rs-ds042188",
        development: "mongodb://writer:writer@ds060977.mongolab.com:60977/letters"
    },    // mongoDB URIs
    emailService:{
        name: "MailGun", // Does not affect operation of email service, write whatever you want here
        apiKey: process.env.MGAPI,
        username: "",   // SMTP/Account User
        password: "",   // SMTP/Account Pass
        domain: process.env.MGDOMAIN, // Domain to send emails from
        emailUser: "noreply",                   // the "user" in "user"@domain.com
        interval: 1 // Send emails every "interval" in minutes
    },        // Email Service Settings
    apiCredentials: {
        username: process.env.APIMASTER,
        password: process.env.APIKEY
    } // Master API Credentials required to access some API routes
};