(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.chain = {}));
}(this, (function (exports) { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, basedir, module) {
		return module = {
			path: basedir,
			exports: {},
			require: function (path, base) {
				return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
			}
		}, fn(module, module.exports), module.exports;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global_1 =
	  // eslint-disable-next-line no-undef
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func
	  (function () { return this; })() || Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var descriptors = !fails(function () {
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;

	var objectPropertyIsEnumerable = {
		f: f
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var split = ''.split;

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings



	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// `ToPrimitive` abstract operation
	// https://tc39.github.io/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var toPrimitive = function (input, PREFERRED_STRING) {
	  if (!isObject(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document$1 = global_1.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	// Thank's IE8 for his funny defineProperty
	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
	var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$1
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  } return it;
	};

	var nativeDefineProperty = Object.defineProperty;

	// `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty
	var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return nativeDefineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var objectDefineProperty = {
		f: f$2
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var setGlobal = function (key, value) {
	  try {
	    createNonEnumerableProperty(global_1, key, value);
	  } catch (error) {
	    global_1[key] = value;
	  } return value;
	};

	var SHARED = '__core-js_shared__';
	var store = global_1[SHARED] || setGlobal(SHARED, {});

	var sharedStore = store;

	var functionToString = Function.toString;

	// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
	if (typeof sharedStore.inspectSource != 'function') {
	  sharedStore.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap = global_1.WeakMap;

	var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

	var shared = createCommonjsModule(function (module) {
	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.7.0',
	  mode:  'global',
	  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
	});
	});

	var id = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys = {};

	var WeakMap$1 = global_1.WeakMap;
	var set, get, has$1;

	var enforce = function (it) {
	  return has$1(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (nativeWeakMap) {
	  var store$1 = sharedStore.state || (sharedStore.state = new WeakMap$1());
	  var wmget = store$1.get;
	  var wmhas = store$1.has;
	  var wmset = store$1.set;
	  set = function (it, metadata) {
	    metadata.facade = it;
	    wmset.call(store$1, it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return wmget.call(store$1, it) || {};
	  };
	  has$1 = function (it) {
	    return wmhas.call(store$1, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;
	  set = function (it, metadata) {
	    metadata.facade = it;
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return has(it, STATE) ? it[STATE] : {};
	  };
	  has$1 = function (it) {
	    return has(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has$1,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var redefine = createCommonjsModule(function (module) {
	var getInternalState = internalState.get;
	var enforceInternalState = internalState.enforce;
	var TEMPLATE = String(String).split('String');

	(module.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  var state;
	  if (typeof value == 'function') {
	    if (typeof key == 'string' && !has(value, 'name')) {
	      createNonEnumerableProperty(value, 'name', key);
	    }
	    state = enforceInternalState(value);
	    if (!state.source) {
	      state.source = TEMPLATE.join(typeof key == 'string' ? key : '');
	    }
	  }
	  if (O === global_1) {
	    if (simple) O[key] = value;
	    else setGlobal(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }
	  if (simple) O[key] = value;
	  else createNonEnumerableProperty(O, key, value);
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
	});
	});

	var path = global_1;

	var aFunction = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
	    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	};

	var ceil = Math.ceil;
	var floor = Math.floor;

	// `ToInteger` abstract operation
	// https://tc39.github.io/ecma262/#sec-tointeger
	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
	};

	var min = Math.min;

	// `ToLength` abstract operation
	// https://tc39.github.io/ecma262/#sec-tolength
	var toLength = function (argument) {
	  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};

	var indexOf = arrayIncludes.indexOf;


	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~indexOf(result, key) || result.push(key);
	  }
	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys = [
	  'constructor',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'toLocaleString',
	  'toString',
	  'valueOf'
	];

	var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyNames = {
		f: f$3
	};

	var f$4 = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols = {
		f: f$4
	};

	// all object keys, includes non-enumerable and symbols
	var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames.f(anObject(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = objectDefineProperty.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true
	    : value == NATIVE ? false
	    : typeof detection == 'function' ? fails(detection)
	    : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';

	var isForced_1 = isForced;

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	  if (GLOBAL) {
	    target = global_1;
	  } else if (STATIC) {
	    target = global_1[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global_1[TARGET] || {}).prototype;
	  }
	  if (target) for (key in source) {
	    sourceProperty = source[key];
	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];
	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contained in target
	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty === typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    }
	    // add a flag to not completely full polyfills
	    if (options.sham || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty(sourceProperty, 'sham', true);
	    }
	    // extend global
	    redefine(target, key, sourceProperty, options);
	  }
	};

	// `IsArray` abstract operation
	// https://tc39.github.io/ecma262/#sec-isarray
	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	// `ToObject` abstract operation
	// https://tc39.github.io/ecma262/#sec-toobject
	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
	  else object[propertyKey] = value;
	};

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  // Chrome 38 Symbol has incorrect toString conversion
	  // eslint-disable-next-line no-undef
	  return !String(Symbol());
	});

	var useSymbolAsUid = nativeSymbol
	  // eslint-disable-next-line no-undef
	  && !Symbol.sham
	  // eslint-disable-next-line no-undef
	  && typeof Symbol.iterator == 'symbol';

	var WellKnownSymbolsStore = shared('wks');
	var Symbol$1 = global_1.Symbol;
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!has(WellKnownSymbolsStore, name)) {
	    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];
	    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
	  } return WellKnownSymbolsStore[name];
	};

	var SPECIES = wellKnownSymbol('species');

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate = function (originalArray, length) {
	  var C;
	  if (isArray(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
	    else if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process$1 = global_1.process;
	var versions = process$1 && process$1.versions;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  version = match[0] + match[1];
	} else if (engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = match[1];
	  }
	}

	var engineV8Version = version && +version;

	var SPECIES$1 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES$1] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

	// We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679
	var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});

	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray(O);
	};

	var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

	// `Array.prototype.concat` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species
	_export({ target: 'Array', proto: true, forced: FORCED }, {
	  concat: function concat(arg) { // eslint-disable-line no-unused-vars
	    var O = toObject(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;
	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];
	      if (isConcatSpreadable(E)) {
	        len = toLength(E.length);
	        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty(A, n++, E);
	      }
	    }
	    A.length = n;
	    return A;
	  }
	});

	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
	  try {
	    var info = gen[key](arg);
	    var value = info.value;
	  } catch (error) {
	    reject(error);
	    return;
	  }

	  if (info.done) {
	    resolve(value);
	  } else {
	    Promise.resolve(value).then(_next, _throw);
	  }
	}

	function _asyncToGenerator(fn) {
	  return function () {
	    var self = this,
	        args = arguments;
	    return new Promise(function (resolve, reject) {
	      var gen = fn.apply(self, args);

	      function _next(value) {
	        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
	      }

	      function _throw(err) {
	        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
	      }

	      _next(undefined);
	    });
	  };
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	function _setPrototypeOf(o, p) {
	  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };

	  return _setPrototypeOf(o, p);
	}

	function _isNativeReflectConstruct() {
	  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
	  if (Reflect.construct.sham) return false;
	  if (typeof Proxy === "function") return true;

	  try {
	    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
	    return true;
	  } catch (e) {
	    return false;
	  }
	}

	function _construct(Parent, args, Class) {
	  if (_isNativeReflectConstruct()) {
	    _construct = Reflect.construct;
	  } else {
	    _construct = function _construct(Parent, args, Class) {
	      var a = [null];
	      a.push.apply(a, args);
	      var Constructor = Function.bind.apply(Parent, a);
	      var instance = new Constructor();
	      if (Class) _setPrototypeOf(instance, Class.prototype);
	      return instance;
	    };
	  }

	  return _construct.apply(null, arguments);
	}

	var runtime_1 = createCommonjsModule(function (module) {
	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	var runtime = (function (exports) {

	  var Op = Object.prototype;
	  var hasOwn = Op.hasOwnProperty;
	  var undefined$1; // More compressible than void 0.
	  var $Symbol = typeof Symbol === "function" ? Symbol : {};
	  var iteratorSymbol = $Symbol.iterator || "@@iterator";
	  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
	  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

	  function define(obj, key, value) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	    return obj[key];
	  }
	  try {
	    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
	    define({}, "");
	  } catch (err) {
	    define = function(obj, key, value) {
	      return obj[key] = value;
	    };
	  }

	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
	    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
	    var generator = Object.create(protoGenerator.prototype);
	    var context = new Context(tryLocsList || []);

	    // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.
	    generator._invoke = makeInvokeMethod(innerFn, self, context);

	    return generator;
	  }
	  exports.wrap = wrap;

	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }

	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";

	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};

	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}

	  // This is a polyfill for %IteratorPrototype% for environments that
	  // don't natively support it.
	  var IteratorPrototype = {};
	  IteratorPrototype[iteratorSymbol] = function () {
	    return this;
	  };

	  var getProto = Object.getPrototypeOf;
	  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
	  if (NativeIteratorPrototype &&
	      NativeIteratorPrototype !== Op &&
	      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
	    // This environment has a native %IteratorPrototype%; use it instead
	    // of the polyfill.
	    IteratorPrototype = NativeIteratorPrototype;
	  }

	  var Gp = GeneratorFunctionPrototype.prototype =
	    Generator.prototype = Object.create(IteratorPrototype);
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunction.displayName = define(
	    GeneratorFunctionPrototype,
	    toStringTagSymbol,
	    "GeneratorFunction"
	  );

	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function(method) {
	      define(prototype, method, function(arg) {
	        return this._invoke(method, arg);
	      });
	    });
	  }

	  exports.isGeneratorFunction = function(genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor
	      ? ctor === GeneratorFunction ||
	        // For the native GeneratorFunction constructor, the best we can
	        // do is to check its .name property.
	        (ctor.displayName || ctor.name) === "GeneratorFunction"
	      : false;
	  };

	  exports.mark = function(genFun) {
	    if (Object.setPrototypeOf) {
	      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	    } else {
	      genFun.__proto__ = GeneratorFunctionPrototype;
	      define(genFun, toStringTagSymbol, "GeneratorFunction");
	    }
	    genFun.prototype = Object.create(Gp);
	    return genFun;
	  };

	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `hasOwn.call(value, "__await")` to determine if the yielded value is
	  // meant to be awaited.
	  exports.awrap = function(arg) {
	    return { __await: arg };
	  };

	  function AsyncIterator(generator, PromiseImpl) {
	    function invoke(method, arg, resolve, reject) {
	      var record = tryCatch(generator[method], generator, arg);
	      if (record.type === "throw") {
	        reject(record.arg);
	      } else {
	        var result = record.arg;
	        var value = result.value;
	        if (value &&
	            typeof value === "object" &&
	            hasOwn.call(value, "__await")) {
	          return PromiseImpl.resolve(value.__await).then(function(value) {
	            invoke("next", value, resolve, reject);
	          }, function(err) {
	            invoke("throw", err, resolve, reject);
	          });
	        }

	        return PromiseImpl.resolve(value).then(function(unwrapped) {
	          // When a yielded Promise is resolved, its final value becomes
	          // the .value of the Promise<{value,done}> result for the
	          // current iteration.
	          result.value = unwrapped;
	          resolve(result);
	        }, function(error) {
	          // If a rejected Promise was yielded, throw the rejection back
	          // into the async generator function so it can be handled there.
	          return invoke("throw", error, resolve, reject);
	        });
	      }
	    }

	    var previousPromise;

	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return new PromiseImpl(function(resolve, reject) {
	          invoke(method, arg, resolve, reject);
	        });
	      }

	      return previousPromise =
	        // If enqueue has been called before, then we want to wait until
	        // all previous Promises have been resolved before calling invoke,
	        // so that results are always delivered in the correct order. If
	        // enqueue has not been called before, then it is important to
	        // call invoke immediately, without waiting on a callback to fire,
	        // so that the async generator function has the opportunity to do
	        // any necessary setup in a predictable way. This predictability
	        // is why the Promise constructor synchronously invokes its
	        // executor callback, and why async functions synchronously
	        // execute code before the first await. Since we implement simple
	        // async functions in terms of async generators, it is especially
	        // important to get this right, even though it requires care.
	        previousPromise ? previousPromise.then(
	          callInvokeWithMethodAndArg,
	          // Avoid propagating failures to Promises returned by later
	          // invocations of the iterator.
	          callInvokeWithMethodAndArg
	        ) : callInvokeWithMethodAndArg();
	    }

	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }

	  defineIteratorMethods(AsyncIterator.prototype);
	  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
	    return this;
	  };
	  exports.AsyncIterator = AsyncIterator;

	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
	    if (PromiseImpl === void 0) PromiseImpl = Promise;

	    var iter = new AsyncIterator(
	      wrap(innerFn, outerFn, self, tryLocsList),
	      PromiseImpl
	    );

	    return exports.isGeneratorFunction(outerFn)
	      ? iter // If outerFn is a generator, return the full iterator.
	      : iter.next().then(function(result) {
	          return result.done ? result.value : iter.next();
	        });
	  };

	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;

	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }

	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }

	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }

	      context.method = method;
	      context.arg = arg;

	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          var delegateResult = maybeInvokeDelegate(delegate, context);
	          if (delegateResult) {
	            if (delegateResult === ContinueSentinel) continue;
	            return delegateResult;
	          }
	        }

	        if (context.method === "next") {
	          // Setting context._sent for legacy support of Babel's
	          // function.sent implementation.
	          context.sent = context._sent = context.arg;

	        } else if (context.method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw context.arg;
	          }

	          context.dispatchException(context.arg);

	        } else if (context.method === "return") {
	          context.abrupt("return", context.arg);
	        }

	        state = GenStateExecuting;

	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done
	            ? GenStateCompleted
	            : GenStateSuspendedYield;

	          if (record.arg === ContinueSentinel) {
	            continue;
	          }

	          return {
	            value: record.arg,
	            done: context.done
	          };

	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(context.arg) call above.
	          context.method = "throw";
	          context.arg = record.arg;
	        }
	      }
	    };
	  }

	  // Call delegate.iterator[context.method](context.arg) and handle the
	  // result, either by returning a { value, done } result from the
	  // delegate iterator, or by modifying context.method and context.arg,
	  // setting context.delegate to null, and returning the ContinueSentinel.
	  function maybeInvokeDelegate(delegate, context) {
	    var method = delegate.iterator[context.method];
	    if (method === undefined$1) {
	      // A .throw or .return when the delegate iterator has no .throw
	      // method always terminates the yield* loop.
	      context.delegate = null;

	      if (context.method === "throw") {
	        // Note: ["return"] must be used for ES3 parsing compatibility.
	        if (delegate.iterator["return"]) {
	          // If the delegate iterator has a return method, give it a
	          // chance to clean up.
	          context.method = "return";
	          context.arg = undefined$1;
	          maybeInvokeDelegate(delegate, context);

	          if (context.method === "throw") {
	            // If maybeInvokeDelegate(context) changed context.method from
	            // "return" to "throw", let that override the TypeError below.
	            return ContinueSentinel;
	          }
	        }

	        context.method = "throw";
	        context.arg = new TypeError(
	          "The iterator does not provide a 'throw' method");
	      }

	      return ContinueSentinel;
	    }

	    var record = tryCatch(method, delegate.iterator, context.arg);

	    if (record.type === "throw") {
	      context.method = "throw";
	      context.arg = record.arg;
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    var info = record.arg;

	    if (! info) {
	      context.method = "throw";
	      context.arg = new TypeError("iterator result is not an object");
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    if (info.done) {
	      // Assign the result of the finished delegate to the temporary
	      // variable specified by delegate.resultName (see delegateYield).
	      context[delegate.resultName] = info.value;

	      // Resume execution at the desired location (see delegateYield).
	      context.next = delegate.nextLoc;

	      // If context.method was "throw" but the delegate handled the
	      // exception, let the outer generator proceed normally. If
	      // context.method was "next", forget context.arg since it has been
	      // "consumed" by the delegate iterator. If context.method was
	      // "return", allow the original .return call to continue in the
	      // outer generator.
	      if (context.method !== "return") {
	        context.method = "next";
	        context.arg = undefined$1;
	      }

	    } else {
	      // Re-yield the result returned by the delegate method.
	      return info;
	    }

	    // The delegate iterator is finished, so forget it and continue with
	    // the outer generator.
	    context.delegate = null;
	    return ContinueSentinel;
	  }

	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);

	  define(Gp, toStringTagSymbol, "Generator");

	  // A Generator should always return itself as the iterator object when the
	  // @@iterator function is called on it. Some browsers' implementations of the
	  // iterator prototype chain incorrectly implement this, causing the Generator
	  // object to not be returned from this call. This ensures that doesn't happen.
	  // See https://github.com/facebook/regenerator/issues/274 for more details.
	  Gp[iteratorSymbol] = function() {
	    return this;
	  };

	  Gp.toString = function() {
	    return "[object Generator]";
	  };

	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };

	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }

	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }

	    this.tryEntries.push(entry);
	  }

	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }

	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }

	  exports.keys = function(object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();

	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }

	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };

	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }

	      if (typeof iterable.next === "function") {
	        return iterable;
	      }

	      if (!isNaN(iterable.length)) {
	        var i = -1, next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }

	          next.value = undefined$1;
	          next.done = true;

	          return next;
	        };

	        return next.next = next;
	      }
	    }

	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  exports.values = values;

	  function doneResult() {
	    return { value: undefined$1, done: true };
	  }

	  Context.prototype = {
	    constructor: Context,

	    reset: function(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      // Resetting context._sent for legacy support of Babel's
	      // function.sent implementation.
	      this.sent = this._sent = undefined$1;
	      this.done = false;
	      this.delegate = null;

	      this.method = "next";
	      this.arg = undefined$1;

	      this.tryEntries.forEach(resetTryEntry);

	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" &&
	              hasOwn.call(this, name) &&
	              !isNaN(+name.slice(1))) {
	            this[name] = undefined$1;
	          }
	        }
	      }
	    },

	    stop: function() {
	      this.done = true;

	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }

	      return this.rval;
	    },

	    dispatchException: function(exception) {
	      if (this.done) {
	        throw exception;
	      }

	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;

	        if (caught) {
	          // If the dispatched exception was caught by a catch block,
	          // then let that catch block handle the exception normally.
	          context.method = "next";
	          context.arg = undefined$1;
	        }

	        return !! caught;
	      }

	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;

	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }

	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");

	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }

	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },

	    abrupt: function(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev &&
	            hasOwn.call(entry, "finallyLoc") &&
	            this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }

	      if (finallyEntry &&
	          (type === "break" ||
	           type === "continue") &&
	          finallyEntry.tryLoc <= arg &&
	          arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }

	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;

	      if (finallyEntry) {
	        this.method = "next";
	        this.next = finallyEntry.finallyLoc;
	        return ContinueSentinel;
	      }

	      return this.complete(record);
	    },

	    complete: function(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }

	      if (record.type === "break" ||
	          record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = this.arg = record.arg;
	        this.method = "return";
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }

	      return ContinueSentinel;
	    },

	    finish: function(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },

	    "catch": function(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }

	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },

	    delegateYield: function(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };

	      if (this.method === "next") {
	        // Deliberately forget the last sent value so that we don't
	        // accidentally pass it on to the delegate.
	        this.arg = undefined$1;
	      }

	      return ContinueSentinel;
	    }
	  };

	  // Regardless of whether this script is executing as a CommonJS module
	  // or not, return the runtime object so that we can declare the variable
	  // regeneratorRuntime in the outer scope, which allows this module to be
	  // injected easily by `bin/regenerator --include-runtime script.js`.
	  return exports;

	}(
	  // If this script is executing as a CommonJS module, use module.exports
	  // as the regeneratorRuntime namespace. Otherwise create a new empty
	  // object. Either way, the resulting object will be used to initialize
	  // the regeneratorRuntime variable at the top of this file.
	   module.exports 
	));

	try {
	  regeneratorRuntime = runtime;
	} catch (accidentalStrictMode) {
	  // This module should not be running in strict mode, so the above
	  // assignment should always work unless something is misconfigured. Just
	  // in case runtime.js accidentally runs in strict mode, we can escape
	  // strict mode using a global Function call. This could conceivably fail
	  // if a Content Security Policy forbids using Function, but in that case
	  // the proper solution is to fix the accidental strict mode problem. If
	  // you've misconfigured your bundler to force strict mode and applied a
	  // CSP to forbid Function, and you're not willing to fix either of those
	  // problems, please detail your unique predicament in a GitHub issue.
	  Function("r", "regeneratorRuntime = r")(runtime);
	}
	});

	var dist = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
		 factory(exports) ;
	}(commonjsGlobal, (function (exports) {
		var commonjsGlobal$1 = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {};

		function createCommonjsModule(fn, basedir, module) {
			return module = {
				path: basedir,
				exports: {},
				require: function (path, base) {
					return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
				}
			}, fn(module, module.exports), module.exports;
		}

		function commonjsRequire () {
			throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
		}

		var check = function (it) {
		  return it && it.Math == Math && it;
		};

		// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
		var global_1 =
		  // eslint-disable-next-line no-undef
		  check(typeof globalThis == 'object' && globalThis) ||
		  check(typeof window == 'object' && window) ||
		  check(typeof self == 'object' && self) ||
		  check(typeof commonjsGlobal$1 == 'object' && commonjsGlobal$1) ||
		  // eslint-disable-next-line no-new-func
		  (function () { return this; })() || Function('return this')();

		var fails = function (exec) {
		  try {
		    return !!exec();
		  } catch (error) {
		    return true;
		  }
		};

		// Thank's IE8 for his funny defineProperty
		var descriptors = !fails(function () {
		  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
		});

		var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
		var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

		// Nashorn ~ JDK8 bug
		var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

		// `Object.prototype.propertyIsEnumerable` method implementation
		// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
		var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
		  var descriptor = getOwnPropertyDescriptor(this, V);
		  return !!descriptor && descriptor.enumerable;
		} : nativePropertyIsEnumerable;

		var objectPropertyIsEnumerable = {
			f: f
		};

		var createPropertyDescriptor = function (bitmap, value) {
		  return {
		    enumerable: !(bitmap & 1),
		    configurable: !(bitmap & 2),
		    writable: !(bitmap & 4),
		    value: value
		  };
		};

		var toString = {}.toString;

		var classofRaw = function (it) {
		  return toString.call(it).slice(8, -1);
		};

		var split = ''.split;

		// fallback for non-array-like ES3 and non-enumerable old V8 strings
		var indexedObject = fails(function () {
		  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
		  // eslint-disable-next-line no-prototype-builtins
		  return !Object('z').propertyIsEnumerable(0);
		}) ? function (it) {
		  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
		} : Object;

		// `RequireObjectCoercible` abstract operation
		// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
		var requireObjectCoercible = function (it) {
		  if (it == undefined) throw TypeError("Can't call method on " + it);
		  return it;
		};

		// toObject with fallback for non-array-like ES3 strings



		var toIndexedObject = function (it) {
		  return indexedObject(requireObjectCoercible(it));
		};

		var isObject = function (it) {
		  return typeof it === 'object' ? it !== null : typeof it === 'function';
		};

		// `ToPrimitive` abstract operation
		// https://tc39.github.io/ecma262/#sec-toprimitive
		// instead of the ES6 spec version, we didn't implement @@toPrimitive case
		// and the second argument - flag - preferred type is a string
		var toPrimitive = function (input, PREFERRED_STRING) {
		  if (!isObject(input)) return input;
		  var fn, val;
		  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
		  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
		  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
		  throw TypeError("Can't convert object to primitive value");
		};

		var hasOwnProperty = {}.hasOwnProperty;

		var has = function (it, key) {
		  return hasOwnProperty.call(it, key);
		};

		var document$1 = global_1.document;
		// typeof document.createElement is 'object' in old IE
		var EXISTS = isObject(document$1) && isObject(document$1.createElement);

		var documentCreateElement = function (it) {
		  return EXISTS ? document$1.createElement(it) : {};
		};

		// Thank's IE8 for his funny defineProperty
		var ie8DomDefine = !descriptors && !fails(function () {
		  return Object.defineProperty(documentCreateElement('div'), 'a', {
		    get: function () { return 7; }
		  }).a != 7;
		});

		var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

		// `Object.getOwnPropertyDescriptor` method
		// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
		var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
		  O = toIndexedObject(O);
		  P = toPrimitive(P, true);
		  if (ie8DomDefine) try {
		    return nativeGetOwnPropertyDescriptor(O, P);
		  } catch (error) { /* empty */ }
		  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
		};

		var objectGetOwnPropertyDescriptor = {
			f: f$1
		};

		var anObject = function (it) {
		  if (!isObject(it)) {
		    throw TypeError(String(it) + ' is not an object');
		  } return it;
		};

		var nativeDefineProperty = Object.defineProperty;

		// `Object.defineProperty` method
		// https://tc39.github.io/ecma262/#sec-object.defineproperty
		var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
		  anObject(O);
		  P = toPrimitive(P, true);
		  anObject(Attributes);
		  if (ie8DomDefine) try {
		    return nativeDefineProperty(O, P, Attributes);
		  } catch (error) { /* empty */ }
		  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
		  if ('value' in Attributes) O[P] = Attributes.value;
		  return O;
		};

		var objectDefineProperty = {
			f: f$2
		};

		var createNonEnumerableProperty = descriptors ? function (object, key, value) {
		  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
		} : function (object, key, value) {
		  object[key] = value;
		  return object;
		};

		var setGlobal = function (key, value) {
		  try {
		    createNonEnumerableProperty(global_1, key, value);
		  } catch (error) {
		    global_1[key] = value;
		  } return value;
		};

		var SHARED = '__core-js_shared__';
		var store = global_1[SHARED] || setGlobal(SHARED, {});

		var sharedStore = store;

		var functionToString = Function.toString;

		// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
		if (typeof sharedStore.inspectSource != 'function') {
		  sharedStore.inspectSource = function (it) {
		    return functionToString.call(it);
		  };
		}

		var inspectSource = sharedStore.inspectSource;

		var WeakMap = global_1.WeakMap;

		var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

		var shared = createCommonjsModule(function (module) {
		(module.exports = function (key, value) {
		  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
		})('versions', []).push({
		  version: '3.7.0',
		  mode:  'global',
		  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
		});
		});

		var id = 0;
		var postfix = Math.random();

		var uid = function (key) {
		  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
		};

		var keys = shared('keys');

		var sharedKey = function (key) {
		  return keys[key] || (keys[key] = uid(key));
		};

		var hiddenKeys = {};

		var WeakMap$1 = global_1.WeakMap;
		var set, get, has$1;

		var enforce = function (it) {
		  return has$1(it) ? get(it) : set(it, {});
		};

		var getterFor = function (TYPE) {
		  return function (it) {
		    var state;
		    if (!isObject(it) || (state = get(it)).type !== TYPE) {
		      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
		    } return state;
		  };
		};

		if (nativeWeakMap) {
		  var store$1 = sharedStore.state || (sharedStore.state = new WeakMap$1());
		  var wmget = store$1.get;
		  var wmhas = store$1.has;
		  var wmset = store$1.set;
		  set = function (it, metadata) {
		    metadata.facade = it;
		    wmset.call(store$1, it, metadata);
		    return metadata;
		  };
		  get = function (it) {
		    return wmget.call(store$1, it) || {};
		  };
		  has$1 = function (it) {
		    return wmhas.call(store$1, it);
		  };
		} else {
		  var STATE = sharedKey('state');
		  hiddenKeys[STATE] = true;
		  set = function (it, metadata) {
		    metadata.facade = it;
		    createNonEnumerableProperty(it, STATE, metadata);
		    return metadata;
		  };
		  get = function (it) {
		    return has(it, STATE) ? it[STATE] : {};
		  };
		  has$1 = function (it) {
		    return has(it, STATE);
		  };
		}

		var internalState = {
		  set: set,
		  get: get,
		  has: has$1,
		  enforce: enforce,
		  getterFor: getterFor
		};

		var redefine = createCommonjsModule(function (module) {
		var getInternalState = internalState.get;
		var enforceInternalState = internalState.enforce;
		var TEMPLATE = String(String).split('String');

		(module.exports = function (O, key, value, options) {
		  var unsafe = options ? !!options.unsafe : false;
		  var simple = options ? !!options.enumerable : false;
		  var noTargetGet = options ? !!options.noTargetGet : false;
		  var state;
		  if (typeof value == 'function') {
		    if (typeof key == 'string' && !has(value, 'name')) {
		      createNonEnumerableProperty(value, 'name', key);
		    }
		    state = enforceInternalState(value);
		    if (!state.source) {
		      state.source = TEMPLATE.join(typeof key == 'string' ? key : '');
		    }
		  }
		  if (O === global_1) {
		    if (simple) O[key] = value;
		    else setGlobal(key, value);
		    return;
		  } else if (!unsafe) {
		    delete O[key];
		  } else if (!noTargetGet && O[key]) {
		    simple = true;
		  }
		  if (simple) O[key] = value;
		  else createNonEnumerableProperty(O, key, value);
		// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
		})(Function.prototype, 'toString', function toString() {
		  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
		});
		});

		var path = global_1;

		var aFunction = function (variable) {
		  return typeof variable == 'function' ? variable : undefined;
		};

		var getBuiltIn = function (namespace, method) {
		  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
		    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
		};

		var ceil = Math.ceil;
		var floor = Math.floor;

		// `ToInteger` abstract operation
		// https://tc39.github.io/ecma262/#sec-tointeger
		var toInteger = function (argument) {
		  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
		};

		var min = Math.min;

		// `ToLength` abstract operation
		// https://tc39.github.io/ecma262/#sec-tolength
		var toLength = function (argument) {
		  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
		};

		var max = Math.max;
		var min$1 = Math.min;

		// Helper for a popular repeating case of the spec:
		// Let integer be ? ToInteger(index).
		// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
		var toAbsoluteIndex = function (index, length) {
		  var integer = toInteger(index);
		  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
		};

		// `Array.prototype.{ indexOf, includes }` methods implementation
		var createMethod = function (IS_INCLUDES) {
		  return function ($this, el, fromIndex) {
		    var O = toIndexedObject($this);
		    var length = toLength(O.length);
		    var index = toAbsoluteIndex(fromIndex, length);
		    var value;
		    // Array#includes uses SameValueZero equality algorithm
		    // eslint-disable-next-line no-self-compare
		    if (IS_INCLUDES && el != el) while (length > index) {
		      value = O[index++];
		      // eslint-disable-next-line no-self-compare
		      if (value != value) return true;
		    // Array#indexOf ignores holes, Array#includes - not
		    } else for (;length > index; index++) {
		      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
		    } return !IS_INCLUDES && -1;
		  };
		};

		var arrayIncludes = {
		  // `Array.prototype.includes` method
		  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
		  includes: createMethod(true),
		  // `Array.prototype.indexOf` method
		  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
		  indexOf: createMethod(false)
		};

		var indexOf = arrayIncludes.indexOf;


		var objectKeysInternal = function (object, names) {
		  var O = toIndexedObject(object);
		  var i = 0;
		  var result = [];
		  var key;
		  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
		  // Don't enum bug & hidden keys
		  while (names.length > i) if (has(O, key = names[i++])) {
		    ~indexOf(result, key) || result.push(key);
		  }
		  return result;
		};

		// IE8- don't enum bug keys
		var enumBugKeys = [
		  'constructor',
		  'hasOwnProperty',
		  'isPrototypeOf',
		  'propertyIsEnumerable',
		  'toLocaleString',
		  'toString',
		  'valueOf'
		];

		var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

		// `Object.getOwnPropertyNames` method
		// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
		var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
		  return objectKeysInternal(O, hiddenKeys$1);
		};

		var objectGetOwnPropertyNames = {
			f: f$3
		};

		var f$4 = Object.getOwnPropertySymbols;

		var objectGetOwnPropertySymbols = {
			f: f$4
		};

		// all object keys, includes non-enumerable and symbols
		var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
		  var keys = objectGetOwnPropertyNames.f(anObject(it));
		  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
		  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
		};

		var copyConstructorProperties = function (target, source) {
		  var keys = ownKeys(source);
		  var defineProperty = objectDefineProperty.f;
		  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
		  for (var i = 0; i < keys.length; i++) {
		    var key = keys[i];
		    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
		  }
		};

		var replacement = /#|\.prototype\./;

		var isForced = function (feature, detection) {
		  var value = data[normalize(feature)];
		  return value == POLYFILL ? true
		    : value == NATIVE ? false
		    : typeof detection == 'function' ? fails(detection)
		    : !!detection;
		};

		var normalize = isForced.normalize = function (string) {
		  return String(string).replace(replacement, '.').toLowerCase();
		};

		var data = isForced.data = {};
		var NATIVE = isForced.NATIVE = 'N';
		var POLYFILL = isForced.POLYFILL = 'P';

		var isForced_1 = isForced;

		var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






		/*
		  options.target      - name of the target object
		  options.global      - target is the global object
		  options.stat        - export as static methods of target
		  options.proto       - export as prototype methods of target
		  options.real        - real prototype method for the `pure` version
		  options.forced      - export even if the native feature is available
		  options.bind        - bind methods to the target, required for the `pure` version
		  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
		  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
		  options.sham        - add a flag to not completely full polyfills
		  options.enumerable  - export as enumerable property
		  options.noTargetGet - prevent calling a getter on target
		*/
		var _export = function (options, source) {
		  var TARGET = options.target;
		  var GLOBAL = options.global;
		  var STATIC = options.stat;
		  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
		  if (GLOBAL) {
		    target = global_1;
		  } else if (STATIC) {
		    target = global_1[TARGET] || setGlobal(TARGET, {});
		  } else {
		    target = (global_1[TARGET] || {}).prototype;
		  }
		  if (target) for (key in source) {
		    sourceProperty = source[key];
		    if (options.noTargetGet) {
		      descriptor = getOwnPropertyDescriptor$1(target, key);
		      targetProperty = descriptor && descriptor.value;
		    } else targetProperty = target[key];
		    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
		    // contained in target
		    if (!FORCED && targetProperty !== undefined) {
		      if (typeof sourceProperty === typeof targetProperty) continue;
		      copyConstructorProperties(sourceProperty, targetProperty);
		    }
		    // add a flag to not completely full polyfills
		    if (options.sham || (targetProperty && targetProperty.sham)) {
		      createNonEnumerableProperty(sourceProperty, 'sham', true);
		    }
		    // extend global
		    redefine(target, key, sourceProperty, options);
		  }
		};

		var aFunction$1 = function (it) {
		  if (typeof it != 'function') {
		    throw TypeError(String(it) + ' is not a function');
		  } return it;
		};

		// optional / simple context binding
		var functionBindContext = function (fn, that, length) {
		  aFunction$1(fn);
		  if (that === undefined) return fn;
		  switch (length) {
		    case 0: return function () {
		      return fn.call(that);
		    };
		    case 1: return function (a) {
		      return fn.call(that, a);
		    };
		    case 2: return function (a, b) {
		      return fn.call(that, a, b);
		    };
		    case 3: return function (a, b, c) {
		      return fn.call(that, a, b, c);
		    };
		  }
		  return function (/* ...args */) {
		    return fn.apply(that, arguments);
		  };
		};

		// `ToObject` abstract operation
		// https://tc39.github.io/ecma262/#sec-toobject
		var toObject = function (argument) {
		  return Object(requireObjectCoercible(argument));
		};

		// `IsArray` abstract operation
		// https://tc39.github.io/ecma262/#sec-isarray
		var isArray = Array.isArray || function isArray(arg) {
		  return classofRaw(arg) == 'Array';
		};

		var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
		  // Chrome 38 Symbol has incorrect toString conversion
		  // eslint-disable-next-line no-undef
		  return !String(Symbol());
		});

		var useSymbolAsUid = nativeSymbol
		  // eslint-disable-next-line no-undef
		  && !Symbol.sham
		  // eslint-disable-next-line no-undef
		  && typeof Symbol.iterator == 'symbol';

		var WellKnownSymbolsStore = shared('wks');
		var Symbol$1 = global_1.Symbol;
		var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

		var wellKnownSymbol = function (name) {
		  if (!has(WellKnownSymbolsStore, name)) {
		    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];
		    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
		  } return WellKnownSymbolsStore[name];
		};

		var SPECIES = wellKnownSymbol('species');

		// `ArraySpeciesCreate` abstract operation
		// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
		var arraySpeciesCreate = function (originalArray, length) {
		  var C;
		  if (isArray(originalArray)) {
		    C = originalArray.constructor;
		    // cross-realm fallback
		    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
		    else if (isObject(C)) {
		      C = C[SPECIES];
		      if (C === null) C = undefined;
		    }
		  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
		};

		var push = [].push;

		// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
		var createMethod$1 = function (TYPE) {
		  var IS_MAP = TYPE == 1;
		  var IS_FILTER = TYPE == 2;
		  var IS_SOME = TYPE == 3;
		  var IS_EVERY = TYPE == 4;
		  var IS_FIND_INDEX = TYPE == 6;
		  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
		  return function ($this, callbackfn, that, specificCreate) {
		    var O = toObject($this);
		    var self = indexedObject(O);
		    var boundFunction = functionBindContext(callbackfn, that, 3);
		    var length = toLength(self.length);
		    var index = 0;
		    var create = specificCreate || arraySpeciesCreate;
		    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
		    var value, result;
		    for (;length > index; index++) if (NO_HOLES || index in self) {
		      value = self[index];
		      result = boundFunction(value, index, O);
		      if (TYPE) {
		        if (IS_MAP) target[index] = result; // map
		        else if (result) switch (TYPE) {
		          case 3: return true;              // some
		          case 5: return value;             // find
		          case 6: return index;             // findIndex
		          case 2: push.call(target, value); // filter
		        } else if (IS_EVERY) return false;  // every
		      }
		    }
		    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
		  };
		};

		var arrayIteration = {
		  // `Array.prototype.forEach` method
		  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
		  forEach: createMethod$1(0),
		  // `Array.prototype.map` method
		  // https://tc39.github.io/ecma262/#sec-array.prototype.map
		  map: createMethod$1(1),
		  // `Array.prototype.filter` method
		  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
		  filter: createMethod$1(2),
		  // `Array.prototype.some` method
		  // https://tc39.github.io/ecma262/#sec-array.prototype.some
		  some: createMethod$1(3),
		  // `Array.prototype.every` method
		  // https://tc39.github.io/ecma262/#sec-array.prototype.every
		  every: createMethod$1(4),
		  // `Array.prototype.find` method
		  // https://tc39.github.io/ecma262/#sec-array.prototype.find
		  find: createMethod$1(5),
		  // `Array.prototype.findIndex` method
		  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
		  findIndex: createMethod$1(6)
		};

		var arrayMethodIsStrict = function (METHOD_NAME, argument) {
		  var method = [][METHOD_NAME];
		  return !!method && fails(function () {
		    // eslint-disable-next-line no-useless-call,no-throw-literal
		    method.call(null, argument || function () { throw 1; }, 1);
		  });
		};

		var defineProperty = Object.defineProperty;
		var cache = {};

		var thrower = function (it) { throw it; };

		var arrayMethodUsesToLength = function (METHOD_NAME, options) {
		  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
		  if (!options) options = {};
		  var method = [][METHOD_NAME];
		  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
		  var argument0 = has(options, 0) ? options[0] : thrower;
		  var argument1 = has(options, 1) ? options[1] : undefined;

		  return cache[METHOD_NAME] = !!method && !fails(function () {
		    if (ACCESSORS && !descriptors) return true;
		    var O = { length: -1 };

		    if (ACCESSORS) defineProperty(O, 1, { enumerable: true, get: thrower });
		    else O[1] = 1;

		    method.call(O, argument0, argument1);
		  });
		};

		var $forEach = arrayIteration.forEach;



		var STRICT_METHOD = arrayMethodIsStrict('forEach');
		var USES_TO_LENGTH = arrayMethodUsesToLength('forEach');

		// `Array.prototype.forEach` method implementation
		// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
		var arrayForEach = (!STRICT_METHOD || !USES_TO_LENGTH) ? function forEach(callbackfn /* , thisArg */) {
		  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
		} : [].forEach;

		// `Array.prototype.forEach` method
		// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
		_export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, {
		  forEach: arrayForEach
		});

		// `Object.keys` method
		// https://tc39.github.io/ecma262/#sec-object.keys
		var objectKeys = Object.keys || function keys(O) {
		  return objectKeysInternal(O, enumBugKeys);
		};

		// `Object.defineProperties` method
		// https://tc39.github.io/ecma262/#sec-object.defineproperties
		var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
		  anObject(O);
		  var keys = objectKeys(Properties);
		  var length = keys.length;
		  var index = 0;
		  var key;
		  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
		  return O;
		};

		var html = getBuiltIn('document', 'documentElement');

		var GT = '>';
		var LT = '<';
		var PROTOTYPE = 'prototype';
		var SCRIPT = 'script';
		var IE_PROTO = sharedKey('IE_PROTO');

		var EmptyConstructor = function () { /* empty */ };

		var scriptTag = function (content) {
		  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
		};

		// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
		var NullProtoObjectViaActiveX = function (activeXDocument) {
		  activeXDocument.write(scriptTag(''));
		  activeXDocument.close();
		  var temp = activeXDocument.parentWindow.Object;
		  activeXDocument = null; // avoid memory leak
		  return temp;
		};

		// Create object with fake `null` prototype: use iframe Object with cleared prototype
		var NullProtoObjectViaIFrame = function () {
		  // Thrash, waste and sodomy: IE GC bug
		  var iframe = documentCreateElement('iframe');
		  var JS = 'java' + SCRIPT + ':';
		  var iframeDocument;
		  iframe.style.display = 'none';
		  html.appendChild(iframe);
		  // https://github.com/zloirock/core-js/issues/475
		  iframe.src = String(JS);
		  iframeDocument = iframe.contentWindow.document;
		  iframeDocument.open();
		  iframeDocument.write(scriptTag('document.F=Object'));
		  iframeDocument.close();
		  return iframeDocument.F;
		};

		// Check for document.domain and active x support
		// No need to use active x approach when document.domain is not set
		// see https://github.com/es-shims/es5-shim/issues/150
		// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
		// avoid IE GC bug
		var activeXDocument;
		var NullProtoObject = function () {
		  try {
		    /* global ActiveXObject */
		    activeXDocument = document.domain && new ActiveXObject('htmlfile');
		  } catch (error) { /* ignore */ }
		  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
		  var length = enumBugKeys.length;
		  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
		  return NullProtoObject();
		};

		hiddenKeys[IE_PROTO] = true;

		// `Object.create` method
		// https://tc39.github.io/ecma262/#sec-object.create
		var objectCreate = Object.create || function create(O, Properties) {
		  var result;
		  if (O !== null) {
		    EmptyConstructor[PROTOTYPE] = anObject(O);
		    result = new EmptyConstructor();
		    EmptyConstructor[PROTOTYPE] = null;
		    // add "__proto__" for Object.getPrototypeOf polyfill
		    result[IE_PROTO] = O;
		  } else result = NullProtoObject();
		  return Properties === undefined ? result : objectDefineProperties(result, Properties);
		};

		var UNSCOPABLES = wellKnownSymbol('unscopables');
		var ArrayPrototype = Array.prototype;

		// Array.prototype[@@unscopables]
		// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
		if (ArrayPrototype[UNSCOPABLES] == undefined) {
		  objectDefineProperty.f(ArrayPrototype, UNSCOPABLES, {
		    configurable: true,
		    value: objectCreate(null)
		  });
		}

		// add a key to Array.prototype[@@unscopables]
		var addToUnscopables = function (key) {
		  ArrayPrototype[UNSCOPABLES][key] = true;
		};

		var iterators = {};

		var correctPrototypeGetter = !fails(function () {
		  function F() { /* empty */ }
		  F.prototype.constructor = null;
		  return Object.getPrototypeOf(new F()) !== F.prototype;
		});

		var IE_PROTO$1 = sharedKey('IE_PROTO');
		var ObjectPrototype = Object.prototype;

		// `Object.getPrototypeOf` method
		// https://tc39.github.io/ecma262/#sec-object.getprototypeof
		var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
		  O = toObject(O);
		  if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];
		  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
		    return O.constructor.prototype;
		  } return O instanceof Object ? ObjectPrototype : null;
		};

		var ITERATOR = wellKnownSymbol('iterator');
		var BUGGY_SAFARI_ITERATORS = false;

		var returnThis = function () { return this; };

		// `%IteratorPrototype%` object
		// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
		var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

		if ([].keys) {
		  arrayIterator = [].keys();
		  // Safari 8 has buggy iterators w/o `next`
		  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
		  else {
		    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
		    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
		  }
		}

		if (IteratorPrototype == undefined) IteratorPrototype = {};

		// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
		if ( !has(IteratorPrototype, ITERATOR)) {
		  createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
		}

		var iteratorsCore = {
		  IteratorPrototype: IteratorPrototype,
		  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
		};

		var defineProperty$1 = objectDefineProperty.f;



		var TO_STRING_TAG = wellKnownSymbol('toStringTag');

		var setToStringTag = function (it, TAG, STATIC) {
		  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
		    defineProperty$1(it, TO_STRING_TAG, { configurable: true, value: TAG });
		  }
		};

		var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





		var returnThis$1 = function () { return this; };

		var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
		  var TO_STRING_TAG = NAME + ' Iterator';
		  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
		  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
		  iterators[TO_STRING_TAG] = returnThis$1;
		  return IteratorConstructor;
		};

		var aPossiblePrototype = function (it) {
		  if (!isObject(it) && it !== null) {
		    throw TypeError("Can't set " + String(it) + ' as a prototype');
		  } return it;
		};

		// `Object.setPrototypeOf` method
		// https://tc39.github.io/ecma262/#sec-object.setprototypeof
		// Works with __proto__ only. Old v8 can't work with null proto objects.
		/* eslint-disable no-proto */
		var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
		  var CORRECT_SETTER = false;
		  var test = {};
		  var setter;
		  try {
		    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
		    setter.call(test, []);
		    CORRECT_SETTER = test instanceof Array;
		  } catch (error) { /* empty */ }
		  return function setPrototypeOf(O, proto) {
		    anObject(O);
		    aPossiblePrototype(proto);
		    if (CORRECT_SETTER) setter.call(O, proto);
		    else O.__proto__ = proto;
		    return O;
		  };
		}() : undefined);

		var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
		var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
		var ITERATOR$1 = wellKnownSymbol('iterator');
		var KEYS = 'keys';
		var VALUES = 'values';
		var ENTRIES = 'entries';

		var returnThis$2 = function () { return this; };

		var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
		  createIteratorConstructor(IteratorConstructor, NAME, next);

		  var getIterationMethod = function (KIND) {
		    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
		    if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
		    switch (KIND) {
		      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
		      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
		      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
		    } return function () { return new IteratorConstructor(this); };
		  };

		  var TO_STRING_TAG = NAME + ' Iterator';
		  var INCORRECT_VALUES_NAME = false;
		  var IterablePrototype = Iterable.prototype;
		  var nativeIterator = IterablePrototype[ITERATOR$1]
		    || IterablePrototype['@@iterator']
		    || DEFAULT && IterablePrototype[DEFAULT];
		  var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
		  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
		  var CurrentIteratorPrototype, methods, KEY;

		  // fix native
		  if (anyNativeIterator) {
		    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
		    if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
		      if ( objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
		        if (objectSetPrototypeOf) {
		          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
		        } else if (typeof CurrentIteratorPrototype[ITERATOR$1] != 'function') {
		          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$1, returnThis$2);
		        }
		      }
		      // Set @@toStringTag to native iterators
		      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
		    }
		  }

		  // fix Array#{values, @@iterator}.name in V8 / FF
		  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
		    INCORRECT_VALUES_NAME = true;
		    defaultIterator = function values() { return nativeIterator.call(this); };
		  }

		  // define iterator
		  if ( IterablePrototype[ITERATOR$1] !== defaultIterator) {
		    createNonEnumerableProperty(IterablePrototype, ITERATOR$1, defaultIterator);
		  }
		  iterators[NAME] = defaultIterator;

		  // export additional methods
		  if (DEFAULT) {
		    methods = {
		      values: getIterationMethod(VALUES),
		      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
		      entries: getIterationMethod(ENTRIES)
		    };
		    if (FORCED) for (KEY in methods) {
		      if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
		        redefine(IterablePrototype, KEY, methods[KEY]);
		      }
		    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
		  }

		  return methods;
		};

		var ARRAY_ITERATOR = 'Array Iterator';
		var setInternalState = internalState.set;
		var getInternalState = internalState.getterFor(ARRAY_ITERATOR);

		// `Array.prototype.entries` method
		// https://tc39.github.io/ecma262/#sec-array.prototype.entries
		// `Array.prototype.keys` method
		// https://tc39.github.io/ecma262/#sec-array.prototype.keys
		// `Array.prototype.values` method
		// https://tc39.github.io/ecma262/#sec-array.prototype.values
		// `Array.prototype[@@iterator]` method
		// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
		// `CreateArrayIterator` internal method
		// https://tc39.github.io/ecma262/#sec-createarrayiterator
		var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
		  setInternalState(this, {
		    type: ARRAY_ITERATOR,
		    target: toIndexedObject(iterated), // target
		    index: 0,                          // next index
		    kind: kind                         // kind
		  });
		// `%ArrayIteratorPrototype%.next` method
		// https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
		}, function () {
		  var state = getInternalState(this);
		  var target = state.target;
		  var kind = state.kind;
		  var index = state.index++;
		  if (!target || index >= target.length) {
		    state.target = undefined;
		    return { value: undefined, done: true };
		  }
		  if (kind == 'keys') return { value: index, done: false };
		  if (kind == 'values') return { value: target[index], done: false };
		  return { value: [index, target[index]], done: false };
		}, 'values');

		// argumentsList[@@iterator] is %ArrayProto_values%
		// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
		// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
		iterators.Arguments = iterators.Array;

		// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
		addToUnscopables('keys');
		addToUnscopables('values');
		addToUnscopables('entries');

		// `Array.prototype.{ reduce, reduceRight }` methods implementation
		var createMethod$2 = function (IS_RIGHT) {
		  return function (that, callbackfn, argumentsLength, memo) {
		    aFunction$1(callbackfn);
		    var O = toObject(that);
		    var self = indexedObject(O);
		    var length = toLength(O.length);
		    var index = IS_RIGHT ? length - 1 : 0;
		    var i = IS_RIGHT ? -1 : 1;
		    if (argumentsLength < 2) while (true) {
		      if (index in self) {
		        memo = self[index];
		        index += i;
		        break;
		      }
		      index += i;
		      if (IS_RIGHT ? index < 0 : length <= index) {
		        throw TypeError('Reduce of empty array with no initial value');
		      }
		    }
		    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
		      memo = callbackfn(memo, self[index], index, O);
		    }
		    return memo;
		  };
		};

		var arrayReduce = {
		  // `Array.prototype.reduce` method
		  // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
		  left: createMethod$2(false),
		  // `Array.prototype.reduceRight` method
		  // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
		  right: createMethod$2(true)
		};

		var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

		var process$1 = global_1.process;
		var versions = process$1 && process$1.versions;
		var v8 = versions && versions.v8;
		var match, version;

		if (v8) {
		  match = v8.split('.');
		  version = match[0] + match[1];
		} else if (engineUserAgent) {
		  match = engineUserAgent.match(/Edge\/(\d+)/);
		  if (!match || match[1] >= 74) {
		    match = engineUserAgent.match(/Chrome\/(\d+)/);
		    if (match) version = match[1];
		  }
		}

		var engineV8Version = version && +version;

		var engineIsNode = classofRaw(global_1.process) == 'process';

		var $reduce = arrayReduce.left;





		var STRICT_METHOD$1 = arrayMethodIsStrict('reduce');
		var USES_TO_LENGTH$1 = arrayMethodUsesToLength('reduce', { 1: 0 });
		// Chrome 80-82 has a critical bug
		// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
		var CHROME_BUG = !engineIsNode && engineV8Version > 79 && engineV8Version < 83;

		// `Array.prototype.reduce` method
		// https://tc39.github.io/ecma262/#sec-array.prototype.reduce
		_export({ target: 'Array', proto: true, forced: !STRICT_METHOD$1 || !USES_TO_LENGTH$1 || CHROME_BUG }, {
		  reduce: function reduce(callbackfn /* , initialValue */) {
		    return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
		  }
		});

		var freezing = !fails(function () {
		  return Object.isExtensible(Object.preventExtensions({}));
		});

		var internalMetadata = createCommonjsModule(function (module) {
		var defineProperty = objectDefineProperty.f;



		var METADATA = uid('meta');
		var id = 0;

		var isExtensible = Object.isExtensible || function () {
		  return true;
		};

		var setMetadata = function (it) {
		  defineProperty(it, METADATA, { value: {
		    objectID: 'O' + ++id, // object ID
		    weakData: {}          // weak collections IDs
		  } });
		};

		var fastKey = function (it, create) {
		  // return a primitive with prefix
		  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
		  if (!has(it, METADATA)) {
		    // can't set metadata to uncaught frozen object
		    if (!isExtensible(it)) return 'F';
		    // not necessary to add metadata
		    if (!create) return 'E';
		    // add missing metadata
		    setMetadata(it);
		  // return object ID
		  } return it[METADATA].objectID;
		};

		var getWeakData = function (it, create) {
		  if (!has(it, METADATA)) {
		    // can't set metadata to uncaught frozen object
		    if (!isExtensible(it)) return true;
		    // not necessary to add metadata
		    if (!create) return false;
		    // add missing metadata
		    setMetadata(it);
		  // return the store of weak collections IDs
		  } return it[METADATA].weakData;
		};

		// add metadata on freeze-family methods calling
		var onFreeze = function (it) {
		  if (freezing && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
		  return it;
		};

		var meta = module.exports = {
		  REQUIRED: false,
		  fastKey: fastKey,
		  getWeakData: getWeakData,
		  onFreeze: onFreeze
		};

		hiddenKeys[METADATA] = true;
		});

		var ITERATOR$2 = wellKnownSymbol('iterator');
		var ArrayPrototype$1 = Array.prototype;

		// check on default Array iterator
		var isArrayIteratorMethod = function (it) {
		  return it !== undefined && (iterators.Array === it || ArrayPrototype$1[ITERATOR$2] === it);
		};

		var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
		var test = {};

		test[TO_STRING_TAG$1] = 'z';

		var toStringTagSupport = String(test) === '[object z]';

		var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');
		// ES3 wrong here
		var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

		// fallback for IE11 Script Access Denied error
		var tryGet = function (it, key) {
		  try {
		    return it[key];
		  } catch (error) { /* empty */ }
		};

		// getting tag from ES6+ `Object.prototype.toString`
		var classof = toStringTagSupport ? classofRaw : function (it) {
		  var O, tag, result;
		  return it === undefined ? 'Undefined' : it === null ? 'Null'
		    // @@toStringTag case
		    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$2)) == 'string' ? tag
		    // builtinTag case
		    : CORRECT_ARGUMENTS ? classofRaw(O)
		    // ES3 arguments fallback
		    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
		};

		var ITERATOR$3 = wellKnownSymbol('iterator');

		var getIteratorMethod = function (it) {
		  if (it != undefined) return it[ITERATOR$3]
		    || it['@@iterator']
		    || iterators[classof(it)];
		};

		var iteratorClose = function (iterator) {
		  var returnMethod = iterator['return'];
		  if (returnMethod !== undefined) {
		    return anObject(returnMethod.call(iterator)).value;
		  }
		};

		var Result = function (stopped, result) {
		  this.stopped = stopped;
		  this.result = result;
		};

		var iterate = function (iterable, unboundFunction, options) {
		  var that = options && options.that;
		  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
		  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
		  var INTERRUPTED = !!(options && options.INTERRUPTED);
		  var fn = functionBindContext(unboundFunction, that, 1 + AS_ENTRIES + INTERRUPTED);
		  var iterator, iterFn, index, length, result, next, step;

		  var stop = function (condition) {
		    if (iterator) iteratorClose(iterator);
		    return new Result(true, condition);
		  };

		  var callFn = function (value) {
		    if (AS_ENTRIES) {
		      anObject(value);
		      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
		    } return INTERRUPTED ? fn(value, stop) : fn(value);
		  };

		  if (IS_ITERATOR) {
		    iterator = iterable;
		  } else {
		    iterFn = getIteratorMethod(iterable);
		    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
		    // optimisation for array iterators
		    if (isArrayIteratorMethod(iterFn)) {
		      for (index = 0, length = toLength(iterable.length); length > index; index++) {
		        result = callFn(iterable[index]);
		        if (result && result instanceof Result) return result;
		      } return new Result(false);
		    }
		    iterator = iterFn.call(iterable);
		  }

		  next = iterator.next;
		  while (!(step = next.call(iterator)).done) {
		    try {
		      result = callFn(step.value);
		    } catch (error) {
		      iteratorClose(iterator);
		      throw error;
		    }
		    if (typeof result == 'object' && result && result instanceof Result) return result;
		  } return new Result(false);
		};

		var anInstance = function (it, Constructor, name) {
		  if (!(it instanceof Constructor)) {
		    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
		  } return it;
		};

		var ITERATOR$4 = wellKnownSymbol('iterator');
		var SAFE_CLOSING = false;

		try {
		  var called = 0;
		  var iteratorWithReturn = {
		    next: function () {
		      return { done: !!called++ };
		    },
		    'return': function () {
		      SAFE_CLOSING = true;
		    }
		  };
		  iteratorWithReturn[ITERATOR$4] = function () {
		    return this;
		  };
		  // eslint-disable-next-line no-throw-literal
		  Array.from(iteratorWithReturn, function () { throw 2; });
		} catch (error) { /* empty */ }

		var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
		  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
		  var ITERATION_SUPPORT = false;
		  try {
		    var object = {};
		    object[ITERATOR$4] = function () {
		      return {
		        next: function () {
		          return { done: ITERATION_SUPPORT = true };
		        }
		      };
		    };
		    exec(object);
		  } catch (error) { /* empty */ }
		  return ITERATION_SUPPORT;
		};

		// makes subclassing work correct for wrapped built-ins
		var inheritIfRequired = function ($this, dummy, Wrapper) {
		  var NewTarget, NewTargetPrototype;
		  if (
		    // it can work only with native `setPrototypeOf`
		    objectSetPrototypeOf &&
		    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
		    typeof (NewTarget = dummy.constructor) == 'function' &&
		    NewTarget !== Wrapper &&
		    isObject(NewTargetPrototype = NewTarget.prototype) &&
		    NewTargetPrototype !== Wrapper.prototype
		  ) objectSetPrototypeOf($this, NewTargetPrototype);
		  return $this;
		};

		var collection = function (CONSTRUCTOR_NAME, wrapper, common) {
		  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
		  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
		  var ADDER = IS_MAP ? 'set' : 'add';
		  var NativeConstructor = global_1[CONSTRUCTOR_NAME];
		  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
		  var Constructor = NativeConstructor;
		  var exported = {};

		  var fixMethod = function (KEY) {
		    var nativeMethod = NativePrototype[KEY];
		    redefine(NativePrototype, KEY,
		      KEY == 'add' ? function add(value) {
		        nativeMethod.call(this, value === 0 ? 0 : value);
		        return this;
		      } : KEY == 'delete' ? function (key) {
		        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
		      } : KEY == 'get' ? function get(key) {
		        return IS_WEAK && !isObject(key) ? undefined : nativeMethod.call(this, key === 0 ? 0 : key);
		      } : KEY == 'has' ? function has(key) {
		        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
		      } : function set(key, value) {
		        nativeMethod.call(this, key === 0 ? 0 : key, value);
		        return this;
		      }
		    );
		  };

		  // eslint-disable-next-line max-len
		  if (isForced_1(CONSTRUCTOR_NAME, typeof NativeConstructor != 'function' || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
		    new NativeConstructor().entries().next();
		  })))) {
		    // create collection constructor
		    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
		    internalMetadata.REQUIRED = true;
		  } else if (isForced_1(CONSTRUCTOR_NAME, true)) {
		    var instance = new Constructor();
		    // early implementations not supports chaining
		    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
		    // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
		    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
		    // most early implementations doesn't supports iterables, most modern - not close it correctly
		    // eslint-disable-next-line no-new
		    var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
		    // for early implementations -0 and +0 not the same
		    var BUGGY_ZERO = !IS_WEAK && fails(function () {
		      // V8 ~ Chromium 42- fails only with 5+ elements
		      var $instance = new NativeConstructor();
		      var index = 5;
		      while (index--) $instance[ADDER](index, index);
		      return !$instance.has(-0);
		    });

		    if (!ACCEPT_ITERABLES) {
		      Constructor = wrapper(function (dummy, iterable) {
		        anInstance(dummy, Constructor, CONSTRUCTOR_NAME);
		        var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
		        if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
		        return that;
		      });
		      Constructor.prototype = NativePrototype;
		      NativePrototype.constructor = Constructor;
		    }

		    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
		      fixMethod('delete');
		      fixMethod('has');
		      IS_MAP && fixMethod('get');
		    }

		    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

		    // weak collections should not contains .clear method
		    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
		  }

		  exported[CONSTRUCTOR_NAME] = Constructor;
		  _export({ global: true, forced: Constructor != NativeConstructor }, exported);

		  setToStringTag(Constructor, CONSTRUCTOR_NAME);

		  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

		  return Constructor;
		};

		var redefineAll = function (target, src, options) {
		  for (var key in src) redefine(target, key, src[key], options);
		  return target;
		};

		var SPECIES$1 = wellKnownSymbol('species');

		var setSpecies = function (CONSTRUCTOR_NAME) {
		  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
		  var defineProperty = objectDefineProperty.f;

		  if (descriptors && Constructor && !Constructor[SPECIES$1]) {
		    defineProperty(Constructor, SPECIES$1, {
		      configurable: true,
		      get: function () { return this; }
		    });
		  }
		};

		var defineProperty$2 = objectDefineProperty.f;








		var fastKey = internalMetadata.fastKey;


		var setInternalState$1 = internalState.set;
		var internalStateGetterFor = internalState.getterFor;

		var collectionStrong = {
		  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
		    var C = wrapper(function (that, iterable) {
		      anInstance(that, C, CONSTRUCTOR_NAME);
		      setInternalState$1(that, {
		        type: CONSTRUCTOR_NAME,
		        index: objectCreate(null),
		        first: undefined,
		        last: undefined,
		        size: 0
		      });
		      if (!descriptors) that.size = 0;
		      if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
		    });

		    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

		    var define = function (that, key, value) {
		      var state = getInternalState(that);
		      var entry = getEntry(that, key);
		      var previous, index;
		      // change existing entry
		      if (entry) {
		        entry.value = value;
		      // create new entry
		      } else {
		        state.last = entry = {
		          index: index = fastKey(key, true),
		          key: key,
		          value: value,
		          previous: previous = state.last,
		          next: undefined,
		          removed: false
		        };
		        if (!state.first) state.first = entry;
		        if (previous) previous.next = entry;
		        if (descriptors) state.size++;
		        else that.size++;
		        // add to index
		        if (index !== 'F') state.index[index] = entry;
		      } return that;
		    };

		    var getEntry = function (that, key) {
		      var state = getInternalState(that);
		      // fast case
		      var index = fastKey(key);
		      var entry;
		      if (index !== 'F') return state.index[index];
		      // frozen object case
		      for (entry = state.first; entry; entry = entry.next) {
		        if (entry.key == key) return entry;
		      }
		    };

		    redefineAll(C.prototype, {
		      // 23.1.3.1 Map.prototype.clear()
		      // 23.2.3.2 Set.prototype.clear()
		      clear: function clear() {
		        var that = this;
		        var state = getInternalState(that);
		        var data = state.index;
		        var entry = state.first;
		        while (entry) {
		          entry.removed = true;
		          if (entry.previous) entry.previous = entry.previous.next = undefined;
		          delete data[entry.index];
		          entry = entry.next;
		        }
		        state.first = state.last = undefined;
		        if (descriptors) state.size = 0;
		        else that.size = 0;
		      },
		      // 23.1.3.3 Map.prototype.delete(key)
		      // 23.2.3.4 Set.prototype.delete(value)
		      'delete': function (key) {
		        var that = this;
		        var state = getInternalState(that);
		        var entry = getEntry(that, key);
		        if (entry) {
		          var next = entry.next;
		          var prev = entry.previous;
		          delete state.index[entry.index];
		          entry.removed = true;
		          if (prev) prev.next = next;
		          if (next) next.previous = prev;
		          if (state.first == entry) state.first = next;
		          if (state.last == entry) state.last = prev;
		          if (descriptors) state.size--;
		          else that.size--;
		        } return !!entry;
		      },
		      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
		      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
		      forEach: function forEach(callbackfn /* , that = undefined */) {
		        var state = getInternalState(this);
		        var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
		        var entry;
		        while (entry = entry ? entry.next : state.first) {
		          boundFunction(entry.value, entry.key, this);
		          // revert to the last existing entry
		          while (entry && entry.removed) entry = entry.previous;
		        }
		      },
		      // 23.1.3.7 Map.prototype.has(key)
		      // 23.2.3.7 Set.prototype.has(value)
		      has: function has(key) {
		        return !!getEntry(this, key);
		      }
		    });

		    redefineAll(C.prototype, IS_MAP ? {
		      // 23.1.3.6 Map.prototype.get(key)
		      get: function get(key) {
		        var entry = getEntry(this, key);
		        return entry && entry.value;
		      },
		      // 23.1.3.9 Map.prototype.set(key, value)
		      set: function set(key, value) {
		        return define(this, key === 0 ? 0 : key, value);
		      }
		    } : {
		      // 23.2.3.1 Set.prototype.add(value)
		      add: function add(value) {
		        return define(this, value = value === 0 ? 0 : value, value);
		      }
		    });
		    if (descriptors) defineProperty$2(C.prototype, 'size', {
		      get: function () {
		        return getInternalState(this).size;
		      }
		    });
		    return C;
		  },
		  setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
		    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
		    var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
		    var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
		    // add .keys, .values, .entries, [@@iterator]
		    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
		    defineIterator(C, CONSTRUCTOR_NAME, function (iterated, kind) {
		      setInternalState$1(this, {
		        type: ITERATOR_NAME,
		        target: iterated,
		        state: getInternalCollectionState(iterated),
		        kind: kind,
		        last: undefined
		      });
		    }, function () {
		      var state = getInternalIteratorState(this);
		      var kind = state.kind;
		      var entry = state.last;
		      // revert to the last existing entry
		      while (entry && entry.removed) entry = entry.previous;
		      // get next entry
		      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
		        // or finish the iteration
		        state.target = undefined;
		        return { value: undefined, done: true };
		      }
		      // return step by kind
		      if (kind == 'keys') return { value: entry.key, done: false };
		      if (kind == 'values') return { value: entry.value, done: false };
		      return { value: [entry.key, entry.value], done: false };
		    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

		    // add [@@species], 23.1.2.2, 23.2.2.2
		    setSpecies(CONSTRUCTOR_NAME);
		  }
		};

		// `Map` constructor
		// https://tc39.github.io/ecma262/#sec-map-objects
		var es_map = collection('Map', function (init) {
		  return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
		}, collectionStrong);

		var FAILS_ON_PRIMITIVES = fails(function () { objectKeys(1); });

		// `Object.keys` method
		// https://tc39.github.io/ecma262/#sec-object.keys
		_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
		  keys: function keys(it) {
		    return objectKeys(toObject(it));
		  }
		});

		// `Object.prototype.toString` method implementation
		// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
		var objectToString = toStringTagSupport ? {}.toString : function toString() {
		  return '[object ' + classof(this) + ']';
		};

		// `Object.prototype.toString` method
		// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
		if (!toStringTagSupport) {
		  redefine(Object.prototype, 'toString', objectToString, { unsafe: true });
		}

		// `Set` constructor
		// https://tc39.github.io/ecma262/#sec-set-objects
		var es_set = collection('Set', function (init) {
		  return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
		}, collectionStrong);

		// `String.prototype.{ codePointAt, at }` methods implementation
		var createMethod$3 = function (CONVERT_TO_STRING) {
		  return function ($this, pos) {
		    var S = String(requireObjectCoercible($this));
		    var position = toInteger(pos);
		    var size = S.length;
		    var first, second;
		    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
		    first = S.charCodeAt(position);
		    return first < 0xD800 || first > 0xDBFF || position + 1 === size
		      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
		        ? CONVERT_TO_STRING ? S.charAt(position) : first
		        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
		  };
		};

		var stringMultibyte = {
		  // `String.prototype.codePointAt` method
		  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
		  codeAt: createMethod$3(false),
		  // `String.prototype.at` method
		  // https://github.com/mathiasbynens/String.prototype.at
		  charAt: createMethod$3(true)
		};

		var charAt = stringMultibyte.charAt;



		var STRING_ITERATOR = 'String Iterator';
		var setInternalState$2 = internalState.set;
		var getInternalState$1 = internalState.getterFor(STRING_ITERATOR);

		// `String.prototype[@@iterator]` method
		// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
		defineIterator(String, 'String', function (iterated) {
		  setInternalState$2(this, {
		    type: STRING_ITERATOR,
		    string: String(iterated),
		    index: 0
		  });
		// `%StringIteratorPrototype%.next` method
		// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
		}, function next() {
		  var state = getInternalState$1(this);
		  var string = state.string;
		  var index = state.index;
		  var point;
		  if (index >= string.length) return { value: undefined, done: true };
		  point = charAt(string, index);
		  state.index += point.length;
		  return { value: point, done: false };
		});

		// iterable DOM collections
		// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
		var domIterables = {
		  CSSRuleList: 0,
		  CSSStyleDeclaration: 0,
		  CSSValueList: 0,
		  ClientRectList: 0,
		  DOMRectList: 0,
		  DOMStringList: 0,
		  DOMTokenList: 1,
		  DataTransferItemList: 0,
		  FileList: 0,
		  HTMLAllCollection: 0,
		  HTMLCollection: 0,
		  HTMLFormElement: 0,
		  HTMLSelectElement: 0,
		  MediaList: 0,
		  MimeTypeArray: 0,
		  NamedNodeMap: 0,
		  NodeList: 1,
		  PaintRequestList: 0,
		  Plugin: 0,
		  PluginArray: 0,
		  SVGLengthList: 0,
		  SVGNumberList: 0,
		  SVGPathSegList: 0,
		  SVGPointList: 0,
		  SVGStringList: 0,
		  SVGTransformList: 0,
		  SourceBufferList: 0,
		  StyleSheetList: 0,
		  TextTrackCueList: 0,
		  TextTrackList: 0,
		  TouchList: 0
		};

		for (var COLLECTION_NAME in domIterables) {
		  var Collection = global_1[COLLECTION_NAME];
		  var CollectionPrototype = Collection && Collection.prototype;
		  // some Chrome versions have non-configurable methods on DOMTokenList
		  if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
		    createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
		  } catch (error) {
		    CollectionPrototype.forEach = arrayForEach;
		  }
		}

		var ITERATOR$5 = wellKnownSymbol('iterator');
		var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
		var ArrayValues = es_array_iterator.values;

		for (var COLLECTION_NAME$1 in domIterables) {
		  var Collection$1 = global_1[COLLECTION_NAME$1];
		  var CollectionPrototype$1 = Collection$1 && Collection$1.prototype;
		  if (CollectionPrototype$1) {
		    // some Chrome versions have non-configurable methods on DOMTokenList
		    if (CollectionPrototype$1[ITERATOR$5] !== ArrayValues) try {
		      createNonEnumerableProperty(CollectionPrototype$1, ITERATOR$5, ArrayValues);
		    } catch (error) {
		      CollectionPrototype$1[ITERATOR$5] = ArrayValues;
		    }
		    if (!CollectionPrototype$1[TO_STRING_TAG$3]) {
		      createNonEnumerableProperty(CollectionPrototype$1, TO_STRING_TAG$3, COLLECTION_NAME$1);
		    }
		    if (domIterables[COLLECTION_NAME$1]) for (var METHOD_NAME in es_array_iterator) {
		      // some Chrome versions have non-configurable methods on DOMTokenList
		      if (CollectionPrototype$1[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
		        createNonEnumerableProperty(CollectionPrototype$1, METHOD_NAME, es_array_iterator[METHOD_NAME]);
		      } catch (error) {
		        CollectionPrototype$1[METHOD_NAME] = es_array_iterator[METHOD_NAME];
		      }
		    }
		  }
		}

		function _slicedToArray(arr, i) {
		  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
		}

		function _toConsumableArray(arr) {
		  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
		}

		function _arrayWithoutHoles(arr) {
		  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
		}

		function _arrayWithHoles(arr) {
		  if (Array.isArray(arr)) return arr;
		}

		function _iterableToArray(iter) {
		  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
		}

		function _iterableToArrayLimit(arr, i) {
		  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
		  var _arr = [];
		  var _n = true;
		  var _d = false;
		  var _e = undefined;

		  try {
		    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
		      _arr.push(_s.value);

		      if (i && _arr.length === i) break;
		    }
		  } catch (err) {
		    _d = true;
		    _e = err;
		  } finally {
		    try {
		      if (!_n && _i["return"] != null) _i["return"]();
		    } finally {
		      if (_d) throw _e;
		    }
		  }

		  return _arr;
		}

		function _unsupportedIterableToArray(o, minLen) {
		  if (!o) return;
		  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
		  var n = Object.prototype.toString.call(o).slice(8, -1);
		  if (n === "Object" && o.constructor) n = o.constructor.name;
		  if (n === "Map" || n === "Set") return Array.from(o);
		  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
		}

		function _arrayLikeToArray(arr, len) {
		  if (len == null || len > arr.length) len = arr.length;

		  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

		  return arr2;
		}

		function _nonIterableSpread() {
		  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
		}

		function _nonIterableRest() {
		  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
		}

		function _createForOfIteratorHelper(o, allowArrayLike) {
		  var it;

		  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
		    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
		      if (it) o = it;
		      var i = 0;

		      var F = function () {};

		      return {
		        s: F,
		        n: function () {
		          if (i >= o.length) return {
		            done: true
		          };
		          return {
		            done: false,
		            value: o[i++]
		          };
		        },
		        e: function (e) {
		          throw e;
		        },
		        f: F
		      };
		    }

		    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
		  }

		  var normalCompletion = true,
		      didErr = false,
		      err;
		  return {
		    s: function () {
		      it = o[Symbol.iterator]();
		    },
		    n: function () {
		      var step = it.next();
		      normalCompletion = step.done;
		      return step;
		    },
		    e: function (e) {
		      didErr = true;
		      err = e;
		    },
		    f: function () {
		      try {
		        if (!normalCompletion && it.return != null) it.return();
		      } finally {
		        if (didErr) throw err;
		      }
		    }
		  };
		}

		var createProperty = function (object, key, value) {
		  var propertyKey = toPrimitive(key);
		  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
		  else object[propertyKey] = value;
		};

		var SPECIES$2 = wellKnownSymbol('species');

		var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
		  // We can't use this feature detection in V8 since it causes
		  // deoptimization and serious performance degradation
		  // https://github.com/zloirock/core-js/issues/677
		  return engineV8Version >= 51 || !fails(function () {
		    var array = [];
		    var constructor = array.constructor = {};
		    constructor[SPECIES$2] = function () {
		      return { foo: 1 };
		    };
		    return array[METHOD_NAME](Boolean).foo !== 1;
		  });
		};

		var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
		var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
		var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

		// We can't use this feature detection in V8 since it causes
		// deoptimization and serious performance degradation
		// https://github.com/zloirock/core-js/issues/679
		var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
		  var array = [];
		  array[IS_CONCAT_SPREADABLE] = false;
		  return array.concat()[0] !== array;
		});

		var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

		var isConcatSpreadable = function (O) {
		  if (!isObject(O)) return false;
		  var spreadable = O[IS_CONCAT_SPREADABLE];
		  return spreadable !== undefined ? !!spreadable : isArray(O);
		};

		var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

		// `Array.prototype.concat` method
		// https://tc39.github.io/ecma262/#sec-array.prototype.concat
		// with adding support of @@isConcatSpreadable and @@species
		_export({ target: 'Array', proto: true, forced: FORCED }, {
		  concat: function concat(arg) { // eslint-disable-line no-unused-vars
		    var O = toObject(this);
		    var A = arraySpeciesCreate(O, 0);
		    var n = 0;
		    var i, k, length, len, E;
		    for (i = -1, length = arguments.length; i < length; i++) {
		      E = i === -1 ? O : arguments[i];
		      if (isConcatSpreadable(E)) {
		        len = toLength(E.length);
		        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
		        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
		      } else {
		        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
		        createProperty(A, n++, E);
		      }
		    }
		    A.length = n;
		    return A;
		  }
		});

		// `Array.isArray` method
		// https://tc39.github.io/ecma262/#sec-array.isarray
		_export({ target: 'Array', stat: true }, {
		  isArray: isArray
		});

		var nativeJoin = [].join;

		var ES3_STRINGS = indexedObject != Object;
		var STRICT_METHOD$2 = arrayMethodIsStrict('join', ',');

		// `Array.prototype.join` method
		// https://tc39.github.io/ecma262/#sec-array.prototype.join
		_export({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD$2 }, {
		  join: function join(separator) {
		    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
		  }
		});

		var DatePrototype = Date.prototype;
		var INVALID_DATE = 'Invalid Date';
		var TO_STRING = 'toString';
		var nativeDateToString = DatePrototype[TO_STRING];
		var getTime = DatePrototype.getTime;

		// `Date.prototype.toString` method
		// https://tc39.github.io/ecma262/#sec-date.prototype.tostring
		if (new Date(NaN) + '' != INVALID_DATE) {
		  redefine(DatePrototype, TO_STRING, function toString() {
		    var value = getTime.call(this);
		    // eslint-disable-next-line no-self-compare
		    return value === value ? nativeDateToString.call(this) : INVALID_DATE;
		  });
		}

		// `RegExp.prototype.flags` getter implementation
		// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
		var regexpFlags = function () {
		  var that = anObject(this);
		  var result = '';
		  if (that.global) result += 'g';
		  if (that.ignoreCase) result += 'i';
		  if (that.multiline) result += 'm';
		  if (that.dotAll) result += 's';
		  if (that.unicode) result += 'u';
		  if (that.sticky) result += 'y';
		  return result;
		};

		// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
		// so we use an intermediate function.
		function RE(s, f) {
		  return RegExp(s, f);
		}

		var UNSUPPORTED_Y = fails(function () {
		  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
		  var re = RE('a', 'y');
		  re.lastIndex = 2;
		  return re.exec('abcd') != null;
		});

		var BROKEN_CARET = fails(function () {
		  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
		  var re = RE('^r', 'gy');
		  re.lastIndex = 2;
		  return re.exec('str') != null;
		});

		var regexpStickyHelpers = {
			UNSUPPORTED_Y: UNSUPPORTED_Y,
			BROKEN_CARET: BROKEN_CARET
		};

		var nativeExec = RegExp.prototype.exec;
		// This always refers to the native implementation, because the
		// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
		// which loads this file before patching the method.
		var nativeReplace = String.prototype.replace;

		var patchedExec = nativeExec;

		var UPDATES_LAST_INDEX_WRONG = (function () {
		  var re1 = /a/;
		  var re2 = /b*/g;
		  nativeExec.call(re1, 'a');
		  nativeExec.call(re2, 'a');
		  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
		})();

		var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET;

		// nonparticipating capturing group, copied from es5-shim's String#split patch.
		var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

		var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1;

		if (PATCH) {
		  patchedExec = function exec(str) {
		    var re = this;
		    var lastIndex, reCopy, match, i;
		    var sticky = UNSUPPORTED_Y$1 && re.sticky;
		    var flags = regexpFlags.call(re);
		    var source = re.source;
		    var charsAdded = 0;
		    var strCopy = str;

		    if (sticky) {
		      flags = flags.replace('y', '');
		      if (flags.indexOf('g') === -1) {
		        flags += 'g';
		      }

		      strCopy = String(str).slice(re.lastIndex);
		      // Support anchored sticky behavior.
		      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
		        source = '(?: ' + source + ')';
		        strCopy = ' ' + strCopy;
		        charsAdded++;
		      }
		      // ^(? + rx + ) is needed, in combination with some str slicing, to
		      // simulate the 'y' flag.
		      reCopy = new RegExp('^(?:' + source + ')', flags);
		    }

		    if (NPCG_INCLUDED) {
		      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
		    }
		    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

		    match = nativeExec.call(sticky ? reCopy : re, strCopy);

		    if (sticky) {
		      if (match) {
		        match.input = match.input.slice(charsAdded);
		        match[0] = match[0].slice(charsAdded);
		        match.index = re.lastIndex;
		        re.lastIndex += match[0].length;
		      } else re.lastIndex = 0;
		    } else if (UPDATES_LAST_INDEX_WRONG && match) {
		      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
		    }
		    if (NPCG_INCLUDED && match && match.length > 1) {
		      // Fix browsers whose `exec` methods don't consistently return `undefined`
		      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
		      nativeReplace.call(match[0], reCopy, function () {
		        for (i = 1; i < arguments.length - 2; i++) {
		          if (arguments[i] === undefined) match[i] = undefined;
		        }
		      });
		    }

		    return match;
		  };
		}

		var regexpExec = patchedExec;

		_export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
		  exec: regexpExec
		});

		var TO_STRING$1 = 'toString';
		var RegExpPrototype = RegExp.prototype;
		var nativeToString = RegExpPrototype[TO_STRING$1];

		var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
		// FF44- RegExp#toString has a wrong name
		var INCORRECT_NAME = nativeToString.name != TO_STRING$1;

		// `RegExp.prototype.toString` method
		// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
		if (NOT_GENERIC || INCORRECT_NAME) {
		  redefine(RegExp.prototype, TO_STRING$1, function toString() {
		    var R = anObject(this);
		    var p = String(R.source);
		    var rf = R.flags;
		    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? regexpFlags.call(R) : rf);
		    return '/' + p + '/' + f;
		  }, { unsafe: true });
		}

		// TODO: Remove from `core-js@4` since it's moved to entry points







		var SPECIES$3 = wellKnownSymbol('species');

		var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
		  // #replace needs built-in support for named groups.
		  // #match works fine because it just return the exec results, even if it has
		  // a "grops" property.
		  var re = /./;
		  re.exec = function () {
		    var result = [];
		    result.groups = { a: '7' };
		    return result;
		  };
		  return ''.replace(re, '$<a>') !== '7';
		});

		// IE <= 11 replaces $0 with the whole match, as if it was $&
		// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
		var REPLACE_KEEPS_$0 = (function () {
		  return 'a'.replace(/./, '$0') === '$0';
		})();

		var REPLACE = wellKnownSymbol('replace');
		// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
		var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
		  if (/./[REPLACE]) {
		    return /./[REPLACE]('a', '$0') === '';
		  }
		  return false;
		})();

		// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
		// Weex JS has frozen built-in prototypes, so use try / catch wrapper
		var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
		  var re = /(?:)/;
		  var originalExec = re.exec;
		  re.exec = function () { return originalExec.apply(this, arguments); };
		  var result = 'ab'.split(re);
		  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
		});

		var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
		  var SYMBOL = wellKnownSymbol(KEY);

		  var DELEGATES_TO_SYMBOL = !fails(function () {
		    // String methods call symbol-named RegEp methods
		    var O = {};
		    O[SYMBOL] = function () { return 7; };
		    return ''[KEY](O) != 7;
		  });

		  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
		    // Symbol-named RegExp methods call .exec
		    var execCalled = false;
		    var re = /a/;

		    if (KEY === 'split') {
		      // We can't use real regex here since it causes deoptimization
		      // and serious performance degradation in V8
		      // https://github.com/zloirock/core-js/issues/306
		      re = {};
		      // RegExp[@@split] doesn't call the regex's exec method, but first creates
		      // a new one. We need to return the patched regex when creating the new one.
		      re.constructor = {};
		      re.constructor[SPECIES$3] = function () { return re; };
		      re.flags = '';
		      re[SYMBOL] = /./[SYMBOL];
		    }

		    re.exec = function () { execCalled = true; return null; };

		    re[SYMBOL]('');
		    return !execCalled;
		  });

		  if (
		    !DELEGATES_TO_SYMBOL ||
		    !DELEGATES_TO_EXEC ||
		    (KEY === 'replace' && !(
		      REPLACE_SUPPORTS_NAMED_GROUPS &&
		      REPLACE_KEEPS_$0 &&
		      !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
		    )) ||
		    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
		  ) {
		    var nativeRegExpMethod = /./[SYMBOL];
		    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
		      if (regexp.exec === regexpExec) {
		        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
		          // The native String method already delegates to @@method (this
		          // polyfilled function), leasing to infinite recursion.
		          // We avoid it by directly calling the native @@method method.
		          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
		        }
		        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
		      }
		      return { done: false };
		    }, {
		      REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
		      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
		    });
		    var stringMethod = methods[0];
		    var regexMethod = methods[1];

		    redefine(String.prototype, KEY, stringMethod);
		    redefine(RegExp.prototype, SYMBOL, length == 2
		      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
		      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
		      ? function (string, arg) { return regexMethod.call(string, this, arg); }
		      // 21.2.5.6 RegExp.prototype[@@match](string)
		      // 21.2.5.9 RegExp.prototype[@@search](string)
		      : function (string) { return regexMethod.call(string, this); }
		    );
		  }

		  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
		};

		var MATCH = wellKnownSymbol('match');

		// `IsRegExp` abstract operation
		// https://tc39.github.io/ecma262/#sec-isregexp
		var isRegexp = function (it) {
		  var isRegExp;
		  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
		};

		var SPECIES$4 = wellKnownSymbol('species');

		// `SpeciesConstructor` abstract operation
		// https://tc39.github.io/ecma262/#sec-speciesconstructor
		var speciesConstructor = function (O, defaultConstructor) {
		  var C = anObject(O).constructor;
		  var S;
		  return C === undefined || (S = anObject(C)[SPECIES$4]) == undefined ? defaultConstructor : aFunction$1(S);
		};

		var charAt$1 = stringMultibyte.charAt;

		// `AdvanceStringIndex` abstract operation
		// https://tc39.github.io/ecma262/#sec-advancestringindex
		var advanceStringIndex = function (S, index, unicode) {
		  return index + (unicode ? charAt$1(S, index).length : 1);
		};

		// `RegExpExec` abstract operation
		// https://tc39.github.io/ecma262/#sec-regexpexec
		var regexpExecAbstract = function (R, S) {
		  var exec = R.exec;
		  if (typeof exec === 'function') {
		    var result = exec.call(R, S);
		    if (typeof result !== 'object') {
		      throw TypeError('RegExp exec method returned something other than an Object or null');
		    }
		    return result;
		  }

		  if (classofRaw(R) !== 'RegExp') {
		    throw TypeError('RegExp#exec called on incompatible receiver');
		  }

		  return regexpExec.call(R, S);
		};

		var arrayPush = [].push;
		var min$2 = Math.min;
		var MAX_UINT32 = 0xFFFFFFFF;

		// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
		var SUPPORTS_Y = !fails(function () { return !RegExp(MAX_UINT32, 'y'); });

		// @@split logic
		fixRegexpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
		  var internalSplit;
		  if (
		    'abbc'.split(/(b)*/)[1] == 'c' ||
		    'test'.split(/(?:)/, -1).length != 4 ||
		    'ab'.split(/(?:ab)*/).length != 2 ||
		    '.'.split(/(.?)(.?)/).length != 4 ||
		    '.'.split(/()()/).length > 1 ||
		    ''.split(/.?/).length
		  ) {
		    // based on es5-shim implementation, need to rework it
		    internalSplit = function (separator, limit) {
		      var string = String(requireObjectCoercible(this));
		      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
		      if (lim === 0) return [];
		      if (separator === undefined) return [string];
		      // If `separator` is not a regex, use native split
		      if (!isRegexp(separator)) {
		        return nativeSplit.call(string, separator, lim);
		      }
		      var output = [];
		      var flags = (separator.ignoreCase ? 'i' : '') +
		                  (separator.multiline ? 'm' : '') +
		                  (separator.unicode ? 'u' : '') +
		                  (separator.sticky ? 'y' : '');
		      var lastLastIndex = 0;
		      // Make `global` and avoid `lastIndex` issues by working with a copy
		      var separatorCopy = new RegExp(separator.source, flags + 'g');
		      var match, lastIndex, lastLength;
		      while (match = regexpExec.call(separatorCopy, string)) {
		        lastIndex = separatorCopy.lastIndex;
		        if (lastIndex > lastLastIndex) {
		          output.push(string.slice(lastLastIndex, match.index));
		          if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
		          lastLength = match[0].length;
		          lastLastIndex = lastIndex;
		          if (output.length >= lim) break;
		        }
		        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
		      }
		      if (lastLastIndex === string.length) {
		        if (lastLength || !separatorCopy.test('')) output.push('');
		      } else output.push(string.slice(lastLastIndex));
		      return output.length > lim ? output.slice(0, lim) : output;
		    };
		  // Chakra, V8
		  } else if ('0'.split(undefined, 0).length) {
		    internalSplit = function (separator, limit) {
		      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
		    };
		  } else internalSplit = nativeSplit;

		  return [
		    // `String.prototype.split` method
		    // https://tc39.github.io/ecma262/#sec-string.prototype.split
		    function split(separator, limit) {
		      var O = requireObjectCoercible(this);
		      var splitter = separator == undefined ? undefined : separator[SPLIT];
		      return splitter !== undefined
		        ? splitter.call(separator, O, limit)
		        : internalSplit.call(String(O), separator, limit);
		    },
		    // `RegExp.prototype[@@split]` method
		    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
		    //
		    // NOTE: This cannot be properly polyfilled in engines that don't support
		    // the 'y' flag.
		    function (regexp, limit) {
		      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
		      if (res.done) return res.value;

		      var rx = anObject(regexp);
		      var S = String(this);
		      var C = speciesConstructor(rx, RegExp);

		      var unicodeMatching = rx.unicode;
		      var flags = (rx.ignoreCase ? 'i' : '') +
		                  (rx.multiline ? 'm' : '') +
		                  (rx.unicode ? 'u' : '') +
		                  (SUPPORTS_Y ? 'y' : 'g');

		      // ^(? + rx + ) is needed, in combination with some S slicing, to
		      // simulate the 'y' flag.
		      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
		      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
		      if (lim === 0) return [];
		      if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
		      var p = 0;
		      var q = 0;
		      var A = [];
		      while (q < S.length) {
		        splitter.lastIndex = SUPPORTS_Y ? q : 0;
		        var z = regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
		        var e;
		        if (
		          z === null ||
		          (e = min$2(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
		        ) {
		          q = advanceStringIndex(S, q, unicodeMatching);
		        } else {
		          A.push(S.slice(p, q));
		          if (A.length === lim) return A;
		          for (var i = 1; i <= z.length - 1; i++) {
		            A.push(z[i]);
		            if (A.length === lim) return A;
		          }
		          q = p = e;
		        }
		      }
		      A.push(S.slice(p));
		      return A;
		    }
		  ];
		}, !SUPPORTS_Y);

		var pure = createCommonjsModule(function (module, exports) {

		var proxiesSet = new WeakSet();
		var GlobalProxy = Proxy;

		exports.Proxy = new GlobalProxy(GlobalProxy, {
		  construct(target, args) {
		    var proxy = Reflect.construct(target, args);
		    proxiesSet.add(proxy);
		    return proxy;
		  }
		});

		exports.Proxy.revocable = new GlobalProxy(GlobalProxy.revocable, {
		  apply(target, thisArg, argumentsList) {
		    var proxyObj = Reflect.apply(target, thisArg, argumentsList);
		    proxiesSet.add(proxyObj.proxy);
		    return proxyObj;  
		  }
		});

		/**
		 * Checks whether a value is a proxy object
		 *
		 * @param {*} o
		 * @returns {boolean} a boolean, true if value is a proxy object, false if it is not
		 */
		exports.isProxy = function isProxy(o) {
		  return proxiesSet.has(o);
		};
		});

		var isProxy = createCommonjsModule(function (module, exports) {

		(function(scope) {
		  var pure$1 = pure;
		  scope.Proxy = pure$1.Proxy;
		  exports.isProxy = pure$1.isProxy;
		})(
		  (typeof process !== 'undefined' &&
		    {}.toString.call(process) === '[object process]') ||
		    (typeof navigator !== 'undefined' && navigator.product === 'ReactNative')
		    ? commonjsGlobal$1
		    : self
		);
		});

		var isProxy$1 = isProxy.isProxy; // check-is(Object)

		var isObject$1 = function isObject(target) {
		  return Object.prototype.toString.call(target) === '[object Object]' && !isProxy$1(target);
		}; // check-is(Array)

		var isArray$1 = function isArray(target) {
		  return Array.isArray(target);
		}; // check-is(Set)

		var isSet = function isSet(target) {
		  return target instanceof Set;
		}; // check-is(Map)

		var isMap = function isMap(target) {
		  return target instanceof Map;
		}; // check if is certain type

		var isType = function isType(target, type) {
		  var _object$array$set$map, _object$array$set$map2, _object$array$set$map3;

		  return (_object$array$set$map = (_object$array$set$map2 = {
		    object: isObject$1,
		    array: isArray$1,
		    set: isSet,
		    map: isMap,
		    proxy: isProxy$1
		  }) === null || _object$array$set$map2 === void 0 ? void 0 : (_object$array$set$map3 = _object$array$set$map2[type]) === null || _object$array$set$map3 === void 0 ? void 0 : _object$array$set$map3.call(_object$array$set$map2, target)) !== null && _object$array$set$map !== void 0 ? _object$array$set$map : false;
		}; // upper-case the first letter of string

		var formatType = function formatType(type) {
		  var array = type.split('');
		  array[0] = array[0].toUpperCase();
		  return array.join('');
		}; // throw a type error

		var typeError = function typeError(value, type) {
		  return new Error("Type-Error: ".concat(value, " is not an instance of ").concat(formatType(type)));
		};

		var mergeProperty = function mergeProperty(target, value) {
		  if (isObject$1(value)) {
		    var merged = target !== null && target !== void 0 ? target : {};
		    return mergeObject(merged, value);
		  } else if (isArray$1(value)) {
		    var _merged = isArray$1(target) ? target : [];

		    return mergeArray(_merged, value);
		  } else if (isSet(value)) {
		    var _merged2 = isSet(target) ? target : new Set();

		    return mergeSet(_merged2, value);
		  } else if (isMap(value)) {
		    var _merged3 = isMap(target) ? target : new Map();

		    return mergeMap(_merged3, value);
		  } else {
		    return value;
		  }
		}; // merge Objects


		var mergeObject = function mergeObject() {
		  for (var _len = arguments.length, objects = new Array(_len), _key = 0; _key < _len; _key++) {
		    objects[_key] = arguments[_key];
		  }

		  return objects.reduce(function (collection, object) {
		    if (!isType(object, 'object')) {
		      throw typeError(object, 'object');
		    }

		    return Object.keys(object).reduce(function (merged, key) {
		      merged[key] = mergeProperty(merged[key], object[key]);
		      return merged;
		    }, collection);
		  });
		}; // merge Arrays


		var mergeArray = function mergeArray() {
		  for (var _len2 = arguments.length, arrays = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
		    arrays[_key2] = arguments[_key2];
		  }

		  return arrays.reduce(function (collection, array) {
		    if (!isType(array, 'array')) {
		      throw typeError(array, 'array');
		    }

		    array.forEach(function (arrayItem, arrayIndex) {
		      collection[arrayIndex] = mergeProperty(collection[arrayIndex], arrayItem);
		      return collection;
		    });
		    return collection;
		  });
		}; // merge Sets


		var mergeSet = function mergeSet() {
		  for (var _len3 = arguments.length, sets = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
		    sets[_key3] = arguments[_key3];
		  }

		  var result = sets.reduce(function (collection, set) {
		    if (!isType(set, 'set')) {
		      throw typeError(set, 'set');
		    }

		    _toConsumableArray(set).forEach(function (value, index) {
		      collection[index] = mergeProperty(collection[index], value);
		    });

		    return collection;
		  }, []);
		  return new Set(_toConsumableArray(result));
		}; // merge Maps


		var mergeMap = function mergeMap() {
		  for (var _len4 = arguments.length, maps = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
		    maps[_key4] = arguments[_key4];
		  }

		  return maps.reduce(function (collection, map) {
		    if (!isType(map, 'map')) {
		      throw typeError(map, 'map');
		    }

		    var _iterator = _createForOfIteratorHelper(map.entries()),
		        _step;

		    try {
		      for (_iterator.s(); !(_step = _iterator.n()).done;) {
		        var _step$value = _slicedToArray(_step.value, 2),
		            key = _step$value[0],
		            value = _step$value[1];

		        collection.set(key, mergeProperty(collection.get(key), value));
		      }
		    } catch (err) {
		      _iterator.e(err);
		    } finally {
		      _iterator.f();
		    }

		    return collection;
		  }, new Map());
		}; // main function, merge freely
		// also this is the default export of the module


		var merge = function merge() {
		  for (var _len5 = arguments.length, params = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
		    params[_key5] = arguments[_key5];
		  }

		  return params.reduce(function (collection, param) {
		    return mergeProperty(collection, param);
		  });
		}; // exports

		exports.default = merge;
		exports.merge = merge;
		exports.mergeArray = mergeArray;
		exports.mergeMap = mergeMap;
		exports.mergeObject = mergeObject;
		exports.mergeSet = mergeSet;

		Object.defineProperty(exports, '__esModule', { value: true });

	})));
	});

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	// `Object.defineProperties` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperties
	var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
	  return O;
	};

	var html = getBuiltIn('document', 'documentElement');

	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO = sharedKey('IE_PROTO');

	var EmptyConstructor = function () { /* empty */ };

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	};

	// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak
	  return temp;
	};

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe);
	  // https://github.com/zloirock/core-js/issues/475
	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	};

	// Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug
	var activeXDocument;
	var NullProtoObject = function () {
	  try {
	    /* global ActiveXObject */
	    activeXDocument = document.domain && new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
	  return NullProtoObject();
	};

	hiddenKeys[IE_PROTO] = true;

	// `Object.create` method
	// https://tc39.github.io/ecma262/#sec-object.create
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : objectDefineProperties(result, Properties);
	};

	var nativeGetOwnPropertyNames = objectGetOwnPropertyNames.f;

	var toString$1 = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return nativeGetOwnPropertyNames(it);
	  } catch (error) {
	    return windowNames.slice();
	  }
	};

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var f$5 = function getOwnPropertyNames(it) {
	  return windowNames && toString$1.call(it) == '[object Window]'
	    ? getWindowNames(it)
	    : nativeGetOwnPropertyNames(toIndexedObject(it));
	};

	var objectGetOwnPropertyNamesExternal = {
		f: f$5
	};

	var f$6 = wellKnownSymbol;

	var wellKnownSymbolWrapped = {
		f: f$6
	};

	var defineProperty = objectDefineProperty.f;

	var defineWellKnownSymbol = function (NAME) {
	  var Symbol = path.Symbol || (path.Symbol = {});
	  if (!has(Symbol, NAME)) defineProperty(Symbol, NAME, {
	    value: wellKnownSymbolWrapped.f(NAME)
	  });
	};

	var defineProperty$1 = objectDefineProperty.f;



	var TO_STRING_TAG = wellKnownSymbol('toStringTag');

	var setToStringTag = function (it, TAG, STATIC) {
	  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
	    defineProperty$1(it, TO_STRING_TAG, { configurable: true, value: TAG });
	  }
	};

	var aFunction$1 = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  } return it;
	};

	// optional / simple context binding
	var functionBindContext = function (fn, that, length) {
	  aFunction$1(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 0: return function () {
	      return fn.call(that);
	    };
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var push = [].push;

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
	var createMethod$1 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject($this);
	    var self = indexedObject(O);
	    var boundFunction = functionBindContext(callbackfn, that, 3);
	    var length = toLength(self.length);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate;
	    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
	    var value, result;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);
	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	          case 3: return true;              // some
	          case 5: return value;             // find
	          case 6: return index;             // findIndex
	          case 2: push.call(target, value); // filter
	        } else if (IS_EVERY) return false;  // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$1(0),
	  // `Array.prototype.map` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.map
	  map: createMethod$1(1),
	  // `Array.prototype.filter` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
	  filter: createMethod$1(2),
	  // `Array.prototype.some` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.some
	  some: createMethod$1(3),
	  // `Array.prototype.every` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.every
	  every: createMethod$1(4),
	  // `Array.prototype.find` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.find
	  find: createMethod$1(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$1(6)
	};

	var $forEach = arrayIteration.forEach;

	var HIDDEN = sharedKey('hidden');
	var SYMBOL = 'Symbol';
	var PROTOTYPE$1 = 'prototype';
	var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
	var setInternalState = internalState.set;
	var getInternalState = internalState.getterFor(SYMBOL);
	var ObjectPrototype = Object[PROTOTYPE$1];
	var $Symbol = global_1.Symbol;
	var $stringify = getBuiltIn('JSON', 'stringify');
	var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	var nativeDefineProperty$1 = objectDefineProperty.f;
	var nativeGetOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;
	var nativePropertyIsEnumerable$1 = objectPropertyIsEnumerable.f;
	var AllSymbols = shared('symbols');
	var ObjectPrototypeSymbols = shared('op-symbols');
	var StringToSymbolRegistry = shared('string-to-symbol-registry');
	var SymbolToStringRegistry = shared('symbol-to-string-registry');
	var WellKnownSymbolsStore$1 = shared('wks');
	var QObject = global_1.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDescriptor = descriptors && fails(function () {
	  return objectCreate(nativeDefineProperty$1({}, 'a', {
	    get: function () { return nativeDefineProperty$1(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (O, P, Attributes) {
	  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$1(ObjectPrototype, P);
	  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
	  nativeDefineProperty$1(O, P, Attributes);
	  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
	    nativeDefineProperty$1(ObjectPrototype, P, ObjectPrototypeDescriptor);
	  }
	} : nativeDefineProperty$1;

	var wrap = function (tag, description) {
	  var symbol = AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]);
	  setInternalState(symbol, {
	    type: SYMBOL,
	    tag: tag,
	    description: description
	  });
	  if (!descriptors) symbol.description = description;
	  return symbol;
	};

	var isSymbol = useSymbolAsUid ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  return Object(it) instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(O, P, Attributes) {
	  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
	  anObject(O);
	  var key = toPrimitive(P, true);
	  anObject(Attributes);
	  if (has(AllSymbols, key)) {
	    if (!Attributes.enumerable) {
	      if (!has(O, HIDDEN)) nativeDefineProperty$1(O, HIDDEN, createPropertyDescriptor(1, {}));
	      O[HIDDEN][key] = true;
	    } else {
	      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
	      Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
	    } return setSymbolDescriptor(O, key, Attributes);
	  } return nativeDefineProperty$1(O, key, Attributes);
	};

	var $defineProperties = function defineProperties(O, Properties) {
	  anObject(O);
	  var properties = toIndexedObject(Properties);
	  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
	  $forEach(keys, function (key) {
	    if (!descriptors || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
	  });
	  return O;
	};

	var $create = function create(O, Properties) {
	  return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
	};

	var $propertyIsEnumerable = function propertyIsEnumerable(V) {
	  var P = toPrimitive(V, true);
	  var enumerable = nativePropertyIsEnumerable$1.call(this, P);
	  if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
	  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
	};

	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
	  var it = toIndexedObject(O);
	  var key = toPrimitive(P, true);
	  if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
	  var descriptor = nativeGetOwnPropertyDescriptor$1(it, key);
	  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
	    descriptor.enumerable = true;
	  }
	  return descriptor;
	};

	var $getOwnPropertyNames = function getOwnPropertyNames(O) {
	  var names = nativeGetOwnPropertyNames$1(toIndexedObject(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
	  });
	  return result;
	};

	var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
	  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
	  var names = nativeGetOwnPropertyNames$1(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
	      result.push(AllSymbols[key]);
	    }
	  });
	  return result;
	};

	// `Symbol` constructor
	// https://tc39.github.io/ecma262/#sec-symbol-constructor
	if (!nativeSymbol) {
	  $Symbol = function Symbol() {
	    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
	    var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
	    var tag = uid(description);
	    var setter = function (value) {
	      if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
	      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
	    };
	    if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
	    return wrap(tag, description);
	  };

	  redefine($Symbol[PROTOTYPE$1], 'toString', function toString() {
	    return getInternalState(this).tag;
	  });

	  redefine($Symbol, 'withoutSetter', function (description) {
	    return wrap(uid(description), description);
	  });

	  objectPropertyIsEnumerable.f = $propertyIsEnumerable;
	  objectDefineProperty.f = $defineProperty;
	  objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
	  objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames;
	  objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

	  wellKnownSymbolWrapped.f = function (name) {
	    return wrap(wellKnownSymbol(name), name);
	  };

	  if (descriptors) {
	    // https://github.com/tc39/proposal-Symbol-description
	    nativeDefineProperty$1($Symbol[PROTOTYPE$1], 'description', {
	      configurable: true,
	      get: function description() {
	        return getInternalState(this).description;
	      }
	    });
	    {
	      redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
	    }
	  }
	}

	_export({ global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, {
	  Symbol: $Symbol
	});

	$forEach(objectKeys(WellKnownSymbolsStore$1), function (name) {
	  defineWellKnownSymbol(name);
	});

	_export({ target: SYMBOL, stat: true, forced: !nativeSymbol }, {
	  // `Symbol.for` method
	  // https://tc39.github.io/ecma262/#sec-symbol.for
	  'for': function (key) {
	    var string = String(key);
	    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
	    var symbol = $Symbol(string);
	    StringToSymbolRegistry[string] = symbol;
	    SymbolToStringRegistry[symbol] = string;
	    return symbol;
	  },
	  // `Symbol.keyFor` method
	  // https://tc39.github.io/ecma262/#sec-symbol.keyfor
	  keyFor: function keyFor(sym) {
	    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
	    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
	  },
	  useSetter: function () { USE_SETTER = true; },
	  useSimple: function () { USE_SETTER = false; }
	});

	_export({ target: 'Object', stat: true, forced: !nativeSymbol, sham: !descriptors }, {
	  // `Object.create` method
	  // https://tc39.github.io/ecma262/#sec-object.create
	  create: $create,
	  // `Object.defineProperty` method
	  // https://tc39.github.io/ecma262/#sec-object.defineproperty
	  defineProperty: $defineProperty,
	  // `Object.defineProperties` method
	  // https://tc39.github.io/ecma262/#sec-object.defineproperties
	  defineProperties: $defineProperties,
	  // `Object.getOwnPropertyDescriptor` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
	});

	_export({ target: 'Object', stat: true, forced: !nativeSymbol }, {
	  // `Object.getOwnPropertyNames` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // `Object.getOwnPropertySymbols` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
	// https://bugs.chromium.org/p/v8/issues/detail?id=3443
	_export({ target: 'Object', stat: true, forced: fails(function () { objectGetOwnPropertySymbols.f(1); }) }, {
	  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
	    return objectGetOwnPropertySymbols.f(toObject(it));
	  }
	});

	// `JSON.stringify` method behavior with symbols
	// https://tc39.github.io/ecma262/#sec-json.stringify
	if ($stringify) {
	  var FORCED_JSON_STRINGIFY = !nativeSymbol || fails(function () {
	    var symbol = $Symbol();
	    // MS Edge converts symbol values to JSON as {}
	    return $stringify([symbol]) != '[null]'
	      // WebKit converts symbol values to JSON as null
	      || $stringify({ a: symbol }) != '{}'
	      // V8 throws on boxed symbols
	      || $stringify(Object(symbol)) != '{}';
	  });

	  _export({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
	    // eslint-disable-next-line no-unused-vars
	    stringify: function stringify(it, replacer, space) {
	      var args = [it];
	      var index = 1;
	      var $replacer;
	      while (arguments.length > index) args.push(arguments[index++]);
	      $replacer = replacer;
	      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	      if (!isArray(replacer)) replacer = function (key, value) {
	        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
	        if (!isSymbol(value)) return value;
	      };
	      args[1] = replacer;
	      return $stringify.apply(null, args);
	    }
	  });
	}

	// `Symbol.prototype[@@toPrimitive]` method
	// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
	if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE]) {
	  createNonEnumerableProperty($Symbol[PROTOTYPE$1], TO_PRIMITIVE, $Symbol[PROTOTYPE$1].valueOf);
	}
	// `Symbol.prototype[@@toStringTag]` property
	// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
	setToStringTag($Symbol, SYMBOL);

	hiddenKeys[HIDDEN] = true;

	var defineProperty$2 = objectDefineProperty.f;


	var NativeSymbol = global_1.Symbol;

	if (descriptors && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
	  // Safari 12 bug
	  NativeSymbol().description !== undefined
	)) {
	  var EmptyStringDescriptionStore = {};
	  // wrap Symbol constructor for correct work with undefined description
	  var SymbolWrapper = function Symbol() {
	    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
	    var result = this instanceof SymbolWrapper
	      ? new NativeSymbol(description)
	      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
	      : description === undefined ? NativeSymbol() : NativeSymbol(description);
	    if (description === '') EmptyStringDescriptionStore[result] = true;
	    return result;
	  };
	  copyConstructorProperties(SymbolWrapper, NativeSymbol);
	  var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
	  symbolPrototype.constructor = SymbolWrapper;

	  var symbolToString = symbolPrototype.toString;
	  var native = String(NativeSymbol('test')) == 'Symbol(test)';
	  var regexp = /^Symbol\((.*)\)[^)]+$/;
	  defineProperty$2(symbolPrototype, 'description', {
	    configurable: true,
	    get: function description() {
	      var symbol = isObject(this) ? this.valueOf() : this;
	      var string = symbolToString.call(symbol);
	      if (has(EmptyStringDescriptionStore, symbol)) return '';
	      var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
	      return desc === '' ? undefined : desc;
	    }
	  });

	  _export({ global: true, forced: true }, {
	    Symbol: SymbolWrapper
	  });
	}

	var defineProperty$3 = Object.defineProperty;
	var cache = {};

	var thrower = function (it) { throw it; };

	var arrayMethodUsesToLength = function (METHOD_NAME, options) {
	  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
	  if (!options) options = {};
	  var method = [][METHOD_NAME];
	  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
	  var argument0 = has(options, 0) ? options[0] : thrower;
	  var argument1 = has(options, 1) ? options[1] : undefined;

	  return cache[METHOD_NAME] = !!method && !fails(function () {
	    if (ACCESSORS && !descriptors) return true;
	    var O = { length: -1 };

	    if (ACCESSORS) defineProperty$3(O, 1, { enumerable: true, get: thrower });
	    else O[1] = 1;

	    method.call(O, argument0, argument1);
	  });
	};

	var $filter = arrayIteration.filter;



	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');
	// Edge 14- issue
	var USES_TO_LENGTH = arrayMethodUsesToLength('filter');

	// `Array.prototype.filter` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.filter
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
	  filter: function filter(callbackfn /* , thisArg */) {
	    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal
	    method.call(null, argument || function () { throw 1; }, 1);
	  });
	};

	var $forEach$1 = arrayIteration.forEach;



	var STRICT_METHOD = arrayMethodIsStrict('forEach');
	var USES_TO_LENGTH$1 = arrayMethodUsesToLength('forEach');

	// `Array.prototype.forEach` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	var arrayForEach = (!STRICT_METHOD || !USES_TO_LENGTH$1) ? function forEach(callbackfn /* , thisArg */) {
	  return $forEach$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	} : [].forEach;

	// `Array.prototype.forEach` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	_export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, {
	  forEach: arrayForEach
	});

	// `Array.isArray` method
	// https://tc39.github.io/ecma262/#sec-array.isarray
	_export({ target: 'Array', stat: true }, {
	  isArray: isArray
	});

	var defineProperty$4 = objectDefineProperty.f;

	var FunctionPrototype = Function.prototype;
	var FunctionPrototypeToString = FunctionPrototype.toString;
	var nameRE = /^\s*function ([^ (]*)/;
	var NAME = 'name';

	// Function instances `.name` property
	// https://tc39.github.io/ecma262/#sec-function-instances-name
	if (descriptors && !(NAME in FunctionPrototype)) {
	  defineProperty$4(FunctionPrototype, NAME, {
	    configurable: true,
	    get: function () {
	      try {
	        return FunctionPrototypeToString.call(this).match(nameRE)[1];
	      } catch (error) {
	        return '';
	      }
	    }
	  });
	}

	var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
	var test = {};

	test[TO_STRING_TAG$1] = 'z';

	var toStringTagSupport = String(test) === '[object z]';

	var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');
	// ES3 wrong here
	var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) { /* empty */ }
	};

	// getting tag from ES6+ `Object.prototype.toString`
	var classof = toStringTagSupport ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$2)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS ? classofRaw(O)
	    // ES3 arguments fallback
	    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
	};

	// `Object.prototype.toString` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	var objectToString = toStringTagSupport ? {}.toString : function toString() {
	  return '[object ' + classof(this) + ']';
	};

	// `Object.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	if (!toStringTagSupport) {
	  redefine(Object.prototype, 'toString', objectToString, { unsafe: true });
	}

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	for (var COLLECTION_NAME in domIterables) {
	  var Collection = global_1[COLLECTION_NAME];
	  var CollectionPrototype = Collection && Collection.prototype;
	  // some Chrome versions have non-configurable methods on DOMTokenList
	  if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
	    createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
	  } catch (error) {
	    CollectionPrototype.forEach = arrayForEach;
	  }
	}

	// chain(util)
	var generateToken = function generateToken() {
	  return Symbol('token');
	};

	var ChainStatus = {
	  Ready: Symbol('ready'),
	  Progress: Symbol('progress'),
	  Bubbling: Symbol('bubbling'),
	  Finished: Symbol('finished'),
	  Canceled: Symbol('canceled')
	};

	var initializeContext = function initializeContext() {
	  var context = {
	    token: generateToken(),
	    queue: [],
	    hooks: {},
	    data: {
	      caller: null,
	      status: ChainStatus.Ready
	    }
	  };

	  for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
	    params[_key] = arguments[_key];
	  }

	  return dist.merge.apply(void 0, [context].concat(params));
	};

	var useMiddleware = function useMiddleware(context, injection, next) {
	  var _injection$name;

	  if (typeof injection !== 'function') {
	    throw new Error('injection must be an instance of Function');
	  }

	  context.queue.push({
	    token: context.token,
	    name: (_injection$name = injection.name) !== null && _injection$name !== void 0 ? _injection$name : 'anonymous',
	    action: function action() {
	      return injection(context.data, next);
	    }
	  });
	};

	var createNext = function createNext(context) {
	  var queue = context.queue;
	  return /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
	    var forward,
	        task,
	        _args = arguments;
	    return regeneratorRuntime.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            forward = _args.length > 0 && _args[0] !== undefined ? _args[0] : true;

	            if (!forward) {
	              cancelProgress(context);
	            }

	            if (!(context.data.status === ChainStatus.Canceled)) {
	              _context.next = 4;
	              break;
	            }

	            throw {
	              status: ChainStatus.Canceled
	            };

	          case 4:
	            if (!queue.length) {
	              _context.next = 11;
	              break;
	            }

	            task = queue.shift();
	            triggerHook(context, 'onProgress', task);
	            _context.next = 9;
	            return task.action(context, createNext(context));

	          case 9:
	            _context.next = 13;
	            break;

	          case 11:
	            context.data.status = ChainStatus.Bubbling;
	            triggerHook(context, 'onBubbling');

	          case 13:
	          case "end":
	            return _context.stop();
	        }
	      }
	    }, _callee);
	  }));
	};

	var startProgress = function startProgress(context) {
	  return /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
	    return regeneratorRuntime.wrap(function _callee2$(_context2) {
	      while (1) {
	        switch (_context2.prev = _context2.next) {
	          case 0:
	            triggerHook(context, 'onStart');
	            context.data.status = ChainStatus.Progress;
	            _context2.prev = 2;
	            _context2.next = 5;
	            return createNext(context)();

	          case 5:
	            context.data.status = ChainStatus.Finished;
	            triggerHook(context, 'onFinish');
	            _context2.next = 16;
	            break;

	          case 9:
	            _context2.prev = 9;
	            _context2.t0 = _context2["catch"](2);

	            if (!(_context2.t0.status === ChainStatus.Canceled)) {
	              _context2.next = 15;
	              break;
	            }

	            triggerHook(context, 'onCanceled');
	            _context2.next = 16;
	            break;

	          case 15:
	            throw _context2.t0;

	          case 16:
	          case "end":
	            return _context2.stop();
	        }
	      }
	    }, _callee2, null, [[2, 9]]);
	  }));
	};

	var cancelProgress = function cancelProgress(context) {
	  triggerHook(context, 'onBeforeCancel');
	  context.data.status = ChainStatus.Canceled;
	};

	var hackContext = function hackContext(context, injection) {
	  triggerHook(context, 'onBeforeHack');

	  if (typeof injection !== 'function') {
	    throw new Error('injection must be an instance of Function');
	  }

	  context = injection(context);
	  triggerHook(context, 'onHacked');
	  return context;
	};

	var useHook = function useHook(context, getData, type, callback) {
	  if (typeof getData !== 'function') {
	    throw new Error("Param 'getData' must be an instance of Function");
	  }

	  if (typeof callback !== 'function') {
	    throw new Error("Param 'callback' must be an instance of Function");
	  }

	  if (!type) {
	    throw new Error("Can't find param 'type'");
	  }

	  if (!context.hooks[type]) {
	    context.hooks[type] = [];
	  }

	  context.hooks[type].push({
	    getData: getData,
	    callback: callback
	  });
	};

	var removeHook = function removeHook(context, target) {
	  if (!target) {
	    throw new Error("can't find param 'target'");
	  }

	  var hooks = context.hooks;

	  for (var key in hooks) {
	    var _hooks$key;

	    if (!Object.prototype.hasOwnProperty.call(hooks, key)) continue;
	    if (!((_hooks$key = hooks[key]) === null || _hooks$key === void 0 ? void 0 : _hooks$key.length)) continue;
	    hooks[key] = hooks[key].filter(function (hook) {
	      return hook.callback !== target;
	    });
	  }
	};

	var removeHooks = function removeHooks(context, type) {
	  if (!type) {
	    context.hooks = {};
	    return;
	  }

	  var types = Array.isArray(type) ? type : type.spilit(' ');
	  types.forEach(function (type) {
	    context.hooks[type] = [];
	  });
	};

	var triggerHook = function triggerHook(context, type) {
	  var _context$hooks;

	  for (var _len2 = arguments.length, params = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
	    params[_key2 - 2] = arguments[_key2];
	  }

	  if (!type) {
	    throw new Error("can't find param 'type'");
	  }

	  var hooks = context === null || context === void 0 ? void 0 : (_context$hooks = context.hooks) === null || _context$hooks === void 0 ? void 0 : _context$hooks[type];

	  if (hooks && (hooks === null || hooks === void 0 ? void 0 : hooks.length)) {
	    hooks.forEach(function (hook) {
	      hook.callback.apply(hook, [hook.getData()].concat(params));
	    });
	    return true;
	  } else {
	    return false;
	  }
	};

	var ChainBuilder = /*#__PURE__*/function () {
	  // initialize chain instance
	  function ChainBuilder() {
	    _classCallCheck(this, ChainBuilder);

	    // create context
	    this._context = initializeContext();

	    for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
	      params[_key] = arguments[_key];
	    }

	    dist.merge.apply(void 0, [this._context.data].concat(params));
	    return this;
	  } // context


	  _createClass(ChainBuilder, [{
	    key: "context",
	    value: function context() {
	      for (var _len2 = arguments.length, params = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        params[_key2] = arguments[_key2];
	      }

	      dist.merge.apply(void 0, [this._context.data].concat(params));
	      return this;
	    }
	  }, {
	    key: "hack",
	    value: function hack(injection) {
	      hackContext(this._context, injection);
	      return this;
	    } // middleware

	  }, {
	    key: "use",
	    value: function use(injection) {
	      useMiddleware(this._context, injection, createNext(this._context));
	      return this;
	    }
	  }, {
	    key: "start",
	    value: function () {
	      var _start = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
	        return regeneratorRuntime.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                _context.next = 2;
	                return startProgress(this._context)();

	              case 2:
	                return _context.abrupt("return", this);

	              case 3:
	              case "end":
	                return _context.stop();
	            }
	          }
	        }, _callee, this);
	      }));

	      function start() {
	        return _start.apply(this, arguments);
	      }

	      return start;
	    }()
	  }, {
	    key: "cancel",
	    value: function cancel() {
	      cancelProgress(this._context);
	      return this;
	    } // hooks

	  }, {
	    key: "on",
	    value: function on(type, callback) {
	      var _this = this;

	      useHook(this._context, function () {
	        return _this._context.data;
	      }, type, callback);
	      return this;
	    }
	  }, {
	    key: "off",
	    value: function off(target) {
	      if (typeof target === 'function') {
	        removeHook(this._context, target);
	      } else {
	        removeHooks(target);
	      }

	      return this;
	    }
	  }, {
	    key: "emit",
	    value: function emit(type) {
	      triggerHook(this._context, type);
	      return this;
	    } // life-circle-hooks

	  }, {
	    key: "onStart",
	    value: function onStart(callback) {
	      this.on('onStart', callback);
	      return this;
	    }
	  }, {
	    key: "onProgress",
	    value: function onProgress(callback) {
	      this.on('onProgress', callback);
	      return this;
	    }
	  }, {
	    key: "onBeforeCancel",
	    value: function onBeforeCancel(callback) {
	      this.on('onBeforeCancel', callback);
	      return this;
	    }
	  }, {
	    key: "onCanceled",
	    value: function onCanceled(callback) {
	      this.on('onCanceled', callback);
	      return this;
	    }
	  }, {
	    key: "onBubbling",
	    value: function onBubbling(callback) {
	      this.on('onBubbling', callback);
	      return this;
	    }
	  }, {
	    key: "onFinish",
	    value: function onFinish(callback) {
	      this.on('onFinish', callback);
	      return this;
	    } // hack-hooks

	  }, {
	    key: "onBeforeHack",
	    value: function onBeforeHack(callback) {
	      this.on('onBeforeHack', callback);
	      return this;
	    }
	  }, {
	    key: "onHacked",
	    value: function onHacked(callback) {
	      this.on('onHacked', callback);
	      return this;
	    }
	  }]);

	  return ChainBuilder;
	}();

	var chain = function chain() {
	  for (var _len3 = arguments.length, params = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	    params[_key3] = arguments[_key3];
	  }

	  return _construct(ChainBuilder, params);
	};

	exports.ChainBuilder = ChainBuilder;
	exports.ChainStatus = ChainStatus;
	exports.cancelProgress = cancelProgress;
	exports.chain = chain;
	exports.createNext = createNext;
	exports.hackContext = hackContext;
	exports.initializeContext = initializeContext;
	exports.removeHook = removeHook;
	exports.triggerHook = triggerHook;
	exports.useHook = useHook;
	exports.useMiddleware = useMiddleware;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
