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

* Google Maps Integration:
    1. Create Ward Maps on Google Maps
    2. Enter Address or Postal Code Data
    3. Google Maps Checks if address falls into drawn out ward
    4. Spits back "true" if address falls into ward.
* "Thank You For Supporting the LRT" View
* 3 Step Application: Pick Ward => Input Info => Click Send
    * Show which step user is on

### Back End

_Assignee_: Diogo Pinto

- Validation for API requests __(Backburner until post-beta)__
   - Appropriate non-cryptic error messages & codes
   - Prevent foul play on the front end
   - Make sure only valid wards come in
   - Allow for non-brampton residents (no ward)
   - Make sure requests do not attempt to
- Authentication (API Key) __(Backburner until post-beta)__
- Email system
   - ~~Recieve email content from front end~~ **DONE**
   - Validate
      - Has a body
      - Has associated UserID
         - UserID exists in the DB
      - ~~Has Subject Line ("Hurontario-Mail LRT")~~ **DONE**
   - Validate
   - ~~Send to both regional and city councillor in the appropriate wards~~ **DONE**
   - ~~BCC city clerk, swing votes, and mayor~~ **DONE**

## In Progress

- Authentication (API Key) __(Backburner until post-beta)__

## Done List

### Front End

* Ward Numbers (Ward 1 => Wards 1 & 5) functional
* Name of City & Regional Councillors (Ward 2 => Doug Whillans & Michael Pallesci) working
* $http.get API requests to use for letter and councillor data
* $http.post Requests should feed into API
* Splitting Sections into Partials

### Back End

- User schema and non-auth API
- Basic routing ("/api", "/api/users", and "/")
- Email service that checks for unsent emails and sends them
- API Security:
   - "/api/send/:email_id" **PUT, DELETE**   route requires admin login to use
   - "/api/wards/:ward_id" **PUT, DELETE**   route requires admin login to use
   - "/api/wards/"         **POST**          route requires admin login to use
   - "/api/reps/:rep_id"   **PUT, DELETE**   route requires admin login to use
   - "/api/reps/"          **POST**          route requires admin login to use
- Created a separate settings.js file in /app/settings.js for ease of use
- Modularized middleware for secure API routes

## Trash Bin

### Front End

* ~~Build Clickable Ward Map. Clicking on your ward should fill in your form with the following information:~~ Replaced by google maps API.
    * ~~Ward Map Design~~
    * ~~Ward Map Functional~~

## API Documentation


### Users

#### Retrieving all Users
- __URL__: http://example.com/api/users
- __Method__: GET

#### Adding a User

- __URL__: http://example.com/api/users
- __Method__: POST
- Parameters:
```javascript
{
   firstName: String
   lastName: String
   email: String
   address: String
   city: { type: String, default: "Brampton" },
   province: { type: String, default: "ON" },
   postalCode: String,
   wardId: String
}
```

#### Retrieving a User
- __URL__: http://example.com/api/users/:user_id
- __Method__: GET

#### Updating a User

- __URL__: http://example.com/api/users/:user_id
- __Method__: PUT
- Parameters:
```javascript
{
   firstName: String
   lastName: String
   email: String
   address: String
   city: { type: String, default: "Brampton" },
   province: { type: String, default: "ON" },
   postalCode: String,
   wardId: String
}
```

#### Deleting a User
- __URL__: http://example.com/api/users/:user_id
- __Method__: DELETE


### Representatives

#### Retrieving all Representatives
- __URL__: http://example.com/api/reps
- __Method__: GET

#### Adding a Representative

- __URL__: http://example.com/api/reps
- __Method__: POST
- Parameters:
```javascript
{
   firstName: String
   lastName: String
   email: String
   address: String
   city: { type: String, default: "Brampton" },
   province: { type: String, default: "ON" },
   postalCode: String,
   wardId: String,
   regionalRep: Boolean,
   cityRep: Boolean
}
```

#### Retrieving a Representative
- __URL__: http://example.com/api/rep/:rep_id
- __Method__: GET

#### Updating a Representative

- __URL__: http://example.com/api/rep/:rep_id
- __Method__: PUT
- Parameters:
```javascript
{
   firstName: String
   lastName: String
   email: String
   address: String
   city: { type: String, default: "Brampton" },
   province: { type: String, default: "ON" },
   postalCode: String,
   wardId: String,
   regionalRep: Boolean,
   cityRep: Boolean
}
```

#### Deleting a Representative
- __URL__: http://example.com/api/rep/:rep_id
- __Method__: DELETE


### Wards

#### Retrieving all Wards
- __URL__: http://example.com/api/wards
- __Method__: GET

#### Adding a Ward

- __URL__: http://example.com/api/wards
- __Method__: POST
- Parameters:
```javascript
{
   name: String,
   numbers: [String]
}
```

#### Retrieving a Ward
- __URL__: http://example.com/api/wards/:ward_id
- __Method__: GET

#### Updating a Ward

- __URL__: http://example.com/api/wards/:ward_id
- __Method__: PUT
- Parameters:
```javascript
{
   name: String,
   numbers: [String]
}
```

#### Deleting a Ward
- __URL__: http://example.com/api/wards/:ward_id
- __Method__: DELETE


### Emails

#### Retrieving all Emails
- __URL__: http://example.com/api/emails
- __Method__: GET

#### Adding an Email

- __URL__: http://example.com/api/emails
- __Method__: POST
- Parameters:
```javascript
{
   from: String,     // Email address
   to: [String],     // Array of email addresses
   bcc: [String],    // Array of email addresses
   body: String,     // Email body -> plaintext
   sent: { type: Boolean, default: false } // Backend use only
}
```

#### Retrieving an Email
- __URL__: http://example.com/api/emails/:email_id
- __Method__: GET

#### Updating an Email

- __URL__: http://example.com/api/emails/:email_id
- __Method__: PUT
- Parameters:
```javascript
{
   from: String,     // Email address
   to: [String],     // Array of email addresses
   bcc: [String],    // Array of email addresses
   body: String,     // Email body -> plaintext
   sent: { type: Boolean, default: false } // Backend use only
}
```

#### Deleting an Email
- __URL__: http://example.com/api/emails/:email_id
- __Method__: DELETE


#### Sending an Email

- __URL__: http://example.com/api/send/:email_id
- __Method__: GET

__Note: Check to make sure the email has not been sent before sending it. This can be done by retrieving the email to send and checking the returned JSON object: "sent"__
