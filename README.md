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

### Content

_Assignee_: Harpreet Zingh

* Emails of Councillors
* Phone Numbers of Councillors (to display on "Call Your Councillor Now!" screen)

### Front End

_Assignee_: Sushil Tailor

* Build Clickable Ward Map. Clicking on your ward should fill in your form with the following information:
    * ~~Ward Numbers (Ward 1 => Wards 1 & 5)~~ **DONE**
    * ~~Name of City & Regional Councillors (Ward 2 => Doug Whillans & Michael Pallesci)~~ **DONE**
    * Ward Map Functional
* $http.get API requests to use for letter and councillor data
* $http.post Requests should feed into API
* "Thank You For Supporting the LRT" View
* Splitting Sections into Partials
* 3 Step Application: Pick Ward => Input Info => Click Send
    * Show which step user is on

### Back End

_Assignee_: Diogo Pinto

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
   - BCC city clerk, swing votes, and mayor

## In Progress


## Done List

### Front End

* Ward Numbers (Ward 1 => Wards 1 & 5) functional
* Name of City & Regional Councillors (Ward 2 => Doug Whillans & Michael Pallesci) working

### Back End

- User schema and non-auth API
- Basic routing ("/api", "/api/users", and "/")
