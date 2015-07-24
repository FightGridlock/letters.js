// settings.js in /app/

module.exports = {
    devel: true,    // development boolean
    mongoURI: {
        production: "",
        development: "mongodb://writer:BramptonWriter@ds060977.mongolab.com:60977/letters"
    },    // mongoDB URIs
    emailService:{
        name: "MailGun", // Does not affect operation of email service, write whatever you want here
        apiKey: "key-dcbd608a9ee026a1db30c148bca371ee",
        username: "",
        password: "",
        domain: "fightgridlock.anxgroup.com",
        interval: 5 // Send emails every "interval" in minutes
    },        // Email Service Settings
    apiCredentials: {
        username: "fgl_user0001",
        password: "testpass1234"
    } // Master API Credentials requires to access some API routes
};