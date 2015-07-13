//letters.js Angular App

angular.module('letterApp',[])
  .controller('letterController', function (){
    var letter = this;
    // Info to pass to server
    letter.info = {
      firstName: "Rob",
      lastName: "Singh",
      email: "rsingh@email.com",
      options: [ true, false, true ],
      address: "33 Ashmere Road",
      city: "Brampton",
      province: "ON",
      postalCode: "L7A 1W9",
      ward: 1
    }

    
  });
