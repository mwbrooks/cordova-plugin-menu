//
// Helper Function
// ===============
// -

(function(window) {

    //
    // Asynchronous forEach
    // --------------------
    // Iterate over an array, firing the callback function for each element.
    // The callback function accepts two parameters: the element and a callback.
    // After iterating over all of the elemnets, the success callback is fired.
    //
    // asyncForEach(
    //   [1,2,3,4],
    //   function(item, callback) {
    //     console.log('This item is: ' + item);
    //     callback();
    //   },
    //   function() {
    //     console.log('Done iterating through items.');
    //   }
    // );
    //
    window.asyncForEach = function(array, fn, callback) {
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
            var item = array.shift();
            fn(item, nextItem);
        }

        nextItem();
    };

})(window);
