// Helpers

function asyncForEach(array, fn, callback) {
    // Convert a NodeList into an array
    if (typeof array.slice === 'undefined') {
        var a = [];
        for (var i = 0, l = array.length; i < l; i++) {
            a.push(array[i]);
        }
        array = a;
    }

    array    = array.slice(0);
    callback = callback || function() {};

    function nextItem() {
        if (array.length > 0) {
            processNextItem();
        } else {
            callback();
        }
    }

    function processNextItem() {
        var item = array.pop();
        fn(item, nextItem);
    }

    nextItem();
};

//
// Array forEach implementation
//
(function(window) {
    // Production steps of ECMA-262, Edition 5, 15.4.4.18
    if ( !Array.prototype.forEach ) {

      Array.prototype.forEach = function( callbackfn, thisArg ) {

        var T,
          O = Object(this),
          len = O.length >>> 0,
          k = 0;

        // If no callback function or if callback is not a callable function
        if ( !callbackfn || !callbackfn.call ) {
          throw new TypeError();
        }

        // If the optional thisArg context param was provided,
        // Set as this context 
        if ( thisArg ) {
          T = thisArg;
        }

        while( k < len ) {

          // Store property key string object reference
          var Pk = String( k ),
            // Determine if property key is present in this object context
            kPresent = O.hasOwnProperty( Pk ),
            kValue;

          if ( kPresent ) {
            // Dereference and store the value of this Property key
            kValue = O[ Pk ];

            // Invoke the callback function with call, passing arguments:
            // context, property value, property key, thisArg object context
            callbackfn.call( T, kValue, k, O );
          }

          k++;
        }
      };
    }
})(window);
