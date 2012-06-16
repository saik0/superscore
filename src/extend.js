//     superscore extend.js 0.2.0
//     (c) 2012 David Souther
//     superscore is freely distributable under the MIT license.
//     For all details and documentation:
//     https://github.com/DavidSouther/superscore

(function(_, $){
"use strict";

// ### Underscore Utilities
var old_extend = _.extend,
	hasOwn = Object.prototype.hasOwnProperty;

// #### Underscore's extend doesn't do deep extension. Use jQuery's (c/v)
var extend = $ ? $.extend : function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !_.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) !== null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( _.isPlainObject(copy) || (copyIsArray = _.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && _.isArray(src) ? src : [];

					} else {
						clone = src && _.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = _.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}
	// Return the modified object
	return target;
};
var isPlainObject = $ ? $.isPlainObject : function( obj ) {
	// Must be an Object.
	// Because of IE, we also have to check the presence of the constructor property.
	// Make sure that DOM nodes and window objects don't pass through, as well
	if ( !obj || _.type(obj) !== "object" || obj.nodeType || _.isWindow( obj ) ) {
		return false;
	}

	try {
		// Not own constructor property must be Object
		if ( obj.constructor &&
			!hasOwn.call(obj, "constructor") &&
			!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}
	} catch ( e ) {
		// IE8,9 Will throw exceptions on certain host objects #9897
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.

	var key;
	for ( key in obj ) {}

	return key === undefined || hasOwn.call( obj, key );
};

var isWindow = $ ? $.isWindow : function( obj ) {
	return obj !== null && obj === obj.window;
};

_.mixin({
	_extend: old_extend,
	extend: extend,
	isPlainObject: isPlainObject,
	isWindow: isWindow
});

}.call(this, _, jQuery || null));