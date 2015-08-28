
(function (myNameSpace) {
    'use strict';

    window[myNameSpace] = {

        /**
         *  get unique id
         */
        getUniqueId: function(prefix) {
            let s4 = function() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            if ( !prefix ) {
                return s4() + s4() + s4() + s4();
            }
            return prefix + s4() + s4() + s4() + s4();
        },

        /**
         *  each
         *      - 可以代入 object & array
         *      - 在 callback 中使用 "return false" 將離開整個迴圈
         *
         */
        each: function( obj, callback )
        {
            let isArray = false;
            if ( Object.prototype.toString.call( obj ) === '[object Array]' ) {
                isArray = true;
            }
            else if ( Object.prototype.toString.call( obj ) !== '[object Object]' ) {
                return;
            }

            let value,
                i = 0,
                length = obj.length;

            if ( isArray ) {
                for ( ; i < length; i++ ) {
                    value = callback.call( obj[ i ], i, obj[ i ] );
                    if ( value === false ) {
                        break;
                    }
                }
            } else {
                for ( i in obj ) {
                    value = callback.call( obj[ i ], i, obj[ i ] );
                    if ( value === false ) {
                        break;
                    }
                }
            }
            return obj;
        },

    };

})('utils');
