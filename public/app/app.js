//letters.js Angular App
'use strict';

angular.module('letterApp',[])
  .controller('letterController', [ '$scope', function (){
    var letter = this;
    // Info to pass to server
    letter.info = {
      firstName: "",
      lastName: "",
      email: "",
      options: [],
      address: "",
      city: "Brampton",
      province: "ON",
      postalCode: "L7A 1W9",
      ward: 1
    }

  }]);
