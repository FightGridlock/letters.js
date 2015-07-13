# letters.js 0.0.1
A Letter Writing Campaign for the LRT Route in Brampton

### Technologies

- Back End
   - [NodeJS](https://nodejs.org/)
   - [ExpressJS](expressjs.com/)
   - [MongoDB](https://www.mongodb.org/)
   - [Mongoose](mongoosejs.com/)
- Front End
   - [Materialize](materializecss.com/)
   - [AngularJS](https://angularjs.org/)

## Todo List

### Front End

* Build Clickable Ward Map. Clicking on your ward should fill in your form with the following information:
    * Ward Numbers (Ward 1 => Wards 1 & 5)
    * Name of City & Regional Councillors (Ward 2 => Doug Whillans & Michael Pallesci)
    * Emails of Councillors
    * Phone Numbers of Councillors (to display on "Call Your Councillor Now!" screen)

### Back End

- Validation for API requests
   - Appropriate non-cryptic error messages & codes
   - Prevent foul play on the front end
   - Make sure only valid wards come in
   - Allow for non-brampton residents (no ward)
   - Make sure requests do not attempt to 
- Authentication (API Key)
- Email system
   - Recieve email content from front end
   - Validate
      - Has a body
      - Has associated UserID
         - UserID exists in the DB
      - Has Subject Line ("Hurontario-Mail LRT")
   - Send to both regional and city councillor in the appropriate wards
   - BCC city clerk and mayor

## In Progress


## Done List

### Back End

- User schema and non-auth API
- Basic routing ("/api", "/api/users", and "/")
