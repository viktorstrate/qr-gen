(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.bL.aO === region.b4.aO)
	{
		return 'on line ' + region.bL.aO;
	}
	return 'on lines ' + region.bL.aO + ' through ' + region.b4.aO;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.dk,
		impl.dJ,
		impl.dG,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		T: func(record.T),
		bM: record.bM,
		bG: record.bG
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.T;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.bM;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.bG) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.dk,
		impl.dJ,
		impl.dG,
		function(sendToApp, initialModel) {
			var view = impl.dL;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.dk,
		impl.dJ,
		impl.dG,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.bK && impl.bK(sendToApp)
			var view = impl.dL;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.cX);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.dI) && (_VirtualDom_doc.title = title = doc.dI);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.du;
	var onUrlRequest = impl.dv;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		bK: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.cz === next.cz
							&& curr.cc === next.cc
							&& curr.cw.a === next.cw.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		dk: function(flags)
		{
			return A3(impl.dk, flags, _Browser_getUrl(), key);
		},
		dL: impl.dL,
		dJ: impl.dJ,
		dG: impl.dG
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { dg: 'hidden', cZ: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { dg: 'mozHidden', cZ: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { dg: 'msHidden', cZ: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { dg: 'webkitHidden', cZ: 'webkitvisibilitychange' }
		: { dg: 'hidden', cZ: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		cG: _Browser_getScene(),
		cN: {
			cP: _Browser_window.pageXOffset,
			cQ: _Browser_window.pageYOffset,
			cO: _Browser_doc.documentElement.clientWidth,
			cb: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		cO: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		cb: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			cG: {
				cO: node.scrollWidth,
				cb: node.scrollHeight
			},
			cN: {
				cP: node.scrollLeft,
				cQ: node.scrollTop,
				cO: node.clientWidth,
				cb: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			cG: _Browser_getScene(),
			cN: {
				cP: x,
				cQ: y,
				cO: _Browser_doc.documentElement.clientWidth,
				cb: _Browser_doc.documentElement.clientHeight
			},
			c9: {
				cP: x + rect.left,
				cQ: y + rect.top,
				cO: rect.width,
				cb: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



// DECODER

var _File_decoder = _Json_decodePrim(function(value) {
	// NOTE: checks if `File` exists in case this is run on node
	return (typeof File !== 'undefined' && value instanceof File)
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FILE', value);
});


// METADATA

function _File_name(file) { return file.name; }
function _File_mime(file) { return file.type; }
function _File_size(file) { return file.size; }

function _File_lastModified(file)
{
	return $elm$time$Time$millisToPosix(file.lastModified);
}


// DOWNLOAD

var _File_downloadNode;

function _File_getDownloadNode()
{
	return _File_downloadNode || (_File_downloadNode = document.createElement('a'));
}

var _File_download = F3(function(name, mime, content)
{
	return _Scheduler_binding(function(callback)
	{
		var blob = new Blob([content], {type: mime});

		// for IE10+
		if (navigator.msSaveOrOpenBlob)
		{
			navigator.msSaveOrOpenBlob(blob, name);
			return;
		}

		// for HTML5
		var node = _File_getDownloadNode();
		var objectUrl = URL.createObjectURL(blob);
		node.href = objectUrl;
		node.download = name;
		_File_click(node);
		URL.revokeObjectURL(objectUrl);
	});
});

function _File_downloadUrl(href)
{
	return _Scheduler_binding(function(callback)
	{
		var node = _File_getDownloadNode();
		node.href = href;
		node.download = '';
		node.origin === location.origin || (node.target = '_blank');
		_File_click(node);
	});
}


// IE COMPATIBILITY

function _File_makeBytesSafeForInternetExplorer(bytes)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/10
	// all other browsers can just run `new Blob([bytes])` directly with no problem
	//
	return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

function _File_click(node)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/11
	// all other browsers have MouseEvent and do not need this conditional stuff
	//
	if (typeof MouseEvent === 'function')
	{
		node.dispatchEvent(new MouseEvent('click'));
	}
	else
	{
		var event = document.createEvent('MouseEvents');
		event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		document.body.appendChild(node);
		node.dispatchEvent(event);
		document.body.removeChild(node);
	}
}


// UPLOAD

var _File_node;

function _File_uploadOne(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			callback(_Scheduler_succeed(event.target.files[0]));
		});
		_File_click(_File_node);
	});
}

function _File_uploadOneOrMore(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.multiple = true;
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			var elmFiles = _List_fromArray(event.target.files);
			callback(_Scheduler_succeed(_Utils_Tuple2(elmFiles.a, elmFiles.b)));
		});
		_File_click(_File_node);
	});
}


// CONTENT

function _File_toString(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsText(blob);
		return function() { reader.abort(); };
	});
}

function _File_toBytes(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(new DataView(reader.result)));
		});
		reader.readAsArrayBuffer(blob);
		return function() { reader.abort(); };
	});
}

function _File_toUrl(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsDataURL(blob);
		return function() { reader.abort(); };
	});
}



// BYTES

function _Bytes_width(bytes)
{
	return bytes.byteLength;
}

var _Bytes_getHostEndianness = F2(function(le, be)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(new Uint8Array(new Uint32Array([1]))[0] === 1 ? le : be));
	});
});


// ENCODERS

function _Bytes_encode(encoder)
{
	var mutableBytes = new DataView(new ArrayBuffer($elm$bytes$Bytes$Encode$getWidth(encoder)));
	$elm$bytes$Bytes$Encode$write(encoder)(mutableBytes)(0);
	return mutableBytes;
}


// SIGNED INTEGERS

var _Bytes_write_i8  = F3(function(mb, i, n) { mb.setInt8(i, n); return i + 1; });
var _Bytes_write_i16 = F4(function(mb, i, n, isLE) { mb.setInt16(i, n, isLE); return i + 2; });
var _Bytes_write_i32 = F4(function(mb, i, n, isLE) { mb.setInt32(i, n, isLE); return i + 4; });


// UNSIGNED INTEGERS

var _Bytes_write_u8  = F3(function(mb, i, n) { mb.setUint8(i, n); return i + 1 ;});
var _Bytes_write_u16 = F4(function(mb, i, n, isLE) { mb.setUint16(i, n, isLE); return i + 2; });
var _Bytes_write_u32 = F4(function(mb, i, n, isLE) { mb.setUint32(i, n, isLE); return i + 4; });


// FLOATS

var _Bytes_write_f32 = F4(function(mb, i, n, isLE) { mb.setFloat32(i, n, isLE); return i + 4; });
var _Bytes_write_f64 = F4(function(mb, i, n, isLE) { mb.setFloat64(i, n, isLE); return i + 8; });


// BYTES

var _Bytes_write_bytes = F3(function(mb, offset, bytes)
{
	for (var i = 0, len = bytes.byteLength, limit = len - 4; i <= limit; i += 4)
	{
		mb.setUint32(offset + i, bytes.getUint32(i));
	}
	for (; i < len; i++)
	{
		mb.setUint8(offset + i, bytes.getUint8(i));
	}
	return offset + len;
});


// STRINGS

function _Bytes_getStringWidth(string)
{
	for (var width = 0, i = 0; i < string.length; i++)
	{
		var code = string.charCodeAt(i);
		width +=
			(code < 0x80) ? 1 :
			(code < 0x800) ? 2 :
			(code < 0xD800 || 0xDBFF < code) ? 3 : (i++, 4);
	}
	return width;
}

var _Bytes_write_string = F3(function(mb, offset, string)
{
	for (var i = 0; i < string.length; i++)
	{
		var code = string.charCodeAt(i);
		offset +=
			(code < 0x80)
				? (mb.setUint8(offset, code)
				, 1
				)
				:
			(code < 0x800)
				? (mb.setUint16(offset, 0xC080 /* 0b1100000010000000 */
					| (code >>> 6 & 0x1F /* 0b00011111 */) << 8
					| code & 0x3F /* 0b00111111 */)
				, 2
				)
				:
			(code < 0xD800 || 0xDBFF < code)
				? (mb.setUint16(offset, 0xE080 /* 0b1110000010000000 */
					| (code >>> 12 & 0xF /* 0b00001111 */) << 8
					| code >>> 6 & 0x3F /* 0b00111111 */)
				, mb.setUint8(offset + 2, 0x80 /* 0b10000000 */
					| code & 0x3F /* 0b00111111 */)
				, 3
				)
				:
			(code = (code - 0xD800) * 0x400 + string.charCodeAt(++i) - 0xDC00 + 0x10000
			, mb.setUint32(offset, 0xF0808080 /* 0b11110000100000001000000010000000 */
				| (code >>> 18 & 0x7 /* 0b00000111 */) << 24
				| (code >>> 12 & 0x3F /* 0b00111111 */) << 16
				| (code >>> 6 & 0x3F /* 0b00111111 */) << 8
				| code & 0x3F /* 0b00111111 */)
			, 4
			);
	}
	return offset;
});


// DECODER

var _Bytes_decode = F2(function(decoder, bytes)
{
	try {
		return $elm$core$Maybe$Just(A2(decoder, bytes, 0).b);
	} catch(e) {
		return $elm$core$Maybe$Nothing;
	}
});

var _Bytes_read_i8  = F2(function(      bytes, offset) { return _Utils_Tuple2(offset + 1, bytes.getInt8(offset)); });
var _Bytes_read_i16 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 2, bytes.getInt16(offset, isLE)); });
var _Bytes_read_i32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getInt32(offset, isLE)); });
var _Bytes_read_u8  = F2(function(      bytes, offset) { return _Utils_Tuple2(offset + 1, bytes.getUint8(offset)); });
var _Bytes_read_u16 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 2, bytes.getUint16(offset, isLE)); });
var _Bytes_read_u32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getUint32(offset, isLE)); });
var _Bytes_read_f32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getFloat32(offset, isLE)); });
var _Bytes_read_f64 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 8, bytes.getFloat64(offset, isLE)); });

var _Bytes_read_bytes = F3(function(len, bytes, offset)
{
	return _Utils_Tuple2(offset + len, new DataView(bytes.buffer, bytes.byteOffset + offset, len));
});

var _Bytes_read_string = F3(function(len, bytes, offset)
{
	var string = '';
	var end = offset + len;
	for (; offset < end;)
	{
		var byte = bytes.getUint8(offset++);
		string +=
			(byte < 128)
				? String.fromCharCode(byte)
				:
			((byte & 0xE0 /* 0b11100000 */) === 0xC0 /* 0b11000000 */)
				? String.fromCharCode((byte & 0x1F /* 0b00011111 */) << 6 | bytes.getUint8(offset++) & 0x3F /* 0b00111111 */)
				:
			((byte & 0xF0 /* 0b11110000 */) === 0xE0 /* 0b11100000 */)
				? String.fromCharCode(
					(byte & 0xF /* 0b00001111 */) << 12
					| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 6
					| bytes.getUint8(offset++) & 0x3F /* 0b00111111 */
				)
				:
				(byte =
					((byte & 0x7 /* 0b00000111 */) << 18
						| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 12
						| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 6
						| bytes.getUint8(offset++) & 0x3F /* 0b00111111 */
					) - 0x10000
				, String.fromCharCode(Math.floor(byte / 0x400) + 0xD800, byte % 0x400 + 0xDC00)
				);
	}
	return _Utils_Tuple2(offset, string);
});

var _Bytes_decodeFailure = F2(function() { throw 0; });


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}


var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});


// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function(options, string)
{
	var flags = 'g';
	if (options.dr) { flags += 'm'; }
	if (options.cY) { flags += 'i'; }

	try
	{
		return $elm$core$Maybe$Just(new RegExp(string, flags));
	}
	catch(error)
	{
		return $elm$core$Maybe$Nothing;
	}
});


// USE

var _Regex_contains = F2(function(re, string)
{
	return string.match(re) !== null;
});


var _Regex_findAtMost = F3(function(n, re, str)
{
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex == re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		out.push(A4($elm$regex$Regex$Match, result[0], result.index, number, _List_fromArray(subs)));
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _List_fromArray(out);
});


var _Regex_replaceAtMost = F4(function(n, re, replacer, string)
{
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		return replacer(A4($elm$regex$Regex$Match, match, arguments[arguments.length - 2], count, _List_fromArray(submatches)));
	}
	return string.replace(re, jsReplacer);
});

var _Regex_splitAtMost = F3(function(n, re, str)
{
	var string = str;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		var result = re.exec(string);
		if (!result) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _List_fromArray(out);
});

var _Regex_infinity = Infinity;
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.i) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.l),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.l);
		} else {
			var treeLen = builder.i * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.m) : builder.m;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.i);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.l) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.l);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{m: nodeList, i: (len / $elm$core$Array$branchFactor) | 0, l: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {b9: fragment, cc: host, cu: path, cw: port_, cz: protocol, cA: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$document = _Browser_document;
var $author$project$QRTypes$QRText = function (a) {
	return {$: 0, a: a};
};
var $pablohirafuji$elm_qrcode$QRCode$Quartile = 2;
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$init = _Utils_Tuple2(
	{
		da: 2,
		dz: $author$project$QRTypes$QRText('')
	},
	$elm$core$Platform$Cmd$none);
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$file$File$Download$bytes = F3(
	function (name, mime, content) {
		return A2(
			$elm$core$Task$perform,
			$elm$core$Basics$never,
			A3(
				_File_download,
				name,
				mime,
				_File_makeBytesSafeForInternetExplorer(content)));
	});
var $pablohirafuji$elm_qrcode$QRCode$defaultImageOptions = {c1: 255, dm: 4294967295, dq: 5, cB: 4};
var $elm$bytes$Bytes$Encode$getWidth = function (builder) {
	switch (builder.$) {
		case 0:
			return 1;
		case 1:
			return 2;
		case 2:
			return 4;
		case 3:
			return 1;
		case 4:
			return 2;
		case 5:
			return 4;
		case 6:
			return 4;
		case 7:
			return 8;
		case 8:
			var w = builder.a;
			return w;
		case 9:
			var w = builder.a;
			return w;
		default:
			var bs = builder.a;
			return _Bytes_width(bs);
	}
};
var $elm$bytes$Bytes$LE = 0;
var $elm$bytes$Bytes$Encode$write = F3(
	function (builder, mb, offset) {
		switch (builder.$) {
			case 0:
				var n = builder.a;
				return A3(_Bytes_write_i8, mb, offset, n);
			case 1:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_i16, mb, offset, n, !e);
			case 2:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_i32, mb, offset, n, !e);
			case 3:
				var n = builder.a;
				return A3(_Bytes_write_u8, mb, offset, n);
			case 4:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_u16, mb, offset, n, !e);
			case 5:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_u32, mb, offset, n, !e);
			case 6:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_f32, mb, offset, n, !e);
			case 7:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_f64, mb, offset, n, !e);
			case 8:
				var bs = builder.b;
				return A3($elm$bytes$Bytes$Encode$writeSequence, bs, mb, offset);
			case 9:
				var s = builder.b;
				return A3(_Bytes_write_string, mb, offset, s);
			default:
				var bs = builder.a;
				return A3(_Bytes_write_bytes, mb, offset, bs);
		}
	});
var $elm$bytes$Bytes$Encode$writeSequence = F3(
	function (builders, mb, offset) {
		writeSequence:
		while (true) {
			if (!builders.b) {
				return offset;
			} else {
				var b = builders.a;
				var bs = builders.b;
				var $temp$builders = bs,
					$temp$mb = mb,
					$temp$offset = A3($elm$bytes$Bytes$Encode$write, b, mb, offset);
				builders = $temp$builders;
				mb = $temp$mb;
				offset = $temp$offset;
				continue writeSequence;
			}
		}
	});
var $elm$bytes$Bytes$Encode$encode = _Bytes_encode;
var $elm$url$Url$percentEncode = _Url_percentEncode;
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $author$project$QRTypes$encodeQRType = function (qrType) {
	switch (qrType.$) {
		case 0:
			var value = qrType.a;
			return value;
		case 1:
			var url = qrType.a;
			return url;
		case 2:
			var address = qrType.a;
			var subject = qrType.b;
			var message = qrType.c;
			return 'mailto:' + ($elm$url$Url$percentEncode(address) + ('?subject=' + ($elm$url$Url$percentEncode(subject) + ('&body=' + $elm$url$Url$percentEncode(message)))));
		case 3:
			var ssid = qrType.a;
			var password = qrType.b;
			var hidden = qrType.c;
			var formattedPasswordType = function () {
				switch (password.$) {
					case 0:
						return 'T:WPA;';
					case 1:
						return 'T:WEP;';
					default:
						return '';
				}
			}();
			var formattedHidden = hidden ? 'H:true;' : '';
			var escapeStr = A2($elm$core$String$replace, ';', '\\;');
			var formattedPassword = function () {
				switch (password.$) {
					case 0:
						var pass = password.a;
						return 'P:' + (escapeStr(pass) + ';');
					case 1:
						var pass = password.a;
						return 'P:' + (escapeStr(pass) + ';');
					default:
						return '';
				}
			}();
			var formattedSSID = 'S:' + (escapeStr(ssid) + ';');
			return 'WIFI:' + (formattedPasswordType + (formattedSSID + (formattedPassword + (formattedHidden + ';'))));
		case 4:
			var number = qrType.a;
			return 'tel:' + number;
		case 5:
			var number = qrType.a;
			var message = qrType.b;
			return 'SMSTO:' + (number + (':' + message));
		case 6:
			var message = qrType.a;
			return 'https://twitter.com/intent/tweet?text=' + $elm$url$Url$percentEncode(message);
		default:
			var currency = qrType.a;
			var address = qrType.b;
			var amount = qrType.c;
			var message = qrType.d;
			var formattedCurrency = function () {
				switch (currency) {
					case 0:
						return 'bitcoin';
					case 1:
						return 'bitcoincash';
					case 2:
						return 'ethereum';
					case 3:
						return 'litecoin';
					default:
						return 'dash';
				}
			}();
			return formattedCurrency + (':' + ($elm$url$Url$percentEncode(address) + ('?amount=' + ($elm$url$Url$percentEncode(amount) + ('&message=' + $elm$url$Url$percentEncode(message))))));
	}
};
var $pablohirafuji$elm_qrcode$QRCode$QRCode = $elm$core$Basics$identity;
var $elm$core$Result$andThen = F2(
	function (callback, result) {
		if (!result.$) {
			var value = result.a;
			return callback(value);
		} else {
			var msg = result.a;
			return $elm$core$Result$Err(msg);
		}
	});
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$getIndex = F3(
	function (size, row, col) {
		return (size * row) + col;
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$isOccupy = F4(
	function (row, col, size, matrix) {
		var _v0 = A2(
			$elm$core$Array$get,
			A3($pablohirafuji$elm_qrcode$QRCode$Matrix$getIndex, size, row, col),
			matrix);
		if ((!_v0.$) && (!_v0.a.$)) {
			return true;
		} else {
			return false;
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$nextModule = function (placement) {
	var row = placement.bJ;
	var col = placement.y;
	var isRight = placement.H;
	var isUp = placement.aM;
	return isRight ? _Utils_update(
		placement,
		{y: col - 1, H: false}) : (isUp ? _Utils_update(
		placement,
		{y: col + 1, H: true, bJ: row - 1}) : _Utils_update(
		placement,
		{y: col + 1, H: true, bJ: row + 1}));
};
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $pablohirafuji$elm_qrcode$QRCode$Matrix$bitToColor = F2(
	function (_byte, offset) {
		return (1 & (_byte >> (7 - offset))) === 1;
	});
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$setHelp = F4(
	function (shift, index, value, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
		if (!_v0.$) {
			var subTree = _v0.a;
			var newSub = A4($elm$core$Array$setHelp, shift - $elm$core$Array$shiftStep, index, value, subTree);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$SubTree(newSub),
				tree);
		} else {
			var values = _v0.a;
			var newLeaf = A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, values);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$Leaf(newLeaf),
				tree);
		}
	});
var $elm$core$Array$set = F3(
	function (index, value, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? array : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			tree,
			A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, tail)) : A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A4($elm$core$Array$setHelp, startShift, index, value, tree),
			tail));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$setDataModule = F3(
	function (_v0, _byte, offset) {
		var size = _v0.bh;
		var row = _v0.bJ;
		var col = _v0.y;
		return A2(
			$elm$core$Array$set,
			A3($pablohirafuji$elm_qrcode$QRCode$Matrix$getIndex, size, row, col),
			$elm$core$Maybe$Just(
				_Utils_Tuple2(
					false,
					A2($pablohirafuji$elm_qrcode$QRCode$Matrix$bitToColor, _byte, offset))));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$addDataModule = F4(
	function (placement, bytes, offset, matrix) {
		addDataModule:
		while (true) {
			var size = placement.bh;
			var row = placement.bJ;
			var col = placement.y;
			if (!bytes.b) {
				return matrix;
			} else {
				var head = bytes.a;
				var tail = bytes.b;
				if (offset >= 8) {
					var $temp$placement = placement,
						$temp$bytes = tail,
						$temp$offset = 0,
						$temp$matrix = matrix;
					placement = $temp$placement;
					bytes = $temp$bytes;
					offset = $temp$offset;
					matrix = $temp$matrix;
					continue addDataModule;
				} else {
					if (col === 6) {
						var $temp$placement = _Utils_update(
							placement,
							{y: col - 1, H: true}),
							$temp$bytes = bytes,
							$temp$offset = offset,
							$temp$matrix = matrix;
						placement = $temp$placement;
						bytes = $temp$bytes;
						offset = $temp$offset;
						matrix = $temp$matrix;
						continue addDataModule;
					} else {
						if (row < 0) {
							var $temp$placement = _Utils_update(
								placement,
								{y: col - 2, H: true, aM: false, bJ: 0}),
								$temp$bytes = bytes,
								$temp$offset = offset,
								$temp$matrix = matrix;
							placement = $temp$placement;
							bytes = $temp$bytes;
							offset = $temp$offset;
							matrix = $temp$matrix;
							continue addDataModule;
						} else {
							if (_Utils_cmp(row, size) > -1) {
								var $temp$placement = _Utils_update(
									placement,
									{y: col - 2, H: true, aM: true, bJ: size - 1}),
									$temp$bytes = bytes,
									$temp$offset = offset,
									$temp$matrix = matrix;
								placement = $temp$placement;
								bytes = $temp$bytes;
								offset = $temp$offset;
								matrix = $temp$matrix;
								continue addDataModule;
							} else {
								if (A4($pablohirafuji$elm_qrcode$QRCode$Matrix$isOccupy, row, col, size, matrix)) {
									var $temp$placement = $pablohirafuji$elm_qrcode$QRCode$Matrix$nextModule(placement),
										$temp$bytes = bytes,
										$temp$offset = offset,
										$temp$matrix = matrix;
									placement = $temp$placement;
									bytes = $temp$bytes;
									offset = $temp$offset;
									matrix = $temp$matrix;
									continue addDataModule;
								} else {
									var $temp$placement = $pablohirafuji$elm_qrcode$QRCode$Matrix$nextModule(placement),
										$temp$bytes = bytes,
										$temp$offset = offset + 1,
										$temp$matrix = A4($pablohirafuji$elm_qrcode$QRCode$Matrix$setDataModule, placement, head, offset, matrix);
									placement = $temp$placement;
									bytes = $temp$bytes;
									offset = $temp$offset;
									matrix = $temp$matrix;
									continue addDataModule;
								}
							}
						}
					}
				}
			}
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$initPlacement = function (size) {
	return {y: size + 1, H: true, aM: true, bJ: size + 1, bh: size};
};
var $pablohirafuji$elm_qrcode$QRCode$Matrix$addData = F3(
	function (size, bytes, matrix) {
		return A4(
			$pablohirafuji$elm_qrcode$QRCode$Matrix$addDataModule,
			$pablohirafuji$elm_qrcode$QRCode$Matrix$initPlacement(size),
			bytes,
			0,
			matrix);
	});
var $pablohirafuji$elm_qrcode$QRCode$Error$AlignmentPatternNotFound = {$: 0};
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{m: nodeList, i: nodeListSize, l: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $pablohirafuji$elm_qrcode$QRCode$Matrix$alignmentPatternData = $elm$core$Array$fromList(
	_List_fromArray(
		[
			_List_Nil,
			_List_fromArray(
			[6, 18]),
			_List_fromArray(
			[6, 22]),
			_List_fromArray(
			[6, 26]),
			_List_fromArray(
			[6, 30]),
			_List_fromArray(
			[6, 34]),
			_List_fromArray(
			[6, 22, 38]),
			_List_fromArray(
			[6, 24, 42]),
			_List_fromArray(
			[6, 26, 46]),
			_List_fromArray(
			[6, 28, 50]),
			_List_fromArray(
			[6, 30, 54]),
			_List_fromArray(
			[6, 32, 58]),
			_List_fromArray(
			[6, 34, 62]),
			_List_fromArray(
			[6, 26, 46, 66]),
			_List_fromArray(
			[6, 26, 48, 70]),
			_List_fromArray(
			[6, 26, 50, 74]),
			_List_fromArray(
			[6, 30, 54, 78]),
			_List_fromArray(
			[6, 30, 56, 82]),
			_List_fromArray(
			[6, 30, 58, 86]),
			_List_fromArray(
			[6, 34, 62, 90]),
			_List_fromArray(
			[6, 28, 50, 72, 94]),
			_List_fromArray(
			[6, 26, 50, 74, 98]),
			_List_fromArray(
			[6, 30, 54, 78, 102]),
			_List_fromArray(
			[6, 28, 54, 80, 106]),
			_List_fromArray(
			[6, 32, 58, 84, 110]),
			_List_fromArray(
			[6, 30, 58, 86, 114]),
			_List_fromArray(
			[6, 34, 62, 90, 118]),
			_List_fromArray(
			[6, 26, 50, 74, 98, 122]),
			_List_fromArray(
			[6, 30, 54, 78, 102, 126]),
			_List_fromArray(
			[6, 26, 52, 78, 104, 130]),
			_List_fromArray(
			[6, 30, 56, 82, 108, 134]),
			_List_fromArray(
			[6, 34, 60, 86, 112, 138]),
			_List_fromArray(
			[6, 30, 58, 86, 114, 142]),
			_List_fromArray(
			[6, 34, 62, 90, 118, 146]),
			_List_fromArray(
			[6, 30, 54, 78, 102, 126, 150]),
			_List_fromArray(
			[6, 24, 50, 76, 102, 128, 154]),
			_List_fromArray(
			[6, 28, 54, 80, 106, 132, 158]),
			_List_fromArray(
			[6, 32, 58, 84, 110, 136, 162]),
			_List_fromArray(
			[6, 26, 54, 82, 110, 138, 166]),
			_List_fromArray(
			[6, 30, 58, 86, 114, 142, 170])
		]));
var $elm$core$Result$fromMaybe = F2(
	function (err, maybe) {
		if (!maybe.$) {
			var v = maybe.a;
			return $elm$core$Result$Ok(v);
		} else {
			return $elm$core$Result$Err(err);
		}
	});
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (!ra.$) {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$getAreaCoord = F2(
	function (rows, cols) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (row, list) {
					return A3(
						$elm$core$List$foldl,
						F2(
							function (col, list_) {
								return A2(
									$elm$core$List$cons,
									_Utils_Tuple2(row, col),
									list_);
							}),
						list,
						cols);
				}),
			_List_Nil,
			rows);
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$isValidAlign = F2(
	function (size, _v0) {
		var row = _v0.a;
		var col = _v0.b;
		return ((row > 10) || ((10 < col) && (_Utils_cmp(col, size - 10) < 0))) && ((_Utils_cmp(row, size - 10) < 0) || (col > 10));
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $pablohirafuji$elm_qrcode$QRCode$Matrix$alignmentRange = A2($elm$core$List$range, -2, 2);
var $pablohirafuji$elm_qrcode$QRCode$Matrix$alignmentColor = F2(
	function (row, col) {
		return (_Utils_eq(row, -2) || ((row === 2) || (_Utils_eq(col, -2) || ((col === 2) || ((!row) && (!col)))))) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(true, true)) : $elm$core$Maybe$Just(
			_Utils_Tuple2(true, false));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$setAlignModule = F4(
	function (size, rowPos, colPos, _v0) {
		var row = _v0.a;
		var col = _v0.b;
		return A2(
			$elm$core$Array$set,
			A3($pablohirafuji$elm_qrcode$QRCode$Matrix$getIndex, size, row + rowPos, col + colPos),
			A2($pablohirafuji$elm_qrcode$QRCode$Matrix$alignmentColor, row, col));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$setAlignment = F3(
	function (size, _v0, matrix) {
		var row = _v0.a;
		var col = _v0.b;
		return A3(
			$elm$core$List$foldl,
			A3($pablohirafuji$elm_qrcode$QRCode$Matrix$setAlignModule, size, row, col),
			matrix,
			A2($pablohirafuji$elm_qrcode$QRCode$Matrix$getAreaCoord, $pablohirafuji$elm_qrcode$QRCode$Matrix$alignmentRange, $pablohirafuji$elm_qrcode$QRCode$Matrix$alignmentRange));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$setAlignments = F3(
	function (size, locations, matrix) {
		return A3(
			$elm$core$List$foldl,
			$pablohirafuji$elm_qrcode$QRCode$Matrix$setAlignment(size),
			matrix,
			A2(
				$elm$core$List$filter,
				$pablohirafuji$elm_qrcode$QRCode$Matrix$isValidAlign(size),
				A2($pablohirafuji$elm_qrcode$QRCode$Matrix$getAreaCoord, locations, locations)));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$alignmentPattern = F3(
	function (version, size, matrix) {
		return A2(
			$elm$core$Result$map,
			function (a) {
				return A3($pablohirafuji$elm_qrcode$QRCode$Matrix$setAlignments, size, a, matrix);
			},
			A2(
				$elm$core$Result$fromMaybe,
				$pablohirafuji$elm_qrcode$QRCode$Error$AlignmentPatternNotFound,
				A2($elm$core$Array$get, version - 1, $pablohirafuji$elm_qrcode$QRCode$Matrix$alignmentPatternData)));
	});
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$darkModule = F2(
	function (version, size) {
		return A2(
			$elm$core$Array$set,
			A3($pablohirafuji$elm_qrcode$QRCode$Matrix$getIndex, size, (4 * version) + 9, 8),
			$elm$core$Maybe$Just(
				_Utils_Tuple2(true, true)));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$finderRange = A2($elm$core$List$range, 0, 8);
var $pablohirafuji$elm_qrcode$QRCode$Matrix$finderColor = F2(
	function (row, col) {
		return ((1 <= row) && ((row <= 7) && ((col === 1) || (col === 7)))) || (((1 <= col) && ((col <= 7) && ((row === 1) || (row === 7)))) || ((3 <= row) && ((row <= 5) && ((3 <= col) && (col <= 5)))));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$setFinder = F5(
	function (size, rowOffset, colOffset, _v0, matrix) {
		var row = _v0.a;
		var col = _v0.b;
		var finalRow = row + rowOffset;
		var finalCol = col + colOffset;
		return ((finalRow < 0) || ((finalCol < 0) || ((_Utils_cmp(finalRow, size) > -1) || (_Utils_cmp(finalCol, size) > -1)))) ? matrix : A3(
			$elm$core$Array$set,
			A3($pablohirafuji$elm_qrcode$QRCode$Matrix$getIndex, size, finalRow, finalCol),
			$elm$core$Maybe$Just(
				_Utils_Tuple2(
					true,
					A2($pablohirafuji$elm_qrcode$QRCode$Matrix$finderColor, row, col))),
			matrix);
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$finderPattern = F4(
	function (size, rowOffset, colOffset, matrix) {
		return A3(
			$elm$core$List$foldl,
			A3($pablohirafuji$elm_qrcode$QRCode$Matrix$setFinder, size, rowOffset, colOffset),
			matrix,
			A2($pablohirafuji$elm_qrcode$QRCode$Matrix$getAreaCoord, $pablohirafuji$elm_qrcode$QRCode$Matrix$finderRange, $pablohirafuji$elm_qrcode$QRCode$Matrix$finderRange));
	});
var $elm$core$Basics$not = _Basics_not;
var $pablohirafuji$elm_qrcode$QRCode$Matrix$applyMaskColor = F2(
	function (maybeModule, isChange) {
		if (isChange) {
			if ((!maybeModule.$) && (!maybeModule.a.a)) {
				var _v1 = maybeModule.a;
				var isDark = _v1.b;
				return $elm$core$Maybe$Just(
					_Utils_Tuple2(false, !isDark));
			} else {
				return maybeModule;
			}
		} else {
			return maybeModule;
		}
	});
var $elm$core$Basics$modBy = _Basics_modBy;
var $pablohirafuji$elm_qrcode$QRCode$Matrix$getCoord = F2(
	function (size, index) {
		return _Utils_Tuple2(
			(index / size) | 0,
			A2($elm$core$Basics$modBy, size, index));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$applyMaskFunction = F4(
	function (_function, size, index, maybeModule) {
		return A2(
			$pablohirafuji$elm_qrcode$QRCode$Matrix$applyMaskColor,
			maybeModule,
			_function(
				A2($pablohirafuji$elm_qrcode$QRCode$Matrix$getCoord, size, index)));
	});
var $elm$core$Elm$JsArray$foldl = _JsArray_foldl;
var $elm$core$Elm$JsArray$indexedMap = _JsArray_indexedMap;
var $elm$core$Array$indexedMap = F2(
	function (func, _v0) {
		var len = _v0.a;
		var tree = _v0.c;
		var tail = _v0.d;
		var initialBuilder = {
			m: _List_Nil,
			i: 0,
			l: A3(
				$elm$core$Elm$JsArray$indexedMap,
				func,
				$elm$core$Array$tailIndex(len),
				tail)
		};
		var helper = F2(
			function (node, builder) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, builder, subTree);
				} else {
					var leaf = node.a;
					var offset = builder.i * $elm$core$Array$branchFactor;
					var mappedLeaf = $elm$core$Array$Leaf(
						A3($elm$core$Elm$JsArray$indexedMap, func, offset, leaf));
					return {
						m: A2($elm$core$List$cons, mappedLeaf, builder.m),
						i: builder.i + 1,
						l: builder.l
					};
				}
			});
		return A2(
			$elm$core$Array$builderToArray,
			true,
			A3($elm$core$Elm$JsArray$foldl, helper, initialBuilder, tree));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$maskFunction = function (mask) {
	switch (mask) {
		case 0:
			return function (_v1) {
				var row = _v1.a;
				var col = _v1.b;
				return !A2($elm$core$Basics$modBy, 2, row + col);
			};
		case 1:
			return function (_v2) {
				var row = _v2.a;
				return !A2($elm$core$Basics$modBy, 2, row);
			};
		case 2:
			return function (_v3) {
				var col = _v3.b;
				return !A2($elm$core$Basics$modBy, 3, col);
			};
		case 3:
			return function (_v4) {
				var row = _v4.a;
				var col = _v4.b;
				return !A2($elm$core$Basics$modBy, 3, row + col);
			};
		case 4:
			return function (_v5) {
				var row = _v5.a;
				var col = _v5.b;
				return !A2(
					$elm$core$Basics$modBy,
					2,
					$elm$core$Basics$floor(row / 2) + $elm$core$Basics$floor(col / 3));
			};
		case 5:
			return function (_v6) {
				var row = _v6.a;
				var col = _v6.b;
				return !(A2($elm$core$Basics$modBy, 2, row * col) + A2($elm$core$Basics$modBy, 3, row * col));
			};
		case 6:
			return function (_v7) {
				var row = _v7.a;
				var col = _v7.b;
				return !A2(
					$elm$core$Basics$modBy,
					2,
					A2($elm$core$Basics$modBy, 2, row * col) + A2($elm$core$Basics$modBy, 3, row * col));
			};
		default:
			return function (_v8) {
				var row = _v8.a;
				var col = _v8.b;
				return !A2(
					$elm$core$Basics$modBy,
					2,
					A2($elm$core$Basics$modBy, 3, row * col) + A2($elm$core$Basics$modBy, 2, row + col));
			};
	}
};
var $pablohirafuji$elm_qrcode$QRCode$Matrix$applyMask = F3(
	function (size, mask, matrix) {
		return A2(
			$elm$core$Array$indexedMap,
			A2(
				$pablohirafuji$elm_qrcode$QRCode$Matrix$applyMaskFunction,
				$pablohirafuji$elm_qrcode$QRCode$Matrix$maskFunction(mask),
				size),
			matrix);
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$breakList = F3(
	function (width, list, acc) {
		breakList:
		while (true) {
			if (!list.b) {
				return $elm$core$List$reverse(acc);
			} else {
				var $temp$width = width,
					$temp$list = A2($elm$core$List$drop, width, list),
					$temp$acc = A2(
					$elm$core$List$cons,
					A2($elm$core$List$take, width, list),
					acc);
				width = $temp$width;
				list = $temp$list;
				acc = $temp$acc;
				continue breakList;
			}
		}
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$isDarkModule = A2(
	$elm$core$Basics$composeR,
	$elm$core$Maybe$map($elm$core$Tuple$second),
	$elm$core$Maybe$withDefault(false));
var $pablohirafuji$elm_qrcode$QRCode$Matrix$rule1Score_ = F2(
	function (simplifiedList, _v0) {
		rule1Score_:
		while (true) {
			var last = _v0.a;
			var partialScore = _v0.b;
			var score = _v0.c;
			if (!simplifiedList.b) {
				return (partialScore >= 5) ? ((score + partialScore) - 2) : score;
			} else {
				var head = simplifiedList.a;
				var tail = simplifiedList.b;
				if (_Utils_eq(last, head)) {
					var $temp$simplifiedList = tail,
						$temp$_v0 = _Utils_Tuple3(last, partialScore + 1, score);
					simplifiedList = $temp$simplifiedList;
					_v0 = $temp$_v0;
					continue rule1Score_;
				} else {
					if (partialScore >= 5) {
						var $temp$simplifiedList = tail,
							$temp$_v0 = _Utils_Tuple3(head, 0, (score + partialScore) - 2);
						simplifiedList = $temp$simplifiedList;
						_v0 = $temp$_v0;
						continue rule1Score_;
					} else {
						var $temp$simplifiedList = tail,
							$temp$_v0 = _Utils_Tuple3(head, 0, score);
						simplifiedList = $temp$simplifiedList;
						_v0 = $temp$_v0;
						continue rule1Score_;
					}
				}
			}
		}
	});
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $pablohirafuji$elm_qrcode$QRCode$Matrix$rule1Score = A2(
	$elm$core$Basics$composeR,
	$elm$core$List$map(
		function (a) {
			return A2(
				$pablohirafuji$elm_qrcode$QRCode$Matrix$rule1Score_,
				a,
				_Utils_Tuple3(false, 0, 0));
		}),
	$elm$core$List$sum);
var $pablohirafuji$elm_qrcode$QRCode$Matrix$rule2Score_ = F4(
	function (row1, row2, maybeLast, score) {
		rule2Score_:
		while (true) {
			if (!row1.b) {
				return score;
			} else {
				var head = row1.a;
				var tail = row1.b;
				if (!row2.b) {
					return score;
				} else {
					var head2 = row2.a;
					var tail2 = row2.b;
					if (_Utils_eq(head, head2)) {
						if (_Utils_eq(
							$elm$core$Maybe$Just(head),
							maybeLast)) {
							var $temp$row1 = tail,
								$temp$row2 = tail2,
								$temp$maybeLast = $elm$core$Maybe$Just(head),
								$temp$score = score + 3;
							row1 = $temp$row1;
							row2 = $temp$row2;
							maybeLast = $temp$maybeLast;
							score = $temp$score;
							continue rule2Score_;
						} else {
							var $temp$row1 = tail,
								$temp$row2 = tail2,
								$temp$maybeLast = $elm$core$Maybe$Just(head),
								$temp$score = score;
							row1 = $temp$row1;
							row2 = $temp$row2;
							maybeLast = $temp$maybeLast;
							score = $temp$score;
							continue rule2Score_;
						}
					} else {
						var $temp$row1 = tail,
							$temp$row2 = tail2,
							$temp$maybeLast = $elm$core$Maybe$Nothing,
							$temp$score = score;
						row1 = $temp$row1;
						row2 = $temp$row2;
						maybeLast = $temp$maybeLast;
						score = $temp$score;
						continue rule2Score_;
					}
				}
			}
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$rule2Score = F2(
	function (list, score) {
		rule2Score:
		while (true) {
			if (list.b && list.b.b) {
				var head1 = list.a;
				var _v1 = list.b;
				var head2 = _v1.a;
				var tail = _v1.b;
				var $temp$list = tail,
					$temp$score = score + A4($pablohirafuji$elm_qrcode$QRCode$Matrix$rule2Score_, head1, head2, $elm$core$Maybe$Nothing, 0);
				list = $temp$list;
				score = $temp$score;
				continue rule2Score;
			} else {
				return score;
			}
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$rule3Score_ = F2(
	function (simplifiedList, score) {
		rule3Score_:
		while (true) {
			_v0$3:
			while (true) {
				if (!simplifiedList.b) {
					return score;
				} else {
					if (!simplifiedList.a) {
						if (((((((((((((((((((simplifiedList.b.b && (!simplifiedList.b.a)) && simplifiedList.b.b.b) && (!simplifiedList.b.b.a)) && simplifiedList.b.b.b.b) && (!simplifiedList.b.b.b.a)) && simplifiedList.b.b.b.b.b) && simplifiedList.b.b.b.b.a) && simplifiedList.b.b.b.b.b.b) && (!simplifiedList.b.b.b.b.b.a)) && simplifiedList.b.b.b.b.b.b.b) && simplifiedList.b.b.b.b.b.b.a) && simplifiedList.b.b.b.b.b.b.b.b) && simplifiedList.b.b.b.b.b.b.b.a) && simplifiedList.b.b.b.b.b.b.b.b.b) && simplifiedList.b.b.b.b.b.b.b.b.a) && simplifiedList.b.b.b.b.b.b.b.b.b.b) && (!simplifiedList.b.b.b.b.b.b.b.b.b.a)) && simplifiedList.b.b.b.b.b.b.b.b.b.b.b) && simplifiedList.b.b.b.b.b.b.b.b.b.b.a) {
							var _v1 = simplifiedList.b;
							var _v2 = _v1.b;
							var _v3 = _v2.b;
							var _v4 = _v3.b;
							var _v5 = _v4.b;
							var _v6 = _v5.b;
							var _v7 = _v6.b;
							var _v8 = _v7.b;
							var _v9 = _v8.b;
							var _v10 = _v9.b;
							var tail = _v10.b;
							var $temp$simplifiedList = tail,
								$temp$score = score + 40;
							simplifiedList = $temp$simplifiedList;
							score = $temp$score;
							continue rule3Score_;
						} else {
							break _v0$3;
						}
					} else {
						if (((((((((((((((((((simplifiedList.b.b && (!simplifiedList.b.a)) && simplifiedList.b.b.b) && simplifiedList.b.b.a) && simplifiedList.b.b.b.b) && simplifiedList.b.b.b.a) && simplifiedList.b.b.b.b.b) && simplifiedList.b.b.b.b.a) && simplifiedList.b.b.b.b.b.b) && (!simplifiedList.b.b.b.b.b.a)) && simplifiedList.b.b.b.b.b.b.b) && simplifiedList.b.b.b.b.b.b.a) && simplifiedList.b.b.b.b.b.b.b.b) && (!simplifiedList.b.b.b.b.b.b.b.a)) && simplifiedList.b.b.b.b.b.b.b.b.b) && (!simplifiedList.b.b.b.b.b.b.b.b.a)) && simplifiedList.b.b.b.b.b.b.b.b.b.b) && (!simplifiedList.b.b.b.b.b.b.b.b.b.a)) && simplifiedList.b.b.b.b.b.b.b.b.b.b.b) && (!simplifiedList.b.b.b.b.b.b.b.b.b.b.a)) {
							var _v11 = simplifiedList.b;
							var _v12 = _v11.b;
							var _v13 = _v12.b;
							var _v14 = _v13.b;
							var _v15 = _v14.b;
							var _v16 = _v15.b;
							var _v17 = _v16.b;
							var _v18 = _v17.b;
							var _v19 = _v18.b;
							var _v20 = _v19.b;
							var tail = _v20.b;
							var $temp$simplifiedList = tail,
								$temp$score = score + 40;
							simplifiedList = $temp$simplifiedList;
							score = $temp$score;
							continue rule3Score_;
						} else {
							break _v0$3;
						}
					}
				}
			}
			var head = simplifiedList.a;
			var tail = simplifiedList.b;
			var $temp$simplifiedList = tail,
				$temp$score = score;
			simplifiedList = $temp$simplifiedList;
			score = $temp$score;
			continue rule3Score_;
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$rule3Score = A2($elm$core$List$foldl, $pablohirafuji$elm_qrcode$QRCode$Matrix$rule3Score_, 0);
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $elm$core$Basics$round = _Basics_round;
var $pablohirafuji$elm_qrcode$QRCode$Matrix$rule4Score = F2(
	function (size, simplifiedList) {
		var moduleCount = size * size;
		var darkCount = $elm$core$List$length(
			A2($elm$core$List$filter, $elm$core$Basics$identity, simplifiedList));
		var darkPerc = $elm$core$Basics$round((100 * darkCount) / moduleCount);
		var remOf5 = darkPerc % 5;
		var nextMult5 = $elm$core$Basics$round(
			$elm$core$Basics$abs((darkPerc + (5 - remOf5)) - 50) / 5);
		var prevMult5 = $elm$core$Basics$round(
			$elm$core$Basics$abs((darkPerc - remOf5) - 50) / 5);
		return A2($elm$core$Basics$min, prevMult5, nextMult5) * 10;
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(xs);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $pablohirafuji$elm_qrcode$QRCode$Helpers$transpose = function (ll) {
	transpose:
	while (true) {
		if (!ll.b) {
			return _List_Nil;
		} else {
			if (!ll.a.b) {
				var xss = ll.b;
				var $temp$ll = xss;
				ll = $temp$ll;
				continue transpose;
			} else {
				var _v1 = ll.a;
				var x = _v1.a;
				var xs = _v1.b;
				var xss = ll.b;
				var tails = A2($elm$core$List$filterMap, $elm$core$List$tail, xss);
				var heads = A2($elm$core$List$filterMap, $elm$core$List$head, xss);
				return A2(
					$elm$core$List$cons,
					A2($elm$core$List$cons, x, heads),
					$pablohirafuji$elm_qrcode$QRCode$Helpers$transpose(
						A2($elm$core$List$cons, xs, tails)));
			}
		}
	}
};
var $pablohirafuji$elm_qrcode$QRCode$Matrix$getMaskScore = F2(
	function (size, matrix) {
		var list = A2(
			$elm$core$List$map,
			$pablohirafuji$elm_qrcode$QRCode$Matrix$isDarkModule,
			$elm$core$Array$toList(matrix));
		var rowList = A3($pablohirafuji$elm_qrcode$QRCode$Matrix$breakList, size, list, _List_Nil);
		var transposedRowList = $pablohirafuji$elm_qrcode$QRCode$Helpers$transpose(rowList);
		return function (b) {
			return _Utils_Tuple2(rowList, b);
		}(
			A2($pablohirafuji$elm_qrcode$QRCode$Matrix$rule4Score, size, list) + ($pablohirafuji$elm_qrcode$QRCode$Matrix$rule3Score(transposedRowList) + ($pablohirafuji$elm_qrcode$QRCode$Matrix$rule3Score(rowList) + (A2($pablohirafuji$elm_qrcode$QRCode$Matrix$rule2Score, rowList, 0) + ($pablohirafuji$elm_qrcode$QRCode$Matrix$rule1Score(transposedRowList) + $pablohirafuji$elm_qrcode$QRCode$Matrix$rule1Score(rowList))))));
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $pablohirafuji$elm_qrcode$QRCode$Matrix$ecLevelToInt = function (ecLevel) {
	switch (ecLevel) {
		case 0:
			return 1;
		case 1:
			return 0;
		case 2:
			return 3;
		default:
			return 2;
	}
};
var $pablohirafuji$elm_qrcode$QRCode$Matrix$getBCHDigit = function (_int) {
	var helper = F2(
		function (digit, int_) {
			helper:
			while (true) {
				if (!(!int_)) {
					var $temp$digit = digit + 1,
						$temp$int_ = int_ >>> 1;
					digit = $temp$digit;
					int_ = $temp$int_;
					continue helper;
				} else {
					return digit;
				}
			}
		});
	return A2(helper, 0, _int);
};
var $pablohirafuji$elm_qrcode$QRCode$Matrix$maskToInt = function (mask) {
	switch (mask) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		case 3:
			return 3;
		case 4:
			return 4;
		case 5:
			return 5;
		case 6:
			return 6;
		default:
			return 7;
	}
};
var $elm$core$Bitwise$or = _Bitwise_or;
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $pablohirafuji$elm_qrcode$QRCode$Matrix$encodeFormatInfo = F2(
	function (ecLevel, mask) {
		var g15Mask = 21522;
		var g15Int = 1335;
		var g15Digit = $pablohirafuji$elm_qrcode$QRCode$Matrix$getBCHDigit(g15Int);
		var formatInfoInt = $pablohirafuji$elm_qrcode$QRCode$Matrix$maskToInt(mask) | ($pablohirafuji$elm_qrcode$QRCode$Matrix$ecLevelToInt(ecLevel) << 3);
		var helper = function (d_) {
			helper:
			while (true) {
				if (($pablohirafuji$elm_qrcode$QRCode$Matrix$getBCHDigit(d_) - g15Digit) >= 0) {
					var $temp$d_ = d_ ^ (g15Int << ($pablohirafuji$elm_qrcode$QRCode$Matrix$getBCHDigit(d_) - g15Digit));
					d_ = $temp$d_;
					continue helper;
				} else {
					return g15Mask ^ (d_ | (formatInfoInt << 10));
				}
			}
		};
		var d = formatInfoInt << 10;
		return helper(d);
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$formatInfoHorizontal = F2(
	function (size, count) {
		return (count < 8) ? _Utils_Tuple2(8, (size - count) - 1) : ((count < 9) ? _Utils_Tuple2(8, 15 - count) : _Utils_Tuple2(8, (15 - count) - 1));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$formatInfoVertical = F2(
	function (size, count) {
		return (count < 6) ? _Utils_Tuple2(count, 8) : ((count < 8) ? _Utils_Tuple2(count + 1, 8) : _Utils_Tuple2((size - 15) + count, 8));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$setFormatModule = F4(
	function (size, isBlack, row, col) {
		return A2(
			$elm$core$Array$set,
			A3($pablohirafuji$elm_qrcode$QRCode$Matrix$getIndex, size, row, col),
			$elm$core$Maybe$Just(
				_Utils_Tuple2(true, isBlack)));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$setFormatInfo_ = F4(
	function (size, isBlackFn, count, matrix) {
		setFormatInfo_:
		while (true) {
			if (count < 15) {
				var isBlack = isBlackFn(count);
				var _v0 = A2($pablohirafuji$elm_qrcode$QRCode$Matrix$formatInfoVertical, size, count);
				var x2 = _v0.a;
				var y2 = _v0.b;
				var _v1 = A2($pablohirafuji$elm_qrcode$QRCode$Matrix$formatInfoHorizontal, size, count);
				var x1 = _v1.a;
				var y1 = _v1.b;
				var $temp$size = size,
					$temp$isBlackFn = isBlackFn,
					$temp$count = count + 1,
					$temp$matrix = A5(
					$pablohirafuji$elm_qrcode$QRCode$Matrix$setFormatModule,
					size,
					isBlack,
					x2,
					y2,
					A5($pablohirafuji$elm_qrcode$QRCode$Matrix$setFormatModule, size, isBlack, x1, y1, matrix));
				size = $temp$size;
				isBlackFn = $temp$isBlackFn;
				count = $temp$count;
				matrix = $temp$matrix;
				continue setFormatInfo_;
			} else {
				return matrix;
			}
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$setFormatInfo = F4(
	function (ecLevel, size, mask, matrix) {
		var isBlack = F2(
			function (bits_, count) {
				return (1 & (bits_ >> count)) === 1;
			});
		var bits = A2($pablohirafuji$elm_qrcode$QRCode$Matrix$encodeFormatInfo, ecLevel, mask);
		return A4(
			$pablohirafuji$elm_qrcode$QRCode$Matrix$setFormatInfo_,
			size,
			isBlack(bits),
			0,
			matrix);
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$getBestMask_ = F5(
	function (ecLevel, size, matrix, mask, _v0) {
		var minSMatrix = _v0.a;
		var minScore = _v0.b;
		var maskedMatrix = A4(
			$pablohirafuji$elm_qrcode$QRCode$Matrix$setFormatInfo,
			ecLevel,
			size,
			mask,
			A3($pablohirafuji$elm_qrcode$QRCode$Matrix$applyMask, size, mask, matrix));
		var _v1 = A2($pablohirafuji$elm_qrcode$QRCode$Matrix$getMaskScore, size, maskedMatrix);
		var maskSMatrix = _v1.a;
		var maskScore = _v1.b;
		return ((_Utils_cmp(minScore, maskScore) < 0) && (!_Utils_eq(minScore, -1))) ? _Utils_Tuple2(minSMatrix, minScore) : _Utils_Tuple2(maskSMatrix, maskScore);
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$Pattern0 = 0;
var $pablohirafuji$elm_qrcode$QRCode$Matrix$Pattern1 = 1;
var $pablohirafuji$elm_qrcode$QRCode$Matrix$Pattern2 = 2;
var $pablohirafuji$elm_qrcode$QRCode$Matrix$Pattern3 = 3;
var $pablohirafuji$elm_qrcode$QRCode$Matrix$Pattern4 = 4;
var $pablohirafuji$elm_qrcode$QRCode$Matrix$Pattern5 = 5;
var $pablohirafuji$elm_qrcode$QRCode$Matrix$Pattern6 = 6;
var $pablohirafuji$elm_qrcode$QRCode$Matrix$Pattern7 = 7;
var $pablohirafuji$elm_qrcode$QRCode$Matrix$patternList = _List_fromArray(
	[0, 1, 2, 3, 4, 5, 6, 7]);
var $pablohirafuji$elm_qrcode$QRCode$Matrix$getBestMask = F3(
	function (ecLevel, size, matrix) {
		return A3(
			$elm$core$List$foldl,
			A3($pablohirafuji$elm_qrcode$QRCode$Matrix$getBestMask_, ecLevel, size, matrix),
			_Utils_Tuple2(_List_Nil, -1),
			$pablohirafuji$elm_qrcode$QRCode$Matrix$patternList).a;
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$reserveFormatInfo = F2(
	function (size, matrix) {
		return A4(
			$pablohirafuji$elm_qrcode$QRCode$Matrix$setFormatInfo_,
			size,
			$elm$core$Basics$always(true),
			0,
			matrix);
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$encodeVersionInfo = function (version) {
	var g18Int = 7973;
	var g18Digit = $pablohirafuji$elm_qrcode$QRCode$Matrix$getBCHDigit(g18Int);
	var helper = function (d_) {
		helper:
		while (true) {
			if (($pablohirafuji$elm_qrcode$QRCode$Matrix$getBCHDigit(d_) - g18Digit) >= 0) {
				var $temp$d_ = d_ ^ (g18Int << ($pablohirafuji$elm_qrcode$QRCode$Matrix$getBCHDigit(d_) - g18Digit));
				d_ = $temp$d_;
				continue helper;
			} else {
				return d_ | (version << 12);
			}
		}
	};
	var d = version << 12;
	return helper(d);
};
var $pablohirafuji$elm_qrcode$QRCode$Matrix$setVersionModule = F3(
	function (size, isBlack, _v0) {
		var row = _v0.a;
		var col = _v0.b;
		return A2(
			$elm$core$Array$set,
			A3($pablohirafuji$elm_qrcode$QRCode$Matrix$getIndex, size, row, col),
			$elm$core$Maybe$Just(
				_Utils_Tuple2(true, isBlack)));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$setVersionInfo_ = F4(
	function (size, isBlackFn, count, matrix) {
		setVersionInfo_:
		while (true) {
			if (count < 18) {
				var topRight = _Utils_Tuple2(
					$elm$core$Basics$floor(count / 3),
					((A2($elm$core$Basics$modBy, 3, count) + size) - 8) - 3);
				var isBlack = isBlackFn(count);
				var bottomLeft = _Utils_Tuple2(
					((A2($elm$core$Basics$modBy, 3, count) + size) - 8) - 3,
					$elm$core$Basics$floor(count / 3));
				var $temp$size = size,
					$temp$isBlackFn = isBlackFn,
					$temp$count = count + 1,
					$temp$matrix = A4(
					$pablohirafuji$elm_qrcode$QRCode$Matrix$setVersionModule,
					size,
					isBlack,
					bottomLeft,
					A4($pablohirafuji$elm_qrcode$QRCode$Matrix$setVersionModule, size, isBlack, topRight, matrix));
				size = $temp$size;
				isBlackFn = $temp$isBlackFn;
				count = $temp$count;
				matrix = $temp$matrix;
				continue setVersionInfo_;
			} else {
				return matrix;
			}
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$setVersionInfo = F3(
	function (version, size, matrix) {
		if (version >= 7) {
			var isBlack = F2(
				function (bits_, count) {
					return (1 & (bits_ >> count)) === 1;
				});
			var bits = $pablohirafuji$elm_qrcode$QRCode$Matrix$encodeVersionInfo(version);
			return A4(
				$pablohirafuji$elm_qrcode$QRCode$Matrix$setVersionInfo_,
				size,
				isBlack(bits),
				0,
				matrix);
		} else {
			return matrix;
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$timingColor = F2(
	function (row, col) {
		return (!A2($elm$core$Basics$modBy, 2, row + col)) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(true, true)) : $elm$core$Maybe$Just(
			_Utils_Tuple2(true, false));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$setTiming = F3(
	function (size, row, col) {
		return A2(
			$elm$core$Array$set,
			A3($pablohirafuji$elm_qrcode$QRCode$Matrix$getIndex, size, row, col),
			A2($pablohirafuji$elm_qrcode$QRCode$Matrix$timingColor, row, col));
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$timingPattern = F2(
	function (size, matrix) {
		var range = A2($elm$core$List$range, 8, size - 9);
		return A3(
			$elm$core$List$foldl,
			function (b) {
				return A3($pablohirafuji$elm_qrcode$QRCode$Matrix$setTiming, size, b, 6);
			},
			A3(
				$elm$core$List$foldl,
				A2($pablohirafuji$elm_qrcode$QRCode$Matrix$setTiming, size, 6),
				matrix,
				range),
			range);
	});
var $pablohirafuji$elm_qrcode$QRCode$Matrix$apply = function (_v0) {
	var ecLevel = _v0.a.b3;
	var groupInfo = _v0.a.de;
	var bytes = _v0.b;
	var version = groupInfo.bP;
	var size = ((version - 1) * 4) + 21;
	return A2(
		$elm$core$Result$map,
		A2($pablohirafuji$elm_qrcode$QRCode$Matrix$getBestMask, ecLevel, size),
		A2(
			$elm$core$Result$map,
			A2($pablohirafuji$elm_qrcode$QRCode$Matrix$addData, size, bytes),
			A3(
				$pablohirafuji$elm_qrcode$QRCode$Matrix$alignmentPattern,
				version,
				size,
				A2(
					$pablohirafuji$elm_qrcode$QRCode$Matrix$timingPattern,
					size,
					A3(
						$pablohirafuji$elm_qrcode$QRCode$Matrix$darkModule,
						version,
						size,
						A3(
							$pablohirafuji$elm_qrcode$QRCode$Matrix$setVersionInfo,
							version,
							size,
							A2(
								$pablohirafuji$elm_qrcode$QRCode$Matrix$reserveFormatInfo,
								size,
								A4(
									$pablohirafuji$elm_qrcode$QRCode$Matrix$finderPattern,
									size,
									-1,
									size - 8,
									A4(
										$pablohirafuji$elm_qrcode$QRCode$Matrix$finderPattern,
										size,
										size - 8,
										-1,
										A4(
											$pablohirafuji$elm_qrcode$QRCode$Matrix$finderPattern,
											size,
											-1,
											-1,
											A2(
												$elm$core$Array$initialize,
												size * size,
												$elm$core$Basics$always($elm$core$Maybe$Nothing))))))))))));
};
var $pablohirafuji$elm_qrcode$QRCode$ECLevel$H = 3;
var $pablohirafuji$elm_qrcode$QRCode$ECLevel$L = 0;
var $pablohirafuji$elm_qrcode$QRCode$ECLevel$M = 1;
var $pablohirafuji$elm_qrcode$QRCode$ECLevel$Q = 2;
var $pablohirafuji$elm_qrcode$QRCode$convertEC = function (ec) {
	switch (ec) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $pablohirafuji$elm_qrcode$QRCode$AlignmentPatternNotFound = {$: 0};
var $pablohirafuji$elm_qrcode$QRCode$InputLengthOverflow = {$: 7};
var $pablohirafuji$elm_qrcode$QRCode$InvalidAlphanumericChar = {$: 2};
var $pablohirafuji$elm_qrcode$QRCode$InvalidNumericChar = {$: 1};
var $pablohirafuji$elm_qrcode$QRCode$InvalidUTF8Char = {$: 3};
var $pablohirafuji$elm_qrcode$QRCode$LogTableException = function (a) {
	return {$: 4, a: a};
};
var $pablohirafuji$elm_qrcode$QRCode$PolynomialModException = {$: 6};
var $pablohirafuji$elm_qrcode$QRCode$PolynomialMultiplyException = {$: 5};
var $pablohirafuji$elm_qrcode$QRCode$convertError = function (e) {
	switch (e.$) {
		case 0:
			return $pablohirafuji$elm_qrcode$QRCode$AlignmentPatternNotFound;
		case 1:
			return $pablohirafuji$elm_qrcode$QRCode$InvalidNumericChar;
		case 2:
			return $pablohirafuji$elm_qrcode$QRCode$InvalidAlphanumericChar;
		case 3:
			return $pablohirafuji$elm_qrcode$QRCode$InvalidUTF8Char;
		case 4:
			var n = e.a;
			return $pablohirafuji$elm_qrcode$QRCode$LogTableException(n);
		case 5:
			return $pablohirafuji$elm_qrcode$QRCode$PolynomialMultiplyException;
		case 6:
			return $pablohirafuji$elm_qrcode$QRCode$PolynomialModException;
		default:
			return $pablohirafuji$elm_qrcode$QRCode$InputLengthOverflow;
	}
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$firstFillerByte = 236;
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $pablohirafuji$elm_qrcode$QRCode$Encode$secondFillerByte = 17;
var $pablohirafuji$elm_qrcode$QRCode$Encode$addFiller = F2(
	function (capacity, bytes) {
		var fillerLength = ((capacity / 8) | 0) - $elm$core$List$length(bytes);
		var ns = $elm$core$List$concat(
			A2(
				$elm$core$List$repeat,
				(fillerLength / 2) | 0,
				_List_fromArray(
					[$pablohirafuji$elm_qrcode$QRCode$Encode$firstFillerByte, $pablohirafuji$elm_qrcode$QRCode$Encode$secondFillerByte])));
		return (!A2($elm$core$Basics$modBy, 2, fillerLength)) ? _Utils_ap(bytes, ns) : _Utils_ap(
			bytes,
			_Utils_ap(
				ns,
				_List_fromArray(
					[$pablohirafuji$elm_qrcode$QRCode$Encode$firstFillerByte])));
	});
var $pablohirafuji$elm_qrcode$QRCode$Encode$addTerminator = F3(
	function (capacity, bitsCount, bits) {
		return _Utils_ap(
			bits,
			_List_fromArray(
				[
					_Utils_Tuple2(
					0,
					A2($elm$core$Basics$min, 4, capacity - bitsCount))
				]));
	});
var $pablohirafuji$elm_qrcode$QRCode$Encode$bitsToBytes3 = function (_v0) {
	bitsToBytes3:
	while (true) {
		var _v1 = _v0.a;
		var bits = _v1.a;
		var length = _v1.b;
		var bytes = _v0.b;
		if (length >= 8) {
			var remLength = length - 8;
			var remBits = bits & ((1 << remLength) - 1);
			var _byte = bits >> remLength;
			var $temp$_v0 = _Utils_Tuple2(
				_Utils_Tuple2(remBits, remLength),
				A2($elm$core$List$cons, _byte, bytes));
			_v0 = $temp$_v0;
			continue bitsToBytes3;
		} else {
			return _Utils_Tuple2(
				_Utils_Tuple2(bits, length),
				bytes);
		}
	}
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$bitsToBytes2 = F2(
	function (_v0, _v1) {
		var curBits = _v0.a;
		var curLength = _v0.b;
		var _v2 = _v1.a;
		var remBits = _v2.a;
		var remLength = _v2.b;
		var bytes = _v1.b;
		var lengthSum = curLength + remLength;
		var bitsSum = curBits | (remBits << curLength);
		return $pablohirafuji$elm_qrcode$QRCode$Encode$bitsToBytes3(
			_Utils_Tuple2(
				_Utils_Tuple2(bitsSum, lengthSum),
				bytes));
	});
var $pablohirafuji$elm_qrcode$QRCode$Encode$bitsToBytes1 = F2(
	function (bits, _v0) {
		bitsToBytes1:
		while (true) {
			var _v1 = _v0.a;
			var remBits = _v1.a;
			var remLength = _v1.b;
			var bytes = _v0.b;
			if (bits.b) {
				var head = bits.a;
				var tail = bits.b;
				var $temp$bits = tail,
					$temp$_v0 = A2(
					$pablohirafuji$elm_qrcode$QRCode$Encode$bitsToBytes2,
					head,
					_Utils_Tuple2(
						_Utils_Tuple2(remBits, remLength),
						bytes));
				bits = $temp$bits;
				_v0 = $temp$_v0;
				continue bitsToBytes1;
			} else {
				return (!remLength) ? $elm$core$List$reverse(bytes) : $elm$core$List$reverse(
					A2($elm$core$List$cons, remBits << (8 - remLength), bytes));
			}
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Encode$bitsToBytes = function (bits) {
	return A2(
		$pablohirafuji$elm_qrcode$QRCode$Encode$bitsToBytes1,
		bits,
		_Utils_Tuple2(
			_Utils_Tuple2(0, 0),
			_List_Nil));
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$UTF8 = 3;
var $pablohirafuji$elm_qrcode$QRCode$Encode$charCountIndicatorLength = F2(
	function (mode, version) {
		if (version <= 9) {
			switch (mode) {
				case 0:
					return 10;
				case 1:
					return 9;
				case 2:
					return 8;
				default:
					return 8;
			}
		} else {
			if (version <= 26) {
				switch (mode) {
					case 0:
						return 12;
					case 1:
						return 11;
					case 2:
						return 16;
					default:
						return 16;
				}
			} else {
				switch (mode) {
					case 0:
						return 14;
					case 1:
						return 13;
					case 2:
						return 16;
					default:
						return 16;
				}
			}
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Encode$charCountIndicator = F2(
	function (_v0, bits) {
		var groupInfo = _v0.de;
		var inputStr = _v0.bz;
		var mode = _v0.a8;
		var length = A2($pablohirafuji$elm_qrcode$QRCode$Encode$charCountIndicatorLength, mode, groupInfo.bP);
		var charCount = (mode === 3) ? $elm$core$List$length(bits) : $elm$core$String$length(inputStr);
		return _Utils_Tuple2(charCount, length);
	});
var $pablohirafuji$elm_qrcode$QRCode$Encode$modeIndicator = function (mode) {
	switch (mode) {
		case 0:
			return 1;
		case 1:
			return 2;
		case 2:
			return 4;
		default:
			return 4;
	}
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$addInfoAndFinalBits = function (_v0) {
	var bits = _v0.a;
	var model = _v0.b;
	return _Utils_Tuple2(
		model,
		A2(
			$pablohirafuji$elm_qrcode$QRCode$Encode$addFiller,
			model.de.a$,
			$pablohirafuji$elm_qrcode$QRCode$Encode$bitsToBytes(
				A3(
					$pablohirafuji$elm_qrcode$QRCode$Encode$addTerminator,
					model.de.a$,
					model.bo,
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(
							$pablohirafuji$elm_qrcode$QRCode$Encode$modeIndicator(model.a8),
							4),
						A2(
							$elm$core$List$cons,
							A2($pablohirafuji$elm_qrcode$QRCode$Encode$charCountIndicator, model, bits),
							bits))))));
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$concatTranspose = function (_v0) {
	var model = _v0.a;
	var dataBlocks = _v0.b;
	var ecBlocks = _v0.c;
	return _Utils_Tuple2(
		model,
		$elm$core$List$concat(
			_Utils_ap(
				$pablohirafuji$elm_qrcode$QRCode$Helpers$transpose(dataBlocks),
				$pablohirafuji$elm_qrcode$QRCode$Helpers$transpose(ecBlocks))));
};
var $elm_community$list_extra$List$Extra$greedyGroupsOfWithStep = F3(
	function (size, step, xs) {
		var xs_ = A2($elm$core$List$drop, step, xs);
		var okayXs = $elm$core$List$length(xs) > 0;
		var okayArgs = (size > 0) && (step > 0);
		return (okayArgs && okayXs) ? A2(
			$elm$core$List$cons,
			A2($elm$core$List$take, size, xs),
			A3($elm_community$list_extra$List$Extra$greedyGroupsOfWithStep, size, step, xs_)) : _List_Nil;
	});
var $elm_community$list_extra$List$Extra$greedyGroupsOf = F2(
	function (size, xs) {
		return A3($elm_community$list_extra$List$Extra$greedyGroupsOfWithStep, size, size, xs);
	});
var $elm$core$Result$map2 = F3(
	function (func, ra, rb) {
		if (ra.$ === 1) {
			var x = ra.a;
			return $elm$core$Result$Err(x);
		} else {
			var a = ra.a;
			if (rb.$ === 1) {
				var x = rb.a;
				return $elm$core$Result$Err(x);
			} else {
				var b = rb.a;
				return $elm$core$Result$Ok(
					A2(func, a, b));
			}
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Error$InvalidAlphanumericChar = {$: 2};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$alphanumericCodes = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2('0', 0),
			_Utils_Tuple2('1', 1),
			_Utils_Tuple2('2', 2),
			_Utils_Tuple2('3', 3),
			_Utils_Tuple2('4', 4),
			_Utils_Tuple2('5', 5),
			_Utils_Tuple2('6', 6),
			_Utils_Tuple2('7', 7),
			_Utils_Tuple2('8', 8),
			_Utils_Tuple2('9', 9),
			_Utils_Tuple2('A', 10),
			_Utils_Tuple2('B', 11),
			_Utils_Tuple2('C', 12),
			_Utils_Tuple2('D', 13),
			_Utils_Tuple2('E', 14),
			_Utils_Tuple2('F', 15),
			_Utils_Tuple2('G', 16),
			_Utils_Tuple2('H', 17),
			_Utils_Tuple2('I', 18),
			_Utils_Tuple2('J', 19),
			_Utils_Tuple2('K', 20),
			_Utils_Tuple2('L', 21),
			_Utils_Tuple2('M', 22),
			_Utils_Tuple2('N', 23),
			_Utils_Tuple2('O', 24),
			_Utils_Tuple2('P', 25),
			_Utils_Tuple2('Q', 26),
			_Utils_Tuple2('R', 27),
			_Utils_Tuple2('S', 28),
			_Utils_Tuple2('T', 29),
			_Utils_Tuple2('U', 30),
			_Utils_Tuple2('V', 31),
			_Utils_Tuple2('W', 32),
			_Utils_Tuple2('X', 33),
			_Utils_Tuple2('Y', 34),
			_Utils_Tuple2('Z', 35),
			_Utils_Tuple2(' ', 36),
			_Utils_Tuple2('$', 37),
			_Utils_Tuple2('%', 38),
			_Utils_Tuple2('*', 39),
			_Utils_Tuple2('+', 40),
			_Utils_Tuple2('-', 41),
			_Utils_Tuple2('.', 42),
			_Utils_Tuple2('/', 43),
			_Utils_Tuple2(':', 44)
		]));
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$toAlphanumericCode = function (_char) {
	return A2(
		$elm$core$Result$fromMaybe,
		$pablohirafuji$elm_qrcode$QRCode$Error$InvalidAlphanumericChar,
		A2($elm$core$Dict$get, _char, $pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$alphanumericCodes));
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$toBinary = function (chars) {
	_v0$2:
	while (true) {
		if (chars.b) {
			if (chars.b.b) {
				if (!chars.b.b.b) {
					var firstChar = chars.a;
					var _v1 = chars.b;
					var secondChar = _v1.a;
					return A3(
						$elm$core$Result$map2,
						F2(
							function (firstCode, secondCode) {
								return _Utils_Tuple2((firstCode * 45) + secondCode, 11);
							}),
						$pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$toAlphanumericCode(firstChar),
						$pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$toAlphanumericCode(secondChar));
				} else {
					break _v0$2;
				}
			} else {
				var _char = chars.a;
				return A2(
					$elm$core$Result$map,
					function (a) {
						return _Utils_Tuple2(a, 6);
					},
					$pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$toAlphanumericCode(_char));
			}
		} else {
			break _v0$2;
		}
	}
	return $elm$core$Result$Err($pablohirafuji$elm_qrcode$QRCode$Error$InvalidAlphanumericChar);
};
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$encode = function (str) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Result$map2($elm$core$List$cons),
		$elm$core$Result$Ok(_List_Nil),
		A2(
			$elm$core$List$map,
			$pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$toBinary,
			A2(
				$elm_community$list_extra$List$Extra$greedyGroupsOf,
				2,
				$elm$core$String$toList(str))));
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$Byte$encode = function (str) {
	return $elm$core$Result$Ok(
		A2(
			$elm$core$List$map,
			function (a) {
				return _Utils_Tuple2(
					$elm$core$Char$toCode(a),
					8);
			},
			$elm$core$String$toList(str)));
};
var $pablohirafuji$elm_qrcode$QRCode$Error$InvalidNumericChar = {$: 1};
var $elm$core$String$fromList = _String_fromList;
var $pablohirafuji$elm_qrcode$QRCode$Encode$Numeric$numericLength = function (str) {
	var _v0 = $elm$core$String$length(str);
	switch (_v0) {
		case 1:
			return 4;
		case 2:
			return 7;
		default:
			return 10;
	}
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$Numeric$encodeHelp = function (chars) {
	var str = $elm$core$String$fromList(chars);
	return A2(
		$elm$core$Result$fromMaybe,
		$pablohirafuji$elm_qrcode$QRCode$Error$InvalidNumericChar,
		A2(
			$elm$core$Maybe$map,
			function (a) {
				return _Utils_Tuple2(
					a,
					$pablohirafuji$elm_qrcode$QRCode$Encode$Numeric$numericLength(str));
			},
			$elm$core$String$toInt(str)));
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$Numeric$encode = function (str) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Result$map2($elm$core$List$cons),
		$elm$core$Result$Ok(_List_Nil),
		A2(
			$elm$core$List$map,
			$pablohirafuji$elm_qrcode$QRCode$Encode$Numeric$encodeHelp,
			A2(
				$elm_community$list_extra$List$Extra$greedyGroupsOf,
				3,
				$elm$core$String$toList(str))));
};
var $pablohirafuji$elm_qrcode$QRCode$Error$InvalidUTF8Char = {$: 3};
var $elm$bytes$Bytes$Decode$decode = F2(
	function (_v0, bs) {
		var decoder = _v0;
		return A2(_Bytes_decode, decoder, bs);
	});
var $elm$bytes$Bytes$Encode$getStringWidth = _Bytes_getStringWidth;
var $elm$bytes$Bytes$Decode$Decoder = $elm$core$Basics$identity;
var $elm$bytes$Bytes$Decode$loopHelp = F4(
	function (state, callback, bites, offset) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var decoder = _v0;
			var _v1 = A2(decoder, bites, offset);
			var newOffset = _v1.a;
			var step = _v1.b;
			if (!step.$) {
				var newState = step.a;
				var $temp$state = newState,
					$temp$callback = callback,
					$temp$bites = bites,
					$temp$offset = newOffset;
				state = $temp$state;
				callback = $temp$callback;
				bites = $temp$bites;
				offset = $temp$offset;
				continue loopHelp;
			} else {
				var result = step.a;
				return _Utils_Tuple2(newOffset, result);
			}
		}
	});
var $elm$bytes$Bytes$Decode$loop = F2(
	function (state, callback) {
		return A2($elm$bytes$Bytes$Decode$loopHelp, state, callback);
	});
var $elm$bytes$Bytes$Decode$Done = function (a) {
	return {$: 1, a: a};
};
var $elm$bytes$Bytes$Decode$Loop = function (a) {
	return {$: 0, a: a};
};
var $elm$bytes$Bytes$Decode$map = F2(
	function (func, _v0) {
		var decodeA = _v0;
		return F2(
			function (bites, offset) {
				var _v1 = A2(decodeA, bites, offset);
				var aOffset = _v1.a;
				var a = _v1.b;
				return _Utils_Tuple2(
					aOffset,
					func(a));
			});
	});
var $elm$bytes$Bytes$Decode$succeed = function (a) {
	return F2(
		function (_v0, offset) {
			return _Utils_Tuple2(offset, a);
		});
};
var $elm$bytes$Bytes$Decode$unsignedInt8 = _Bytes_read_u8;
var $pablohirafuji$elm_qrcode$QRCode$Encode$UTF8$step = function (_v0) {
	var n = _v0.a;
	var xs = _v0.b;
	return (n <= 0) ? $elm$bytes$Bytes$Decode$succeed(
		$elm$bytes$Bytes$Decode$Done(
			$elm$core$List$reverse(xs))) : A2(
		$elm$bytes$Bytes$Decode$map,
		function (x) {
			return $elm$bytes$Bytes$Decode$Loop(
				_Utils_Tuple2(
					n - 1,
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(x, 8),
						xs)));
		},
		$elm$bytes$Bytes$Decode$unsignedInt8);
};
var $elm$bytes$Bytes$Encode$Utf8 = F2(
	function (a, b) {
		return {$: 9, a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$string = function (str) {
	return A2(
		$elm$bytes$Bytes$Encode$Utf8,
		_Bytes_getStringWidth(str),
		str);
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$UTF8$encode = function (str) {
	var utf8BytesWidth = $elm$bytes$Bytes$Encode$getStringWidth(str);
	var decoder = A2(
		$elm$bytes$Bytes$Decode$loop,
		_Utils_Tuple2(utf8BytesWidth, _List_Nil),
		$pablohirafuji$elm_qrcode$QRCode$Encode$UTF8$step);
	return A2(
		$elm$core$Result$fromMaybe,
		$pablohirafuji$elm_qrcode$QRCode$Error$InvalidUTF8Char,
		A2(
			$elm$bytes$Bytes$Decode$decode,
			decoder,
			$elm$bytes$Bytes$Encode$encode(
				$elm$bytes$Bytes$Encode$string(str))));
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$encoder = function (mode) {
	switch (mode) {
		case 0:
			return $pablohirafuji$elm_qrcode$QRCode$Encode$Numeric$encode;
		case 1:
			return $pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$encode;
		case 2:
			return $pablohirafuji$elm_qrcode$QRCode$Encode$Byte$encode;
		default:
			return $pablohirafuji$elm_qrcode$QRCode$Encode$UTF8$encode;
	}
};
var $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$expTable = $elm$core$Array$fromList(
	_List_fromArray(
		[1, 2, 4, 8, 16, 32, 64, 128, 29, 58, 116, 232, 205, 135, 19, 38, 76, 152, 45, 90, 180, 117, 234, 201, 143, 3, 6, 12, 24, 48, 96, 192, 157, 39, 78, 156, 37, 74, 148, 53, 106, 212, 181, 119, 238, 193, 159, 35, 70, 140, 5, 10, 20, 40, 80, 160, 93, 186, 105, 210, 185, 111, 222, 161, 95, 190, 97, 194, 153, 47, 94, 188, 101, 202, 137, 15, 30, 60, 120, 240, 253, 231, 211, 187, 107, 214, 177, 127, 254, 225, 223, 163, 91, 182, 113, 226, 217, 175, 67, 134, 17, 34, 68, 136, 13, 26, 52, 104, 208, 189, 103, 206, 129, 31, 62, 124, 248, 237, 199, 147, 59, 118, 236, 197, 151, 51, 102, 204, 133, 23, 46, 92, 184, 109, 218, 169, 79, 158, 33, 66, 132, 21, 42, 84, 168, 77, 154, 41, 82, 164, 85, 170, 73, 146, 57, 114, 228, 213, 183, 115, 230, 209, 191, 99, 198, 145, 63, 126, 252, 229, 215, 179, 123, 246, 241, 255, 227, 219, 171, 75, 150, 49, 98, 196, 149, 55, 110, 220, 165, 87, 174, 65, 130, 25, 50, 100, 200, 141, 7, 14, 28, 56, 112, 224, 221, 167, 83, 166, 81, 162, 89, 178, 121, 242, 249, 239, 195, 155, 43, 86, 172, 69, 138, 9, 18, 36, 72, 144, 61, 122, 244, 245, 247, 243, 251, 235, 203, 139, 11, 22, 44, 88, 176, 125, 250, 233, 207, 131, 27, 54, 108, 216, 173, 71, 142, 1]));
var $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$getExp = function (index) {
	return A2(
		$elm$core$Maybe$withDefault,
		0,
		A2(
			$elm$core$Array$get,
			A2($elm$core$Basics$modBy, 255, index),
			$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$expTable));
};
var $pablohirafuji$elm_qrcode$QRCode$Error$PolynomialMultiplyException = {$: 5};
var $pablohirafuji$elm_qrcode$QRCode$Error$LogTableException = function (a) {
	return {$: 4, a: a};
};
var $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$logTable = $elm$core$Array$fromList(
	_List_fromArray(
		[0, 1, 25, 2, 50, 26, 198, 3, 223, 51, 238, 27, 104, 199, 75, 4, 100, 224, 14, 52, 141, 239, 129, 28, 193, 105, 248, 200, 8, 76, 113, 5, 138, 101, 47, 225, 36, 15, 33, 53, 147, 142, 218, 240, 18, 130, 69, 29, 181, 194, 125, 106, 39, 249, 185, 201, 154, 9, 120, 77, 228, 114, 166, 6, 191, 139, 98, 102, 221, 48, 253, 226, 152, 37, 179, 16, 145, 34, 136, 54, 208, 148, 206, 143, 150, 219, 189, 241, 210, 19, 92, 131, 56, 70, 64, 30, 66, 182, 163, 195, 72, 126, 110, 107, 58, 40, 84, 250, 133, 186, 61, 202, 94, 155, 159, 10, 21, 121, 43, 78, 212, 229, 172, 115, 243, 167, 87, 7, 112, 192, 247, 140, 128, 99, 13, 103, 74, 222, 237, 49, 197, 254, 24, 227, 165, 153, 119, 38, 184, 180, 124, 17, 68, 146, 217, 35, 32, 137, 46, 55, 63, 209, 91, 149, 188, 207, 205, 144, 135, 151, 178, 220, 252, 190, 97, 242, 86, 211, 171, 20, 42, 93, 158, 132, 60, 57, 83, 71, 109, 65, 162, 31, 45, 67, 216, 183, 123, 164, 118, 196, 23, 73, 236, 127, 12, 111, 246, 108, 161, 59, 82, 41, 157, 85, 170, 251, 96, 134, 177, 187, 204, 62, 90, 203, 89, 95, 176, 156, 169, 160, 81, 11, 245, 22, 235, 122, 117, 44, 215, 79, 174, 213, 233, 230, 231, 173, 232, 116, 214, 244, 234, 168, 80, 88, 175]));
var $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$getLog = function (index) {
	return (index < 1) ? $elm$core$Result$Err(
		$pablohirafuji$elm_qrcode$QRCode$Error$LogTableException(index)) : A2(
		$elm$core$Result$fromMaybe,
		$pablohirafuji$elm_qrcode$QRCode$Error$LogTableException(index),
		A2($elm$core$Array$get, index - 1, $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$logTable));
};
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$getOffset = function (_v0) {
	getOffset:
	while (true) {
		var num = _v0.a;
		var offset = _v0.b;
		if (num.b) {
			var head = num.a;
			var tail = num.b;
			if (!head) {
				var $temp$_v0 = _Utils_Tuple2(tail, offset + 1);
				_v0 = $temp$_v0;
				continue getOffset;
			} else {
				return offset;
			}
		} else {
			return offset;
		}
	}
};
var $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$newPolynomial = F2(
	function (num, shift) {
		var offset = $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$getOffset(
			_Utils_Tuple2(num, 0));
		var numArray = $elm$core$Array$fromList(num);
		return A2(
			$elm$core$Array$initialize,
			($elm$core$List$length(num) - offset) + shift,
			function (index) {
				return A2(
					$elm$core$Maybe$withDefault,
					0,
					A2($elm$core$Array$get, index + offset, numArray));
			});
	});
var $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$multiply = F2(
	function (poly1, poly2) {
		var valuesArray = A2(
			$elm$core$List$indexedMap,
			F2(
				function (index1, value1) {
					return A2(
						$elm$core$List$indexedMap,
						F2(
							function (index2, value2) {
								return _Utils_Tuple3(index1 + index2, value1, value2);
							}),
						$elm$core$Array$toList(poly2));
				}),
			$elm$core$Array$toList(poly1));
		var process__ = F3(
			function (indexSum, num_, exp) {
				return A2(
					$elm$core$Result$fromMaybe,
					$pablohirafuji$elm_qrcode$QRCode$Error$PolynomialMultiplyException,
					A2(
						$elm$core$Maybe$map,
						$elm$core$Bitwise$xor(exp),
						A2($elm$core$Array$get, indexSum, num_)));
			});
		var process_ = F2(
			function (_v0, num_) {
				var indexSum = _v0.a;
				var value1 = _v0.b;
				var value2 = _v0.c;
				return A2(
					$elm$core$Result$map,
					function (r) {
						return A3($elm$core$Array$set, indexSum, r, num_);
					},
					A2(
						$elm$core$Result$andThen,
						A2(process__, indexSum, num_),
						A2(
							$elm$core$Result$map,
							$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$getExp,
							A3(
								$elm$core$Result$map2,
								$elm$core$Basics$add,
								$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$getLog(value1),
								$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$getLog(value2)))));
			});
		var process = F2(
			function (args, numResult) {
				return A2(
					$elm$core$Result$andThen,
					process_(args),
					numResult);
			});
		var num = A2(
			$elm$core$Array$initialize,
			($elm$core$Array$length(poly1) + $elm$core$Array$length(poly2)) - 1,
			$elm$core$Basics$always(0));
		return A2(
			$elm$core$Result$map,
			function (a) {
				return A2($pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$newPolynomial, a, 0);
			},
			A2(
				$elm$core$Result$map,
				$elm$core$Array$toList,
				A3(
					$elm$core$List$foldl,
					process,
					$elm$core$Result$Ok(num),
					$elm$core$List$concat(valuesArray))));
	});
var $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$getECPolynomial = function (ecLength) {
	var generate = F2(
		function (count, polyResult) {
			generate:
			while (true) {
				if (_Utils_cmp(count, ecLength) < 0) {
					var $temp$count = count + 1,
						$temp$polyResult = A2(
						$elm$core$Result$andThen,
						function (a) {
							return A2(
								$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$multiply,
								a,
								A2(
									$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$newPolynomial,
									_List_fromArray(
										[
											1,
											$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$getExp(count)
										]),
									0));
						},
						polyResult);
					count = $temp$count;
					polyResult = $temp$polyResult;
					continue generate;
				} else {
					return polyResult;
				}
			}
		});
	return A2(
		generate,
		0,
		$elm$core$Result$Ok(
			A2(
				$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$newPolynomial,
				_List_fromArray(
					[1]),
				0)));
};
var $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$get___ = F2(
	function (ecLength, modPoly) {
		return $elm$core$Array$toList(
			A2(
				$elm$core$Array$initialize,
				ecLength,
				function (index) {
					var modIndex = (index + $elm$core$Array$length(modPoly)) - ecLength;
					return (modIndex >= 0) ? A2(
						$elm$core$Maybe$withDefault,
						0,
						A2($elm$core$Array$get, modIndex, modPoly)) : 0;
				}));
	});
var $pablohirafuji$elm_qrcode$QRCode$Error$PolynomialModException = {$: 6};
var $elm$core$Array$foldl = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldl, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldl,
			func,
			A3($elm$core$Elm$JsArray$foldl, helper, baseCase, tree),
			tail);
	});
var $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$mod = F2(
	function (poly1, poly2) {
		if (($elm$core$Array$length(poly1) - $elm$core$Array$length(poly2)) < 0) {
			return $elm$core$Result$Ok(poly1);
		} else {
			var helper_ = F3(
				function (index2, poly1_, exp) {
					return A2(
						$elm$core$Result$fromMaybe,
						$pablohirafuji$elm_qrcode$QRCode$Error$PolynomialModException,
						A2(
							$elm$core$Maybe$map,
							$elm$core$Bitwise$xor(exp),
							A2($elm$core$Array$get, index2, poly1_)));
				});
			var getHead = function (poly) {
				return A2(
					$elm$core$Result$andThen,
					$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$getLog,
					A2(
						$elm$core$Result$fromMaybe,
						$pablohirafuji$elm_qrcode$QRCode$Error$PolynomialModException,
						A2($elm$core$Array$get, 0, poly)));
			};
			var ratio = A3(
				$elm$core$Result$map2,
				$elm$core$Basics$sub,
				getHead(poly1),
				getHead(poly2));
			var helper = F2(
				function (_v0, poly1_) {
					var index2 = _v0.a;
					var value2 = _v0.b;
					return A2(
						$elm$core$Result$map,
						function (r) {
							return A3($elm$core$Array$set, index2, r, poly1_);
						},
						A2(
							$elm$core$Result$andThen,
							A2(helper_, index2, poly1_),
							A2(
								$elm$core$Result$map,
								$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$getExp,
								A3(
									$elm$core$Result$map2,
									$elm$core$Basics$add,
									ratio,
									$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$getLog(value2)))));
				});
			var numFold = F2(
				function (args, poly1Result) {
					return A2(
						$elm$core$Result$andThen,
						helper(args),
						poly1Result);
				});
			var numResult = A3(
				$elm$core$Array$foldl,
				numFold,
				$elm$core$Result$Ok(poly1),
				A2(
					$elm$core$Array$indexedMap,
					F2(
						function (a, b) {
							return _Utils_Tuple2(a, b);
						}),
					poly2));
			return A2(
				$elm$core$Result$andThen,
				function (a) {
					return A2($pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$mod, a, poly2);
				},
				A2(
					$elm$core$Result$map,
					function (a) {
						return A2($pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$newPolynomial, a, 0);
					},
					A2($elm$core$Result$map, $elm$core$Array$toList, numResult)));
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$get__ = F2(
	function (rsPoly, dataCodewords) {
		return A2(
			$elm$core$Result$map,
			$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$get___(
				$elm$core$Array$length(rsPoly) - 1),
			A2(
				$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$mod,
				A2(
					$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$newPolynomial,
					dataCodewords,
					$elm$core$Array$length(rsPoly) - 1),
				rsPoly));
	});
var $pablohirafuji$elm_qrcode$QRCode$Helpers$listResult = F3(
	function (fun, listb, lista) {
		if (lista.b) {
			var head = lista.a;
			var tail = lista.b;
			return A2(
				$elm$core$Result$andThen,
				function (a) {
					return A3($pablohirafuji$elm_qrcode$QRCode$Helpers$listResult, fun, a, tail);
				},
				A2(
					$elm$core$Result$map,
					function (r) {
						return A2($elm$core$List$cons, r, listb);
					},
					fun(head)));
		} else {
			return $elm$core$Result$Ok(
				$elm$core$List$reverse(listb));
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$get_ = F2(
	function (byteBlocks, rsPoly) {
		return A3(
			$pablohirafuji$elm_qrcode$QRCode$Helpers$listResult,
			$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$get__(rsPoly),
			_List_Nil,
			byteBlocks);
	});
var $pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$get = F2(
	function (ecPerBlock, byteBlocks) {
		return A2(
			$elm$core$Result$andThen,
			$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$get_(byteBlocks),
			$pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$getECPolynomial(ecPerBlock));
	});
var $pablohirafuji$elm_qrcode$QRCode$Encode$getErrorCorrection = function (_v0) {
	var model = _v0.a;
	var dataBlocks = _v0.b;
	return A2(
		$elm$core$Result$map,
		function (c) {
			return _Utils_Tuple3(model, dataBlocks, c);
		},
		A2($pablohirafuji$elm_qrcode$QRCode$ErrorCorrection$get, model.de.c8, dataBlocks));
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric = 1;
var $pablohirafuji$elm_qrcode$QRCode$Encode$Byte = 2;
var $pablohirafuji$elm_qrcode$QRCode$Encode$Numeric = 0;
var $elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {dj: index, dn: match, dt: number, dF: submatches};
	});
var $elm$regex$Regex$contains = _Regex_contains;
var $elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var $pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$onlyAlphanumeric = A2(
	$elm$regex$Regex$fromStringWith,
	{cY: false, dr: false},
	'^[0-9A-Z $%*+\\-.\\/:]+$');
var $pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$isValid = function (input) {
	return A2(
		$elm$core$Maybe$withDefault,
		false,
		A2(
			$elm$core$Maybe$map,
			function (r) {
				return A2($elm$regex$Regex$contains, r, input);
			},
			$pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$onlyAlphanumeric));
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$Byte$only8Bit = A2(
	$elm$regex$Regex$fromStringWith,
	{cY: false, dr: false},
	'^[\\u0000-\\u00ff]+$');
var $pablohirafuji$elm_qrcode$QRCode$Encode$Byte$isValid = function (input) {
	return A2(
		$elm$core$Maybe$withDefault,
		false,
		A2(
			$elm$core$Maybe$map,
			function (r) {
				return A2($elm$regex$Regex$contains, r, input);
			},
			$pablohirafuji$elm_qrcode$QRCode$Encode$Byte$only8Bit));
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$Numeric$onlyNumber = A2(
	$elm$regex$Regex$fromStringWith,
	{cY: false, dr: false},
	'^[0-9]+$');
var $pablohirafuji$elm_qrcode$QRCode$Encode$Numeric$isValid = function (input) {
	return A2(
		$elm$core$Maybe$withDefault,
		false,
		A2(
			$elm$core$Maybe$map,
			function (r) {
				return A2($elm$regex$Regex$contains, r, input);
			},
			$pablohirafuji$elm_qrcode$QRCode$Encode$Numeric$onlyNumber));
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$selectMode = function (input) {
	return $pablohirafuji$elm_qrcode$QRCode$Encode$Numeric$isValid(input) ? 0 : ($pablohirafuji$elm_qrcode$QRCode$Encode$Alphanumeric$isValid(input) ? 1 : ($pablohirafuji$elm_qrcode$QRCode$Encode$Byte$isValid(input) ? 2 : 3));
};
var $pablohirafuji$elm_qrcode$QRCode$Error$InputLengthOverflow = {$: 7};
var $pablohirafuji$elm_qrcode$QRCode$Encode$filterCapacity = F3(
	function (mode, dataLength, _v0) {
		var version = _v0.bP;
		var capacity = _v0.a$;
		return _Utils_cmp(
			A2($pablohirafuji$elm_qrcode$QRCode$Encode$charCountIndicatorLength, mode, version) + dataLength,
			capacity) < 1;
	});
var $pablohirafuji$elm_qrcode$QRCode$GroupInfo$blockByteCapacity = function (_v0) {
	var blockCount = _v0.a;
	var bytePerBlock = _v0.b;
	return blockCount * bytePerBlock;
};
var $pablohirafuji$elm_qrcode$QRCode$GroupInfo$byteCapacity = F2(
	function (group1, maybeGroup2) {
		if (!maybeGroup2.$) {
			var block2 = maybeGroup2.a;
			return $pablohirafuji$elm_qrcode$QRCode$GroupInfo$blockByteCapacity(group1) + $pablohirafuji$elm_qrcode$QRCode$GroupInfo$blockByteCapacity(block2);
		} else {
			return $pablohirafuji$elm_qrcode$QRCode$GroupInfo$blockByteCapacity(group1);
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo = F4(
	function (version, ecPerBlock, group1, maybeGroup2) {
		return {
			a$: A2($pablohirafuji$elm_qrcode$QRCode$GroupInfo$byteCapacity, group1, maybeGroup2) * 8,
			c8: ecPerBlock,
			ca: group1,
			$7: maybeGroup2,
			bP: version
		};
	});
var $pablohirafuji$elm_qrcode$QRCode$GroupInfo$dataH = _List_fromArray(
	[
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		1,
		17,
		_Utils_Tuple2(1, 9),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		2,
		28,
		_Utils_Tuple2(1, 16),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		3,
		22,
		_Utils_Tuple2(2, 13),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		4,
		16,
		_Utils_Tuple2(4, 9),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		5,
		22,
		_Utils_Tuple2(2, 11),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 12))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		6,
		28,
		_Utils_Tuple2(4, 15),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		7,
		26,
		_Utils_Tuple2(4, 13),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(1, 14))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		8,
		26,
		_Utils_Tuple2(4, 14),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 15))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		9,
		24,
		_Utils_Tuple2(4, 12),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 13))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		10,
		28,
		_Utils_Tuple2(6, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		11,
		24,
		_Utils_Tuple2(3, 12),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(8, 13))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		12,
		28,
		_Utils_Tuple2(7, 14),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 15))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		13,
		22,
		_Utils_Tuple2(12, 11),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 12))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		14,
		24,
		_Utils_Tuple2(11, 12),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(5, 13))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		15,
		24,
		_Utils_Tuple2(11, 12),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(7, 13))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		16,
		30,
		_Utils_Tuple2(3, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(13, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		17,
		28,
		_Utils_Tuple2(2, 14),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(17, 15))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		18,
		28,
		_Utils_Tuple2(2, 14),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(19, 15))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		19,
		26,
		_Utils_Tuple2(9, 13),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(16, 14))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		20,
		28,
		_Utils_Tuple2(15, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(10, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		21,
		30,
		_Utils_Tuple2(19, 16),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(6, 17))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		22,
		24,
		_Utils_Tuple2(34, 13),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		23,
		30,
		_Utils_Tuple2(16, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(14, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		24,
		30,
		_Utils_Tuple2(30, 16),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 17))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		25,
		30,
		_Utils_Tuple2(22, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(13, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		26,
		30,
		_Utils_Tuple2(33, 16),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 17))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		27,
		30,
		_Utils_Tuple2(12, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(28, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		28,
		30,
		_Utils_Tuple2(11, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(31, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		29,
		30,
		_Utils_Tuple2(19, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(26, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		30,
		30,
		_Utils_Tuple2(23, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(25, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		31,
		30,
		_Utils_Tuple2(23, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(28, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		32,
		30,
		_Utils_Tuple2(19, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(35, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		33,
		30,
		_Utils_Tuple2(11, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(46, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		34,
		30,
		_Utils_Tuple2(59, 16),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(1, 17))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		35,
		30,
		_Utils_Tuple2(22, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(41, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		36,
		30,
		_Utils_Tuple2(2, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(64, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		37,
		30,
		_Utils_Tuple2(24, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(46, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		38,
		30,
		_Utils_Tuple2(42, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(32, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		39,
		30,
		_Utils_Tuple2(10, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(67, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		40,
		30,
		_Utils_Tuple2(20, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(61, 16)))
	]);
var $pablohirafuji$elm_qrcode$QRCode$GroupInfo$dataL = _List_fromArray(
	[
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		1,
		7,
		_Utils_Tuple2(1, 19),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		2,
		10,
		_Utils_Tuple2(1, 34),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		3,
		15,
		_Utils_Tuple2(1, 55),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		4,
		20,
		_Utils_Tuple2(1, 80),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		5,
		26,
		_Utils_Tuple2(1, 108),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		6,
		18,
		_Utils_Tuple2(2, 68),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		7,
		20,
		_Utils_Tuple2(2, 78),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		8,
		24,
		_Utils_Tuple2(2, 97),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		9,
		30,
		_Utils_Tuple2(2, 116),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		10,
		18,
		_Utils_Tuple2(2, 68),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 69))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		11,
		20,
		_Utils_Tuple2(4, 81),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		12,
		24,
		_Utils_Tuple2(2, 92),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 93))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		13,
		26,
		_Utils_Tuple2(4, 107),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		14,
		30,
		_Utils_Tuple2(3, 115),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(1, 116))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		15,
		22,
		_Utils_Tuple2(5, 87),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(1, 88))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		16,
		24,
		_Utils_Tuple2(5, 98),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(1, 99))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		17,
		28,
		_Utils_Tuple2(1, 107),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(5, 108))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		18,
		30,
		_Utils_Tuple2(5, 120),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(1, 121))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		19,
		28,
		_Utils_Tuple2(3, 113),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 114))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		20,
		28,
		_Utils_Tuple2(3, 107),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(5, 108))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		21,
		28,
		_Utils_Tuple2(4, 116),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 117))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		22,
		28,
		_Utils_Tuple2(2, 111),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(7, 112))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		23,
		30,
		_Utils_Tuple2(4, 121),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(5, 122))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		24,
		30,
		_Utils_Tuple2(6, 117),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 118))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		25,
		26,
		_Utils_Tuple2(8, 106),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 107))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		26,
		28,
		_Utils_Tuple2(10, 114),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 115))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		27,
		30,
		_Utils_Tuple2(8, 122),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 123))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		28,
		30,
		_Utils_Tuple2(3, 117),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(10, 118))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		29,
		30,
		_Utils_Tuple2(7, 116),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(7, 117))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		30,
		30,
		_Utils_Tuple2(5, 115),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(10, 116))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		31,
		30,
		_Utils_Tuple2(13, 115),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(3, 116))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		32,
		30,
		_Utils_Tuple2(17, 115),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		33,
		30,
		_Utils_Tuple2(17, 115),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(1, 116))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		34,
		30,
		_Utils_Tuple2(13, 115),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(6, 116))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		35,
		30,
		_Utils_Tuple2(12, 121),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(7, 122))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		36,
		30,
		_Utils_Tuple2(6, 121),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(14, 122))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		37,
		30,
		_Utils_Tuple2(17, 122),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 123))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		38,
		30,
		_Utils_Tuple2(4, 122),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(18, 123))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		39,
		30,
		_Utils_Tuple2(20, 117),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 118))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		40,
		30,
		_Utils_Tuple2(19, 118),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(6, 119)))
	]);
var $pablohirafuji$elm_qrcode$QRCode$GroupInfo$dataM = _List_fromArray(
	[
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		1,
		10,
		_Utils_Tuple2(1, 16),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		2,
		16,
		_Utils_Tuple2(1, 28),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		3,
		26,
		_Utils_Tuple2(1, 44),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		4,
		18,
		_Utils_Tuple2(2, 32),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		5,
		24,
		_Utils_Tuple2(2, 43),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		6,
		16,
		_Utils_Tuple2(4, 27),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		7,
		18,
		_Utils_Tuple2(4, 31),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		8,
		22,
		_Utils_Tuple2(2, 38),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 39))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		9,
		22,
		_Utils_Tuple2(3, 36),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 37))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		10,
		26,
		_Utils_Tuple2(4, 43),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(1, 44))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		11,
		30,
		_Utils_Tuple2(1, 50),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 51))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		12,
		22,
		_Utils_Tuple2(6, 36),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 37))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		13,
		22,
		_Utils_Tuple2(8, 37),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(1, 38))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		14,
		24,
		_Utils_Tuple2(4, 40),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(5, 41))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		15,
		24,
		_Utils_Tuple2(5, 41),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(5, 42))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		16,
		28,
		_Utils_Tuple2(7, 45),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(3, 46))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		17,
		28,
		_Utils_Tuple2(10, 46),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(1, 47))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		18,
		26,
		_Utils_Tuple2(9, 43),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 44))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		19,
		26,
		_Utils_Tuple2(3, 44),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(11, 45))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		20,
		26,
		_Utils_Tuple2(3, 41),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(13, 42))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		21,
		26,
		_Utils_Tuple2(17, 42),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		22,
		28,
		_Utils_Tuple2(17, 46),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		23,
		28,
		_Utils_Tuple2(4, 47),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(14, 48))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		24,
		28,
		_Utils_Tuple2(6, 45),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(14, 46))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		25,
		28,
		_Utils_Tuple2(8, 47),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(13, 48))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		26,
		28,
		_Utils_Tuple2(19, 46),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 47))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		27,
		28,
		_Utils_Tuple2(22, 45),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(3, 46))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		28,
		28,
		_Utils_Tuple2(3, 45),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(23, 46))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		29,
		28,
		_Utils_Tuple2(21, 45),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(7, 46))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		30,
		28,
		_Utils_Tuple2(19, 47),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(10, 48))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		31,
		28,
		_Utils_Tuple2(2, 46),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(29, 47))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		32,
		28,
		_Utils_Tuple2(10, 46),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(23, 47))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		33,
		28,
		_Utils_Tuple2(14, 46),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(21, 47))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		34,
		28,
		_Utils_Tuple2(14, 46),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(23, 47))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		35,
		28,
		_Utils_Tuple2(12, 47),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(26, 48))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		36,
		28,
		_Utils_Tuple2(6, 47),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(34, 48))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		37,
		28,
		_Utils_Tuple2(29, 46),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(14, 47))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		38,
		28,
		_Utils_Tuple2(13, 46),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(32, 47))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		39,
		28,
		_Utils_Tuple2(40, 47),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(7, 48))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		40,
		28,
		_Utils_Tuple2(18, 47),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(31, 48)))
	]);
var $pablohirafuji$elm_qrcode$QRCode$GroupInfo$dataQ = _List_fromArray(
	[
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		1,
		13,
		_Utils_Tuple2(1, 13),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		2,
		22,
		_Utils_Tuple2(1, 22),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		3,
		18,
		_Utils_Tuple2(2, 17),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		4,
		26,
		_Utils_Tuple2(2, 24),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		5,
		18,
		_Utils_Tuple2(2, 15),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 16))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		6,
		24,
		_Utils_Tuple2(4, 19),
		$elm$core$Maybe$Nothing),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		7,
		18,
		_Utils_Tuple2(2, 14),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 15))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		8,
		22,
		_Utils_Tuple2(4, 18),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 19))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		9,
		20,
		_Utils_Tuple2(4, 16),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 17))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		10,
		24,
		_Utils_Tuple2(6, 19),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 20))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		11,
		28,
		_Utils_Tuple2(4, 22),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 23))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		12,
		26,
		_Utils_Tuple2(4, 20),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(6, 21))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		13,
		24,
		_Utils_Tuple2(8, 20),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 21))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		14,
		20,
		_Utils_Tuple2(11, 16),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(5, 17))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		15,
		30,
		_Utils_Tuple2(5, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(7, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		16,
		24,
		_Utils_Tuple2(15, 19),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(2, 20))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		17,
		28,
		_Utils_Tuple2(1, 22),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(15, 23))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		18,
		28,
		_Utils_Tuple2(17, 22),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(1, 23))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		19,
		26,
		_Utils_Tuple2(17, 21),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(4, 22))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		20,
		30,
		_Utils_Tuple2(15, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(5, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		21,
		28,
		_Utils_Tuple2(17, 22),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(6, 23))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		22,
		30,
		_Utils_Tuple2(7, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(16, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		23,
		30,
		_Utils_Tuple2(11, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(14, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		24,
		30,
		_Utils_Tuple2(11, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(16, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		25,
		30,
		_Utils_Tuple2(7, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(22, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		26,
		28,
		_Utils_Tuple2(28, 22),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(6, 23))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		27,
		30,
		_Utils_Tuple2(8, 23),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(26, 24))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		28,
		30,
		_Utils_Tuple2(4, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(31, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		29,
		30,
		_Utils_Tuple2(1, 23),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(37, 24))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		30,
		30,
		_Utils_Tuple2(15, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(25, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		31,
		30,
		_Utils_Tuple2(42, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(1, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		32,
		30,
		_Utils_Tuple2(10, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(35, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		33,
		30,
		_Utils_Tuple2(29, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(19, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		34,
		30,
		_Utils_Tuple2(44, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(7, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		35,
		30,
		_Utils_Tuple2(39, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(14, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		36,
		30,
		_Utils_Tuple2(46, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(10, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		37,
		30,
		_Utils_Tuple2(49, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(10, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		38,
		30,
		_Utils_Tuple2(48, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(14, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		39,
		30,
		_Utils_Tuple2(43, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(22, 25))),
		A4(
		$pablohirafuji$elm_qrcode$QRCode$GroupInfo$newGroupInfo,
		40,
		30,
		_Utils_Tuple2(34, 24),
		$elm$core$Maybe$Just(
			_Utils_Tuple2(34, 25)))
	]);
var $pablohirafuji$elm_qrcode$QRCode$GroupInfo$getGroupData = function (ecLevel) {
	switch (ecLevel) {
		case 0:
			return $pablohirafuji$elm_qrcode$QRCode$GroupInfo$dataL;
		case 1:
			return $pablohirafuji$elm_qrcode$QRCode$GroupInfo$dataM;
		case 2:
			return $pablohirafuji$elm_qrcode$QRCode$GroupInfo$dataQ;
		default:
			return $pablohirafuji$elm_qrcode$QRCode$GroupInfo$dataH;
	}
};
var $elm$core$List$sortBy = _List_sortBy;
var $pablohirafuji$elm_qrcode$QRCode$Encode$getVersion = F3(
	function (ecLevel, mode, dataLength) {
		return A2(
			$elm$core$Result$fromMaybe,
			$pablohirafuji$elm_qrcode$QRCode$Error$InputLengthOverflow,
			$elm$core$List$head(
				A2(
					$elm$core$List$sortBy,
					function ($) {
						return $.a$;
					},
					A2(
						$elm$core$List$filter,
						A2($pablohirafuji$elm_qrcode$QRCode$Encode$filterCapacity, mode, dataLength),
						$pablohirafuji$elm_qrcode$QRCode$GroupInfo$getGroupData(ecLevel)))));
	});
var $pablohirafuji$elm_qrcode$QRCode$Encode$versionToModel = F5(
	function (inputStr, ecLevel, mode, partialBitsCount, groupInfo) {
		return {
			bo: partialBitsCount + A2($pablohirafuji$elm_qrcode$QRCode$Encode$charCountIndicatorLength, mode, groupInfo.bP),
			b3: ecLevel,
			de: groupInfo,
			bz: inputStr,
			a8: mode
		};
	});
var $pablohirafuji$elm_qrcode$QRCode$Encode$selectVersion = F4(
	function (inputStr, ecLevel, mode, encodedStr) {
		var partialBitsCount = 4 + A3(
			$elm$core$List$foldl,
			F2(
				function (a, b) {
					return a.b + b;
				}),
			0,
			encodedStr);
		return A2(
			$elm$core$Result$map,
			function (b) {
				return _Utils_Tuple2(encodedStr, b);
			},
			A2(
				$elm$core$Result$map,
				A4($pablohirafuji$elm_qrcode$QRCode$Encode$versionToModel, inputStr, ecLevel, mode, partialBitsCount),
				A3($pablohirafuji$elm_qrcode$QRCode$Encode$getVersion, ecLevel, mode, partialBitsCount)));
	});
var $pablohirafuji$elm_qrcode$QRCode$Encode$breakList = F3(
	function (checkFinish, _v0, _v1) {
		breakList:
		while (true) {
			var times = _v0.a;
			var itemCount = _v0.b;
			var byteList = _v1.a;
			var progress = _v1.b;
			if (times > 0) {
				var remainList = A2($elm$core$List$drop, itemCount, byteList);
				var block = A2($elm$core$List$take, itemCount, byteList);
				var $temp$checkFinish = checkFinish,
					$temp$_v0 = _Utils_Tuple2(times - 1, itemCount),
					$temp$_v1 = _Utils_Tuple2(
					remainList,
					A2($elm$core$List$cons, block, progress));
				checkFinish = $temp$checkFinish;
				_v0 = $temp$_v0;
				_v1 = $temp$_v1;
				continue breakList;
			} else {
				if (checkFinish && ($elm$core$List$length(byteList) > 0)) {
					return $elm$core$Result$Err($pablohirafuji$elm_qrcode$QRCode$Error$InputLengthOverflow);
				} else {
					return $elm$core$Result$Ok(
						_Utils_Tuple2(byteList, progress));
				}
			}
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$Encode$toBlocks = function (_v0) {
	var model = _v0.a;
	var groupInfo = model.de;
	var byteList = _v0.b;
	var _v1 = groupInfo.$7;
	if (!_v1.$) {
		var group2 = _v1.a;
		return A2(
			$elm$core$Result$map,
			function (b) {
				return _Utils_Tuple2(model, b);
			},
			A2(
				$elm$core$Result$map,
				A2($elm$core$Basics$composeR, $elm$core$Tuple$second, $elm$core$List$reverse),
				A2(
					$elm$core$Result$andThen,
					A2($pablohirafuji$elm_qrcode$QRCode$Encode$breakList, true, group2),
					A3(
						$pablohirafuji$elm_qrcode$QRCode$Encode$breakList,
						false,
						groupInfo.ca,
						_Utils_Tuple2(byteList, _List_Nil)))));
	} else {
		return A2(
			$elm$core$Result$map,
			function (b) {
				return _Utils_Tuple2(model, b);
			},
			A2(
				$elm$core$Result$map,
				A2($elm$core$Basics$composeR, $elm$core$Tuple$second, $elm$core$List$reverse),
				A3(
					$pablohirafuji$elm_qrcode$QRCode$Encode$breakList,
					true,
					groupInfo.ca,
					_Utils_Tuple2(byteList, _List_Nil))));
	}
};
var $pablohirafuji$elm_qrcode$QRCode$Encode$encode = F2(
	function (inputStr, ecLevel) {
		var mode = $pablohirafuji$elm_qrcode$QRCode$Encode$selectMode(inputStr);
		return A2(
			$elm$core$Result$map,
			$pablohirafuji$elm_qrcode$QRCode$Encode$concatTranspose,
			A2(
				$elm$core$Result$andThen,
				$pablohirafuji$elm_qrcode$QRCode$Encode$getErrorCorrection,
				A2(
					$elm$core$Result$andThen,
					$pablohirafuji$elm_qrcode$QRCode$Encode$toBlocks,
					A2(
						$elm$core$Result$map,
						$pablohirafuji$elm_qrcode$QRCode$Encode$addInfoAndFinalBits,
						A2(
							$elm$core$Result$andThen,
							A3($pablohirafuji$elm_qrcode$QRCode$Encode$selectVersion, inputStr, ecLevel, mode),
							A2($pablohirafuji$elm_qrcode$QRCode$Encode$encoder, mode, inputStr))))));
	});
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $pablohirafuji$elm_qrcode$QRCode$fromStringWith = F2(
	function (ecLevel, input) {
		return A2(
			$elm$core$Result$mapError,
			$pablohirafuji$elm_qrcode$QRCode$convertError,
			A2(
				$elm$core$Result$andThen,
				function (_v0) {
					var encodeModel = _v0.a;
					var encodedData = _v0.b;
					return A2(
						$elm$core$Result$map,
						function (matrix) {
							return {aP: matrix, bP: encodeModel.de.bP};
						},
						$pablohirafuji$elm_qrcode$QRCode$Matrix$apply(
							_Utils_Tuple2(encodeModel, encodedData)));
				},
				A2(
					$pablohirafuji$elm_qrcode$QRCode$Encode$encode,
					input,
					$pablohirafuji$elm_qrcode$QRCode$convertEC(ecLevel))));
	});
var $pablohirafuji$elm_qrcode$QRCode$Render$Raster$addQuietZone = F2(
	function (quietZoneSize, matrix) {
		if (quietZoneSize <= 0) {
			return matrix;
		} else {
			var matrixWithQZLength = $elm$core$List$length(matrix) + (2 * quietZoneSize);
			var rows = A2(
				$elm$core$List$repeat,
				quietZoneSize,
				A2($elm$core$List$repeat, matrixWithQZLength, false));
			var cols = A2($elm$core$List$repeat, quietZoneSize, false);
			return _Utils_ap(
				rows,
				_Utils_ap(
					A2(
						$elm$core$List$map,
						function (row) {
							return _Utils_ap(
								cols,
								_Utils_ap(row, cols));
						},
						matrix),
					rows));
		}
	});
var $justgook$elm_image$Image$Info$FromData = function (a) {
	return {$: 3, a: a};
};
var $justgook$elm_image$Image$Info$FromDataBitDepth8 = 3;
var $justgook$elm_image$Image$Info$FromDataChannel4 = function (a) {
	return {$: 3, a: a};
};
var $justgook$elm_image$Image$Internal$ImageData$List2d = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $justgook$elm_image$Image$fromList2d = function (l) {
	return A2(
		$justgook$elm_image$Image$Internal$ImageData$List2d,
		$justgook$elm_image$Image$Info$FromData(
			{
				a1: $justgook$elm_image$Image$Info$FromDataChannel4(3),
				cb: $elm$core$List$length(l),
				cO: A2(
					$elm$core$Maybe$withDefault,
					0,
					A2(
						$elm$core$Maybe$map,
						$elm$core$List$length,
						$elm$core$List$head(l)))
			}),
		l);
};
var $pablohirafuji$elm_qrcode$QRCode$Render$Raster$moduleToPixel = F2(
	function (options, isDark) {
		return isDark ? options.c1 : options.dm;
	});
var $pablohirafuji$elm_qrcode$QRCode$Render$Raster$toImageWithOptions = F2(
	function (options, matrix) {
		var moduleSize = A2($elm$core$Basics$max, 1, options.dq);
		return $justgook$elm_image$Image$fromList2d(
			$elm$core$List$concat(
				A2(
					$elm$core$List$map,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$List$map(
							A2(
								$elm$core$Basics$composeR,
								$pablohirafuji$elm_qrcode$QRCode$Render$Raster$moduleToPixel(options),
								$elm$core$List$repeat(moduleSize))),
						A2(
							$elm$core$Basics$composeR,
							$elm$core$List$concat,
							$elm$core$List$repeat(moduleSize))),
					A2($pablohirafuji$elm_qrcode$QRCode$Render$Raster$addQuietZone, options.cB, matrix))));
	});
var $pablohirafuji$elm_qrcode$QRCode$toImageWithOptions = F2(
	function (config, _v0) {
		var matrix = _v0.aP;
		return A2($pablohirafuji$elm_qrcode$QRCode$Render$Raster$toImageWithOptions, config, matrix);
	});
var $justgook$elm_image$Image$Internal$ImageData$RGBA = 0;
var $justgook$elm_image$Image$Internal$ImageData$RightDown = 0;
var $justgook$elm_image$Image$Internal$ImageData$defaultOptions = {b8: 0, cs: 0};
var $elm$bytes$Bytes$BE = 1;
var $elm$bytes$Bytes$Encode$Bytes = function (a) {
	return {$: 10, a: a};
};
var $elm$bytes$Bytes$Encode$bytes = $elm$bytes$Bytes$Encode$Bytes;
var $elm$bytes$Bytes$Decode$map2 = F3(
	function (func, _v0, _v1) {
		var decodeA = _v0;
		var decodeB = _v1;
		return F2(
			function (bites, offset) {
				var _v2 = A2(decodeA, bites, offset);
				var aOffset = _v2.a;
				var a = _v2.b;
				var _v3 = A2(decodeB, bites, aOffset);
				var bOffset = _v3.a;
				var b = _v3.b;
				return _Utils_Tuple2(
					bOffset,
					A2(func, a, b));
			});
	});
var $folkertdev$elm_flate$Checksum$Crc32$tinf_crc32case = function (i) {
	switch (i) {
		case 0:
			return 0;
		case 1:
			return 498536548;
		case 2:
			return 997073096;
		case 3:
			return 651767980;
		case 4:
			return 1994146192;
		case 5:
			return 1802195444;
		case 6:
			return 1303535960;
		case 7:
			return 1342533948;
		case 8:
			return 3988292384;
		case 9:
			return 4027552580;
		case 10:
			return 3604390888;
		case 11:
			return 3412177804;
		case 12:
			return 2607071920;
		case 13:
			return 2262029012;
		case 14:
			return 2685067896;
		default:
			return 3183342108;
	}
};
var $folkertdev$elm_flate$Checksum$Crc32$step = F2(
	function (_byte, crc) {
		var a = (crc ^ _byte) >>> 0;
		var b = ((a >>> 4) ^ $folkertdev$elm_flate$Checksum$Crc32$tinf_crc32case(a & 15)) >>> 0;
		var c = (b >>> 4) ^ $folkertdev$elm_flate$Checksum$Crc32$tinf_crc32case(b & 15);
		return c;
	});
var $elm$bytes$Bytes$Decode$unsignedInt32 = function (endianness) {
	return _Bytes_read_u32(!endianness);
};
var $folkertdev$elm_flate$Checksum$Crc32$crc32Help = function (_v0) {
	var remaining = _v0.bd;
	var crc = _v0.a2;
	return (remaining >= 8) ? A3(
		$elm$bytes$Bytes$Decode$map2,
		F2(
			function (word1, word2) {
				var byte8 = 255 & word2;
				var byte7 = 255 & (word2 >>> 8);
				var byte6 = 255 & (word2 >>> 16);
				var byte5 = 255 & (word2 >>> 24);
				var byte4 = 255 & word1;
				var byte3 = 255 & (word1 >>> 8);
				var byte2 = 255 & (word1 >>> 16);
				var byte1 = 255 & (word1 >>> 24);
				return $elm$bytes$Bytes$Decode$Loop(
					{
						a2: A2(
							$folkertdev$elm_flate$Checksum$Crc32$step,
							byte8,
							A2(
								$folkertdev$elm_flate$Checksum$Crc32$step,
								byte7,
								A2(
									$folkertdev$elm_flate$Checksum$Crc32$step,
									byte6,
									A2(
										$folkertdev$elm_flate$Checksum$Crc32$step,
										byte5,
										A2(
											$folkertdev$elm_flate$Checksum$Crc32$step,
											byte4,
											A2(
												$folkertdev$elm_flate$Checksum$Crc32$step,
												byte3,
												A2(
													$folkertdev$elm_flate$Checksum$Crc32$step,
													byte2,
													A2($folkertdev$elm_flate$Checksum$Crc32$step, byte1, crc)))))))),
						bd: remaining - 8
					});
			}),
		$elm$bytes$Bytes$Decode$unsignedInt32(1),
		$elm$bytes$Bytes$Decode$unsignedInt32(1)) : ((remaining > 0) ? A2(
		$elm$bytes$Bytes$Decode$map,
		function (_byte) {
			return $elm$bytes$Bytes$Decode$Loop(
				{
					a2: A2($folkertdev$elm_flate$Checksum$Crc32$step, _byte, crc),
					bd: remaining - 1
				});
		},
		$elm$bytes$Bytes$Decode$unsignedInt8) : $elm$bytes$Bytes$Decode$succeed(
		$elm$bytes$Bytes$Decode$Done((crc ^ 4294967295) >>> 0)));
};
var $elm$bytes$Bytes$width = _Bytes_width;
var $folkertdev$elm_flate$Checksum$Crc32$tinf_crc32 = function (buffer) {
	var length = $elm$bytes$Bytes$width(buffer);
	var initialCrc = 4294967295;
	return (!length) ? 0 : A2(
		$elm$core$Maybe$withDefault,
		0,
		A2(
			$elm$bytes$Bytes$Decode$decode,
			A2(
				$elm$bytes$Bytes$Decode$loop,
				{a2: initialCrc, bd: length},
				$folkertdev$elm_flate$Checksum$Crc32$crc32Help),
			buffer));
};
var $folkertdev$elm_flate$Checksum$Crc32$crc32 = $folkertdev$elm_flate$Checksum$Crc32$tinf_crc32;
var $folkertdev$elm_flate$Flate$crc32 = $folkertdev$elm_flate$Checksum$Crc32$crc32;
var $elm$bytes$Bytes$Encode$Seq = F2(
	function (a, b) {
		return {$: 8, a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$getWidths = F2(
	function (width, builders) {
		getWidths:
		while (true) {
			if (!builders.b) {
				return width;
			} else {
				var b = builders.a;
				var bs = builders.b;
				var $temp$width = width + $elm$bytes$Bytes$Encode$getWidth(b),
					$temp$builders = bs;
				width = $temp$width;
				builders = $temp$builders;
				continue getWidths;
			}
		}
	});
var $elm$bytes$Bytes$Encode$sequence = function (builders) {
	return A2(
		$elm$bytes$Bytes$Encode$Seq,
		A2($elm$bytes$Bytes$Encode$getWidths, 0, builders),
		builders);
};
var $elm$bytes$Bytes$Encode$U32 = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$unsignedInt32 = $elm$bytes$Bytes$Encode$U32;
var $justgook$elm_image$Image$Internal$PNG$encodeChunk = F2(
	function (kind, data) {
		var length = $elm$bytes$Bytes$width(data);
		var kindAndData = $elm$bytes$Bytes$Encode$encode(
			$elm$bytes$Bytes$Encode$sequence(
				_List_fromArray(
					[
						A2($elm$bytes$Bytes$Encode$unsignedInt32, 1, kind),
						$elm$bytes$Bytes$Encode$bytes(data)
					])));
		return $elm$bytes$Bytes$Encode$sequence(
			_List_fromArray(
				[
					A2($elm$bytes$Bytes$Encode$unsignedInt32, 1, length),
					$elm$bytes$Bytes$Encode$bytes(kindAndData),
					A2(
					$elm$bytes$Bytes$Encode$unsignedInt32,
					1,
					$folkertdev$elm_flate$Flate$crc32(kindAndData))
				]));
	});
var $folkertdev$elm_flate$Flate$Dynamic = function (a) {
	return {$: 1, a: a};
};
var $folkertdev$elm_flate$Flate$WithWindowSize = function (a) {
	return {$: 1, a: a};
};
var $folkertdev$elm_flate$Checksum$Adler32$a32 = {bn: 65521, cq: 5552};
var $folkertdev$elm_flate$Checksum$Adler32$step8Bytes = F5(
	function (remaining, s1, s2, word1, word2) {
		var byte8 = 255 & word2;
		var byte7 = 255 & (word2 >>> 8);
		var byte6 = 255 & (word2 >>> 16);
		var byte5 = 255 & (word2 >>> 24);
		var byte4 = 255 & word1;
		var byte3 = 255 & (word1 >>> 8);
		var byte2 = 255 & (word1 >>> 16);
		var byte1 = 255 & (word1 >>> 24);
		var s1a_1 = s1 + byte1;
		var s1a_2 = s1a_1 + byte2;
		var s1a_3 = s1a_2 + byte3;
		var s1a_4 = s1a_3 + byte4;
		var s2a_1 = s2 + s1a_1;
		var s2a_2 = s2a_1 + s1a_2;
		var s2a_3 = s2a_2 + s1a_3;
		var s2a_4 = s2a_3 + s1a_4;
		var s1b_1 = s1a_4 + byte5;
		var s1b_2 = s1b_1 + byte6;
		var s1b_3 = s1b_2 + byte7;
		var s1b_4 = s1b_3 + byte8;
		var s2b_1 = s2a_4 + s1b_1;
		var s2b_2 = s2b_1 + s1b_2;
		var s2b_3 = s2b_2 + s1b_3;
		var s2b_4 = s2b_3 + s1b_4;
		return $elm$bytes$Bytes$Decode$Loop(
			{bd: remaining - 8, v: s1b_4, w: s2b_4});
	});
var $folkertdev$elm_flate$Checksum$Adler32$processChunkHelp = function (_v0) {
	var remaining = _v0.bd;
	var s1 = _v0.v;
	var s2 = _v0.w;
	return (remaining >= 8) ? A3(
		$elm$bytes$Bytes$Decode$map2,
		A3($folkertdev$elm_flate$Checksum$Adler32$step8Bytes, remaining, s1, s2),
		$elm$bytes$Bytes$Decode$unsignedInt32(1),
		$elm$bytes$Bytes$Decode$unsignedInt32(1)) : ((remaining > 0) ? A2(
		$elm$bytes$Bytes$Decode$map,
		function (_byte) {
			return $elm$bytes$Bytes$Decode$Loop(
				{bd: remaining - 1, v: s1 + _byte, w: (s1 + _byte) + s2});
		},
		$elm$bytes$Bytes$Decode$unsignedInt8) : $elm$bytes$Bytes$Decode$succeed(
		$elm$bytes$Bytes$Decode$Done(
			{v: s1 % $folkertdev$elm_flate$Checksum$Adler32$a32.bn, w: s2 % $folkertdev$elm_flate$Checksum$Adler32$a32.bn})));
};
var $folkertdev$elm_flate$Checksum$Adler32$processChunk = function (config) {
	return A2($elm$bytes$Bytes$Decode$loop, config, $folkertdev$elm_flate$Checksum$Adler32$processChunkHelp);
};
var $folkertdev$elm_flate$Checksum$Adler32$chunkedFold = function (_v0) {
	var bufferSize = _v0.bY;
	var maxBlockSize = _v0.cm;
	var go = function (_v1) {
		var remainingLength = _v1.bI;
		var s1 = _v1.v;
		var s2 = _v1.w;
		return (!remainingLength) ? $elm$bytes$Bytes$Decode$succeed(
			$elm$bytes$Bytes$Decode$Done(
				{v: s1, w: s2})) : ((_Utils_cmp(remainingLength, maxBlockSize) < 0) ? A2(
			$elm$bytes$Bytes$Decode$map,
			$elm$bytes$Bytes$Decode$Done,
			$folkertdev$elm_flate$Checksum$Adler32$processChunk(
				{bd: remainingLength, v: s1, w: s2})) : A2(
			$elm$bytes$Bytes$Decode$map,
			function (result) {
				return $elm$bytes$Bytes$Decode$Loop(
					{bI: remainingLength - maxBlockSize, v: result.v, w: result.w});
			},
			$folkertdev$elm_flate$Checksum$Adler32$processChunk(
				{bd: maxBlockSize, v: s1, w: s2})));
	};
	return A2(
		$elm$bytes$Bytes$Decode$loop,
		{bI: bufferSize, v: 1, w: 0},
		go);
};
var $folkertdev$elm_flate$Checksum$Adler32$adler32 = function (buffer) {
	var _v0 = A2(
		$elm$bytes$Bytes$Decode$decode,
		$folkertdev$elm_flate$Checksum$Adler32$chunkedFold(
			{
				bY: $elm$bytes$Bytes$width(buffer),
				cm: $folkertdev$elm_flate$Checksum$Adler32$a32.cq
			}),
		buffer);
	if (_v0.$ === 1) {
		return 0;
	} else {
		var s1 = _v0.a.v;
		var s2 = _v0.a.w;
		return ((s2 << 16) | s1) >>> 0;
	}
};
var $elm$bytes$Bytes$Decode$bytes = function (n) {
	return _Bytes_read_bytes(n);
};
var $folkertdev$elm_flate$Deflate$Internal$chunksHelp = F2(
	function (chunkSize, _v0) {
		var sizeRemaining = _v0.a;
		var accum = _v0.b;
		return (!sizeRemaining) ? $elm$bytes$Bytes$Decode$succeed(
			$elm$bytes$Bytes$Decode$Done(_List_Nil)) : ((_Utils_cmp(chunkSize, sizeRemaining) > -1) ? A2(
			$elm$bytes$Bytes$Decode$map,
			function (_new) {
				return $elm$bytes$Bytes$Decode$Done(
					$elm$core$List$reverse(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(true, _new),
							accum)));
			},
			$elm$bytes$Bytes$Decode$bytes(sizeRemaining)) : A2(
			$elm$bytes$Bytes$Decode$map,
			function (_new) {
				return $elm$bytes$Bytes$Decode$Loop(
					_Utils_Tuple2(
						sizeRemaining - chunkSize,
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(false, _new),
							accum)));
			},
			$elm$bytes$Bytes$Decode$bytes(chunkSize)));
	});
var $folkertdev$elm_flate$Deflate$Internal$chunks = F2(
	function (chunkSize, buffer) {
		var _v0 = A2(
			$elm$bytes$Bytes$Decode$decode,
			A2(
				$elm$bytes$Bytes$Decode$loop,
				_Utils_Tuple2(
					$elm$bytes$Bytes$width(buffer),
					_List_Nil),
				$folkertdev$elm_flate$Deflate$Internal$chunksHelp(chunkSize)),
			buffer);
		if (_v0.$ === 1) {
			return _List_fromArray(
				[
					_Utils_Tuple2(
					true,
					$elm$bytes$Bytes$Encode$encode(
						$elm$bytes$Bytes$Encode$sequence(_List_Nil)))
				]);
		} else {
			if (!_v0.a.b) {
				return _List_fromArray(
					[
						_Utils_Tuple2(
						true,
						$elm$bytes$Bytes$Encode$encode(
							$elm$bytes$Bytes$Encode$sequence(_List_Nil)))
					]);
			} else {
				var value = _v0.a;
				return value;
			}
		}
	});
var $folkertdev$elm_flate$Deflate$Internal$default_block_size = 1024 * 1024;
var $folkertdev$elm_flate$Deflate$BitWriter$empty = {A: 0, B: _List_Nil, K: 0};
var $folkertdev$elm_flate$Deflate$Symbol$code = function (symbol) {
	switch (symbol.$) {
		case 1:
			var _byte = symbol.a;
			return _byte;
		case 0:
			return 256;
		default:
			var length = symbol.a;
			return ((length >= 3) && (length <= 10)) ? ((257 + length) - 3) : (((length >= 11) && (length <= 18)) ? (265 + (((length - 11) / 2) | 0)) : (((length >= 19) && (length <= 34)) ? (269 + (((length - 19) / 4) | 0)) : (((length >= 35) && (length <= 66)) ? (273 + (((length - 35) / 8) | 0)) : (((length >= 67) && (length <= 130)) ? (277 + (((length - 67) / 16) | 0)) : (((length >= 131) && (length <= 257)) ? (281 + (((length - 131) / 32) | 0)) : ((length === 258) ? 285 : (-1)))))));
	}
};
var $folkertdev$elm_flate$Deflate$Symbol$distance = function (symbol) {
	if (symbol.$ === 2) {
		var distance_ = symbol.b;
		if (distance_ <= 4) {
			return $elm$core$Maybe$Just(
				_Utils_Tuple3(distance_ - 1, 0, 0));
		} else {
			var go = F3(
				function (extraBits, code_, base) {
					go:
					while (true) {
						if (_Utils_cmp(base * 2, distance_) < 0) {
							var $temp$extraBits = extraBits + 1,
								$temp$code_ = code_ + 2,
								$temp$base = base * 2;
							extraBits = $temp$extraBits;
							code_ = $temp$code_;
							base = $temp$base;
							continue go;
						} else {
							return _Utils_Tuple3(extraBits, code_, base);
						}
					}
				});
			var _v1 = A3(go, 1, 4, 4);
			var extraBits = _v1.a;
			var code_ = _v1.b;
			var base = _v1.c;
			var delta = (distance_ - base) - 1;
			var half = (base / 2) | 0;
			return (_Utils_cmp(distance_, base + half) < 1) ? $elm$core$Maybe$Just(
				_Utils_Tuple3(
					code_,
					extraBits,
					A2($elm$core$Basics$modBy, half, delta))) : $elm$core$Maybe$Just(
				_Utils_Tuple3(
					code_ + 1,
					extraBits,
					A2($elm$core$Basics$modBy, half, delta)));
		}
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $folkertdev$elm_flate$Deflate$Symbol$update = F3(
	function (index, tagger, array) {
		var _v0 = A2($elm$core$Array$get, index, array);
		if (_v0.$ === 1) {
			return array;
		} else {
			var value = _v0.a;
			return A3(
				$elm$core$Array$set,
				index,
				tagger(value),
				array);
		}
	});
var $folkertdev$elm_flate$Deflate$Symbol$dynamicFindFrequencies = F2(
	function (symbol, _v0) {
		var literalCounts = _v0.a;
		var distanceCounts = _v0.b;
		var emptyDistanceCount = _v0.c;
		var _v1 = $folkertdev$elm_flate$Deflate$Symbol$distance(symbol);
		if (_v1.$ === 1) {
			return _Utils_Tuple3(
				A3(
					$folkertdev$elm_flate$Deflate$Symbol$update,
					$folkertdev$elm_flate$Deflate$Symbol$code(symbol),
					function (v) {
						return v + 1;
					},
					literalCounts),
				distanceCounts,
				emptyDistanceCount);
		} else {
			var _v2 = _v1.a;
			var d = _v2.a;
			return _Utils_Tuple3(
				A3(
					$folkertdev$elm_flate$Deflate$Symbol$update,
					$folkertdev$elm_flate$Deflate$Symbol$code(symbol),
					function (v) {
						return v + 1;
					},
					literalCounts),
				A3(
					$folkertdev$elm_flate$Deflate$Symbol$update,
					d,
					function (v) {
						return v + 1;
					},
					distanceCounts),
				false);
		}
	});
var $elm$core$List$sortWith = _List_sortWith;
var $folkertdev$elm_flate$Huffman$calcOptimalMaxBitWidth = function (frequencies) {
	var heapModificationLoop = function (heap) {
		heapModificationLoop:
		while (true) {
			if (!heap.b) {
				return 0;
			} else {
				if (!heap.b.b) {
					var _v1 = heap.a;
					var value = _v1.b;
					return A2($elm$core$Basics$max, 1, value);
				} else {
					var _v2 = heap.a;
					var weight1 = _v2.a;
					var width1 = _v2.b;
					var _v3 = heap.b;
					var _v4 = _v3.a;
					var weight2 = _v4.a;
					var width2 = _v4.b;
					var rest = _v3.b;
					var $temp$heap = A2(
						$elm$core$List$sortWith,
						F2(
							function (a, b) {
								return A2($elm$core$Basics$compare, b, a);
							}),
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								weight1 + weight2,
								1 + A2($elm$core$Basics$max, width1, width2)),
							rest));
					heap = $temp$heap;
					continue heapModificationLoop;
				}
			}
		}
	};
	var createHeapFolder = F2(
		function (freq, heap) {
			return (freq > 0) ? A2(
				$elm$core$List$cons,
				_Utils_Tuple2(-freq, 0),
				heap) : heap;
		});
	var createHeap = A3($elm$core$Array$foldl, createHeapFolder, _List_Nil, frequencies);
	return heapModificationLoop(createHeap);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$core$Array$filter = F2(
	function (isGood, array) {
		return $elm$core$Array$fromList(
			A3(
				$elm$core$Array$foldr,
				F2(
					function (x, xs) {
						return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
					}),
				_List_Nil,
				array));
	});
var $elm$core$Elm$JsArray$map = _JsArray_map;
var $elm$core$Array$map = F2(
	function (func, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = function (node) {
			if (!node.$) {
				var subTree = node.a;
				return $elm$core$Array$SubTree(
					A2($elm$core$Elm$JsArray$map, helper, subTree));
			} else {
				var values = node.a;
				return $elm$core$Array$Leaf(
					A2($elm$core$Elm$JsArray$map, func, values));
			}
		};
		return A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A2($elm$core$Elm$JsArray$map, helper, tree),
			A2($elm$core$Elm$JsArray$map, func, tail));
	});
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.l)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.l, tail);
		return (notAppended < 0) ? {
			m: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.m),
			i: builder.i + 1,
			l: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			m: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.m),
			i: builder.i + 1,
			l: $elm$core$Elm$JsArray$empty
		} : {m: builder.m, i: builder.i, l: appended});
	});
var $elm$core$Elm$JsArray$push = _JsArray_push;
var $elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var $elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			$elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					$elm$core$Elm$JsArray$push,
					$elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, $elm$core$Elm$JsArray$empty));
				return A2($elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!value.$) {
				var subTree = value.a;
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, subTree));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4(
						$elm$core$Array$insertTailInTree,
						shift - $elm$core$Array$shiftStep,
						index,
						tail,
						$elm$core$Elm$JsArray$singleton(value)));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var $elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var originalTailLen = $elm$core$Elm$JsArray$length(tail);
		var newTailLen = $elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, $elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> $elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + $elm$core$Array$shiftStep;
				var newTree = A4(
					$elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					$elm$core$Elm$JsArray$singleton(
						$elm$core$Array$SubTree(tree)));
				return A4($elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, $elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4($elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					$elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4($elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var $elm$core$Array$appendHelpTree = F2(
	function (toAppend, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		var itemsToAppend = $elm$core$Elm$JsArray$length(toAppend);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(tail)) - itemsToAppend;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, tail, toAppend);
		var newArray = A2($elm$core$Array$unsafeReplaceTail, appended, array);
		if (notAppended < 0) {
			var nextTail = A3($elm$core$Elm$JsArray$slice, notAppended, itemsToAppend, toAppend);
			return A2($elm$core$Array$unsafeReplaceTail, nextTail, newArray);
		} else {
			return newArray;
		}
	});
var $elm$core$Array$builderFromArray = function (_v0) {
	var len = _v0.a;
	var tree = _v0.c;
	var tail = _v0.d;
	var helper = F2(
		function (node, acc) {
			if (!node.$) {
				var subTree = node.a;
				return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
			} else {
				return A2($elm$core$List$cons, node, acc);
			}
		});
	return {
		m: A3($elm$core$Elm$JsArray$foldl, helper, _List_Nil, tree),
		i: (len / $elm$core$Array$branchFactor) | 0,
		l: tail
	};
};
var $elm$core$Array$append = F2(
	function (a, _v0) {
		var aTail = a.d;
		var bLen = _v0.a;
		var bTree = _v0.c;
		var bTail = _v0.d;
		if (_Utils_cmp(bLen, $elm$core$Array$branchFactor * 4) < 1) {
			var foldHelper = F2(
				function (node, array) {
					if (!node.$) {
						var tree = node.a;
						return A3($elm$core$Elm$JsArray$foldl, foldHelper, array, tree);
					} else {
						var leaf = node.a;
						return A2($elm$core$Array$appendHelpTree, leaf, array);
					}
				});
			return A2(
				$elm$core$Array$appendHelpTree,
				bTail,
				A3($elm$core$Elm$JsArray$foldl, foldHelper, a, bTree));
		} else {
			var foldHelper = F2(
				function (node, builder) {
					if (!node.$) {
						var tree = node.a;
						return A3($elm$core$Elm$JsArray$foldl, foldHelper, builder, tree);
					} else {
						var leaf = node.a;
						return A2($elm$core$Array$appendHelpBuilder, leaf, builder);
					}
				});
			return A2(
				$elm$core$Array$builderToArray,
				true,
				A2(
					$elm$core$Array$appendHelpBuilder,
					bTail,
					A3(
						$elm$core$Elm$JsArray$foldl,
						foldHelper,
						$elm$core$Array$builderFromArray(a),
						bTree)));
		}
	});
var $elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			$elm$core$Array$unsafeReplaceTail,
			A2($elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$mergeLoop = F3(
	function (xarr, yarr, accum) {
		mergeLoop:
		while (true) {
			var _v0 = _Utils_Tuple2(xarr, yarr);
			if (!_v0.a.b) {
				return A2(
					$elm$core$Array$append,
					accum,
					$elm$core$Array$fromList(yarr));
			} else {
				if (!_v0.b.b) {
					return A2(
						$elm$core$Array$append,
						accum,
						$elm$core$Array$fromList(xarr));
				} else {
					var _v1 = _v0.a;
					var x = _v1.a;
					var xrest = _v1.b;
					var _v2 = _v0.b;
					var y = _v2.a;
					var yrest = _v2.b;
					if (_Utils_cmp(x.F, y.F) < 0) {
						var $temp$xarr = xrest,
							$temp$yarr = yarr,
							$temp$accum = A2($elm$core$Array$push, x, accum);
						xarr = $temp$xarr;
						yarr = $temp$yarr;
						accum = $temp$accum;
						continue mergeLoop;
					} else {
						var $temp$xarr = xarr,
							$temp$yarr = yrest,
							$temp$accum = A2($elm$core$Array$push, y, accum);
						xarr = $temp$xarr;
						yarr = $temp$yarr;
						accum = $temp$accum;
						continue mergeLoop;
					}
				}
			}
		}
	});
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$merge = F2(
	function (x, y) {
		return A3(
			$folkertdev$elm_flate$LengthLimitedHuffmanCodes$mergeLoop,
			$elm$core$Array$toList(x),
			$elm$core$Array$toList(y),
			$elm$core$Array$empty);
	});
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$mergeNodes = F2(
	function (node1, node2) {
		return {
			ai: A2($elm$core$Array$append, node1.ai, node2.ai),
			F: node1.F + node2.F
		};
	});
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$package = function (nodes) {
	if ($elm$core$Array$length(nodes) >= 2) {
		var newLen = ($elm$core$Array$length(nodes) / 2) | 0;
		var loop = F2(
			function (currentNodes, accum) {
				loop:
				while (true) {
					if (currentNodes.b && currentNodes.b.b) {
						var self = currentNodes.a;
						var _v1 = currentNodes.b;
						var other = _v1.a;
						var rest = _v1.b;
						var $temp$currentNodes = rest,
							$temp$accum = A2(
							$elm$core$List$cons,
							A2($folkertdev$elm_flate$LengthLimitedHuffmanCodes$mergeNodes, self, other),
							accum);
						currentNodes = $temp$currentNodes;
						accum = $temp$accum;
						continue loop;
					} else {
						return $elm$core$Array$fromList(
							$elm$core$List$reverse(accum));
					}
				}
			});
		return A2(
			loop,
			$elm$core$Array$toList(nodes),
			_List_Nil);
	} else {
		return nodes;
	}
};
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$core$Array$repeat = F2(
	function (n, e) {
		return A2(
			$elm$core$Array$initialize,
			n,
			function (_v0) {
				return e;
			});
	});
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$singletonNode = F2(
	function (symbol, weight) {
		return {
			ai: A2($elm$core$Array$repeat, 1, symbol),
			F: weight
		};
	});
var $elm_community$list_extra$List$Extra$stableSortWith = F2(
	function (pred, list) {
		var predWithIndex = F2(
			function (_v1, _v2) {
				var a1 = _v1.a;
				var i1 = _v1.b;
				var a2 = _v2.a;
				var i2 = _v2.b;
				var result = A2(pred, a1, a2);
				if (result === 1) {
					return A2($elm$core$Basics$compare, i1, i2);
				} else {
					return result;
				}
			});
		var listWithIndex = A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, a) {
					return _Utils_Tuple2(a, i);
				}),
			list);
		return A2(
			$elm$core$List$map,
			$elm$core$Tuple$first,
			A2($elm$core$List$sortWith, predWithIndex, listWithIndex));
	});
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$update = F3(
	function (index, tagger, array) {
		var _v0 = A2($elm$core$Array$get, index, array);
		if (_v0.$ === 1) {
			return array;
		} else {
			var value = _v0.a;
			return A3(
				$elm$core$Array$set,
				index,
				tagger(value),
				array);
		}
	});
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$calculate = F2(
	function (maxBitWidth, frequencies) {
		var source = $elm$core$Array$fromList(
			A2(
				$elm_community$list_extra$List$Extra$stableSortWith,
				F2(
					function (a, b) {
						return A2($elm$core$Basics$compare, a.F, b.F);
					}),
				$elm$core$Array$toList(
					A2(
						$elm$core$Array$map,
						function (_v3) {
							var symbol = _v3.a;
							var weight = _v3.b;
							return A2($folkertdev$elm_flate$LengthLimitedHuffmanCodes$singletonNode, symbol, weight);
						},
						A2(
							$elm$core$Array$filter,
							function (_v2) {
								var f = _v2.b;
								return f > 0;
							},
							A2($elm$core$Array$indexedMap, $elm$core$Tuple$pair, frequencies))))));
		var weighted = A3(
			$elm$core$List$foldl,
			F2(
				function (_v1, w) {
					return A2(
						$folkertdev$elm_flate$LengthLimitedHuffmanCodes$merge,
						$folkertdev$elm_flate$LengthLimitedHuffmanCodes$package(w),
						source);
				}),
			source,
			A2($elm$core$List$range, 0, maxBitWidth - 2));
		var loop = F2(
			function (symbols, accum) {
				loop:
				while (true) {
					if (!symbols.b) {
						return accum;
					} else {
						var symbol = symbols.a;
						var rest = symbols.b;
						var $temp$symbols = rest,
							$temp$accum = A3(
							$folkertdev$elm_flate$LengthLimitedHuffmanCodes$update,
							symbol,
							function (v) {
								return v + 1;
							},
							accum);
						symbols = $temp$symbols;
						accum = $temp$accum;
						continue loop;
					}
				}
			});
		var allSymbols = A2(
			$elm$core$List$concatMap,
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.ai;
				},
				$elm$core$Array$toList),
			$elm$core$Array$toList(
				$folkertdev$elm_flate$LengthLimitedHuffmanCodes$package(weighted)));
		return A2(
			loop,
			allSymbols,
			A2(
				$elm$core$Array$repeat,
				$elm$core$Array$length(frequencies),
				0));
	});
var $folkertdev$elm_flate$Huffman$Tree = $elm$core$Basics$identity;
var $folkertdev$elm_flate$Huffman$Code = $elm$core$Basics$identity;
var $folkertdev$elm_flate$Huffman$codeFromRecord = $elm$core$Basics$identity;
var $folkertdev$elm_flate$Huffman$new = function (n) {
	return A2(
		$elm$core$Array$repeat,
		n,
		$folkertdev$elm_flate$Huffman$codeFromRecord(
			{a: 0, cO: 0}));
};
var $folkertdev$elm_flate$Huffman$inverseEndianLoop = F4(
	function (i, limit, f, t) {
		inverseEndianLoop:
		while (true) {
			if (_Utils_cmp(i, limit) < 0) {
				var $temp$i = i + 1,
					$temp$limit = limit,
					$temp$f = f >> 1,
					$temp$t = (f & 1) | (t << 1);
				i = $temp$i;
				limit = $temp$limit;
				f = $temp$f;
				t = $temp$t;
				continue inverseEndianLoop;
			} else {
				return t;
			}
		}
	});
var $folkertdev$elm_flate$Huffman$inverseEndian = function (_v0) {
	var width = _v0.cO;
	var bits = _v0.a;
	var inverseBits = A4($folkertdev$elm_flate$Huffman$inverseEndianLoop, 0, width, bits, 0);
	return {a: inverseBits, cO: width};
};
var $folkertdev$elm_flate$Huffman$setMapping = F3(
	function (symbol, code, _v0) {
		var array = _v0;
		return A3(
			$elm$core$Array$set,
			symbol,
			$folkertdev$elm_flate$Huffman$inverseEndian(code),
			array);
	});
var $folkertdev$elm_flate$Huffman$restoreCanonicalHuffmanCodes = F2(
	function (bitWidths, tree) {
		var symbols = A2(
			$elm_community$list_extra$List$Extra$stableSortWith,
			F2(
				function (_v4, _v5) {
					var a = _v4.b;
					var b = _v5.b;
					return A2($elm$core$Basics$compare, a, b);
				}),
			$elm$core$Array$toList(
				A2(
					$elm$core$Array$filter,
					function (_v3) {
						var codeBitWidth = _v3.b;
						return codeBitWidth > 0;
					},
					A2($elm$core$Array$indexedMap, $elm$core$Tuple$pair, bitWidths))));
		var loop = F2(
			function (_v1, _v2) {
				var symbol = _v1.a;
				var bitWidth = _v1.b;
				var code = _v2.a;
				var prevWidth = _v2.b;
				var currentTree = _v2.c;
				var newBits = code << (bitWidth - prevWidth);
				var nextCode = {a: newBits, cO: bitWidth};
				return _Utils_Tuple3(
					newBits + 1,
					bitWidth,
					A3($folkertdev$elm_flate$Huffman$setMapping, symbol, nextCode, currentTree));
			});
		return function (_v0) {
			var x = _v0.c;
			return x;
		}(
			A3(
				$elm$core$List$foldl,
				loop,
				_Utils_Tuple3(0, 0, tree),
				symbols));
	});
var $folkertdev$elm_flate$Huffman$fromBitWidths = function (bitWidths) {
	var symbolCount = function (v) {
		return v + 1;
	}(
		A2(
			$elm$core$Maybe$withDefault,
			0,
			A2(
				$elm$core$Maybe$map,
				$elm$core$Tuple$first,
				function (a) {
					return A2(
						$elm$core$Array$get,
						$elm$core$Array$length(a) - 1,
						a);
				}(
					A2(
						$elm$core$Array$filter,
						function (e) {
							return e.b > 0;
						},
						A2($elm$core$Array$indexedMap, $elm$core$Tuple$pair, bitWidths))))));
	return A2(
		$folkertdev$elm_flate$Huffman$restoreCanonicalHuffmanCodes,
		bitWidths,
		$folkertdev$elm_flate$Huffman$new(symbolCount));
};
var $folkertdev$elm_flate$Huffman$fromFrequencies = F2(
	function (symbolFrequencies, maxBitWidth_) {
		var maxBitWidth = A2(
			$elm$core$Basics$min,
			maxBitWidth_,
			$folkertdev$elm_flate$Huffman$calcOptimalMaxBitWidth(symbolFrequencies));
		var codeBitWidhts = A2($folkertdev$elm_flate$LengthLimitedHuffmanCodes$calculate, maxBitWidth, symbolFrequencies);
		return $folkertdev$elm_flate$Huffman$fromBitWidths(codeBitWidhts);
	});
var $folkertdev$elm_flate$Deflate$Symbol$buildDynamicHuffmanCodec = function (symbols) {
	var _v0 = A3(
		$elm$core$Array$foldl,
		$folkertdev$elm_flate$Deflate$Symbol$dynamicFindFrequencies,
		_Utils_Tuple3(
			A2($elm$core$Array$repeat, 286, 0),
			A2($elm$core$Array$repeat, 30, 0),
			true),
		symbols);
	var literalCounts = _v0.a;
	var distanceCounts = _v0.b;
	var emptyDistanceCount = _v0.c;
	return {
		Z: emptyDistanceCount ? A2(
			$folkertdev$elm_flate$Huffman$fromFrequencies,
			A3($elm$core$Array$set, 0, 1, distanceCounts),
			15) : A2($folkertdev$elm_flate$Huffman$fromFrequencies, distanceCounts, 15),
		ad: A2($folkertdev$elm_flate$Huffman$fromFrequencies, literalCounts, 15)
	};
};
var $folkertdev$elm_flate$Deflate$Symbol$EndOfBlock = {$: 0};
var $folkertdev$elm_flate$Deflate$Symbol$Literal = function (a) {
	return {$: 1, a: a};
};
var $folkertdev$elm_flate$Deflate$Symbol$Share = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $folkertdev$elm_flate$Deflate$Internal$codeToSymbol = function (code) {
	if (!code.$) {
		var v = code.a;
		return $folkertdev$elm_flate$Deflate$Symbol$Literal(v);
	} else {
		var length = code.a;
		var backwardDistance = code.b;
		return A2($folkertdev$elm_flate$Deflate$Symbol$Share, length, backwardDistance);
	}
};
var $folkertdev$elm_flate$LZ77$Literal = function (a) {
	return {$: 0, a: a};
};
var $folkertdev$elm_flate$LZ77$Pointer = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $folkertdev$elm_flate$PrefixTable$Small = function (a) {
	return {$: 0, a: a};
};
var $folkertdev$elm_flate$PrefixTable$Large = function (a) {
	return {$: 1, a: a};
};
var $folkertdev$elm_flate$PrefixTable$LargePrefixTable = $elm$core$Basics$identity;
var $folkertdev$elm_flate$PrefixTable$insertInList = F6(
	function (i, array, p2, position, remaining, accum) {
		insertInList:
		while (true) {
			if (!remaining.b) {
				var newPositions = A2(
					$elm$core$List$cons,
					_Utils_Tuple2(p2, position),
					accum);
				return _Utils_Tuple2(
					$folkertdev$elm_flate$PrefixTable$Large(
						A3($elm$core$Array$set, i, newPositions, array)),
					$elm$core$Maybe$Nothing);
			} else {
				var current = remaining.a;
				var key = current.a;
				var oldValue = current.b;
				var rest = remaining.b;
				if (!(key - p2)) {
					var newPositions = _Utils_ap(
						accum,
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(key, position),
							rest));
					return _Utils_Tuple2(
						$folkertdev$elm_flate$PrefixTable$Large(
							A3($elm$core$Array$set, i, newPositions, array)),
						$elm$core$Maybe$Just(oldValue));
				} else {
					var $temp$i = i,
						$temp$array = array,
						$temp$p2 = p2,
						$temp$position = position,
						$temp$remaining = rest,
						$temp$accum = A2($elm$core$List$cons, current, accum);
					i = $temp$i;
					array = $temp$array;
					p2 = $temp$p2;
					position = $temp$position;
					remaining = $temp$remaining;
					accum = $temp$accum;
					continue insertInList;
				}
			}
		}
	});
var $folkertdev$elm_flate$PrefixTable$insert = F3(
	function (_v0, position, ptable) {
		var prefix_ = _v0;
		var prefix = 16777215 & (prefix_ >>> 0);
		if (!ptable.$) {
			var dict = ptable.a;
			var _v2 = A2($elm$core$Dict$get, prefix, dict);
			if (_v2.$ === 1) {
				return _Utils_Tuple2(
					$folkertdev$elm_flate$PrefixTable$Small(
						A3($elm$core$Dict$insert, prefix, position, dict)),
					$elm$core$Maybe$Nothing);
			} else {
				var oldValue = _v2.a;
				return _Utils_Tuple2(
					$folkertdev$elm_flate$PrefixTable$Small(
						A3($elm$core$Dict$insert, prefix, position, dict)),
					$elm$core$Maybe$Just(oldValue));
			}
		} else {
			var array = ptable.a;
			var index = prefix >> 8;
			var _v3 = A2($elm$core$Array$get, index, array);
			if (_v3.$ === 1) {
				return _Utils_Tuple2(ptable, $elm$core$Maybe$Nothing);
			} else {
				var positions = _v3.a;
				return A6($folkertdev$elm_flate$PrefixTable$insertInList, index, array, 255 & prefix, position, positions, _List_Nil);
			}
		}
	});
var $folkertdev$elm_flate$Experimental$ByteArray$length = function (_v0) {
	var array = _v0.a;
	var finalSize = _v0.b;
	var finalBytes = _v0.c;
	var _v1 = $elm$core$Array$length(array) * 4;
	if (!_v1) {
		return finalSize;
	} else {
		var l = _v1;
		return l + finalSize;
	}
};
var $folkertdev$elm_flate$Experimental$ByteArray$get = F2(
	function (index, _v0) {
		var array = _v0.a;
		var finalSize = _v0.b;
		var finalBytes = _v0.c;
		var offset = index % 4;
		if (_Utils_cmp(
			index,
			($elm$core$Array$length(array) * 4) + finalSize) > -1) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (_Utils_cmp(
				index,
				$elm$core$Array$length(array) * 4) > -1) {
				return $elm$core$Maybe$Just(255 & (finalBytes >>> (8 * (3 - offset))));
			} else {
				var internalIndex = (index / 4) | 0;
				var _v1 = A2($elm$core$Array$get, internalIndex, array);
				if (_v1.$ === 1) {
					return $elm$core$Maybe$Nothing;
				} else {
					var int32 = _v1.a;
					return $elm$core$Maybe$Just(255 & (int32 >>> (8 * (3 - offset))));
				}
			}
		}
	});
var $folkertdev$elm_flate$LZ77$longestCommonPrefixLoop = F5(
	function (i, j, limit, accum, array) {
		longestCommonPrefixLoop:
		while (true) {
			if (_Utils_cmp(i, limit) < 0) {
				var _v0 = A2($folkertdev$elm_flate$Experimental$ByteArray$get, i, array);
				if (_v0.$ === 1) {
					return accum;
				} else {
					var value1 = _v0.a;
					var _v1 = A2($folkertdev$elm_flate$Experimental$ByteArray$get, j, array);
					if (_v1.$ === 1) {
						return accum;
					} else {
						var value2 = _v1.a;
						if (!(value1 - value2)) {
							var $temp$i = i + 1,
								$temp$j = j + 1,
								$temp$limit = limit,
								$temp$accum = accum + 1,
								$temp$array = array;
							i = $temp$i;
							j = $temp$j;
							limit = $temp$limit;
							accum = $temp$accum;
							array = $temp$array;
							continue longestCommonPrefixLoop;
						} else {
							return accum;
						}
					}
				}
			} else {
				return accum;
			}
		}
	});
var $folkertdev$elm_flate$LZ77$max_length = 258;
var $folkertdev$elm_flate$LZ77$longestCommonPrefix = F3(
	function (i, j, array) {
		var remaining = A2(
			$elm$core$Basics$min,
			$folkertdev$elm_flate$LZ77$max_length - 3,
			$folkertdev$elm_flate$Experimental$ByteArray$length(array) - j);
		return A5($folkertdev$elm_flate$LZ77$longestCommonPrefixLoop, i, j, i + remaining, 0, array);
	});
var $folkertdev$elm_flate$PrefixTable$OutOfBounds = {$: 3};
var $folkertdev$elm_flate$PrefixTable$Prefix = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $folkertdev$elm_flate$PrefixTable$PrefixCode = $elm$core$Basics$identity;
var $folkertdev$elm_flate$PrefixTable$Trailing1 = function (a) {
	return {$: 1, a: a};
};
var $folkertdev$elm_flate$PrefixTable$Trailing2 = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $folkertdev$elm_flate$Experimental$ByteArray$getInt32 = F2(
	function (index, _v0) {
		var array = _v0.a;
		var finalBytes = _v0.c;
		var size = $elm$core$Array$length(array);
		return (!(index - size)) ? $elm$core$Maybe$Just(finalBytes) : A2($elm$core$Array$get, index, array);
	});
var $folkertdev$elm_flate$PrefixTable$prefixAt = F2(
	function (k, input) {
		var size = $folkertdev$elm_flate$Experimental$ByteArray$length(input);
		if (_Utils_cmp(k + 2, size) > -1) {
			if (_Utils_cmp(k, size) > -1) {
				return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
			} else {
				if (_Utils_cmp(k + 1, size) > -1) {
					var _v0 = A2($folkertdev$elm_flate$Experimental$ByteArray$get, k, input);
					if (_v0.$ === 1) {
						return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
					} else {
						var value = _v0.a;
						return $folkertdev$elm_flate$PrefixTable$Trailing1(value);
					}
				} else {
					var _v1 = A2($folkertdev$elm_flate$Experimental$ByteArray$get, k, input);
					if (_v1.$ === 1) {
						return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
					} else {
						var v1 = _v1.a;
						var _v2 = A2($folkertdev$elm_flate$Experimental$ByteArray$get, k + 1, input);
						if (_v2.$ === 1) {
							return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
						} else {
							var v2 = _v2.a;
							return A2($folkertdev$elm_flate$PrefixTable$Trailing2, v1, v2);
						}
					}
				}
			}
		} else {
			var offset = k % 4;
			var internalIndex = (k / 4) | 0;
			switch (offset) {
				case 0:
					var _v4 = A2($folkertdev$elm_flate$Experimental$ByteArray$getInt32, internalIndex, input);
					if (_v4.$ === 1) {
						return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
					} else {
						var int32 = _v4.a;
						var first = 255 & ((int32 >> 24) >>> 0);
						var code = int32 >> 8;
						return A2($folkertdev$elm_flate$PrefixTable$Prefix, first, code);
					}
				case 1:
					var _v5 = A2($folkertdev$elm_flate$Experimental$ByteArray$getInt32, internalIndex, input);
					if (_v5.$ === 1) {
						return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
					} else {
						var int32 = _v5.a;
						var first = 255 & ((255 & (int32 >> 16)) >>> 0);
						var code = 16777215 & int32;
						return A2($folkertdev$elm_flate$PrefixTable$Prefix, first, code);
					}
				case 2:
					var _v6 = A2($folkertdev$elm_flate$Experimental$ByteArray$getInt32, internalIndex, input);
					if (_v6.$ === 1) {
						return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
					} else {
						var int32 = _v6.a;
						var _v7 = A2($folkertdev$elm_flate$Experimental$ByteArray$getInt32, internalIndex + 1, input);
						if (_v7.$ === 1) {
							return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
						} else {
							var nextInt32 = _v7.a;
							var first = 255 & ((255 & (int32 >> 8)) >>> 0);
							var code = 16777215 & (((255 & (nextInt32 >> 24)) | ((65535 & int32) << 8)) >>> 0);
							return A2($folkertdev$elm_flate$PrefixTable$Prefix, first, code);
						}
					}
				default:
					var _v8 = A2($folkertdev$elm_flate$Experimental$ByteArray$getInt32, internalIndex, input);
					if (_v8.$ === 1) {
						return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
					} else {
						var int32 = _v8.a;
						var _v9 = A2($folkertdev$elm_flate$Experimental$ByteArray$getInt32, internalIndex + 1, input);
						if (_v9.$ === 1) {
							return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
						} else {
							var nextInt32 = _v9.a;
							var first = 255 & ((255 & int32) >>> 0);
							var code = (65535 & (nextInt32 >> 16)) | ((255 & int32) << 16);
							return A2($folkertdev$elm_flate$PrefixTable$Prefix, first, code);
						}
					}
			}
		}
	});
var $folkertdev$elm_flate$LZ77$updatePrefixTableLoop = F4(
	function (k, limit, buffer, prefixTable) {
		updatePrefixTableLoop:
		while (true) {
			if (_Utils_cmp(k, limit) < 0) {
				var _v0 = A2($folkertdev$elm_flate$PrefixTable$prefixAt, k, buffer);
				if (!_v0.$) {
					var code = _v0.b;
					var _v1 = A3($folkertdev$elm_flate$PrefixTable$insert, code, k, prefixTable);
					var newPrefixTable = _v1.a;
					var $temp$k = k + 1,
						$temp$limit = limit,
						$temp$buffer = buffer,
						$temp$prefixTable = newPrefixTable;
					k = $temp$k;
					limit = $temp$limit;
					buffer = $temp$buffer;
					prefixTable = $temp$prefixTable;
					continue updatePrefixTableLoop;
				} else {
					return prefixTable;
				}
			} else {
				return prefixTable;
			}
		}
	});
var $folkertdev$elm_flate$LZ77$flushLoop = F5(
	function (i, windowSize, buffer, prefixTable, encoders) {
		flushLoop:
		while (true) {
			var _v0 = A2($folkertdev$elm_flate$PrefixTable$prefixAt, i, buffer);
			switch (_v0.$) {
				case 3:
					return encoders;
				case 1:
					var p1 = _v0.a;
					return A2(
						$elm$core$Array$push,
						$folkertdev$elm_flate$LZ77$Literal(p1),
						encoders);
				case 2:
					var p1 = _v0.a;
					var p2 = _v0.b;
					return A2(
						$elm$core$Array$push,
						$folkertdev$elm_flate$LZ77$Literal(p2),
						A2(
							$elm$core$Array$push,
							$folkertdev$elm_flate$LZ77$Literal(p1),
							encoders));
				default:
					var p1 = _v0.a;
					var key = _v0.b;
					var _v1 = A3($folkertdev$elm_flate$PrefixTable$insert, key, i, prefixTable);
					var newPrefixTable = _v1.a;
					var matched = _v1.b;
					if (!matched.$) {
						var j = matched.a;
						var distance = i - j;
						if ((distance - windowSize) <= 0) {
							var length = 3 + A3($folkertdev$elm_flate$LZ77$longestCommonPrefix, i + 3, j + 3, buffer);
							var newEncoders = A2(
								$elm$core$Array$push,
								A2($folkertdev$elm_flate$LZ77$Pointer, length, distance),
								encoders);
							var newerPrefixTable = A4($folkertdev$elm_flate$LZ77$updatePrefixTableLoop, i + 1, i + length, buffer, newPrefixTable);
							var $temp$i = i + length,
								$temp$windowSize = windowSize,
								$temp$buffer = buffer,
								$temp$prefixTable = newerPrefixTable,
								$temp$encoders = newEncoders;
							i = $temp$i;
							windowSize = $temp$windowSize;
							buffer = $temp$buffer;
							prefixTable = $temp$prefixTable;
							encoders = $temp$encoders;
							continue flushLoop;
						} else {
							var $temp$i = i + 1,
								$temp$windowSize = windowSize,
								$temp$buffer = buffer,
								$temp$prefixTable = newPrefixTable,
								$temp$encoders = A2(
								$elm$core$Array$push,
								$folkertdev$elm_flate$LZ77$Literal(p1),
								encoders);
							i = $temp$i;
							windowSize = $temp$windowSize;
							buffer = $temp$buffer;
							prefixTable = $temp$prefixTable;
							encoders = $temp$encoders;
							continue flushLoop;
						}
					} else {
						var $temp$i = i + 1,
							$temp$windowSize = windowSize,
							$temp$buffer = buffer,
							$temp$prefixTable = newPrefixTable,
							$temp$encoders = A2(
							$elm$core$Array$push,
							$folkertdev$elm_flate$LZ77$Literal(p1),
							encoders);
						i = $temp$i;
						windowSize = $temp$windowSize;
						buffer = $temp$buffer;
						prefixTable = $temp$prefixTable;
						encoders = $temp$encoders;
						continue flushLoop;
					}
			}
		}
	});
var $folkertdev$elm_flate$PrefixTable$max_distance = 32768;
var $folkertdev$elm_flate$PrefixTable$max_window_size = $folkertdev$elm_flate$PrefixTable$max_distance;
var $folkertdev$elm_flate$PrefixTable$newLargePrefixTable = A2($elm$core$Array$repeat, 65535, _List_Nil);
var $folkertdev$elm_flate$PrefixTable$new = function (nbytes) {
	return (_Utils_cmp(nbytes, $folkertdev$elm_flate$PrefixTable$max_window_size) < 0) ? $folkertdev$elm_flate$PrefixTable$Small($elm$core$Dict$empty) : $folkertdev$elm_flate$PrefixTable$Large($folkertdev$elm_flate$PrefixTable$newLargePrefixTable);
};
var $folkertdev$elm_flate$LZ77$flush = F2(
	function (windowSize, buffer) {
		var codes = A5(
			$folkertdev$elm_flate$LZ77$flushLoop,
			0,
			windowSize,
			buffer,
			$folkertdev$elm_flate$PrefixTable$new(
				$folkertdev$elm_flate$Experimental$ByteArray$length(buffer)),
			$elm$core$Array$empty);
		return codes;
	});
var $folkertdev$elm_flate$Experimental$ByteArray$ByteArray = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $folkertdev$elm_flate$Experimental$ByteArray$empty = A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, $elm$core$Array$empty, 0, 0);
var $elm$bytes$Bytes$Decode$andThen = F2(
	function (callback, _v0) {
		var decodeA = _v0;
		return F2(
			function (bites, offset) {
				var _v1 = A2(decodeA, bites, offset);
				var newOffset = _v1.a;
				var a = _v1.b;
				var _v2 = callback(a);
				var decodeB = _v2;
				return A2(decodeB, bites, newOffset);
			});
	});
var $elm$bytes$Bytes$Decode$map5 = F6(
	function (func, _v0, _v1, _v2, _v3, _v4) {
		var decodeA = _v0;
		var decodeB = _v1;
		var decodeC = _v2;
		var decodeD = _v3;
		var decodeE = _v4;
		return F2(
			function (bites, offset) {
				var _v5 = A2(decodeA, bites, offset);
				var aOffset = _v5.a;
				var a = _v5.b;
				var _v6 = A2(decodeB, bites, aOffset);
				var bOffset = _v6.a;
				var b = _v6.b;
				var _v7 = A2(decodeC, bites, bOffset);
				var cOffset = _v7.a;
				var c = _v7.b;
				var _v8 = A2(decodeD, bites, cOffset);
				var dOffset = _v8.a;
				var d = _v8.b;
				var _v9 = A2(decodeE, bites, dOffset);
				var eOffset = _v9.a;
				var e = _v9.b;
				return _Utils_Tuple2(
					eOffset,
					A5(func, a, b, c, d, e));
			});
	});
var $elm$bytes$Bytes$Decode$unsignedInt16 = function (endianness) {
	return _Bytes_read_u16(!endianness);
};
var $folkertdev$elm_flate$Experimental$ByteArray$fromBytesHelp = function (_v0) {
	var remaining = _v0.a;
	var array = _v0.b;
	if (remaining >= 40) {
		return A2(
			$elm$bytes$Bytes$Decode$andThen,
			$elm$core$Basics$identity,
			A6(
				$elm$bytes$Bytes$Decode$map5,
				F5(
					function (a, b, c, d, e) {
						return A6(
							$elm$bytes$Bytes$Decode$map5,
							F5(
								function (f, g, h, i, j) {
									return $elm$bytes$Bytes$Decode$Loop(
										_Utils_Tuple2(
											remaining - 40,
											A2(
												$elm$core$Array$append,
												array,
												$elm$core$Array$fromList(
													_List_fromArray(
														[a, b, c, d, e, f, g, h, i, j])))));
								}),
							$elm$bytes$Bytes$Decode$unsignedInt32(1),
							$elm$bytes$Bytes$Decode$unsignedInt32(1),
							$elm$bytes$Bytes$Decode$unsignedInt32(1),
							$elm$bytes$Bytes$Decode$unsignedInt32(1),
							$elm$bytes$Bytes$Decode$unsignedInt32(1));
					}),
				$elm$bytes$Bytes$Decode$unsignedInt32(1),
				$elm$bytes$Bytes$Decode$unsignedInt32(1),
				$elm$bytes$Bytes$Decode$unsignedInt32(1),
				$elm$bytes$Bytes$Decode$unsignedInt32(1),
				$elm$bytes$Bytes$Decode$unsignedInt32(1)));
	} else {
		if (remaining >= 20) {
			return A6(
				$elm$bytes$Bytes$Decode$map5,
				F5(
					function (a, b, c, d, e) {
						return $elm$bytes$Bytes$Decode$Loop(
							_Utils_Tuple2(
								remaining - 20,
								A2(
									$elm$core$Array$push,
									e,
									A2(
										$elm$core$Array$push,
										d,
										A2(
											$elm$core$Array$push,
											c,
											A2(
												$elm$core$Array$push,
												b,
												A2($elm$core$Array$push, a, array)))))));
					}),
				$elm$bytes$Bytes$Decode$unsignedInt32(1),
				$elm$bytes$Bytes$Decode$unsignedInt32(1),
				$elm$bytes$Bytes$Decode$unsignedInt32(1),
				$elm$bytes$Bytes$Decode$unsignedInt32(1),
				$elm$bytes$Bytes$Decode$unsignedInt32(1));
		} else {
			if (remaining >= 4) {
				return A2(
					$elm$bytes$Bytes$Decode$map,
					function (a) {
						return $elm$bytes$Bytes$Decode$Loop(
							_Utils_Tuple2(
								remaining - 4,
								A2($elm$core$Array$push, a, array)));
					},
					$elm$bytes$Bytes$Decode$unsignedInt32(1));
			} else {
				switch (remaining) {
					case 0:
						return $elm$bytes$Bytes$Decode$succeed(
							$elm$bytes$Bytes$Decode$Done(
								_Utils_Tuple3(0, 0, array)));
					case 1:
						return A2(
							$elm$bytes$Bytes$Decode$map,
							function (_byte) {
								return $elm$bytes$Bytes$Decode$Done(
									_Utils_Tuple3(1, _byte << 24, array));
							},
							$elm$bytes$Bytes$Decode$unsignedInt8);
					case 2:
						return A2(
							$elm$bytes$Bytes$Decode$map,
							function (_byte) {
								return $elm$bytes$Bytes$Decode$Done(
									_Utils_Tuple3(2, _byte << 16, array));
							},
							$elm$bytes$Bytes$Decode$unsignedInt16(1));
					default:
						return A3(
							$elm$bytes$Bytes$Decode$map2,
							F2(
								function (bytes, _byte) {
									return $elm$bytes$Bytes$Decode$Done(
										_Utils_Tuple3(3, (bytes << 16) | (_byte << 8), array));
								}),
							$elm$bytes$Bytes$Decode$unsignedInt16(1),
							$elm$bytes$Bytes$Decode$unsignedInt8);
				}
			}
		}
	}
};
var $folkertdev$elm_flate$Experimental$ByteArray$fromBytes = function (buffer) {
	var _v0 = A2(
		$elm$bytes$Bytes$Decode$decode,
		A2(
			$elm$bytes$Bytes$Decode$loop,
			_Utils_Tuple2(
				$elm$bytes$Bytes$width(buffer),
				$elm$core$Array$empty),
			$folkertdev$elm_flate$Experimental$ByteArray$fromBytesHelp),
		buffer);
	if (_v0.$ === 1) {
		return $folkertdev$elm_flate$Experimental$ByteArray$empty;
	} else {
		var _v1 = _v0.a;
		var finalSize = _v1.a;
		var finalBytes = _v1.b;
		var array = _v1.c;
		return A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, array, finalSize, finalBytes);
	}
};
var $folkertdev$elm_flate$LZ77$encodeWithOptions = F2(
	function (_v0, buffer) {
		var windowSize = _v0.dM;
		return A2(
			$folkertdev$elm_flate$LZ77$flush,
			windowSize,
			$folkertdev$elm_flate$Experimental$ByteArray$fromBytes(buffer));
	});
var $folkertdev$elm_flate$ByteArray$decodeByteArrayHelp = function (_v0) {
	var remaining = _v0.a;
	var accum = _v0.b;
	return (remaining >= 4) ? A2(
		$elm$bytes$Bytes$Decode$map,
		function (_new) {
			var byte4 = 255 & (_new >>> 0);
			var byte3 = 255 & ((_new >> 8) >>> 0);
			var byte2 = 255 & ((_new >> 16) >>> 0);
			var byte1 = 255 & ((_new >> 24) >>> 0);
			var newAccum = A2(
				$elm$core$Array$push,
				byte4,
				A2(
					$elm$core$Array$push,
					byte3,
					A2(
						$elm$core$Array$push,
						byte2,
						A2($elm$core$Array$push, byte1, accum))));
			return $elm$bytes$Bytes$Decode$Loop(
				_Utils_Tuple2(remaining - 4, newAccum));
		},
		$elm$bytes$Bytes$Decode$unsignedInt32(1)) : ((remaining > 0) ? A2(
		$elm$bytes$Bytes$Decode$map,
		function (_new) {
			return $elm$bytes$Bytes$Decode$Loop(
				_Utils_Tuple2(
					remaining - 1,
					A2($elm$core$Array$push, _new, accum)));
		},
		$elm$bytes$Bytes$Decode$unsignedInt8) : $elm$bytes$Bytes$Decode$succeed(
		$elm$bytes$Bytes$Decode$Done(accum)));
};
var $folkertdev$elm_flate$ByteArray$decoder = function (n) {
	return A2(
		$elm$bytes$Bytes$Decode$loop,
		_Utils_Tuple2(n, $elm$core$Array$empty),
		$folkertdev$elm_flate$ByteArray$decodeByteArrayHelp);
};
var $folkertdev$elm_flate$ByteArray$fromBytes = function (buffer) {
	var _v0 = A2(
		$elm$bytes$Bytes$Decode$decode,
		$folkertdev$elm_flate$ByteArray$decoder(
			$elm$bytes$Bytes$width(buffer)),
		buffer);
	if (_v0.$ === 1) {
		return $elm$core$Array$empty;
	} else {
		var value = _v0.a;
		return value;
	}
};
var $folkertdev$elm_flate$Deflate$Internal$compress = F2(
	function (maybeWindowSize, buf) {
		if (maybeWindowSize.$ === 1) {
			return A2(
				$elm$core$Array$push,
				$folkertdev$elm_flate$Deflate$Symbol$EndOfBlock,
				A2(
					$elm$core$Array$map,
					$folkertdev$elm_flate$Deflate$Symbol$Literal,
					$folkertdev$elm_flate$ByteArray$fromBytes(buf)));
		} else {
			var windowSize = maybeWindowSize.a;
			return A2(
				$elm$core$Array$push,
				$folkertdev$elm_flate$Deflate$Symbol$EndOfBlock,
				A2(
					$elm$core$Array$map,
					$folkertdev$elm_flate$Deflate$Internal$codeToSymbol,
					A2(
						$folkertdev$elm_flate$LZ77$encodeWithOptions,
						{dM: windowSize},
						buf)));
		}
	});
var $elm$bytes$Bytes$Encode$U16 = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$unsignedInt16 = $elm$bytes$Bytes$Encode$U16;
var $folkertdev$elm_flate$Deflate$BitWriter$flushIfNeeded = F3(
	function (tag, bitsWritten, encoders) {
		return (bitsWritten >= 16) ? {
			A: bitsWritten - 16,
			B: A2(
				$elm$core$List$cons,
				A2($elm$bytes$Bytes$Encode$unsignedInt16, 0, tag),
				encoders),
			K: tag >> 16
		} : {A: bitsWritten, B: encoders, K: tag};
	});
var $folkertdev$elm_flate$Deflate$BitWriter$writeBits = F3(
	function (bitwidth, bits, state) {
		return A3($folkertdev$elm_flate$Deflate$BitWriter$flushIfNeeded, state.K | (bits << state.A), state.A + bitwidth, state.B);
	});
var $folkertdev$elm_flate$Huffman$encode = F2(
	function (symbol, _v0) {
		var table = _v0;
		var _v1 = A2($elm$core$Array$get, symbol, table);
		if (_v1.$ === 1) {
			return A2($folkertdev$elm_flate$Deflate$BitWriter$writeBits, 0, 0);
		} else {
			var width = _v1.a.cO;
			var bits = _v1.a.a;
			return A2($folkertdev$elm_flate$Deflate$BitWriter$writeBits, width, bits);
		}
	});
var $folkertdev$elm_flate$Deflate$Symbol$extraLength = function (symbol) {
	if (symbol.$ === 2) {
		var length = symbol.a;
		return (((length >= 3) && (length <= 10)) || (length === 258)) ? $elm$core$Maybe$Nothing : (((length >= 11) && (length <= 18)) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(
				1,
				A2($elm$core$Basics$modBy, 2, length - 11))) : (((length >= 19) && (length <= 34)) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(
				2,
				A2($elm$core$Basics$modBy, 4, length - 19))) : (((length >= 35) && (length <= 66)) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(
				3,
				A2($elm$core$Basics$modBy, 8, length - 35))) : (((length >= 67) && (length <= 130)) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(
				4,
				A2($elm$core$Basics$modBy, 16, length - 67))) : (((length >= 131) && (length <= 257)) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(
				5,
				A2($elm$core$Basics$modBy, 32, length - 131))) : $elm$core$Maybe$Nothing)))));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $folkertdev$elm_flate$Deflate$Symbol$encode = F3(
	function (symbol, htrees, bitWriter) {
		var maybeExtra = function () {
			var _v2 = $folkertdev$elm_flate$Deflate$Symbol$extraLength(symbol);
			if (_v2.$ === 1) {
				return $elm$core$Basics$identity;
			} else {
				var _v3 = _v2.a;
				var bits = _v3.a;
				var extra = _v3.b;
				return A2($folkertdev$elm_flate$Deflate$BitWriter$writeBits, bits, extra);
			}
		}();
		var maybeDistance = function () {
			var _v0 = $folkertdev$elm_flate$Deflate$Symbol$distance(symbol);
			if (_v0.$ === 1) {
				return $elm$core$Basics$identity;
			} else {
				var _v1 = _v0.a;
				var code_ = _v1.a;
				var bits = _v1.b;
				var extra = _v1.c;
				return A2(
					$elm$core$Basics$composeR,
					A2($folkertdev$elm_flate$Huffman$encode, code_, htrees.Z),
					(bits > 0) ? A2($folkertdev$elm_flate$Deflate$BitWriter$writeBits, bits, extra) : $elm$core$Basics$identity);
			}
		}();
		return maybeDistance(
			maybeExtra(
				A3(
					$folkertdev$elm_flate$Huffman$encode,
					$folkertdev$elm_flate$Deflate$Symbol$code(symbol),
					htrees.ad,
					bitWriter)));
	});
var $folkertdev$elm_flate$Deflate$Symbol$bitwidth_code_order = _List_fromArray(
	[16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var $folkertdev$elm_flate$Deflate$Symbol$calculateCodes = function (runLengths) {
	var loop2 = F3(
		function (r, c, codes) {
			loop2:
			while (true) {
				if (c >= 3) {
					var n = A2($elm$core$Basics$min, 6, c);
					var $temp$r = r,
						$temp$c = c - n,
						$temp$codes = A2(
						$elm$core$Array$push,
						_Utils_Tuple3(16, 2, n - 3),
						codes);
					r = $temp$r;
					c = $temp$c;
					codes = $temp$codes;
					continue loop2;
				} else {
					return A2(
						$elm$core$Array$append,
						codes,
						A2(
							$elm$core$Array$repeat,
							c,
							_Utils_Tuple3(r.L, 0, 0)));
				}
			}
		});
	var loop1 = F2(
		function (c, codes) {
			loop1:
			while (true) {
				if (c >= 11) {
					var n = A2($elm$core$Basics$min, 138, c);
					var $temp$c = c - n,
						$temp$codes = A2(
						$elm$core$Array$push,
						_Utils_Tuple3(18, 7, n - 11),
						codes);
					c = $temp$c;
					codes = $temp$codes;
					continue loop1;
				} else {
					if (c >= 3) {
						return A2(
							$elm$core$Array$push,
							_Utils_Tuple3(17, 3, c - 3),
							codes);
					} else {
						return A2(
							$elm$core$Array$append,
							codes,
							A2(
								$elm$core$Array$repeat,
								c,
								_Utils_Tuple3(0, 0, 0)));
					}
				}
			}
		});
	var folder = F2(
		function (r, codes) {
			return (!r.L) ? A2(loop1, r.Y, codes) : A3(
				loop2,
				r,
				r.Y - 1,
				A2(
					$elm$core$Array$push,
					_Utils_Tuple3(r.L, 0, 0),
					codes));
		});
	return A3($elm$core$Array$foldl, folder, $elm$core$Array$empty, runLengths);
};
var $folkertdev$elm_flate$Huffman$getWidth = function (_v0) {
	var width = _v0.cO;
	return width;
};
var $folkertdev$elm_flate$Huffman$lookup = F2(
	function (symbol, _v0) {
		var array = _v0;
		return A2($elm$core$Array$get, symbol, array);
	});
var $folkertdev$elm_flate$Deflate$Symbol$calculateRunLengths = F2(
	function (lengths, accum) {
		calculateRunLengths:
		while (true) {
			if (!lengths.b) {
				return A3($elm$core$List$foldr, $elm$core$Array$push, $elm$core$Array$empty, accum);
			} else {
				var _v1 = lengths.a;
				var e = _v1.a;
				var size = _v1.b;
				var rest = lengths.b;
				var list = A2(
					$elm$core$List$indexedMap,
					$elm$core$Tuple$pair,
					A2(
						$elm$core$List$map,
						function (x) {
							return A2(
								$elm$core$Maybe$withDefault,
								0,
								A2(
									$elm$core$Maybe$map,
									$folkertdev$elm_flate$Huffman$getWidth,
									A2($folkertdev$elm_flate$Huffman$lookup, x, e)));
						},
						A2($elm$core$List$range, 0, size - 1)));
				var folder = F2(
					function (_v3, runLengths) {
						var i = _v3.a;
						var c = _v3.b;
						if (!runLengths.b) {
							return A2(
								$elm$core$List$cons,
								{Y: 1, L: c},
								runLengths);
						} else {
							var last = runLengths.a;
							var remaining = runLengths.b;
							return _Utils_eq(last.L, c) ? A2(
								$elm$core$List$cons,
								{Y: last.Y + 1, L: last.L},
								remaining) : A2(
								$elm$core$List$cons,
								{Y: 1, L: c},
								runLengths);
						}
					});
				var $temp$lengths = rest,
					$temp$accum = A3($elm$core$List$foldl, folder, accum, list);
				lengths = $temp$lengths;
				accum = $temp$accum;
				continue calculateRunLengths;
			}
		}
	});
var $folkertdev$elm_flate$Deflate$Symbol$buildBitWidthCodes = F3(
	function (literalCodeCount, distanceCodeCount, trees) {
		var runLengths = A2(
			$folkertdev$elm_flate$Deflate$Symbol$calculateRunLengths,
			_List_fromArray(
				[
					_Utils_Tuple2(trees.ad, literalCodeCount),
					_Utils_Tuple2(trees.Z, distanceCodeCount)
				]),
			_List_Nil);
		return $folkertdev$elm_flate$Deflate$Symbol$calculateCodes(runLengths);
	});
var $folkertdev$elm_flate$Deflate$Symbol$positionLoop = F3(
	function (predicate, i, elements) {
		positionLoop:
		while (true) {
			if (!elements.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var x = elements.a;
				var xs = elements.b;
				if (predicate(x)) {
					return $elm$core$Maybe$Just(i);
				} else {
					var $temp$predicate = predicate,
						$temp$i = i + 1,
						$temp$elements = xs;
					predicate = $temp$predicate;
					i = $temp$i;
					elements = $temp$elements;
					continue positionLoop;
				}
			}
		}
	});
var $folkertdev$elm_flate$Deflate$Symbol$position = F2(
	function (predicate, elements) {
		return A3($folkertdev$elm_flate$Deflate$Symbol$positionLoop, predicate, 0, elements);
	});
var $folkertdev$elm_flate$Huffman$positionFromTheEnd = F2(
	function (predicated, array) {
		var folder = F2(
			function (element, _v1) {
				var index = _v1.a;
				var accum = _v1.b;
				if (!accum.$) {
					return _Utils_Tuple2(index, accum);
				} else {
					return predicated(element) ? _Utils_Tuple2(
						index,
						$elm$core$Maybe$Just(index)) : _Utils_Tuple2(index - 1, $elm$core$Maybe$Nothing);
				}
			});
		var finalIndex = $elm$core$Array$length(array) - 1;
		return A2(
			$elm$core$Maybe$map,
			function (v) {
				return finalIndex - v;
			},
			A3(
				$elm$core$Array$foldr,
				folder,
				_Utils_Tuple2(finalIndex, $elm$core$Maybe$Nothing),
				array).b);
	});
var $folkertdev$elm_flate$Huffman$usedMaxSymbol = function (_v0) {
	var array = _v0;
	return A2(
		$elm$core$Maybe$map,
		function (trailingZeros) {
			return ($elm$core$Array$length(array) - 1) - trailingZeros;
		},
		A2(
			$folkertdev$elm_flate$Huffman$positionFromTheEnd,
			function (_v1) {
				var value = _v1;
				return value.cO > 0;
			},
			array));
};
var $folkertdev$elm_flate$Deflate$Symbol$writeDynamicHuffmanCodec = F2(
	function (trees, bitWriter) {
		var literal_code_count = A2(
			$elm$core$Basics$max,
			257,
			A2(
				$elm$core$Maybe$withDefault,
				0,
				$folkertdev$elm_flate$Huffman$usedMaxSymbol(trees.ad)) + 1);
		var distance_code_count = A2(
			$elm$core$Basics$max,
			1,
			A2(
				$elm$core$Maybe$withDefault,
				0,
				$folkertdev$elm_flate$Huffman$usedMaxSymbol(trees.Z)) + 1);
		var codes = A3(
			$folkertdev$elm_flate$Deflate$Symbol$buildBitWidthCodes,
			literal_code_count,
			distance_code_count,
			{Z: trees.Z, ad: trees.ad});
		var codeCounts = A3(
			$elm$core$Array$foldl,
			function (_v2) {
				var i = _v2.a;
				return A2(
					$folkertdev$elm_flate$Deflate$Symbol$update,
					i,
					function (v) {
						return v + 1;
					});
			},
			A2($elm$core$Array$repeat, 19, 0),
			codes);
		var bitWidthEncoder = A2($folkertdev$elm_flate$Huffman$fromFrequencies, codeCounts, 7);
		var bitwidthCodeCount = A2(
			$elm$core$Basics$max,
			4,
			A2(
				$elm$core$Maybe$withDefault,
				0,
				A2(
					$elm$core$Maybe$map,
					function (trailingZeros) {
						return 19 - trailingZeros;
					},
					A2(
						$folkertdev$elm_flate$Deflate$Symbol$position,
						function (i) {
							var _v1 = A2($folkertdev$elm_flate$Huffman$lookup, i, bitWidthEncoder);
							if (_v1.$ === 1) {
								return false;
							} else {
								var value = _v1.a;
								return $folkertdev$elm_flate$Huffman$getWidth(value) > 0;
							}
						},
						$elm$core$List$reverse($folkertdev$elm_flate$Deflate$Symbol$bitwidth_code_order)))));
		var v1 = function (writer) {
			return A3(
				$elm$core$List$foldl,
				F2(
					function (i, current) {
						var width = _Utils_eq(
							A2($elm$core$Array$get, i, codeCounts),
							$elm$core$Maybe$Just(0)) ? 0 : A2(
							$elm$core$Maybe$withDefault,
							0,
							A2(
								$elm$core$Maybe$map,
								$folkertdev$elm_flate$Huffman$getWidth,
								A2($folkertdev$elm_flate$Huffman$lookup, i, bitWidthEncoder)));
						return A3($folkertdev$elm_flate$Deflate$BitWriter$writeBits, 3, width, current);
					}),
				writer,
				A2($elm$core$List$take, bitwidthCodeCount, $folkertdev$elm_flate$Deflate$Symbol$bitwidth_code_order));
		};
		var v2 = function (writer) {
			return A3(
				$elm$core$Array$foldl,
				F2(
					function (_v0, current) {
						var code_ = _v0.a;
						var bits = _v0.b;
						var extra = _v0.c;
						return (bits > 0) ? A3(
							$folkertdev$elm_flate$Deflate$BitWriter$writeBits,
							bits,
							extra,
							A3($folkertdev$elm_flate$Huffman$encode, code_, bitWidthEncoder, current)) : A3($folkertdev$elm_flate$Huffman$encode, code_, bitWidthEncoder, current);
					}),
				writer,
				codes);
		};
		return v2(
			v1(
				A3(
					$folkertdev$elm_flate$Deflate$BitWriter$writeBits,
					4,
					bitwidthCodeCount - 4,
					A3(
						$folkertdev$elm_flate$Deflate$BitWriter$writeBits,
						5,
						distance_code_count - 1,
						A3($folkertdev$elm_flate$Deflate$BitWriter$writeBits, 5, literal_code_count - 257, bitWriter)))));
	});
var $folkertdev$elm_flate$Deflate$Internal$encodeCompressDynamic = F3(
	function (maybeWindowSize, buf, bitWriter) {
		var compressed = A2($folkertdev$elm_flate$Deflate$Internal$compress, maybeWindowSize, buf);
		var huffmanTree = $folkertdev$elm_flate$Deflate$Symbol$buildDynamicHuffmanCodec(compressed);
		var huffmanTreeWriter = A2($folkertdev$elm_flate$Deflate$Symbol$writeDynamicHuffmanCodec, huffmanTree, bitWriter);
		return A3(
			$elm$core$Array$foldl,
			F2(
				function (symbol, first) {
					return A3($folkertdev$elm_flate$Deflate$Symbol$encode, symbol, huffmanTree, first);
				}),
			huffmanTreeWriter,
			compressed);
	});
var $folkertdev$elm_flate$Deflate$BitWriter$writeBit = function (b) {
	if (!b) {
		return A2($folkertdev$elm_flate$Deflate$BitWriter$writeBits, 1, 0);
	} else {
		return A2($folkertdev$elm_flate$Deflate$BitWriter$writeBits, 1, 1);
	}
};
var $folkertdev$elm_flate$Deflate$Internal$encodeDynamicBlock = F3(
	function (windowSize, _v0, bitWriter) {
		var isLastBlock = _v0.a;
		var buffer = _v0.b;
		return A3(
			$folkertdev$elm_flate$Deflate$Internal$encodeCompressDynamic,
			windowSize,
			buffer,
			A3(
				$folkertdev$elm_flate$Deflate$BitWriter$writeBits,
				2,
				2,
				A2($folkertdev$elm_flate$Deflate$BitWriter$writeBit, isLastBlock, bitWriter)));
	});
var $elm$bytes$Bytes$Encode$U8 = function (a) {
	return {$: 3, a: a};
};
var $elm$bytes$Bytes$Encode$unsignedInt8 = $elm$bytes$Bytes$Encode$U8;
var $folkertdev$elm_flate$Deflate$BitWriter$flushLoop = F3(
	function (tag, bitsWritten, encoders) {
		flushLoop:
		while (true) {
			if (bitsWritten > 0) {
				var $temp$tag = tag >> 8,
					$temp$bitsWritten = A2($elm$core$Basics$max, 0, bitsWritten - 8),
					$temp$encoders = A2(
					$elm$core$List$cons,
					$elm$bytes$Bytes$Encode$unsignedInt8(tag),
					encoders);
				tag = $temp$tag;
				bitsWritten = $temp$bitsWritten;
				encoders = $temp$encoders;
				continue flushLoop;
			} else {
				return {A: bitsWritten, B: encoders, K: tag};
			}
		}
	});
var $folkertdev$elm_flate$Deflate$BitWriter$flush = function (state) {
	return A3($folkertdev$elm_flate$Deflate$BitWriter$flushLoop, state.K, state.A, state.B);
};
var $folkertdev$elm_flate$Deflate$BitWriter$run = function (state) {
	return $elm$core$List$reverse(state.B);
};
var $folkertdev$elm_flate$Deflate$Internal$encodeDynamic = F2(
	function (windowSize, buffer) {
		var encodedChunks = A2(
			$elm$core$List$map,
			$folkertdev$elm_flate$Deflate$Internal$encodeDynamicBlock(windowSize),
			A2($folkertdev$elm_flate$Deflate$Internal$chunks, $folkertdev$elm_flate$Deflate$Internal$default_block_size, buffer));
		return $elm$bytes$Bytes$Encode$encode(
			$elm$bytes$Bytes$Encode$sequence(
				$folkertdev$elm_flate$Deflate$BitWriter$run(
					$folkertdev$elm_flate$Deflate$BitWriter$flush(
						A3(
							$elm$core$List$foldl,
							F2(
								function (chunk, first) {
									return chunk(first);
								}),
							$folkertdev$elm_flate$Deflate$BitWriter$empty,
							encodedChunks)))));
	});
var $elm$core$Bitwise$complement = _Bitwise_complement;
var $folkertdev$elm_flate$Deflate$Internal$max_non_compressed_block_size = 65535;
var $elm$core$Array$sliceLeft = F2(
	function (from, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		if (!from) {
			return array;
		} else {
			if (_Utils_cmp(
				from,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					len - from,
					$elm$core$Array$shiftStep,
					$elm$core$Elm$JsArray$empty,
					A3(
						$elm$core$Elm$JsArray$slice,
						from - $elm$core$Array$tailIndex(len),
						$elm$core$Elm$JsArray$length(tail),
						tail));
			} else {
				var skipNodes = (from / $elm$core$Array$branchFactor) | 0;
				var helper = F2(
					function (node, acc) {
						if (!node.$) {
							var subTree = node.a;
							return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
						} else {
							var leaf = node.a;
							return A2($elm$core$List$cons, leaf, acc);
						}
					});
				var leafNodes = A3(
					$elm$core$Elm$JsArray$foldr,
					helper,
					_List_fromArray(
						[tail]),
					tree);
				var nodesToInsert = A2($elm$core$List$drop, skipNodes, leafNodes);
				if (!nodesToInsert.b) {
					return $elm$core$Array$empty;
				} else {
					var head = nodesToInsert.a;
					var rest = nodesToInsert.b;
					var firstSlice = from - (skipNodes * $elm$core$Array$branchFactor);
					var initialBuilder = {
						m: _List_Nil,
						i: 0,
						l: A3(
							$elm$core$Elm$JsArray$slice,
							firstSlice,
							$elm$core$Elm$JsArray$length(head),
							head)
					};
					return A2(
						$elm$core$Array$builderToArray,
						true,
						A3($elm$core$List$foldl, $elm$core$Array$appendHelpBuilder, initialBuilder, rest));
				}
			}
		}
	});
var $elm$core$Array$fetchNewTail = F4(
	function (shift, end, treeEnd, tree) {
		fetchNewTail:
		while (true) {
			var pos = $elm$core$Array$bitMask & (treeEnd >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var sub = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$end = end,
					$temp$treeEnd = treeEnd,
					$temp$tree = sub;
				shift = $temp$shift;
				end = $temp$end;
				treeEnd = $temp$treeEnd;
				tree = $temp$tree;
				continue fetchNewTail;
			} else {
				var values = _v0.a;
				return A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, values);
			}
		}
	});
var $elm$core$Array$hoistTree = F3(
	function (oldShift, newShift, tree) {
		hoistTree:
		while (true) {
			if ((_Utils_cmp(oldShift, newShift) < 1) || (!$elm$core$Elm$JsArray$length(tree))) {
				return tree;
			} else {
				var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, 0, tree);
				if (!_v0.$) {
					var sub = _v0.a;
					var $temp$oldShift = oldShift - $elm$core$Array$shiftStep,
						$temp$newShift = newShift,
						$temp$tree = sub;
					oldShift = $temp$oldShift;
					newShift = $temp$newShift;
					tree = $temp$tree;
					continue hoistTree;
				} else {
					return tree;
				}
			}
		}
	});
var $elm$core$Array$sliceTree = F3(
	function (shift, endIdx, tree) {
		var lastPos = $elm$core$Array$bitMask & (endIdx >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, lastPos, tree);
		if (!_v0.$) {
			var sub = _v0.a;
			var newSub = A3($elm$core$Array$sliceTree, shift - $elm$core$Array$shiftStep, endIdx, sub);
			return (!$elm$core$Elm$JsArray$length(newSub)) ? A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree) : A3(
				$elm$core$Elm$JsArray$unsafeSet,
				lastPos,
				$elm$core$Array$SubTree(newSub),
				A3($elm$core$Elm$JsArray$slice, 0, lastPos + 1, tree));
		} else {
			return A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree);
		}
	});
var $elm$core$Array$sliceRight = F2(
	function (end, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		if (_Utils_eq(end, len)) {
			return array;
		} else {
			if (_Utils_cmp(
				end,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					startShift,
					tree,
					A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, tail));
			} else {
				var endIdx = $elm$core$Array$tailIndex(end);
				var depth = $elm$core$Basics$floor(
					A2(
						$elm$core$Basics$logBase,
						$elm$core$Array$branchFactor,
						A2($elm$core$Basics$max, 1, endIdx - 1)));
				var newShift = A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep);
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					newShift,
					A3(
						$elm$core$Array$hoistTree,
						startShift,
						newShift,
						A3($elm$core$Array$sliceTree, startShift, endIdx, tree)),
					A4($elm$core$Array$fetchNewTail, startShift, end, endIdx, tree));
			}
		}
	});
var $elm$core$Array$translateIndex = F2(
	function (index, _v0) {
		var len = _v0.a;
		var posIndex = (index < 0) ? (len + index) : index;
		return (posIndex < 0) ? 0 : ((_Utils_cmp(posIndex, len) > 0) ? len : posIndex);
	});
var $elm$core$Array$slice = F3(
	function (from, to, array) {
		var correctTo = A2($elm$core$Array$translateIndex, to, array);
		var correctFrom = A2($elm$core$Array$translateIndex, from, array);
		return (_Utils_cmp(correctFrom, correctTo) > 0) ? $elm$core$Array$empty : A2(
			$elm$core$Array$sliceLeft,
			correctFrom,
			A2($elm$core$Array$sliceRight, correctTo, array));
	});
var $folkertdev$elm_flate$ByteArray$fasterEncodeFolderR = F2(
	function (_byte, _v0) {
		var bytesOnAccum = _v0.a;
		var accum = _v0.b;
		var encoders = _v0.c;
		switch (bytesOnAccum) {
			case 0:
				var value = 255 & _byte;
				return _Utils_Tuple3(1, value, encoders);
			case 1:
				var value = accum | ((255 & _byte) << 8);
				return _Utils_Tuple3(2, value, encoders);
			case 2:
				var value = accum | ((255 & _byte) << 16);
				return _Utils_Tuple3(3, value, encoders);
			default:
				var value = accum | ((255 & _byte) << 24);
				return _Utils_Tuple3(
					0,
					0,
					A2(
						$elm$core$List$cons,
						A2($elm$bytes$Bytes$Encode$unsignedInt32, 1, value),
						encoders));
		}
	});
var $folkertdev$elm_flate$ByteArray$fasterEncodeR = function (_v0) {
	var bytesOnAccum = _v0.a;
	var accum = _v0.b;
	var otherEncoders = _v0.c;
	var encoders = function () {
		switch (bytesOnAccum) {
			case 0:
				return otherEncoders;
			case 1:
				return A2(
					$elm$core$List$cons,
					$elm$bytes$Bytes$Encode$unsignedInt8(accum),
					otherEncoders);
			case 2:
				return A2(
					$elm$core$List$cons,
					A2($elm$bytes$Bytes$Encode$unsignedInt16, 1, accum),
					otherEncoders);
			default:
				var otherBytes = accum >> 8;
				var firstByte = 255 & accum;
				return A2(
					$elm$core$List$cons,
					A2($elm$bytes$Bytes$Encode$unsignedInt16, 1, otherBytes),
					A2(
						$elm$core$List$cons,
						$elm$bytes$Bytes$Encode$unsignedInt8(firstByte),
						otherEncoders));
		}
	}();
	return encoders;
};
var $folkertdev$elm_flate$ByteArray$toBytes = function (array) {
	return $elm$bytes$Bytes$Encode$encode(
		$elm$bytes$Bytes$Encode$sequence(
			$folkertdev$elm_flate$ByteArray$fasterEncodeR(
				A3(
					$elm$core$Array$foldr,
					$folkertdev$elm_flate$ByteArray$fasterEncodeFolderR,
					_Utils_Tuple3(0, 0, _List_Nil),
					array))));
};
var $folkertdev$elm_flate$Deflate$BitWriter$writeEncoder = F2(
	function (encoder, state) {
		return {
			A: state.A,
			B: A2($elm$core$List$cons, encoder, state.B),
			K: state.K
		};
	});
var $folkertdev$elm_flate$Deflate$Internal$encodeRawBlock = F2(
	function (_v0, bitWriter) {
		var isLastBlock = _v0.a;
		var buffer = _v0.b;
		var byteArray = $folkertdev$elm_flate$ByteArray$fromBytes(buffer);
		var size = A2(
			$elm$core$Basics$min,
			$elm$core$Array$length(byteArray),
			$folkertdev$elm_flate$Deflate$Internal$max_non_compressed_block_size);
		var sliced = A3($elm$core$Array$slice, 0, size, byteArray);
		return A2(
			$folkertdev$elm_flate$Deflate$BitWriter$writeEncoder,
			$elm$bytes$Bytes$Encode$bytes(
				$folkertdev$elm_flate$ByteArray$toBytes(sliced)),
			A2(
				$folkertdev$elm_flate$Deflate$BitWriter$writeEncoder,
				A2($elm$bytes$Bytes$Encode$unsignedInt16, 0, ~size),
				A2(
					$folkertdev$elm_flate$Deflate$BitWriter$writeEncoder,
					A2($elm$bytes$Bytes$Encode$unsignedInt16, 0, size),
					$folkertdev$elm_flate$Deflate$BitWriter$flush(
						A3(
							$folkertdev$elm_flate$Deflate$BitWriter$writeBits,
							2,
							0,
							A2($folkertdev$elm_flate$Deflate$BitWriter$writeBit, isLastBlock, bitWriter))))));
	});
var $folkertdev$elm_flate$Deflate$Internal$encodeRaw = function (buffer) {
	return $elm$bytes$Bytes$Encode$encode(
		$elm$bytes$Bytes$Encode$sequence(
			$folkertdev$elm_flate$Deflate$BitWriter$run(
				A3(
					$elm$core$List$foldl,
					F2(
						function (chunk, first) {
							return A2($folkertdev$elm_flate$Deflate$Internal$encodeRawBlock, chunk, first);
						}),
					$folkertdev$elm_flate$Deflate$BitWriter$empty,
					A2(
						$folkertdev$elm_flate$Deflate$Internal$chunks,
						A2($elm$core$Basics$min, $folkertdev$elm_flate$Deflate$Internal$max_non_compressed_block_size, $folkertdev$elm_flate$Deflate$Internal$default_block_size),
						buffer)))));
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $folkertdev$elm_flate$Huffman$fromList = A2(
	$elm$core$Basics$composeL,
	A2($elm$core$Basics$composeL, $elm$core$Basics$identity, $elm$core$Array$fromList),
	$elm$core$List$map($folkertdev$elm_flate$Huffman$codeFromRecord));
var $folkertdev$elm_flate$Huffman$hardcodedStaticHuffmanTree = {
	Z: $folkertdev$elm_flate$Huffman$fromList(
		_List_fromArray(
			[
				{a: 0, cO: 5},
				{a: 16, cO: 5},
				{a: 8, cO: 5},
				{a: 24, cO: 5},
				{a: 4, cO: 5},
				{a: 20, cO: 5},
				{a: 12, cO: 5},
				{a: 28, cO: 5},
				{a: 2, cO: 5},
				{a: 18, cO: 5},
				{a: 10, cO: 5},
				{a: 26, cO: 5},
				{a: 6, cO: 5},
				{a: 22, cO: 5},
				{a: 14, cO: 5},
				{a: 30, cO: 5},
				{a: 1, cO: 5},
				{a: 17, cO: 5},
				{a: 9, cO: 5},
				{a: 25, cO: 5},
				{a: 5, cO: 5},
				{a: 21, cO: 5},
				{a: 13, cO: 5},
				{a: 29, cO: 5},
				{a: 3, cO: 5},
				{a: 19, cO: 5},
				{a: 11, cO: 5},
				{a: 27, cO: 5},
				{a: 7, cO: 5},
				{a: 23, cO: 5}
			])),
	ad: $folkertdev$elm_flate$Huffman$fromList(
		_List_fromArray(
			[
				{a: 12, cO: 8},
				{a: 140, cO: 8},
				{a: 76, cO: 8},
				{a: 204, cO: 8},
				{a: 44, cO: 8},
				{a: 172, cO: 8},
				{a: 108, cO: 8},
				{a: 236, cO: 8},
				{a: 28, cO: 8},
				{a: 156, cO: 8},
				{a: 92, cO: 8},
				{a: 220, cO: 8},
				{a: 60, cO: 8},
				{a: 188, cO: 8},
				{a: 124, cO: 8},
				{a: 252, cO: 8},
				{a: 2, cO: 8},
				{a: 130, cO: 8},
				{a: 66, cO: 8},
				{a: 194, cO: 8},
				{a: 34, cO: 8},
				{a: 162, cO: 8},
				{a: 98, cO: 8},
				{a: 226, cO: 8},
				{a: 18, cO: 8},
				{a: 146, cO: 8},
				{a: 82, cO: 8},
				{a: 210, cO: 8},
				{a: 50, cO: 8},
				{a: 178, cO: 8},
				{a: 114, cO: 8},
				{a: 242, cO: 8},
				{a: 10, cO: 8},
				{a: 138, cO: 8},
				{a: 74, cO: 8},
				{a: 202, cO: 8},
				{a: 42, cO: 8},
				{a: 170, cO: 8},
				{a: 106, cO: 8},
				{a: 234, cO: 8},
				{a: 26, cO: 8},
				{a: 154, cO: 8},
				{a: 90, cO: 8},
				{a: 218, cO: 8},
				{a: 58, cO: 8},
				{a: 186, cO: 8},
				{a: 122, cO: 8},
				{a: 250, cO: 8},
				{a: 6, cO: 8},
				{a: 134, cO: 8},
				{a: 70, cO: 8},
				{a: 198, cO: 8},
				{a: 38, cO: 8},
				{a: 166, cO: 8},
				{a: 102, cO: 8},
				{a: 230, cO: 8},
				{a: 22, cO: 8},
				{a: 150, cO: 8},
				{a: 86, cO: 8},
				{a: 214, cO: 8},
				{a: 54, cO: 8},
				{a: 182, cO: 8},
				{a: 118, cO: 8},
				{a: 246, cO: 8},
				{a: 14, cO: 8},
				{a: 142, cO: 8},
				{a: 78, cO: 8},
				{a: 206, cO: 8},
				{a: 46, cO: 8},
				{a: 174, cO: 8},
				{a: 110, cO: 8},
				{a: 238, cO: 8},
				{a: 30, cO: 8},
				{a: 158, cO: 8},
				{a: 94, cO: 8},
				{a: 222, cO: 8},
				{a: 62, cO: 8},
				{a: 190, cO: 8},
				{a: 126, cO: 8},
				{a: 254, cO: 8},
				{a: 1, cO: 8},
				{a: 129, cO: 8},
				{a: 65, cO: 8},
				{a: 193, cO: 8},
				{a: 33, cO: 8},
				{a: 161, cO: 8},
				{a: 97, cO: 8},
				{a: 225, cO: 8},
				{a: 17, cO: 8},
				{a: 145, cO: 8},
				{a: 81, cO: 8},
				{a: 209, cO: 8},
				{a: 49, cO: 8},
				{a: 177, cO: 8},
				{a: 113, cO: 8},
				{a: 241, cO: 8},
				{a: 9, cO: 8},
				{a: 137, cO: 8},
				{a: 73, cO: 8},
				{a: 201, cO: 8},
				{a: 41, cO: 8},
				{a: 169, cO: 8},
				{a: 105, cO: 8},
				{a: 233, cO: 8},
				{a: 25, cO: 8},
				{a: 153, cO: 8},
				{a: 89, cO: 8},
				{a: 217, cO: 8},
				{a: 57, cO: 8},
				{a: 185, cO: 8},
				{a: 121, cO: 8},
				{a: 249, cO: 8},
				{a: 5, cO: 8},
				{a: 133, cO: 8},
				{a: 69, cO: 8},
				{a: 197, cO: 8},
				{a: 37, cO: 8},
				{a: 165, cO: 8},
				{a: 101, cO: 8},
				{a: 229, cO: 8},
				{a: 21, cO: 8},
				{a: 149, cO: 8},
				{a: 85, cO: 8},
				{a: 213, cO: 8},
				{a: 53, cO: 8},
				{a: 181, cO: 8},
				{a: 117, cO: 8},
				{a: 245, cO: 8},
				{a: 13, cO: 8},
				{a: 141, cO: 8},
				{a: 77, cO: 8},
				{a: 205, cO: 8},
				{a: 45, cO: 8},
				{a: 173, cO: 8},
				{a: 109, cO: 8},
				{a: 237, cO: 8},
				{a: 29, cO: 8},
				{a: 157, cO: 8},
				{a: 93, cO: 8},
				{a: 221, cO: 8},
				{a: 61, cO: 8},
				{a: 189, cO: 8},
				{a: 125, cO: 8},
				{a: 253, cO: 8},
				{a: 19, cO: 9},
				{a: 275, cO: 9},
				{a: 147, cO: 9},
				{a: 403, cO: 9},
				{a: 83, cO: 9},
				{a: 339, cO: 9},
				{a: 211, cO: 9},
				{a: 467, cO: 9},
				{a: 51, cO: 9},
				{a: 307, cO: 9},
				{a: 179, cO: 9},
				{a: 435, cO: 9},
				{a: 115, cO: 9},
				{a: 371, cO: 9},
				{a: 243, cO: 9},
				{a: 499, cO: 9},
				{a: 11, cO: 9},
				{a: 267, cO: 9},
				{a: 139, cO: 9},
				{a: 395, cO: 9},
				{a: 75, cO: 9},
				{a: 331, cO: 9},
				{a: 203, cO: 9},
				{a: 459, cO: 9},
				{a: 43, cO: 9},
				{a: 299, cO: 9},
				{a: 171, cO: 9},
				{a: 427, cO: 9},
				{a: 107, cO: 9},
				{a: 363, cO: 9},
				{a: 235, cO: 9},
				{a: 491, cO: 9},
				{a: 27, cO: 9},
				{a: 283, cO: 9},
				{a: 155, cO: 9},
				{a: 411, cO: 9},
				{a: 91, cO: 9},
				{a: 347, cO: 9},
				{a: 219, cO: 9},
				{a: 475, cO: 9},
				{a: 59, cO: 9},
				{a: 315, cO: 9},
				{a: 187, cO: 9},
				{a: 443, cO: 9},
				{a: 123, cO: 9},
				{a: 379, cO: 9},
				{a: 251, cO: 9},
				{a: 507, cO: 9},
				{a: 7, cO: 9},
				{a: 263, cO: 9},
				{a: 135, cO: 9},
				{a: 391, cO: 9},
				{a: 71, cO: 9},
				{a: 327, cO: 9},
				{a: 199, cO: 9},
				{a: 455, cO: 9},
				{a: 39, cO: 9},
				{a: 295, cO: 9},
				{a: 167, cO: 9},
				{a: 423, cO: 9},
				{a: 103, cO: 9},
				{a: 359, cO: 9},
				{a: 231, cO: 9},
				{a: 487, cO: 9},
				{a: 23, cO: 9},
				{a: 279, cO: 9},
				{a: 151, cO: 9},
				{a: 407, cO: 9},
				{a: 87, cO: 9},
				{a: 343, cO: 9},
				{a: 215, cO: 9},
				{a: 471, cO: 9},
				{a: 55, cO: 9},
				{a: 311, cO: 9},
				{a: 183, cO: 9},
				{a: 439, cO: 9},
				{a: 119, cO: 9},
				{a: 375, cO: 9},
				{a: 247, cO: 9},
				{a: 503, cO: 9},
				{a: 15, cO: 9},
				{a: 271, cO: 9},
				{a: 143, cO: 9},
				{a: 399, cO: 9},
				{a: 79, cO: 9},
				{a: 335, cO: 9},
				{a: 207, cO: 9},
				{a: 463, cO: 9},
				{a: 47, cO: 9},
				{a: 303, cO: 9},
				{a: 175, cO: 9},
				{a: 431, cO: 9},
				{a: 111, cO: 9},
				{a: 367, cO: 9},
				{a: 239, cO: 9},
				{a: 495, cO: 9},
				{a: 31, cO: 9},
				{a: 287, cO: 9},
				{a: 159, cO: 9},
				{a: 415, cO: 9},
				{a: 95, cO: 9},
				{a: 351, cO: 9},
				{a: 223, cO: 9},
				{a: 479, cO: 9},
				{a: 63, cO: 9},
				{a: 319, cO: 9},
				{a: 191, cO: 9},
				{a: 447, cO: 9},
				{a: 127, cO: 9},
				{a: 383, cO: 9},
				{a: 255, cO: 9},
				{a: 511, cO: 9},
				{a: 0, cO: 7},
				{a: 64, cO: 7},
				{a: 32, cO: 7},
				{a: 96, cO: 7},
				{a: 16, cO: 7},
				{a: 80, cO: 7},
				{a: 48, cO: 7},
				{a: 112, cO: 7},
				{a: 8, cO: 7},
				{a: 72, cO: 7},
				{a: 40, cO: 7},
				{a: 104, cO: 7},
				{a: 24, cO: 7},
				{a: 88, cO: 7},
				{a: 56, cO: 7},
				{a: 120, cO: 7},
				{a: 4, cO: 7},
				{a: 68, cO: 7},
				{a: 36, cO: 7},
				{a: 100, cO: 7},
				{a: 20, cO: 7},
				{a: 84, cO: 7},
				{a: 52, cO: 7},
				{a: 116, cO: 7},
				{a: 3, cO: 8},
				{a: 131, cO: 8},
				{a: 67, cO: 8},
				{a: 195, cO: 8},
				{a: 35, cO: 8},
				{a: 163, cO: 8},
				{a: 99, cO: 8},
				{a: 227, cO: 8}
			]))
};
var $folkertdev$elm_flate$Deflate$Internal$encodeCompressStatic = F3(
	function (maybeWindowSize, buf, bitWriter) {
		var huffmanTrees = $folkertdev$elm_flate$Huffman$hardcodedStaticHuffmanTree;
		var compressed = A2($folkertdev$elm_flate$Deflate$Internal$compress, maybeWindowSize, buf);
		return A3(
			$elm$core$Array$foldl,
			F2(
				function (symbol, first) {
					return A3($folkertdev$elm_flate$Deflate$Symbol$encode, symbol, huffmanTrees, first);
				}),
			bitWriter,
			compressed);
	});
var $folkertdev$elm_flate$Deflate$Internal$encodeStaticBlock = F3(
	function (windowSize, _v0, bitWriter) {
		var isLastBlock = _v0.a;
		var buffer = _v0.b;
		return A3(
			$folkertdev$elm_flate$Deflate$Internal$encodeCompressStatic,
			windowSize,
			buffer,
			A3(
				$folkertdev$elm_flate$Deflate$BitWriter$writeBits,
				2,
				1,
				A2($folkertdev$elm_flate$Deflate$BitWriter$writeBit, isLastBlock, bitWriter)));
	});
var $folkertdev$elm_flate$Deflate$Internal$encodeStatic = F2(
	function (windowSize, buffer) {
		return $elm$bytes$Bytes$Encode$encode(
			$elm$bytes$Bytes$Encode$sequence(
				$folkertdev$elm_flate$Deflate$BitWriter$run(
					$folkertdev$elm_flate$Deflate$BitWriter$flush(
						A3(
							$elm$core$List$foldl,
							F2(
								function (chunk, first) {
									return A3($folkertdev$elm_flate$Deflate$Internal$encodeStaticBlock, windowSize, chunk, first);
								}),
							$folkertdev$elm_flate$Deflate$BitWriter$empty,
							A2($folkertdev$elm_flate$Deflate$Internal$chunks, $folkertdev$elm_flate$Deflate$Internal$default_block_size, buffer))))));
	});
var $folkertdev$elm_flate$Flate$deflateWithOptions = F2(
	function (encoding, buffer) {
		switch (encoding.$) {
			case 0:
				return $folkertdev$elm_flate$Deflate$Internal$encodeRaw(buffer);
			case 2:
				if (!encoding.a.$) {
					var _v1 = encoding.a;
					return A2($folkertdev$elm_flate$Deflate$Internal$encodeStatic, $elm$core$Maybe$Nothing, buffer);
				} else {
					var w = encoding.a.a;
					return A2(
						$folkertdev$elm_flate$Deflate$Internal$encodeStatic,
						$elm$core$Maybe$Just(w),
						buffer);
				}
			default:
				if (!encoding.a.$) {
					var _v2 = encoding.a;
					return A2($folkertdev$elm_flate$Deflate$Internal$encodeDynamic, $elm$core$Maybe$Nothing, buffer);
				} else {
					var w = encoding.a.a;
					return A2(
						$folkertdev$elm_flate$Deflate$Internal$encodeDynamic,
						$elm$core$Maybe$Just(w),
						buffer);
				}
		}
	});
var $elm$core$Basics$pow = _Basics_pow;
var $folkertdev$elm_flate$Flate$deflateZlibWithOptions = F2(
	function (encoding, buffer) {
		var windowSizeHelp = function (size) {
			var kb = 1024;
			return (size <= 256) ? 0 : ((size <= 512) ? 1 : ((_Utils_cmp(size, 1 * kb) < 1) ? 2 : ((_Utils_cmp(size, 2 * kb) < 1) ? 3 : ((_Utils_cmp(size, 4 * kb) < 1) ? 4 : ((_Utils_cmp(size, 8 * kb) < 1) ? 5 : ((_Utils_cmp(size, 16 * kb) < 1) ? 6 : ((_Utils_cmp(size, 32 * kb) < 1) ? 7 : 0)))))));
		};
		var windowSize = function () {
			switch (encoding.$) {
				case 0:
					return 0;
				case 2:
					if (!encoding.a.$) {
						var _v1 = encoding.a;
						return 0;
					} else {
						var size = encoding.a.a;
						return windowSizeHelp(size);
					}
				default:
					if (!encoding.a.$) {
						var _v2 = encoding.a;
						return 0;
					} else {
						var size = encoding.a.a;
						return windowSizeHelp(size);
					}
			}
		}();
		var mask16 = function (value) {
			return value & (A2($elm$core$Basics$pow, 2, 16) - 1);
		};
		var encodedTrailer = _List_fromArray(
			[
				A2(
				$elm$bytes$Bytes$Encode$unsignedInt32,
				1,
				$folkertdev$elm_flate$Checksum$Adler32$adler32(buffer))
			]);
		var data = A2($folkertdev$elm_flate$Flate$deflateWithOptions, encoding, buffer);
		var compressionLevel = 2;
		var cmf = (windowSize << 4) | 8;
		var check = (cmf << 8) + (compressionLevel << 6);
		var flag = (!(!A2($elm$core$Basics$modBy, 31, check))) ? ((compressionLevel << 6) + (31 - A2($elm$core$Basics$modBy, 31, check))) : (compressionLevel << 6);
		var encodedHeader = _List_fromArray(
			[
				$elm$bytes$Bytes$Encode$unsignedInt8(cmf),
				$elm$bytes$Bytes$Encode$unsignedInt8(flag)
			]);
		return $elm$bytes$Bytes$Encode$encode(
			$elm$bytes$Bytes$Encode$sequence(
				_Utils_ap(
					encodedHeader,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$bytes$Bytes$Encode$bytes(data)
							]),
						encodedTrailer))));
	});
var $folkertdev$elm_flate$LZ77$max_distance = 32768;
var $folkertdev$elm_flate$LZ77$maxWindowSize = $folkertdev$elm_flate$LZ77$max_distance;
var $folkertdev$elm_flate$Flate$deflateZlib = $folkertdev$elm_flate$Flate$deflateZlibWithOptions(
	$folkertdev$elm_flate$Flate$Dynamic(
		$folkertdev$elm_flate$Flate$WithWindowSize($folkertdev$elm_flate$LZ77$maxWindowSize)));
var $justgook$elm_image$Image$Internal$PNG$packIntoInt32 = F4(
	function (r, g, b, a) {
		return (((255 & r) << 24) | ((255 & g) << 16)) | (((255 & b) << 8) | (255 & a));
	});
var $justgook$elm_image$Image$Internal$PNG$encodePixel32 = F2(
	function (px, prev) {
		var r = px >>> 24;
		var prevR = prev >>> 24;
		var prevG = 255 & (prev >> 16);
		var prevB = 255 & (prev >> 8);
		var prevA = 255 & prev;
		var g = 255 & (px >> 16);
		var b = 255 & (px >> 8);
		var a = 255 & px;
		return A2(
			$elm$bytes$Bytes$Encode$unsignedInt32,
			1,
			A4($justgook$elm_image$Image$Internal$PNG$packIntoInt32, r - prevR, g - prevG, b - prevB, a - prevA));
	});
var $justgook$elm_image$Image$Internal$PNG$encodeIDAT = F2(
	function (_v0, arr) {
		var order = _v0.cs;
		var scanLineFilter = $elm$bytes$Bytes$Encode$unsignedInt8(1);
		var _v1 = function () {
			switch (order) {
				case 0:
					return _Utils_Tuple2($elm$core$Array$foldl, $elm$core$Array$foldl);
				case 1:
					return _Utils_Tuple2($elm$core$Array$foldr, $elm$core$Array$foldl);
				case 2:
					return _Utils_Tuple2($elm$core$Array$foldl, $elm$core$Array$foldr);
				default:
					return _Utils_Tuple2($elm$core$Array$foldr, $elm$core$Array$foldr);
			}
		}();
		var fold1 = _v1.a;
		var fold2 = _v1.b;
		return A3(
			$elm$core$Basics$composeR,
			$elm$bytes$Bytes$Encode$encode,
			A2($elm$core$Basics$composeR, $folkertdev$elm_flate$Flate$deflateZlib, $elm$bytes$Bytes$Encode$bytes),
			A3(
				fold1,
				F2(
					function (sArr, acc) {
						return function (_v4) {
							var line = _v4.b;
							return $elm$bytes$Bytes$Encode$sequence(
								_List_fromArray(
									[acc, line]));
						}(
							A3(
								fold2,
								F2(
									function (px, _v3) {
										var prev = _v3.a;
										var acc2 = _v3.b;
										var packed = A2($justgook$elm_image$Image$Internal$PNG$encodePixel32, px, prev);
										return _Utils_Tuple2(
											px,
											$elm$bytes$Bytes$Encode$sequence(
												_List_fromArray(
													[acc2, packed])));
									}),
								_Utils_Tuple2(0, scanLineFilter),
								sArr));
					}),
				$elm$bytes$Bytes$Encode$sequence(_List_Nil),
				arr));
	});
var $justgook$elm_image$Image$Internal$PNG$encodeIHDR = F3(
	function (width, height, _v0) {
		var format = _v0.b8;
		var interlace = 0;
		var _v1 = function () {
			switch (format) {
				case 0:
					return _Utils_Tuple2(8, 6);
				case 1:
					return _Utils_Tuple2(8, 2);
				case 2:
					return _Utils_Tuple2(16, 0);
				default:
					return _Utils_Tuple2(8, 0);
			}
		}();
		var depth = _v1.a;
		var color = _v1.b;
		return $elm$bytes$Bytes$Encode$sequence(
			_List_fromArray(
				[
					A2($elm$bytes$Bytes$Encode$unsignedInt32, 1, width),
					A2($elm$bytes$Bytes$Encode$unsignedInt32, 1, height),
					$elm$bytes$Bytes$Encode$unsignedInt8(depth),
					$elm$bytes$Bytes$Encode$unsignedInt8(color),
					$elm$bytes$Bytes$Encode$unsignedInt8(0),
					$elm$bytes$Bytes$Encode$unsignedInt8(0),
					$elm$bytes$Bytes$Encode$unsignedInt8(interlace)
				]));
	});
var $justgook$elm_image$Image$Internal$PNG$encodeSignature = $elm$bytes$Bytes$Encode$sequence(
	_List_fromArray(
		[
			$elm$bytes$Bytes$Encode$unsignedInt8(137),
			$elm$bytes$Bytes$Encode$unsignedInt8(80),
			$elm$bytes$Bytes$Encode$unsignedInt8(78),
			$elm$bytes$Bytes$Encode$unsignedInt8(71),
			$elm$bytes$Bytes$Encode$unsignedInt8(13),
			$elm$bytes$Bytes$Encode$unsignedInt8(10),
			$elm$bytes$Bytes$Encode$unsignedInt8(26),
			$elm$bytes$Bytes$Encode$unsignedInt8(10)
		]));
var $justgook$elm_image$Image$Info$dimensions = function (meta) {
	switch (meta.$) {
		case 0:
			var width = meta.a.cO;
			var height = meta.a.cb;
			return {cb: height, cO: width};
		case 1:
			var width = meta.a.cO;
			var height = meta.a.cb;
			return {cb: height, cO: width};
		case 2:
			var width = meta.a.cO;
			var height = meta.a.cb;
			return {cb: height, cO: width};
		default:
			var width = meta.a.cO;
			var height = meta.a.cb;
			return {cb: height, cO: width};
	}
};
var $justgook$elm_image$Image$Internal$ImageData$splitAt = F2(
	function (index, xs) {
		var len = $elm$core$Array$length(xs);
		var _v0 = _Utils_Tuple2(
			index > 0,
			_Utils_cmp(index, len) < 0);
		if (_v0.a) {
			if (_v0.b) {
				return _Utils_Tuple2(
					A3($elm$core$Array$slice, 0, index, xs),
					A3($elm$core$Array$slice, index, len, xs));
			} else {
				return _Utils_Tuple2(xs, $elm$core$Array$empty);
			}
		} else {
			if (_v0.b) {
				return _Utils_Tuple2($elm$core$Array$empty, xs);
			} else {
				return _Utils_Tuple2($elm$core$Array$empty, $elm$core$Array$empty);
			}
		}
	});
var $justgook$elm_image$Image$Internal$ImageData$fromArray = F3(
	function (w, arr, acc) {
		fromArray:
		while (true) {
			if (_Utils_cmp(
				$elm$core$Array$length(arr),
				w) > 0) {
				var _v0 = A2($justgook$elm_image$Image$Internal$ImageData$splitAt, w, arr);
				var a1 = _v0.a;
				var a2 = _v0.b;
				var $temp$w = w,
					$temp$arr = a2,
					$temp$acc = A2($elm$core$Array$push, a1, acc);
				w = $temp$w;
				arr = $temp$arr;
				acc = $temp$acc;
				continue fromArray;
			} else {
				return A2($elm$core$Array$push, arr, acc);
			}
		}
	});
var $justgook$elm_image$Image$Internal$ImageData$applyIf = F3(
	function (bool, f, a) {
		return bool ? f(a) : a;
	});
var $justgook$elm_image$Image$Internal$Array2D$lastIndex_ = function (arr) {
	return $elm$core$Array$length(arr) - 1;
};
var $justgook$elm_image$Image$Internal$Array2D$lastLength = function (arr) {
	return A2(
		$elm$core$Maybe$withDefault,
		0,
		A2(
			$elm$core$Maybe$map,
			$elm$core$Array$length,
			A2(
				$elm$core$Array$get,
				$justgook$elm_image$Image$Internal$Array2D$lastIndex_(arr),
				arr)));
};
var $justgook$elm_image$Image$Internal$Array2D$push = F2(
	function (item, arr) {
		return A2(
			$elm$core$Maybe$withDefault,
			arr,
			A2(
				$elm$core$Maybe$map,
				function (arr2) {
					return A3(
						$elm$core$Array$set,
						$justgook$elm_image$Image$Internal$Array2D$lastIndex_(arr),
						A2($elm$core$Array$push, item, arr2),
						arr);
				},
				A2(
					$elm$core$Array$get,
					$justgook$elm_image$Image$Internal$Array2D$lastIndex_(arr),
					arr)));
	});
var $justgook$elm_image$Image$Internal$ImageData$fromList = F3(
	function (w, l, acc) {
		fromList:
		while (true) {
			if (l.b) {
				var a = l.a;
				var rest = l.b;
				var newAcc = A3(
					$justgook$elm_image$Image$Internal$ImageData$applyIf,
					_Utils_cmp(
						$justgook$elm_image$Image$Internal$Array2D$lastLength(acc),
						w) > -1,
					$elm$core$Array$push($elm$core$Array$empty),
					acc);
				var $temp$w = w,
					$temp$l = rest,
					$temp$acc = A2($justgook$elm_image$Image$Internal$Array2D$push, a, newAcc);
				w = $temp$w;
				l = $temp$l;
				acc = $temp$acc;
				continue fromList;
			} else {
				return acc;
			}
		}
	});
var $justgook$elm_image$Image$Internal$ImageData$toArray2d = function (image) {
	toArray2d:
	while (true) {
		switch (image.$) {
			case 0:
				var meta = image.a;
				var l = image.b;
				return A3(
					$justgook$elm_image$Image$Internal$ImageData$fromList,
					$justgook$elm_image$Image$Info$dimensions(meta).cO,
					l,
					$elm$core$Array$fromList(
						_List_fromArray(
							[$elm$core$Array$empty])));
			case 1:
				var l = image.b;
				return A3(
					$elm$core$List$foldl,
					A2($elm$core$Basics$composeR, $elm$core$Array$fromList, $elm$core$Array$push),
					$elm$core$Array$empty,
					l);
			case 2:
				var meta = image.a;
				var arr = image.b;
				return A3(
					$justgook$elm_image$Image$Internal$ImageData$fromArray,
					$justgook$elm_image$Image$Info$dimensions(meta).cO,
					arr,
					$elm$core$Array$empty);
			case 3:
				var arr = image.b;
				return arr;
			default:
				var d = image.b;
				var b = image.c;
				var _v1 = A2($elm$bytes$Bytes$Decode$decode, d, b);
				if (!_v1.$) {
					if (_v1.a.$ === 4) {
						var _v2 = _v1.a;
						return $elm$core$Array$empty;
					} else {
						var newData = _v1.a;
						var $temp$image = newData;
						image = $temp$image;
						continue toArray2d;
					}
				} else {
					return $elm$core$Array$empty;
				}
		}
	}
};
var $justgook$elm_image$Image$Internal$PNG$encode = function (imgData) {
	var opt = $justgook$elm_image$Image$Internal$ImageData$defaultOptions;
	var chunkIEND = A2(
		$justgook$elm_image$Image$Internal$PNG$encodeChunk,
		1229278788,
		$elm$bytes$Bytes$Encode$encode(
			$elm$bytes$Bytes$Encode$sequence(_List_Nil)));
	var arr = $justgook$elm_image$Image$Internal$ImageData$toArray2d(imgData);
	var chunkIDAT = A2(
		$justgook$elm_image$Image$Internal$PNG$encodeChunk,
		1229209940,
		$elm$bytes$Bytes$Encode$encode(
			A2($justgook$elm_image$Image$Internal$PNG$encodeIDAT, opt, arr)));
	var height = $elm$core$Array$length(arr);
	var width = A2(
		$elm$core$Maybe$withDefault,
		0,
		A2(
			$elm$core$Maybe$map,
			$elm$core$Array$length,
			A2($elm$core$Array$get, 0, arr)));
	var chunkIHDR = A2(
		$justgook$elm_image$Image$Internal$PNG$encodeChunk,
		1229472850,
		$elm$bytes$Bytes$Encode$encode(
			A3($justgook$elm_image$Image$Internal$PNG$encodeIHDR, width, height, opt)));
	return $elm$bytes$Bytes$Encode$encode(
		$elm$bytes$Bytes$Encode$sequence(
			_List_fromArray(
				[$justgook$elm_image$Image$Internal$PNG$encodeSignature, chunkIHDR, chunkIDAT, chunkIEND])));
};
var $justgook$elm_image$Image$Internal$ImageData$Array = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $justgook$elm_image$Image$Internal$ImageData$Array2d = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $justgook$elm_image$Image$Internal$ImageData$Bytes = F3(
	function (a, b, c) {
		return {$: 4, a: a, b: b, c: c};
	});
var $justgook$elm_image$Image$Internal$ImageData$List = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $justgook$elm_image$Image$Internal$ImageData$map = F2(
	function (fn, image) {
		map:
		while (true) {
			switch (image.$) {
				case 0:
					var meta = image.a;
					var l = image.b;
					return A2(
						$justgook$elm_image$Image$Internal$ImageData$List,
						meta,
						A2($elm$core$List$map, fn, l));
				case 1:
					var meta = image.a;
					var l = image.b;
					return A2(
						$justgook$elm_image$Image$Internal$ImageData$List2d,
						meta,
						A2(
							$elm$core$List$map,
							$elm$core$List$map(fn),
							l));
				case 2:
					var meta = image.a;
					var arr = image.b;
					return A2(
						$justgook$elm_image$Image$Internal$ImageData$Array,
						meta,
						A2($elm$core$Array$map, fn, arr));
				case 3:
					var meta = image.a;
					var arr = image.b;
					return A2(
						$justgook$elm_image$Image$Internal$ImageData$Array2d,
						meta,
						A2(
							$elm$core$Array$map,
							$elm$core$Array$map(fn),
							arr));
				default:
					var meta = image.a;
					var d = image.b;
					var b = image.c;
					var _v1 = A2($elm$bytes$Bytes$Decode$decode, d, b);
					if (!_v1.$) {
						if (_v1.a.$ === 4) {
							var _v2 = _v1.a;
							return A3($justgook$elm_image$Image$Internal$ImageData$Bytes, meta, d, b);
						} else {
							var newData = _v1.a;
							var $temp$fn = fn,
								$temp$image = newData;
							fn = $temp$fn;
							image = $temp$image;
							continue map;
						}
					} else {
						return A3($justgook$elm_image$Image$Internal$ImageData$Bytes, meta, d, b);
					}
			}
		}
	});
var $justgook$elm_image$Image$Internal$Pixel$addChannel = $justgook$elm_image$Image$Internal$ImageData$map(
	A2(
		$elm$core$Basics$composeR,
		$elm$core$Bitwise$shiftLeftBy(8),
		$elm$core$Basics$add(255)));
var $justgook$elm_image$Image$Internal$ImageData$getInfo = function (image) {
	switch (image.$) {
		case 4:
			var meta = image.a;
			return meta;
		case 3:
			var meta = image.a;
			return meta;
		case 1:
			var meta = image.a;
			return meta;
		case 2:
			var meta = image.a;
			return meta;
		default:
			var meta = image.a;
			return meta;
	}
};
var $justgook$elm_image$Image$Internal$Pixel$px8AlphaTo32 = function (px_) {
	var px = px_ >>> 8;
	return (255 & px_) + ((px + ((px + ((px + (px << 8)) << 8)) << 8)) << 8);
};
var $justgook$elm_image$Image$Internal$Pixel$px8to32 = function (px) {
	return 255 + ((px + ((px + ((px + (px << 8)) << 8)) << 8)) << 8);
};
var $justgook$elm_image$Image$Internal$Pixel$toBit32 = function (image) {
	var _v0 = $justgook$elm_image$Image$Internal$ImageData$getInfo(image);
	switch (_v0.$) {
		case 0:
			var color = _v0.a.a1;
			switch (color.$) {
				case 0:
					return image;
				case 2:
					return image;
				case 4:
					return image;
				case 1:
					return A2($justgook$elm_image$Image$Internal$ImageData$map, $justgook$elm_image$Image$Internal$Pixel$px8AlphaTo32, image);
				default:
					return image;
			}
		case 1:
			var bitsPerPixel = _v0.a.cW;
			switch (bitsPerPixel) {
				case 0:
					return A2($justgook$elm_image$Image$Internal$ImageData$map, $justgook$elm_image$Image$Internal$Pixel$px8to32, image);
				case 1:
					return image;
				case 2:
					return $justgook$elm_image$Image$Internal$Pixel$addChannel(image);
				default:
					return image;
			}
		case 2:
			return image;
		default:
			var color = _v0.a.a1;
			switch (color.$) {
				case 0:
					return image;
				case 1:
					return image;
				case 2:
					return image;
				default:
					return image;
			}
	}
};
var $justgook$elm_image$Image$Advanced$toPng32 = A2($elm$core$Basics$composeR, $justgook$elm_image$Image$Internal$Pixel$toBit32, $justgook$elm_image$Image$Internal$PNG$encode);
var $justgook$elm_image$Image$toPng = $justgook$elm_image$Image$Advanced$toPng32;
var $author$project$State$generateQRCodePngUrl = F2(
	function (_v0, model) {
		var fg = _v0.a;
		var bg = _v0.b;
		var _v1 = A2(
			$pablohirafuji$elm_qrcode$QRCode$fromStringWith,
			model.da,
			$author$project$QRTypes$encodeQRType(model.dz));
		if (_v1.$ === 1) {
			return $elm$bytes$Bytes$Encode$encode(
				$elm$bytes$Bytes$Encode$string('ERROR'));
		} else {
			var code = _v1.a;
			return $justgook$elm_image$Image$toPng(
				A2(
					$pablohirafuji$elm_qrcode$QRCode$toImageWithOptions,
					_Utils_update(
						$pablohirafuji$elm_qrcode$QRCode$defaultImageOptions,
						{c1: fg, dm: bg, dq: 10}),
					code));
		}
	});
var $author$project$State$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var newType = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{dz: newType}),
					$elm$core$Platform$Cmd$none);
			case 1:
				var ecc = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{da: ecc}),
					$elm$core$Platform$Cmd$none);
			case 2:
				var fg = msg.a;
				var bg = msg.b;
				return _Utils_Tuple2(
					model,
					A3(
						$elm$file$File$Download$bytes,
						'qrcode.png',
						'image/png',
						A2(
							$author$project$State$generateQRCodePngUrl,
							_Utils_Tuple2(fg, bg),
							model)));
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $rtfeldman$elm_css$Css$Preprocess$AppendProperty = function (a) {
	return {$: 0, a: a};
};
var $rtfeldman$elm_css$Css$property = F2(
	function (key, value) {
		return $rtfeldman$elm_css$Css$Preprocess$AppendProperty(key + (':' + value));
	});
var $rtfeldman$elm_css$Css$prop1 = F2(
	function (key, arg) {
		return A2($rtfeldman$elm_css$Css$property, key, arg.L);
	});
var $rtfeldman$elm_css$Css$center = $rtfeldman$elm_css$Css$prop1('center');
var $rtfeldman$elm_css$VirtualDom$Styled$Attribute = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence = function (a) {
	return {$: 1, a: a};
};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $rtfeldman$elm_css$Css$Structure$compactHelp = F2(
	function (declaration, _v0) {
		var keyframesByName = _v0.a;
		var declarations = _v0.b;
		switch (declaration.$) {
			case 0:
				var _v2 = declaration.a;
				var properties = _v2.c;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 1:
				var styleBlocks = declaration.b;
				return A2(
					$elm$core$List$all,
					function (_v3) {
						var properties = _v3.c;
						return $elm$core$List$isEmpty(properties);
					},
					styleBlocks) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 2:
				var otherDeclarations = declaration.b;
				return $elm$core$List$isEmpty(otherDeclarations) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 3:
				return _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 4:
				var properties = declaration.b;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 5:
				var properties = declaration.a;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 6:
				var record = declaration.a;
				return $elm$core$String$isEmpty(record.c3) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					A3($elm$core$Dict$insert, record.ds, record.c3, keyframesByName),
					declarations);
			case 7:
				var properties = declaration.a;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 8:
				var properties = declaration.a;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			default:
				var tuples = declaration.a;
				return A2(
					$elm$core$List$all,
					function (_v4) {
						var properties = _v4.b;
						return $elm$core$List$isEmpty(properties);
					},
					tuples) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
		}
	});
var $rtfeldman$elm_css$Css$Structure$Keyframes = function (a) {
	return {$: 6, a: a};
};
var $rtfeldman$elm_css$Css$Structure$withKeyframeDeclarations = F2(
	function (keyframesByName, compactedDeclarations) {
		return A2(
			$elm$core$List$append,
			A2(
				$elm$core$List$map,
				function (_v0) {
					var name = _v0.a;
					var decl = _v0.b;
					return $rtfeldman$elm_css$Css$Structure$Keyframes(
						{c3: decl, ds: name});
				},
				$elm$core$Dict$toList(keyframesByName)),
			compactedDeclarations);
	});
var $rtfeldman$elm_css$Css$Structure$compactStylesheet = function (_v0) {
	var charset = _v0.b$;
	var imports = _v0.cg;
	var namespaces = _v0.cp;
	var declarations = _v0.c4;
	var _v1 = A3(
		$elm$core$List$foldr,
		$rtfeldman$elm_css$Css$Structure$compactHelp,
		_Utils_Tuple2($elm$core$Dict$empty, _List_Nil),
		declarations);
	var keyframesByName = _v1.a;
	var compactedDeclarations = _v1.b;
	var finalDeclarations = A2($rtfeldman$elm_css$Css$Structure$withKeyframeDeclarations, keyframesByName, compactedDeclarations);
	return {b$: charset, c4: finalDeclarations, cg: imports, cp: namespaces};
};
var $rtfeldman$elm_css$Css$Structure$Output$charsetToString = function (charset) {
	return A2(
		$elm$core$Maybe$withDefault,
		'',
		A2(
			$elm$core$Maybe$map,
			function (str) {
				return '@charset \"' + (str + '\"');
			},
			charset));
};
var $rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString = function (expression) {
	return '(' + (expression.b7 + (A2(
		$elm$core$Maybe$withDefault,
		'',
		A2(
			$elm$core$Maybe$map,
			$elm$core$Basics$append(': '),
			expression.L)) + ')'));
};
var $rtfeldman$elm_css$Css$Structure$Output$mediaTypeToString = function (mediaType) {
	switch (mediaType) {
		case 0:
			return 'print';
		case 1:
			return 'screen';
		default:
			return 'speech';
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$mediaQueryToString = function (mediaQuery) {
	var prefixWith = F3(
		function (str, mediaType, expressions) {
			return str + (' ' + A2(
				$elm$core$String$join,
				' and ',
				A2(
					$elm$core$List$cons,
					$rtfeldman$elm_css$Css$Structure$Output$mediaTypeToString(mediaType),
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString, expressions))));
		});
	switch (mediaQuery.$) {
		case 0:
			var expressions = mediaQuery.a;
			return A2(
				$elm$core$String$join,
				' and ',
				A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString, expressions));
		case 1:
			var mediaType = mediaQuery.a;
			var expressions = mediaQuery.b;
			return A3(prefixWith, 'only', mediaType, expressions);
		case 2:
			var mediaType = mediaQuery.a;
			var expressions = mediaQuery.b;
			return A3(prefixWith, 'not', mediaType, expressions);
		default:
			var str = mediaQuery.a;
			return str;
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$importMediaQueryToString = F2(
	function (name, mediaQuery) {
		return '@import \"' + (name + ($rtfeldman$elm_css$Css$Structure$Output$mediaQueryToString(mediaQuery) + '\"'));
	});
var $rtfeldman$elm_css$Css$Structure$Output$importToString = function (_v0) {
	var name = _v0.a;
	var mediaQueries = _v0.b;
	return A2(
		$elm$core$String$join,
		'\n',
		A2(
			$elm$core$List$map,
			$rtfeldman$elm_css$Css$Structure$Output$importMediaQueryToString(name),
			mediaQueries));
};
var $rtfeldman$elm_css$Css$Structure$Output$namespaceToString = function (_v0) {
	var prefix = _v0.a;
	var str = _v0.b;
	return '@namespace ' + (prefix + ('\"' + (str + '\"')));
};
var $rtfeldman$elm_css$Css$Structure$Output$spaceIndent = '    ';
var $rtfeldman$elm_css$Css$Structure$Output$indent = function (str) {
	return _Utils_ap($rtfeldman$elm_css$Css$Structure$Output$spaceIndent, str);
};
var $rtfeldman$elm_css$Css$Structure$Output$noIndent = '';
var $rtfeldman$elm_css$Css$Structure$Output$emitProperty = function (str) {
	return str + ';';
};
var $rtfeldman$elm_css$Css$Structure$Output$emitProperties = function (properties) {
	return A2(
		$elm$core$String$join,
		'\n',
		A2(
			$elm$core$List$map,
			A2($elm$core$Basics$composeL, $rtfeldman$elm_css$Css$Structure$Output$indent, $rtfeldman$elm_css$Css$Structure$Output$emitProperty),
			properties));
};
var $elm$core$String$append = _String_append;
var $rtfeldman$elm_css$Css$Structure$Output$pseudoElementToString = function (_v0) {
	var str = _v0;
	return '::' + str;
};
var $rtfeldman$elm_css$Css$Structure$Output$combinatorToString = function (combinator) {
	switch (combinator) {
		case 0:
			return '+';
		case 1:
			return '~';
		case 2:
			return '>';
		default:
			return '';
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString = function (repeatableSimpleSelector) {
	switch (repeatableSimpleSelector.$) {
		case 0:
			var str = repeatableSimpleSelector.a;
			return '.' + str;
		case 1:
			var str = repeatableSimpleSelector.a;
			return '#' + str;
		case 2:
			var str = repeatableSimpleSelector.a;
			return ':' + str;
		default:
			var str = repeatableSimpleSelector.a;
			return '[' + (str + ']');
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString = function (simpleSelectorSequence) {
	switch (simpleSelectorSequence.$) {
		case 0:
			var str = simpleSelectorSequence.a;
			var repeatableSimpleSelectors = simpleSelectorSequence.b;
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$cons,
					str,
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors)));
		case 1:
			var repeatableSimpleSelectors = simpleSelectorSequence.a;
			return $elm$core$List$isEmpty(repeatableSimpleSelectors) ? '*' : A2(
				$elm$core$String$join,
				'',
				A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors));
		default:
			var str = simpleSelectorSequence.a;
			var repeatableSimpleSelectors = simpleSelectorSequence.b;
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$cons,
					str,
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors)));
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$selectorChainToString = function (_v0) {
	var combinator = _v0.a;
	var sequence = _v0.b;
	return A2(
		$elm$core$String$join,
		' ',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$Structure$Output$combinatorToString(combinator),
				$rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString(sequence)
			]));
};
var $rtfeldman$elm_css$Css$Structure$Output$selectorToString = function (_v0) {
	var simpleSelectorSequence = _v0.a;
	var chain = _v0.b;
	var pseudoElement = _v0.c;
	var segments = A2(
		$elm$core$List$cons,
		$rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString(simpleSelectorSequence),
		A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$selectorChainToString, chain));
	var pseudoElementsString = A2(
		$elm$core$String$join,
		'',
		_List_fromArray(
			[
				A2(
				$elm$core$Maybe$withDefault,
				'',
				A2($elm$core$Maybe$map, $rtfeldman$elm_css$Css$Structure$Output$pseudoElementToString, pseudoElement))
			]));
	return A2(
		$elm$core$String$append,
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$filter,
				A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
				segments)),
		pseudoElementsString);
};
var $rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock = F2(
	function (indentLevel, _v0) {
		var firstSelector = _v0.a;
		var otherSelectors = _v0.b;
		var properties = _v0.c;
		var selectorStr = A2(
			$elm$core$String$join,
			', ',
			A2(
				$elm$core$List$map,
				$rtfeldman$elm_css$Css$Structure$Output$selectorToString,
				A2($elm$core$List$cons, firstSelector, otherSelectors)));
		return A2(
			$elm$core$String$join,
			'',
			_List_fromArray(
				[
					selectorStr,
					' {\n',
					indentLevel,
					$rtfeldman$elm_css$Css$Structure$Output$emitProperties(properties),
					'\n',
					indentLevel,
					'}'
				]));
	});
var $rtfeldman$elm_css$Css$Structure$Output$prettyPrintDeclaration = function (decl) {
	switch (decl.$) {
		case 0:
			var styleBlock = decl.a;
			return A2($rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock, $rtfeldman$elm_css$Css$Structure$Output$noIndent, styleBlock);
		case 1:
			var mediaQueries = decl.a;
			var styleBlocks = decl.b;
			var query = A2(
				$elm$core$String$join,
				',\n',
				A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$mediaQueryToString, mediaQueries));
			var blocks = A2(
				$elm$core$String$join,
				'\n\n',
				A2(
					$elm$core$List$map,
					A2(
						$elm$core$Basics$composeL,
						$rtfeldman$elm_css$Css$Structure$Output$indent,
						$rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock($rtfeldman$elm_css$Css$Structure$Output$spaceIndent)),
					styleBlocks));
			return '@media ' + (query + (' {\n' + (blocks + '\n}')));
		case 2:
			return 'TODO';
		case 3:
			return 'TODO';
		case 4:
			return 'TODO';
		case 5:
			return 'TODO';
		case 6:
			var name = decl.a.ds;
			var declaration = decl.a.c3;
			return '@keyframes ' + (name + (' {\n' + (declaration + '\n}')));
		case 7:
			return 'TODO';
		case 8:
			return 'TODO';
		default:
			return 'TODO';
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$prettyPrint = function (_v0) {
	var charset = _v0.b$;
	var imports = _v0.cg;
	var namespaces = _v0.cp;
	var declarations = _v0.c4;
	return A2(
		$elm$core$String$join,
		'\n\n',
		A2(
			$elm$core$List$filter,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$Output$charsetToString(charset),
					A2(
					$elm$core$String$join,
					'\n',
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$importToString, imports)),
					A2(
					$elm$core$String$join,
					'\n',
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$namespaceToString, namespaces)),
					A2(
					$elm$core$String$join,
					'\n\n',
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$prettyPrintDeclaration, declarations))
				])));
};
var $rtfeldman$elm_css$Css$Structure$CounterStyle = function (a) {
	return {$: 8, a: a};
};
var $rtfeldman$elm_css$Css$Structure$FontFace = function (a) {
	return {$: 5, a: a};
};
var $rtfeldman$elm_css$Css$Structure$PageRule = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$Selector = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$Css$Structure$StyleBlock = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration = function (a) {
	return {$: 0, a: a};
};
var $rtfeldman$elm_css$Css$Structure$SupportsRule = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$Viewport = function (a) {
	return {$: 7, a: a};
};
var $rtfeldman$elm_css$Css$Structure$MediaRule = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$mapLast = F2(
	function (update, list) {
		if (!list.b) {
			return list;
		} else {
			if (!list.b.b) {
				var only = list.a;
				return _List_fromArray(
					[
						update(only)
					]);
			} else {
				var first = list.a;
				var rest = list.b;
				return A2(
					$elm$core$List$cons,
					first,
					A2($rtfeldman$elm_css$Css$Structure$mapLast, update, rest));
			}
		}
	});
var $rtfeldman$elm_css$Css$Structure$withPropertyAppended = F2(
	function (property, _v0) {
		var firstSelector = _v0.a;
		var otherSelectors = _v0.b;
		var properties = _v0.c;
		return A3(
			$rtfeldman$elm_css$Css$Structure$StyleBlock,
			firstSelector,
			otherSelectors,
			_Utils_ap(
				properties,
				_List_fromArray(
					[property])));
	});
var $rtfeldman$elm_css$Css$Structure$appendProperty = F2(
	function (property, declarations) {
		if (!declarations.b) {
			return declarations;
		} else {
			if (!declarations.b.b) {
				switch (declarations.a.$) {
					case 0:
						var styleBlock = declarations.a.a;
						return _List_fromArray(
							[
								$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
								A2($rtfeldman$elm_css$Css$Structure$withPropertyAppended, property, styleBlock))
							]);
					case 1:
						var _v1 = declarations.a;
						var mediaQueries = _v1.a;
						var styleBlocks = _v1.b;
						return _List_fromArray(
							[
								A2(
								$rtfeldman$elm_css$Css$Structure$MediaRule,
								mediaQueries,
								A2(
									$rtfeldman$elm_css$Css$Structure$mapLast,
									$rtfeldman$elm_css$Css$Structure$withPropertyAppended(property),
									styleBlocks))
							]);
					default:
						return declarations;
				}
			} else {
				var first = declarations.a;
				var rest = declarations.b;
				return A2(
					$elm$core$List$cons,
					first,
					A2($rtfeldman$elm_css$Css$Structure$appendProperty, property, rest));
			}
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendToLastSelector = F2(
	function (f, styleBlock) {
		if (!styleBlock.b.b) {
			var only = styleBlock.a;
			var properties = styleBlock.c;
			return _List_fromArray(
				[
					A3($rtfeldman$elm_css$Css$Structure$StyleBlock, only, _List_Nil, properties),
					A3(
					$rtfeldman$elm_css$Css$Structure$StyleBlock,
					f(only),
					_List_Nil,
					_List_Nil)
				]);
		} else {
			var first = styleBlock.a;
			var rest = styleBlock.b;
			var properties = styleBlock.c;
			var newRest = A2($elm$core$List$map, f, rest);
			var newFirst = f(first);
			return _List_fromArray(
				[
					A3($rtfeldman$elm_css$Css$Structure$StyleBlock, first, rest, properties),
					A3($rtfeldman$elm_css$Css$Structure$StyleBlock, newFirst, newRest, _List_Nil)
				]);
		}
	});
var $rtfeldman$elm_css$Css$Structure$applyPseudoElement = F2(
	function (pseudo, _v0) {
		var sequence = _v0.a;
		var selectors = _v0.b;
		return A3(
			$rtfeldman$elm_css$Css$Structure$Selector,
			sequence,
			selectors,
			$elm$core$Maybe$Just(pseudo));
	});
var $rtfeldman$elm_css$Css$Structure$appendPseudoElementToLastSelector = F2(
	function (pseudo, styleBlock) {
		return A2(
			$rtfeldman$elm_css$Css$Structure$appendToLastSelector,
			$rtfeldman$elm_css$Css$Structure$applyPseudoElement(pseudo),
			styleBlock);
	});
var $rtfeldman$elm_css$Css$Structure$CustomSelector = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$TypeSelectorSequence = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$appendRepeatable = F2(
	function (selector, sequence) {
		switch (sequence.$) {
			case 0:
				var typeSelector = sequence.a;
				var list = sequence.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$TypeSelectorSequence,
					typeSelector,
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
			case 1:
				var list = sequence.a;
				return $rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
			default:
				var str = sequence.a;
				var list = sequence.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$CustomSelector,
					str,
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendRepeatableWithCombinator = F2(
	function (selector, list) {
		if (!list.b) {
			return _List_Nil;
		} else {
			if (!list.b.b) {
				var _v1 = list.a;
				var combinator = _v1.a;
				var sequence = _v1.b;
				return _List_fromArray(
					[
						_Utils_Tuple2(
						combinator,
						A2($rtfeldman$elm_css$Css$Structure$appendRepeatable, selector, sequence))
					]);
			} else {
				var first = list.a;
				var rest = list.b;
				return A2(
					$elm$core$List$cons,
					first,
					A2($rtfeldman$elm_css$Css$Structure$appendRepeatableWithCombinator, selector, rest));
			}
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendRepeatableSelector = F2(
	function (repeatableSimpleSelector, selector) {
		if (!selector.b.b) {
			var sequence = selector.a;
			var pseudoElement = selector.c;
			return A3(
				$rtfeldman$elm_css$Css$Structure$Selector,
				A2($rtfeldman$elm_css$Css$Structure$appendRepeatable, repeatableSimpleSelector, sequence),
				_List_Nil,
				pseudoElement);
		} else {
			var firstSelector = selector.a;
			var tuples = selector.b;
			var pseudoElement = selector.c;
			return A3(
				$rtfeldman$elm_css$Css$Structure$Selector,
				firstSelector,
				A2($rtfeldman$elm_css$Css$Structure$appendRepeatableWithCombinator, repeatableSimpleSelector, tuples),
				pseudoElement);
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendRepeatableToLastSelector = F2(
	function (selector, styleBlock) {
		return A2(
			$rtfeldman$elm_css$Css$Structure$appendToLastSelector,
			$rtfeldman$elm_css$Css$Structure$appendRepeatableSelector(selector),
			styleBlock);
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors = function (declarations) {
	collectSelectors:
	while (true) {
		if (!declarations.b) {
			return _List_Nil;
		} else {
			if (!declarations.a.$) {
				var _v1 = declarations.a.a;
				var firstSelector = _v1.a;
				var otherSelectors = _v1.b;
				var rest = declarations.b;
				return _Utils_ap(
					A2($elm$core$List$cons, firstSelector, otherSelectors),
					$rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors(rest));
			} else {
				var rest = declarations.b;
				var $temp$declarations = rest;
				declarations = $temp$declarations;
				continue collectSelectors;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Structure$DocumentRule = F5(
	function (a, b, c, d, e) {
		return {$: 3, a: a, b: b, c: c, d: d, e: e};
	});
var $rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock = F2(
	function (update, declarations) {
		_v0$12:
		while (true) {
			if (!declarations.b) {
				return declarations;
			} else {
				if (!declarations.b.b) {
					switch (declarations.a.$) {
						case 0:
							var styleBlock = declarations.a.a;
							return A2(
								$elm$core$List$map,
								$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration,
								update(styleBlock));
						case 1:
							if (declarations.a.b.b) {
								if (!declarations.a.b.b.b) {
									var _v1 = declarations.a;
									var mediaQueries = _v1.a;
									var _v2 = _v1.b;
									var styleBlock = _v2.a;
									return _List_fromArray(
										[
											A2(
											$rtfeldman$elm_css$Css$Structure$MediaRule,
											mediaQueries,
											update(styleBlock))
										]);
								} else {
									var _v3 = declarations.a;
									var mediaQueries = _v3.a;
									var _v4 = _v3.b;
									var first = _v4.a;
									var rest = _v4.b;
									var _v5 = A2(
										$rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock,
										update,
										_List_fromArray(
											[
												A2($rtfeldman$elm_css$Css$Structure$MediaRule, mediaQueries, rest)
											]));
									if ((_v5.b && (_v5.a.$ === 1)) && (!_v5.b.b)) {
										var _v6 = _v5.a;
										var newMediaQueries = _v6.a;
										var newStyleBlocks = _v6.b;
										return _List_fromArray(
											[
												A2(
												$rtfeldman$elm_css$Css$Structure$MediaRule,
												newMediaQueries,
												A2($elm$core$List$cons, first, newStyleBlocks))
											]);
									} else {
										var newDeclarations = _v5;
										return newDeclarations;
									}
								}
							} else {
								break _v0$12;
							}
						case 2:
							var _v7 = declarations.a;
							var str = _v7.a;
							var nestedDeclarations = _v7.b;
							return _List_fromArray(
								[
									A2(
									$rtfeldman$elm_css$Css$Structure$SupportsRule,
									str,
									A2($rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, update, nestedDeclarations))
								]);
						case 3:
							var _v8 = declarations.a;
							var str1 = _v8.a;
							var str2 = _v8.b;
							var str3 = _v8.c;
							var str4 = _v8.d;
							var styleBlock = _v8.e;
							return A2(
								$elm$core$List$map,
								A4($rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4),
								update(styleBlock));
						case 4:
							var _v9 = declarations.a;
							return declarations;
						case 5:
							return declarations;
						case 6:
							return declarations;
						case 7:
							return declarations;
						case 8:
							return declarations;
						default:
							return declarations;
					}
				} else {
					break _v0$12;
				}
			}
		}
		var first = declarations.a;
		var rest = declarations.b;
		return A2(
			$elm$core$List$cons,
			first,
			A2($rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, update, rest));
	});
var $elm$core$String$cons = _String_cons;
var $rtfeldman$elm_css$ElmCssVendor$Murmur3$HashData = F4(
	function (shift, seed, hash, charsProcessed) {
		return {aq: charsProcessed, aw: hash, ag: seed, aC: shift};
	});
var $rtfeldman$elm_css$ElmCssVendor$Murmur3$c1 = 3432918353;
var $rtfeldman$elm_css$ElmCssVendor$Murmur3$c2 = 461845907;
var $rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy = F2(
	function (b, a) {
		return ((a & 65535) * b) + ((((a >>> 16) * b) & 65535) << 16);
	});
var $rtfeldman$elm_css$ElmCssVendor$Murmur3$rotlBy = F2(
	function (b, a) {
		return (a << b) | (a >>> (32 - b));
	});
var $rtfeldman$elm_css$ElmCssVendor$Murmur3$finalize = function (data) {
	var acc = (!(!data.aw)) ? (data.ag ^ A2(
		$rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy,
		$rtfeldman$elm_css$ElmCssVendor$Murmur3$c2,
		A2(
			$rtfeldman$elm_css$ElmCssVendor$Murmur3$rotlBy,
			15,
			A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy, $rtfeldman$elm_css$ElmCssVendor$Murmur3$c1, data.aw)))) : data.ag;
	var h0 = acc ^ data.aq;
	var h1 = A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy, 2246822507, h0 ^ (h0 >>> 16));
	var h2 = A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy, 3266489909, h1 ^ (h1 >>> 13));
	return (h2 ^ (h2 >>> 16)) >>> 0;
};
var $elm$core$String$foldl = _String_foldl;
var $rtfeldman$elm_css$ElmCssVendor$Murmur3$mix = F2(
	function (h1, k1) {
		return A2(
			$rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy,
			5,
			A2(
				$rtfeldman$elm_css$ElmCssVendor$Murmur3$rotlBy,
				13,
				h1 ^ A2(
					$rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy,
					$rtfeldman$elm_css$ElmCssVendor$Murmur3$c2,
					A2(
						$rtfeldman$elm_css$ElmCssVendor$Murmur3$rotlBy,
						15,
						A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy, $rtfeldman$elm_css$ElmCssVendor$Murmur3$c1, k1))))) + 3864292196;
	});
var $rtfeldman$elm_css$ElmCssVendor$Murmur3$hashFold = F2(
	function (c, data) {
		var res = data.aw | ((255 & $elm$core$Char$toCode(c)) << data.aC);
		var _v0 = data.aC;
		if (_v0 === 24) {
			return {
				aq: data.aq + 1,
				aw: 0,
				ag: A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$mix, data.ag, res),
				aC: 0
			};
		} else {
			return {aq: data.aq + 1, aw: res, ag: data.ag, aC: data.aC + 8};
		}
	});
var $rtfeldman$elm_css$ElmCssVendor$Murmur3$hashString = F2(
	function (seed, str) {
		return $rtfeldman$elm_css$ElmCssVendor$Murmur3$finalize(
			A3(
				$elm$core$String$foldl,
				$rtfeldman$elm_css$ElmCssVendor$Murmur3$hashFold,
				A4($rtfeldman$elm_css$ElmCssVendor$Murmur3$HashData, 0, seed, 0, 0),
				str));
	});
var $rtfeldman$elm_css$Hash$murmurSeed = 15739;
var $rtfeldman$elm_hex$Hex$unsafeToDigit = function (num) {
	unsafeToDigit:
	while (true) {
		switch (num) {
			case 0:
				return '0';
			case 1:
				return '1';
			case 2:
				return '2';
			case 3:
				return '3';
			case 4:
				return '4';
			case 5:
				return '5';
			case 6:
				return '6';
			case 7:
				return '7';
			case 8:
				return '8';
			case 9:
				return '9';
			case 10:
				return 'a';
			case 11:
				return 'b';
			case 12:
				return 'c';
			case 13:
				return 'd';
			case 14:
				return 'e';
			case 15:
				return 'f';
			default:
				var $temp$num = num;
				num = $temp$num;
				continue unsafeToDigit;
		}
	}
};
var $rtfeldman$elm_hex$Hex$unsafePositiveToDigits = F2(
	function (digits, num) {
		unsafePositiveToDigits:
		while (true) {
			if (num < 16) {
				return A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(num),
					digits);
			} else {
				var $temp$digits = A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(
						A2($elm$core$Basics$modBy, 16, num)),
					digits),
					$temp$num = (num / 16) | 0;
				digits = $temp$digits;
				num = $temp$num;
				continue unsafePositiveToDigits;
			}
		}
	});
var $rtfeldman$elm_hex$Hex$toString = function (num) {
	return $elm$core$String$fromList(
		(num < 0) ? A2(
			$elm$core$List$cons,
			'-',
			A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, -num)) : A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, num));
};
var $rtfeldman$elm_css$Hash$fromString = function (str) {
	return A2(
		$elm$core$String$cons,
		'_',
		$rtfeldman$elm_hex$Hex$toString(
			A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$hashString, $rtfeldman$elm_css$Hash$murmurSeed, str)));
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$last = function (list) {
	last:
	while (true) {
		if (!list.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!list.b.b) {
				var singleton = list.a;
				return $elm$core$Maybe$Just(singleton);
			} else {
				var rest = list.b;
				var $temp$list = rest;
				list = $temp$list;
				continue last;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$lastDeclaration = function (declarations) {
	lastDeclaration:
	while (true) {
		if (!declarations.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!declarations.b.b) {
				var x = declarations.a;
				return $elm$core$Maybe$Just(
					_List_fromArray(
						[x]));
			} else {
				var xs = declarations.b;
				var $temp$declarations = xs;
				declarations = $temp$declarations;
				continue lastDeclaration;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$oneOf = function (maybes) {
	oneOf:
	while (true) {
		if (!maybes.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var maybe = maybes.a;
			var rest = maybes.b;
			if (maybe.$ === 1) {
				var $temp$maybes = rest;
				maybes = $temp$maybes;
				continue oneOf;
			} else {
				return maybe;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Structure$FontFeatureValues = function (a) {
	return {$: 9, a: a};
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveFontFeatureValues = function (tuples) {
	var expandTuples = function (tuplesToExpand) {
		if (!tuplesToExpand.b) {
			return _List_Nil;
		} else {
			var properties = tuplesToExpand.a;
			var rest = tuplesToExpand.b;
			return A2(
				$elm$core$List$cons,
				properties,
				expandTuples(rest));
		}
	};
	var newTuples = expandTuples(tuples);
	return _List_fromArray(
		[
			$rtfeldman$elm_css$Css$Structure$FontFeatureValues(newTuples)
		]);
};
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $rtfeldman$elm_css$Css$Structure$styleBlockToMediaRule = F2(
	function (mediaQueries, declaration) {
		if (!declaration.$) {
			var styleBlock = declaration.a;
			return A2(
				$rtfeldman$elm_css$Css$Structure$MediaRule,
				mediaQueries,
				_List_fromArray(
					[styleBlock]));
		} else {
			return declaration;
		}
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule = F5(
	function (str1, str2, str3, str4, declaration) {
		if (!declaration.$) {
			var structureStyleBlock = declaration.a;
			return A5($rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4, structureStyleBlock);
		} else {
			return declaration;
		}
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule = F2(
	function (mediaQueries, declaration) {
		switch (declaration.$) {
			case 0:
				var structureStyleBlock = declaration.a;
				return A2(
					$rtfeldman$elm_css$Css$Structure$MediaRule,
					mediaQueries,
					_List_fromArray(
						[structureStyleBlock]));
			case 1:
				var newMediaQueries = declaration.a;
				var structureStyleBlocks = declaration.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$MediaRule,
					_Utils_ap(mediaQueries, newMediaQueries),
					structureStyleBlocks);
			case 2:
				var str = declaration.a;
				var declarations = declaration.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$SupportsRule,
					str,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule(mediaQueries),
						declarations));
			case 3:
				var str1 = declaration.a;
				var str2 = declaration.b;
				var str3 = declaration.c;
				var str4 = declaration.d;
				var structureStyleBlock = declaration.e;
				return A5($rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4, structureStyleBlock);
			case 4:
				return declaration;
			case 5:
				return declaration;
			case 6:
				return declaration;
			case 7:
				return declaration;
			case 8:
				return declaration;
			default:
				return declaration;
		}
	});
var $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet = function (_v0) {
	var declarations = _v0;
	return declarations;
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$applyNestedStylesToLast = F4(
	function (nestedStyles, rest, f, declarations) {
		var withoutParent = function (decls) {
			return A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				$elm$core$List$tail(decls));
		};
		var nextResult = A2(
			$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
			rest,
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				$rtfeldman$elm_css$Css$Preprocess$Resolve$lastDeclaration(declarations)));
		var newDeclarations = function () {
			var _v14 = _Utils_Tuple2(
				$elm$core$List$head(nextResult),
				$rtfeldman$elm_css$Css$Preprocess$Resolve$last(declarations));
			if ((!_v14.a.$) && (!_v14.b.$)) {
				var nextResultParent = _v14.a.a;
				var originalParent = _v14.b.a;
				return _Utils_ap(
					A2(
						$elm$core$List$take,
						$elm$core$List$length(declarations) - 1,
						declarations),
					_List_fromArray(
						[
							(!_Utils_eq(originalParent, nextResultParent)) ? nextResultParent : originalParent
						]));
			} else {
				return declarations;
			}
		}();
		var insertStylesToNestedDecl = function (lastDecl) {
			return $elm$core$List$concat(
				A2(
					$rtfeldman$elm_css$Css$Structure$mapLast,
					$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles(nestedStyles),
					A2(
						$elm$core$List$map,
						$elm$core$List$singleton,
						A2($rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, f, lastDecl))));
		};
		var initialResult = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Maybe$map,
				insertStylesToNestedDecl,
				$rtfeldman$elm_css$Css$Preprocess$Resolve$lastDeclaration(declarations)));
		return _Utils_ap(
			newDeclarations,
			_Utils_ap(
				withoutParent(initialResult),
				withoutParent(nextResult)));
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles = F2(
	function (styles, declarations) {
		if (!styles.b) {
			return declarations;
		} else {
			switch (styles.a.$) {
				case 0:
					var property = styles.a.a;
					var rest = styles.b;
					return A2(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
						rest,
						A2($rtfeldman$elm_css$Css$Structure$appendProperty, property, declarations));
				case 1:
					var _v4 = styles.a;
					var selector = _v4.a;
					var nestedStyles = _v4.b;
					var rest = styles.b;
					return A4(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyNestedStylesToLast,
						nestedStyles,
						rest,
						$rtfeldman$elm_css$Css$Structure$appendRepeatableToLastSelector(selector),
						declarations);
				case 2:
					var _v5 = styles.a;
					var selectorCombinator = _v5.a;
					var snippets = _v5.b;
					var rest = styles.b;
					var chain = F2(
						function (_v9, _v10) {
							var originalSequence = _v9.a;
							var originalTuples = _v9.b;
							var originalPseudoElement = _v9.c;
							var newSequence = _v10.a;
							var newTuples = _v10.b;
							var newPseudoElement = _v10.c;
							return A3(
								$rtfeldman$elm_css$Css$Structure$Selector,
								originalSequence,
								_Utils_ap(
									originalTuples,
									A2(
										$elm$core$List$cons,
										_Utils_Tuple2(selectorCombinator, newSequence),
										newTuples)),
								$rtfeldman$elm_css$Css$Preprocess$Resolve$oneOf(
									_List_fromArray(
										[newPseudoElement, originalPseudoElement])));
						});
					var expandDeclaration = function (declaration) {
						switch (declaration.$) {
							case 0:
								var _v7 = declaration.a;
								var firstSelector = _v7.a;
								var otherSelectors = _v7.b;
								var nestedStyles = _v7.c;
								var newSelectors = A2(
									$elm$core$List$concatMap,
									function (originalSelector) {
										return A2(
											$elm$core$List$map,
											chain(originalSelector),
											A2($elm$core$List$cons, firstSelector, otherSelectors));
									},
									$rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors(declarations));
								var newDeclarations = function () {
									if (!newSelectors.b) {
										return _List_Nil;
									} else {
										var first = newSelectors.a;
										var remainder = newSelectors.b;
										return _List_fromArray(
											[
												$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
												A3($rtfeldman$elm_css$Css$Structure$StyleBlock, first, remainder, _List_Nil))
											]);
									}
								}();
								return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, nestedStyles, newDeclarations);
							case 1:
								var mediaQueries = declaration.a;
								var styleBlocks = declaration.b;
								return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule, mediaQueries, styleBlocks);
							case 2:
								var str = declaration.a;
								var otherSnippets = declaration.b;
								return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule, str, otherSnippets);
							case 3:
								var str1 = declaration.a;
								var str2 = declaration.b;
								var str3 = declaration.c;
								var str4 = declaration.d;
								var styleBlock = declaration.e;
								return A2(
									$elm$core$List$map,
									A4($rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule, str1, str2, str3, str4),
									$rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
							case 4:
								var str = declaration.a;
								var properties = declaration.b;
								return _List_fromArray(
									[
										A2($rtfeldman$elm_css$Css$Structure$PageRule, str, properties)
									]);
							case 5:
								var properties = declaration.a;
								return _List_fromArray(
									[
										$rtfeldman$elm_css$Css$Structure$FontFace(properties)
									]);
							case 6:
								var properties = declaration.a;
								return _List_fromArray(
									[
										$rtfeldman$elm_css$Css$Structure$Viewport(properties)
									]);
							case 7:
								var properties = declaration.a;
								return _List_fromArray(
									[
										$rtfeldman$elm_css$Css$Structure$CounterStyle(properties)
									]);
							default:
								var tuples = declaration.a;
								return $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveFontFeatureValues(tuples);
						}
					};
					return $elm$core$List$concat(
						_Utils_ap(
							_List_fromArray(
								[
									A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, rest, declarations)
								]),
							A2(
								$elm$core$List$map,
								expandDeclaration,
								A2($elm$core$List$concatMap, $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets))));
				case 3:
					var _v11 = styles.a;
					var pseudoElement = _v11.a;
					var nestedStyles = _v11.b;
					var rest = styles.b;
					return A4(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyNestedStylesToLast,
						nestedStyles,
						rest,
						$rtfeldman$elm_css$Css$Structure$appendPseudoElementToLastSelector(pseudoElement),
						declarations);
				case 5:
					var str = styles.a.a;
					var rest = styles.b;
					var name = $rtfeldman$elm_css$Hash$fromString(str);
					var newProperty = 'animation-name:' + name;
					var newDeclarations = A2(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
						rest,
						A2($rtfeldman$elm_css$Css$Structure$appendProperty, newProperty, declarations));
					return A2(
						$elm$core$List$append,
						newDeclarations,
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$Structure$Keyframes(
								{c3: str, ds: name})
							]));
				case 4:
					var _v12 = styles.a;
					var mediaQueries = _v12.a;
					var nestedStyles = _v12.b;
					var rest = styles.b;
					var extraDeclarations = function () {
						var _v13 = $rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors(declarations);
						if (!_v13.b) {
							return _List_Nil;
						} else {
							var firstSelector = _v13.a;
							var otherSelectors = _v13.b;
							return A2(
								$elm$core$List$map,
								$rtfeldman$elm_css$Css$Structure$styleBlockToMediaRule(mediaQueries),
								A2(
									$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
									nestedStyles,
									$elm$core$List$singleton(
										$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
											A3($rtfeldman$elm_css$Css$Structure$StyleBlock, firstSelector, otherSelectors, _List_Nil)))));
						}
					}();
					return _Utils_ap(
						A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, rest, declarations),
						extraDeclarations);
				default:
					var otherStyles = styles.a.a;
					var rest = styles.b;
					return A2(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
						_Utils_ap(otherStyles, rest),
						declarations);
			}
		}
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock = function (_v2) {
	var firstSelector = _v2.a;
	var otherSelectors = _v2.b;
	var styles = _v2.c;
	return A2(
		$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
		styles,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
				A3($rtfeldman$elm_css$Css$Structure$StyleBlock, firstSelector, otherSelectors, _List_Nil))
			]));
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$extract = function (snippetDeclarations) {
	if (!snippetDeclarations.b) {
		return _List_Nil;
	} else {
		var first = snippetDeclarations.a;
		var rest = snippetDeclarations.b;
		return _Utils_ap(
			$rtfeldman$elm_css$Css$Preprocess$Resolve$toDeclarations(first),
			$rtfeldman$elm_css$Css$Preprocess$Resolve$extract(rest));
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule = F2(
	function (mediaQueries, styleBlocks) {
		var handleStyleBlock = function (styleBlock) {
			return A2(
				$elm$core$List$map,
				$rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule(mediaQueries),
				$rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
		};
		return A2($elm$core$List$concatMap, handleStyleBlock, styleBlocks);
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule = F2(
	function (str, snippets) {
		var declarations = $rtfeldman$elm_css$Css$Preprocess$Resolve$extract(
			A2($elm$core$List$concatMap, $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets));
		return _List_fromArray(
			[
				A2($rtfeldman$elm_css$Css$Structure$SupportsRule, str, declarations)
			]);
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toDeclarations = function (snippetDeclaration) {
	switch (snippetDeclaration.$) {
		case 0:
			var styleBlock = snippetDeclaration.a;
			return $rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock);
		case 1:
			var mediaQueries = snippetDeclaration.a;
			var styleBlocks = snippetDeclaration.b;
			return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule, mediaQueries, styleBlocks);
		case 2:
			var str = snippetDeclaration.a;
			var snippets = snippetDeclaration.b;
			return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule, str, snippets);
		case 3:
			var str1 = snippetDeclaration.a;
			var str2 = snippetDeclaration.b;
			var str3 = snippetDeclaration.c;
			var str4 = snippetDeclaration.d;
			var styleBlock = snippetDeclaration.e;
			return A2(
				$elm$core$List$map,
				A4($rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule, str1, str2, str3, str4),
				$rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
		case 4:
			var str = snippetDeclaration.a;
			var properties = snippetDeclaration.b;
			return _List_fromArray(
				[
					A2($rtfeldman$elm_css$Css$Structure$PageRule, str, properties)
				]);
		case 5:
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$FontFace(properties)
				]);
		case 6:
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$Viewport(properties)
				]);
		case 7:
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$CounterStyle(properties)
				]);
		default:
			var tuples = snippetDeclaration.a;
			return $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveFontFeatureValues(tuples);
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toStructure = function (_v0) {
	var charset = _v0.b$;
	var imports = _v0.cg;
	var namespaces = _v0.cp;
	var snippets = _v0.cH;
	var declarations = $rtfeldman$elm_css$Css$Preprocess$Resolve$extract(
		A2($elm$core$List$concatMap, $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets));
	return {b$: charset, c4: declarations, cg: imports, cp: namespaces};
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$compileHelp = function (sheet) {
	return $rtfeldman$elm_css$Css$Structure$Output$prettyPrint(
		$rtfeldman$elm_css$Css$Structure$compactStylesheet(
			$rtfeldman$elm_css$Css$Preprocess$Resolve$toStructure(sheet)));
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$compile = function (styles) {
	return A2(
		$elm$core$String$join,
		'\n\n',
		A2($elm$core$List$map, $rtfeldman$elm_css$Css$Preprocess$Resolve$compileHelp, styles));
};
var $rtfeldman$elm_css$Css$Preprocess$Snippet = $elm$core$Basics$identity;
var $rtfeldman$elm_css$Css$Preprocess$StyleBlock = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$Css$Preprocess$StyleBlockDeclaration = function (a) {
	return {$: 0, a: a};
};
var $rtfeldman$elm_css$VirtualDom$Styled$makeSnippet = F2(
	function (styles, sequence) {
		var selector = A3($rtfeldman$elm_css$Css$Structure$Selector, sequence, _List_Nil, $elm$core$Maybe$Nothing);
		return _List_fromArray(
			[
				$rtfeldman$elm_css$Css$Preprocess$StyleBlockDeclaration(
				A3($rtfeldman$elm_css$Css$Preprocess$StyleBlock, selector, _List_Nil, styles))
			]);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$murmurSeed = 15739;
var $rtfeldman$elm_css$Css$Preprocess$stylesheet = function (snippets) {
	return {b$: $elm$core$Maybe$Nothing, cg: _List_Nil, cp: _List_Nil, cH: snippets};
};
var $rtfeldman$elm_css$VirtualDom$Styled$getClassname = function (styles) {
	return $elm$core$List$isEmpty(styles) ? 'unstyled' : A2(
		$elm$core$String$cons,
		'_',
		$rtfeldman$elm_hex$Hex$toString(
			A2(
				$rtfeldman$elm_css$ElmCssVendor$Murmur3$hashString,
				$rtfeldman$elm_css$VirtualDom$Styled$murmurSeed,
				$rtfeldman$elm_css$Css$Preprocess$Resolve$compile(
					$elm$core$List$singleton(
						$rtfeldman$elm_css$Css$Preprocess$stylesheet(
							$elm$core$List$singleton(
								A2(
									$rtfeldman$elm_css$VirtualDom$Styled$makeSnippet,
									styles,
									$rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(_List_Nil)))))))));
};
var $elm$virtual_dom$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $rtfeldman$elm_css$Html$Styled$Internal$css = function (styles) {
	var classname = $rtfeldman$elm_css$VirtualDom$Styled$getClassname(styles);
	var classProperty = A2(
		$elm$virtual_dom$VirtualDom$property,
		'className',
		$elm$json$Json$Encode$string(classname));
	return A3($rtfeldman$elm_css$VirtualDom$Styled$Attribute, classProperty, styles, classname);
};
var $rtfeldman$elm_css$Html$Styled$Attributes$css = $rtfeldman$elm_css$Html$Styled$Internal$css;
var $rtfeldman$elm_css$VirtualDom$Styled$Node = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$VirtualDom$Styled$node = $rtfeldman$elm_css$VirtualDom$Styled$Node;
var $rtfeldman$elm_css$Html$Styled$node = $rtfeldman$elm_css$VirtualDom$Styled$node;
var $rtfeldman$elm_css$Html$Styled$div = $rtfeldman$elm_css$Html$Styled$node('div');
var $rtfeldman$elm_css$Html$Styled$h1 = $rtfeldman$elm_css$Html$Styled$node('h1');
var $rtfeldman$elm_css$Css$Preprocess$ApplyStyles = function (a) {
	return {$: 6, a: a};
};
var $rtfeldman$elm_css$Css$Internal$property = F2(
	function (key, value) {
		return $rtfeldman$elm_css$Css$Preprocess$AppendProperty(key + (':' + value));
	});
var $rtfeldman$elm_css$Css$Internal$getOverloadedProperty = F3(
	function (functionName, desiredKey, style) {
		getOverloadedProperty:
		while (true) {
			switch (style.$) {
				case 0:
					var str = style.a;
					var key = A2(
						$elm$core$Maybe$withDefault,
						'',
						$elm$core$List$head(
							A2($elm$core$String$split, ':', str)));
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, key);
				case 1:
					var selector = style.a;
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-selector'));
				case 2:
					var combinator = style.a;
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-combinator'));
				case 3:
					var pseudoElement = style.a;
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-pseudo-element setter'));
				case 4:
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-media-query'));
				case 5:
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-keyframes'));
				default:
					if (!style.a.b) {
						return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-empty-Style'));
					} else {
						if (!style.a.b.b) {
							var _v1 = style.a;
							var only = _v1.a;
							var $temp$functionName = functionName,
								$temp$desiredKey = desiredKey,
								$temp$style = only;
							functionName = $temp$functionName;
							desiredKey = $temp$desiredKey;
							style = $temp$style;
							continue getOverloadedProperty;
						} else {
							var _v2 = style.a;
							var first = _v2.a;
							var rest = _v2.b;
							var $temp$functionName = functionName,
								$temp$desiredKey = desiredKey,
								$temp$style = $rtfeldman$elm_css$Css$Preprocess$ApplyStyles(rest);
							functionName = $temp$functionName;
							desiredKey = $temp$desiredKey;
							style = $temp$style;
							continue getOverloadedProperty;
						}
					}
			}
		}
	});
var $rtfeldman$elm_css$Css$Internal$IncompatibleUnits = 0;
var $rtfeldman$elm_css$Css$Structure$Compatible = 0;
var $elm$core$String$fromFloat = _String_fromNumber;
var $rtfeldman$elm_css$Css$Internal$lengthConverter = F3(
	function (units, unitLabel, numericValue) {
		return {
			bQ: 0,
			bZ: 0,
			at: 0,
			q: 0,
			aN: 0,
			ax: 0,
			S: 0,
			ay: 0,
			az: 0,
			ab: 0,
			ac: 0,
			I: 0,
			U: numericValue,
			aF: 0,
			aH: unitLabel,
			aW: units,
			L: _Utils_ap(
				$elm$core$String$fromFloat(numericValue),
				unitLabel)
		};
	});
var $rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty = A3($rtfeldman$elm_css$Css$Internal$lengthConverter, 0, '', 0);
var $rtfeldman$elm_css$Css$alignItems = function (fn) {
	return A3(
		$rtfeldman$elm_css$Css$Internal$getOverloadedProperty,
		'alignItems',
		'align-items',
		fn($rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty));
};
var $rtfeldman$elm_css$Css$row = {bv: 0, aL: 0, L: 'row'};
var $rtfeldman$elm_css$Css$column = _Utils_update(
	$rtfeldman$elm_css$Css$row,
	{L: 'column'});
var $rtfeldman$elm_css$Css$displayFlex = A2($rtfeldman$elm_css$Css$property, 'display', 'flex');
var $rtfeldman$elm_css$Css$flexDirection = $rtfeldman$elm_css$Css$prop1('flex-direction');
var $rtfeldman$elm_css$Css$Structure$Child = 2;
var $rtfeldman$elm_css$Css$Preprocess$NestSnippet = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Global$children = $rtfeldman$elm_css$Css$Preprocess$NestSnippet(2);
var $rtfeldman$elm_css$Css$Global$everything = function (styles) {
	return A2(
		$rtfeldman$elm_css$VirtualDom$Styled$makeSnippet,
		styles,
		$rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(_List_Nil));
};
var $rtfeldman$elm_css$Css$flexGrow = $rtfeldman$elm_css$Css$prop1('flex-grow');
var $rtfeldman$elm_css$Css$flexShrink = $rtfeldman$elm_css$Css$prop1('flex-shrink');
var $rtfeldman$elm_css$Html$Styled$form = $rtfeldman$elm_css$Html$Styled$node('form');
var $rtfeldman$elm_css$Css$UnitlessInteger = 0;
var $rtfeldman$elm_css$Css$int = function (val) {
	return {
		R: 0,
		a6: 0,
		ac: 0,
		I: 0,
		dt: 0,
		a9: 0,
		U: val,
		aH: '',
		aW: 0,
		L: $elm$core$String$fromInt(val)
	};
};
var $rtfeldman$elm_css$Css$marginBottom = $rtfeldman$elm_css$Css$prop1('margin-bottom');
var $rtfeldman$elm_css$Css$marginRight = $rtfeldman$elm_css$Css$prop1('margin-right');
var $rtfeldman$elm_css$Css$maxWidth = $rtfeldman$elm_css$Css$prop1('max-width');
var $rtfeldman$elm_css$Css$PercentageUnits = 0;
var $rtfeldman$elm_css$Css$pct = A2($rtfeldman$elm_css$Css$Internal$lengthConverter, 0, '%');
var $rtfeldman$elm_css$Css$PxUnits = 0;
var $rtfeldman$elm_css$Css$px = A2($rtfeldman$elm_css$Css$Internal$lengthConverter, 0, 'px');
var $author$project$State$ChangeErrorCorrection = function (a) {
	return {$: 1, a: a};
};
var $pablohirafuji$elm_qrcode$QRCode$High = 3;
var $pablohirafuji$elm_qrcode$QRCode$Low = 0;
var $pablohirafuji$elm_qrcode$QRCode$Medium = 1;
var $author$project$Views$ErrorCorrectionView$errorCorrectionValueToType = function (val) {
	switch (val) {
		case 'low':
			return 0;
		case 'medium':
			return 1;
		case 'quartile':
			return 2;
		case 'high':
			return 3;
		default:
			return 2;
	}
};
var $rtfeldman$elm_css$Html$Styled$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $rtfeldman$elm_css$VirtualDom$Styled$on = F2(
	function (eventName, handler) {
		return A3(
			$rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$on, eventName, handler),
			_List_Nil,
			'');
	});
var $rtfeldman$elm_css$Html$Styled$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $rtfeldman$elm_css$Html$Styled$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $rtfeldman$elm_css$Html$Styled$Events$onInput = function (tagger) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$rtfeldman$elm_css$Html$Styled$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $rtfeldman$elm_css$Html$Styled$Events$targetValue)));
};
var $rtfeldman$elm_css$Html$Styled$option = $rtfeldman$elm_css$Html$Styled$node('option');
var $rtfeldman$elm_css$Html$Styled$select = $rtfeldman$elm_css$Html$Styled$node('select');
var $elm$json$Json$Encode$bool = _Json_wrap;
var $rtfeldman$elm_css$VirtualDom$Styled$property = F2(
	function (key, value) {
		return A3(
			$rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$property, key, value),
			_List_Nil,
			'');
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$selected = $rtfeldman$elm_css$Html$Styled$Attributes$boolProperty('selected');
var $rtfeldman$elm_css$Css$backgroundColor = function (c) {
	return A2($rtfeldman$elm_css$Css$property, 'background-color', c.L);
};
var $rtfeldman$elm_css$Css$prop2 = F3(
	function (key, argA, argB) {
		return A2(
			$rtfeldman$elm_css$Css$property,
			key,
			A2(
				$elm$core$String$join,
				' ',
				_List_fromArray(
					[argA.L, argB.L])));
	});
var $rtfeldman$elm_css$Css$border2 = $rtfeldman$elm_css$Css$prop2('border');
var $rtfeldman$elm_css$Css$borderColor = function (c) {
	return A2($rtfeldman$elm_css$Css$property, 'border-color', c.L);
};
var $rtfeldman$elm_css$Css$borderRadius = $rtfeldman$elm_css$Css$prop1('border-radius');
var $rtfeldman$elm_css$Css$withPrecedingHash = function (str) {
	return A2($elm$core$String$startsWith, '#', str) ? str : A2($elm$core$String$cons, '#', str);
};
var $rtfeldman$elm_css$Css$erroneousHex = function (str) {
	return {
		an: 1,
		bp: 0,
		a1: 0,
		bx: 0,
		bH: 0,
		L: $rtfeldman$elm_css$Css$withPrecedingHash(str)
	};
};
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $rtfeldman$elm_hex$Hex$fromStringHelp = F3(
	function (position, chars, accumulated) {
		fromStringHelp:
		while (true) {
			if (!chars.b) {
				return $elm$core$Result$Ok(accumulated);
			} else {
				var _char = chars.a;
				var rest = chars.b;
				switch (_char) {
					case '0':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated;
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '1':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + A2($elm$core$Basics$pow, 16, position);
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '2':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (2 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '3':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (3 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '4':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (4 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '5':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (5 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '6':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (6 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '7':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (7 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '8':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (8 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '9':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (9 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'a':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (10 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'b':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (11 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'c':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (12 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'd':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (13 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'e':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (14 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'f':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (15 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					default:
						var nonHex = _char;
						return $elm$core$Result$Err(
							$elm$core$String$fromChar(nonHex) + ' is not a valid hexadecimal character.');
				}
			}
		}
	});
var $rtfeldman$elm_hex$Hex$fromString = function (str) {
	if ($elm$core$String$isEmpty(str)) {
		return $elm$core$Result$Err('Empty strings are not valid hexadecimal strings.');
	} else {
		var result = function () {
			if (A2($elm$core$String$startsWith, '-', str)) {
				var list = A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					$elm$core$List$tail(
						$elm$core$String$toList(str)));
				return A2(
					$elm$core$Result$map,
					$elm$core$Basics$negate,
					A3(
						$rtfeldman$elm_hex$Hex$fromStringHelp,
						$elm$core$List$length(list) - 1,
						list,
						0));
			} else {
				return A3(
					$rtfeldman$elm_hex$Hex$fromStringHelp,
					$elm$core$String$length(str) - 1,
					$elm$core$String$toList(str),
					0);
			}
		}();
		var formatError = function (err) {
			return A2(
				$elm$core$String$join,
				' ',
				_List_fromArray(
					['\"' + (str + '\"'), 'is not a valid hexadecimal string because', err]));
		};
		return A2($elm$core$Result$mapError, formatError, result);
	}
};
var $elm$core$String$toLower = _String_toLower;
var $rtfeldman$elm_css$Css$validHex = F5(
	function (str, _v0, _v1, _v2, _v3) {
		var r1 = _v0.a;
		var r2 = _v0.b;
		var g1 = _v1.a;
		var g2 = _v1.b;
		var b1 = _v2.a;
		var b2 = _v2.b;
		var a1 = _v3.a;
		var a2 = _v3.b;
		var toResult = A2(
			$elm$core$Basics$composeR,
			$elm$core$String$fromList,
			A2($elm$core$Basics$composeR, $elm$core$String$toLower, $rtfeldman$elm_hex$Hex$fromString));
		var results = _Utils_Tuple2(
			_Utils_Tuple2(
				toResult(
					_List_fromArray(
						[r1, r2])),
				toResult(
					_List_fromArray(
						[g1, g2]))),
			_Utils_Tuple2(
				toResult(
					_List_fromArray(
						[b1, b2])),
				toResult(
					_List_fromArray(
						[a1, a2]))));
		if ((((!results.a.a.$) && (!results.a.b.$)) && (!results.b.a.$)) && (!results.b.b.$)) {
			var _v5 = results.a;
			var red = _v5.a.a;
			var green = _v5.b.a;
			var _v6 = results.b;
			var blue = _v6.a.a;
			var alpha = _v6.b.a;
			return {
				an: alpha / 255,
				bp: blue,
				a1: 0,
				bx: green,
				bH: red,
				L: $rtfeldman$elm_css$Css$withPrecedingHash(str)
			};
		} else {
			return $rtfeldman$elm_css$Css$erroneousHex(str);
		}
	});
var $rtfeldman$elm_css$Css$hex = function (str) {
	var withoutHash = A2($elm$core$String$startsWith, '#', str) ? A2($elm$core$String$dropLeft, 1, str) : str;
	var _v0 = $elm$core$String$toList(withoutHash);
	_v0$4:
	while (true) {
		if ((_v0.b && _v0.b.b) && _v0.b.b.b) {
			if (!_v0.b.b.b.b) {
				var r = _v0.a;
				var _v1 = _v0.b;
				var g = _v1.a;
				var _v2 = _v1.b;
				var b = _v2.a;
				return A5(
					$rtfeldman$elm_css$Css$validHex,
					str,
					_Utils_Tuple2(r, r),
					_Utils_Tuple2(g, g),
					_Utils_Tuple2(b, b),
					_Utils_Tuple2('f', 'f'));
			} else {
				if (!_v0.b.b.b.b.b) {
					var r = _v0.a;
					var _v3 = _v0.b;
					var g = _v3.a;
					var _v4 = _v3.b;
					var b = _v4.a;
					var _v5 = _v4.b;
					var a = _v5.a;
					return A5(
						$rtfeldman$elm_css$Css$validHex,
						str,
						_Utils_Tuple2(r, r),
						_Utils_Tuple2(g, g),
						_Utils_Tuple2(b, b),
						_Utils_Tuple2(a, a));
				} else {
					if (_v0.b.b.b.b.b.b) {
						if (!_v0.b.b.b.b.b.b.b) {
							var r1 = _v0.a;
							var _v6 = _v0.b;
							var r2 = _v6.a;
							var _v7 = _v6.b;
							var g1 = _v7.a;
							var _v8 = _v7.b;
							var g2 = _v8.a;
							var _v9 = _v8.b;
							var b1 = _v9.a;
							var _v10 = _v9.b;
							var b2 = _v10.a;
							return A5(
								$rtfeldman$elm_css$Css$validHex,
								str,
								_Utils_Tuple2(r1, r2),
								_Utils_Tuple2(g1, g2),
								_Utils_Tuple2(b1, b2),
								_Utils_Tuple2('f', 'f'));
						} else {
							if (_v0.b.b.b.b.b.b.b.b && (!_v0.b.b.b.b.b.b.b.b.b)) {
								var r1 = _v0.a;
								var _v11 = _v0.b;
								var r2 = _v11.a;
								var _v12 = _v11.b;
								var g1 = _v12.a;
								var _v13 = _v12.b;
								var g2 = _v13.a;
								var _v14 = _v13.b;
								var b1 = _v14.a;
								var _v15 = _v14.b;
								var b2 = _v15.a;
								var _v16 = _v15.b;
								var a1 = _v16.a;
								var _v17 = _v16.b;
								var a2 = _v17.a;
								return A5(
									$rtfeldman$elm_css$Css$validHex,
									str,
									_Utils_Tuple2(r1, r2),
									_Utils_Tuple2(g1, g2),
									_Utils_Tuple2(b1, b2),
									_Utils_Tuple2(a1, a2));
							} else {
								break _v0$4;
							}
						}
					} else {
						break _v0$4;
					}
				}
			}
		} else {
			break _v0$4;
		}
	}
	return $rtfeldman$elm_css$Css$erroneousHex(str);
};
var $rtfeldman$elm_css$Css$padding = $rtfeldman$elm_css$Css$prop1('padding');
var $rtfeldman$elm_css$Css$solid = {s: 0, ak: 0, L: 'solid'};
var $rtfeldman$elm_css$Html$Styled$styled = F4(
	function (fn, styles, attrs, children) {
		return A2(
			fn,
			A2(
				$elm$core$List$cons,
				$rtfeldman$elm_css$Html$Styled$Internal$css(styles),
				attrs),
			children);
	});
var $author$project$Views$PrimitiveComponents$styledGroup = A2(
	$rtfeldman$elm_css$Html$Styled$styled,
	$rtfeldman$elm_css$Html$Styled$div,
	_List_fromArray(
		[
			$rtfeldman$elm_css$Css$backgroundColor(
			$rtfeldman$elm_css$Css$hex('fff')),
			$rtfeldman$elm_css$Css$padding(
			$rtfeldman$elm_css$Css$px(12)),
			A2(
			$rtfeldman$elm_css$Css$border2,
			$rtfeldman$elm_css$Css$px(1),
			$rtfeldman$elm_css$Css$solid),
			$rtfeldman$elm_css$Css$borderColor(
			$rtfeldman$elm_css$Css$hex('eee')),
			$rtfeldman$elm_css$Css$borderRadius(
			$rtfeldman$elm_css$Css$px(4))
		]));
var $rtfeldman$elm_css$VirtualDom$Styled$Unstyled = function (a) {
	return {$: 4, a: a};
};
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $rtfeldman$elm_css$VirtualDom$Styled$text = function (str) {
	return $rtfeldman$elm_css$VirtualDom$Styled$Unstyled(
		$elm$virtual_dom$VirtualDom$text(str));
};
var $rtfeldman$elm_css$Html$Styled$text = $rtfeldman$elm_css$VirtualDom$Styled$text;
var $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$value = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('value');
var $rtfeldman$elm_css$Css$block = {h: 0, L: 'block'};
var $rtfeldman$elm_css$Css$display = $rtfeldman$elm_css$Css$prop1('display');
var $rtfeldman$elm_css$Html$Styled$label = $rtfeldman$elm_css$Html$Styled$node('label');
var $rtfeldman$elm_css$Html$Styled$span = $rtfeldman$elm_css$Html$Styled$node('span');
var $author$project$Views$PrimitiveComponents$withLabel = F3(
	function (label, attrs, element) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$label,
			attrs,
			_List_fromArray(
				[
					A2(
					$rtfeldman$elm_css$Html$Styled$span,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$css(
							_List_fromArray(
								[
									$rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$block),
									$rtfeldman$elm_css$Css$marginBottom(
									$rtfeldman$elm_css$Css$px(6))
								]))
						]),
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text(label)
						])),
					element
				]));
	});
var $author$project$Views$ErrorCorrectionView$qrErrorCorrectionSelect = function (model) {
	return A2(
		$author$project$Views$PrimitiveComponents$styledGroup,
		_List_Nil,
		_List_fromArray(
			[
				A3(
				$author$project$Views$PrimitiveComponents$withLabel,
				'Error correction',
				_List_Nil,
				A2(
					$rtfeldman$elm_css$Html$Styled$select,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Events$onInput(
							A2($elm$core$Basics$composeL, $author$project$State$ChangeErrorCorrection, $author$project$Views$ErrorCorrectionView$errorCorrectionValueToType))
						]),
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$option,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$Attributes$value('low'),
									$rtfeldman$elm_css$Html$Styled$Attributes$selected(!model.da)
								]),
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Low (7% redundancy)')
								])),
							A2(
							$rtfeldman$elm_css$Html$Styled$option,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$Attributes$value('medium'),
									$rtfeldman$elm_css$Html$Styled$Attributes$selected(model.da === 1)
								]),
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Medium (15% redundancy)')
								])),
							A2(
							$rtfeldman$elm_css$Html$Styled$option,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$Attributes$value('quartile'),
									$rtfeldman$elm_css$Html$Styled$Attributes$selected(model.da === 2)
								]),
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Quartile (25% redundancy)')
								])),
							A2(
							$rtfeldman$elm_css$Html$Styled$option,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$Attributes$value('high'),
									$rtfeldman$elm_css$Html$Styled$Attributes$selected(model.da === 3)
								]),
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('High (30% redundancy)')
								]))
						])))
			]));
};
var $author$project$QRTypes$Bitcoin = 0;
var $author$project$QRTypes$BitcoinCash = 1;
var $author$project$State$ChangeQRType = function (a) {
	return {$: 0, a: a};
};
var $author$project$QRTypes$Ethereum = 2;
var $author$project$QRTypes$Litecoin = 3;
var $author$project$State$NoOp = {$: 3};
var $author$project$QRTypes$QRCrypto = F4(
	function (a, b, c, d) {
		return {$: 7, a: a, b: b, c: c, d: d};
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$checked = $rtfeldman$elm_css$Html$Styled$Attributes$boolProperty('checked');
var $rtfeldman$elm_css$Html$Styled$input = $rtfeldman$elm_css$Html$Styled$node('input');
var $author$project$Views$QRTypeOptionsView$inputSpacingStyles = $rtfeldman$elm_css$Html$Styled$Attributes$css(
	_List_fromArray(
		[
			$rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$block),
			$rtfeldman$elm_css$Css$marginBottom(
			$rtfeldman$elm_css$Css$px(12))
		]));
var $rtfeldman$elm_css$Html$Styled$Attributes$name = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('name');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $rtfeldman$elm_css$Html$Styled$Events$on = F2(
	function (event, decoder) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $rtfeldman$elm_css$Html$Styled$Events$targetChecked = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'checked']),
	$elm$json$Json$Decode$bool);
var $rtfeldman$elm_css$Html$Styled$Events$onCheck = function (tagger) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$Events$on,
		'change',
		A2($elm$json$Json$Decode$map, tagger, $rtfeldman$elm_css$Html$Styled$Events$targetChecked));
};
var $rtfeldman$elm_css$Html$Styled$Attributes$type_ = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('type');
var $author$project$Views$QRTypeOptionsView$cryptoOptions = F4(
	function (currency, address, amount, message) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_Nil,
			_List_fromArray(
				[
					A3(
					$author$project$Views$PrimitiveComponents$withLabel,
					'Crypto currency',
					_List_fromArray(
						[$author$project$Views$QRTypeOptionsView$inputSpacingStyles]),
					A2(
						$rtfeldman$elm_css$Html$Styled$div,
						_List_Nil,
						A2(
							$elm$core$List$map,
							function (_v0) {
								var value = _v0.a;
								var label = _v0.b;
								var currency_ = _v0.c;
								return A2(
									$rtfeldman$elm_css$Html$Styled$label,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$rtfeldman$elm_css$Html$Styled$input,
											_List_fromArray(
												[
													$rtfeldman$elm_css$Html$Styled$Attributes$type_('radio'),
													$rtfeldman$elm_css$Html$Styled$Attributes$name('crypto_currency'),
													$rtfeldman$elm_css$Html$Styled$Attributes$value(value),
													$rtfeldman$elm_css$Html$Styled$Attributes$checked(
													_Utils_eq(currency, currency_)),
													$rtfeldman$elm_css$Html$Styled$Events$onCheck(
													function (selected) {
														return selected ? $author$project$State$ChangeQRType(
															A4($author$project$QRTypes$QRCrypto, currency_, address, amount, message)) : $author$project$State$NoOp;
													})
												]),
											_List_Nil),
											$rtfeldman$elm_css$Html$Styled$text(label)
										]));
							},
							_List_fromArray(
								[
									_Utils_Tuple3('bitcoin', 'Bitcoin', 0),
									_Utils_Tuple3('bitcoin-cash', 'Bitcoin Cash', 1),
									_Utils_Tuple3('ethereum', 'Ethereum', 2),
									_Utils_Tuple3('litecoin', 'Litecoin', 3)
								])))),
					A3(
					$author$project$Views$PrimitiveComponents$withLabel,
					'Receiver address',
					_List_fromArray(
						[$author$project$Views$QRTypeOptionsView$inputSpacingStyles]),
					A2(
						$rtfeldman$elm_css$Html$Styled$input,
						_List_fromArray(
							[
								$rtfeldman$elm_css$Html$Styled$Events$onInput(
								A2(
									$elm$core$Basics$composeL,
									$author$project$State$ChangeQRType,
									function (val) {
										return A4($author$project$QRTypes$QRCrypto, currency, val, amount, message);
									})),
								$rtfeldman$elm_css$Html$Styled$Attributes$value(address),
								$rtfeldman$elm_css$Html$Styled$Attributes$type_('text')
							]),
						_List_Nil)),
					A3(
					$author$project$Views$PrimitiveComponents$withLabel,
					'Amount',
					_List_Nil,
					A2(
						$rtfeldman$elm_css$Html$Styled$input,
						_List_fromArray(
							[
								$rtfeldman$elm_css$Html$Styled$Events$onInput(
								A2(
									$elm$core$Basics$composeL,
									$author$project$State$ChangeQRType,
									function (val) {
										return A4($author$project$QRTypes$QRCrypto, currency, address, val, message);
									})),
								$rtfeldman$elm_css$Html$Styled$Attributes$value(amount),
								$rtfeldman$elm_css$Html$Styled$Attributes$type_('text')
							]),
						_List_Nil))
				]));
	});
var $author$project$QRTypes$QREmail = F3(
	function (a, b, c) {
		return {$: 2, a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$Css$height = $rtfeldman$elm_css$Css$prop1('height');
var $rtfeldman$elm_css$Html$Styled$Attributes$placeholder = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('placeholder');
var $rtfeldman$elm_css$Html$Styled$Attributes$spellcheck = $rtfeldman$elm_css$Html$Styled$Attributes$boolProperty('spellcheck');
var $rtfeldman$elm_css$Html$Styled$textarea = $rtfeldman$elm_css$Html$Styled$node('textarea');
var $rtfeldman$elm_css$Css$width = $rtfeldman$elm_css$Css$prop1('width');
var $author$project$Views$QRTypeOptionsView$emailOptions = F3(
	function (address, subject, body) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_Nil,
			_List_fromArray(
				[
					A3(
					$author$project$Views$PrimitiveComponents$withLabel,
					'Email address',
					_List_fromArray(
						[$author$project$Views$QRTypeOptionsView$inputSpacingStyles]),
					A2(
						$rtfeldman$elm_css$Html$Styled$input,
						_List_fromArray(
							[
								$rtfeldman$elm_css$Html$Styled$Events$onInput(
								A2(
									$elm$core$Basics$composeL,
									$author$project$State$ChangeQRType,
									function (val) {
										return A3($author$project$QRTypes$QREmail, val, subject, body);
									})),
								$rtfeldman$elm_css$Html$Styled$Attributes$type_('email'),
								$rtfeldman$elm_css$Html$Styled$Attributes$value(address),
								$rtfeldman$elm_css$Html$Styled$Attributes$placeholder('name@example.com')
							]),
						_List_Nil)),
					A3(
					$author$project$Views$PrimitiveComponents$withLabel,
					'Subject',
					_List_fromArray(
						[$author$project$Views$QRTypeOptionsView$inputSpacingStyles]),
					A2(
						$rtfeldman$elm_css$Html$Styled$input,
						_List_fromArray(
							[
								$rtfeldman$elm_css$Html$Styled$Events$onInput(
								A2(
									$elm$core$Basics$composeL,
									$author$project$State$ChangeQRType,
									function (val) {
										return A3($author$project$QRTypes$QREmail, address, val, body);
									})),
								$rtfeldman$elm_css$Html$Styled$Attributes$type_('text'),
								$rtfeldman$elm_css$Html$Styled$Attributes$value(subject)
							]),
						_List_Nil)),
					A3(
					$author$project$Views$PrimitiveComponents$withLabel,
					'Message',
					_List_Nil,
					A2(
						$rtfeldman$elm_css$Html$Styled$textarea,
						_List_fromArray(
							[
								$rtfeldman$elm_css$Html$Styled$Events$onInput(
								A2(
									$elm$core$Basics$composeL,
									$author$project$State$ChangeQRType,
									function (val) {
										return A3($author$project$QRTypes$QREmail, address, subject, val);
									})),
								$rtfeldman$elm_css$Html$Styled$Attributes$spellcheck(true),
								$rtfeldman$elm_css$Html$Styled$Attributes$css(
								_List_fromArray(
									[
										$rtfeldman$elm_css$Css$width(
										$rtfeldman$elm_css$Css$pct(100)),
										$rtfeldman$elm_css$Css$height(
										$rtfeldman$elm_css$Css$px(100)),
										$rtfeldman$elm_css$Css$maxWidth(
										$rtfeldman$elm_css$Css$pct(100))
									]))
							]),
						_List_fromArray(
							[
								$rtfeldman$elm_css$Html$Styled$text(body)
							])))
				]));
	});
var $author$project$QRTypes$QRPhone = function (a) {
	return {$: 4, a: a};
};
var $author$project$Views$QRTypeOptionsView$phoneOptions = function (number) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_Nil,
		_List_fromArray(
			[
				A3(
				$author$project$Views$PrimitiveComponents$withLabel,
				'Number',
				_List_Nil,
				A2(
					$rtfeldman$elm_css$Html$Styled$input,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Events$onInput(
							A2($elm$core$Basics$composeL, $author$project$State$ChangeQRType, $author$project$QRTypes$QRPhone)),
							$rtfeldman$elm_css$Html$Styled$Attributes$value(number),
							$rtfeldman$elm_css$Html$Styled$Attributes$type_('tel')
						]),
					_List_Nil))
			]));
};
var $author$project$QRTypes$QRSms = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $author$project$Views$QRTypeOptionsView$smsOptions = F2(
	function (number, message) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_Nil,
			_List_fromArray(
				[
					A3(
					$author$project$Views$PrimitiveComponents$withLabel,
					'Number',
					_List_fromArray(
						[$author$project$Views$QRTypeOptionsView$inputSpacingStyles]),
					A2(
						$rtfeldman$elm_css$Html$Styled$input,
						_List_fromArray(
							[
								$rtfeldman$elm_css$Html$Styled$Events$onInput(
								A2(
									$elm$core$Basics$composeL,
									$author$project$State$ChangeQRType,
									function (val) {
										return A2($author$project$QRTypes$QRSms, val, message);
									})),
								$rtfeldman$elm_css$Html$Styled$Attributes$value(number),
								$rtfeldman$elm_css$Html$Styled$Attributes$type_('tel')
							]),
						_List_Nil)),
					A3(
					$author$project$Views$PrimitiveComponents$withLabel,
					'Message',
					_List_Nil,
					A2(
						$rtfeldman$elm_css$Html$Styled$textarea,
						_List_fromArray(
							[
								$rtfeldman$elm_css$Html$Styled$Events$onInput(
								A2(
									$elm$core$Basics$composeL,
									$author$project$State$ChangeQRType,
									function (val) {
										return A2($author$project$QRTypes$QRSms, number, val);
									})),
								$rtfeldman$elm_css$Html$Styled$Attributes$spellcheck(true),
								$rtfeldman$elm_css$Html$Styled$Attributes$css(
								_List_fromArray(
									[
										$rtfeldman$elm_css$Css$width(
										$rtfeldman$elm_css$Css$pct(100)),
										$rtfeldman$elm_css$Css$height(
										$rtfeldman$elm_css$Css$px(100)),
										$rtfeldman$elm_css$Css$maxWidth(
										$rtfeldman$elm_css$Css$pct(100))
									]))
							]),
						_List_fromArray(
							[
								$rtfeldman$elm_css$Html$Styled$text(message)
							])))
				]));
	});
var $author$project$Views$QRTypeOptionsView$textOptions = function (value) {
	return A3(
		$author$project$Views$PrimitiveComponents$withLabel,
		'Text',
		_List_Nil,
		A2(
			$rtfeldman$elm_css$Html$Styled$textarea,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Events$onInput(
					A2($elm$core$Basics$composeL, $author$project$State$ChangeQRType, $author$project$QRTypes$QRText)),
					$rtfeldman$elm_css$Html$Styled$Attributes$spellcheck(true),
					$rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							$rtfeldman$elm_css$Css$width(
							$rtfeldman$elm_css$Css$pct(100)),
							$rtfeldman$elm_css$Css$height(
							$rtfeldman$elm_css$Css$px(100)),
							$rtfeldman$elm_css$Css$maxWidth(
							$rtfeldman$elm_css$Css$pct(100))
						]))
				]),
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$text(value)
				])));
};
var $author$project$QRTypes$QRTweet = function (a) {
	return {$: 6, a: a};
};
var $author$project$Views$QRTypeOptionsView$tweetOptions = function (message) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_Nil,
		_List_fromArray(
			[
				A3(
				$author$project$Views$PrimitiveComponents$withLabel,
				'Message',
				_List_Nil,
				A2(
					$rtfeldman$elm_css$Html$Styled$textarea,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Events$onInput(
							A2($elm$core$Basics$composeL, $author$project$State$ChangeQRType, $author$project$QRTypes$QRTweet)),
							$rtfeldman$elm_css$Html$Styled$Attributes$spellcheck(true),
							$rtfeldman$elm_css$Html$Styled$Attributes$css(
							_List_fromArray(
								[
									$rtfeldman$elm_css$Css$width(
									$rtfeldman$elm_css$Css$pct(100)),
									$rtfeldman$elm_css$Css$height(
									$rtfeldman$elm_css$Css$px(100)),
									$rtfeldman$elm_css$Css$maxWidth(
									$rtfeldman$elm_css$Css$pct(100))
								]))
						]),
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text(message)
						])))
			]));
};
var $author$project$QRTypes$QRUrl = function (a) {
	return {$: 1, a: a};
};
var $author$project$Views$QRTypeOptionsView$urlOptions = function (url) {
	return A3(
		$author$project$Views$PrimitiveComponents$withLabel,
		'URL',
		_List_Nil,
		A2(
			$rtfeldman$elm_css$Html$Styled$input,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Events$onInput(
					A2($elm$core$Basics$composeL, $author$project$State$ChangeQRType, $author$project$QRTypes$QRUrl)),
					$rtfeldman$elm_css$Html$Styled$Attributes$spellcheck(false),
					$rtfeldman$elm_css$Html$Styled$Attributes$value(url),
					$rtfeldman$elm_css$Html$Styled$Attributes$type_('url'),
					$rtfeldman$elm_css$Html$Styled$Attributes$placeholder('https://example.com')
				]),
			_List_Nil));
};
var $author$project$QRTypes$QRWifi = F3(
	function (a, b, c) {
		return {$: 3, a: a, b: b, c: c};
	});
var $author$project$QRTypes$WifiNone = {$: 2};
var $author$project$QRTypes$WifiWEP = function (a) {
	return {$: 1, a: a};
};
var $author$project$QRTypes$WifiWPA = function (a) {
	return {$: 0, a: a};
};
var $author$project$QRTypes$clearWifiPassword = function (password) {
	switch (password.$) {
		case 0:
			return $author$project$QRTypes$WifiWPA('');
		case 1:
			return $author$project$QRTypes$WifiWEP('');
		default:
			return $author$project$QRTypes$WifiNone;
	}
};
var $author$project$Views$QRTypeOptionsView$wifiPasswordTypeOptions = F3(
	function (ssid, password, hidden) {
		switch (password.$) {
			case 0:
				var wpa = password.a;
				return _List_fromArray(
					[
						A3(
						$author$project$Views$PrimitiveComponents$withLabel,
						'Password',
						_List_fromArray(
							[$author$project$Views$QRTypeOptionsView$inputSpacingStyles]),
						A2(
							$rtfeldman$elm_css$Html$Styled$input,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$Events$onInput(
									A2(
										$elm$core$Basics$composeL,
										$author$project$State$ChangeQRType,
										function (val) {
											return A3(
												$author$project$QRTypes$QRWifi,
												ssid,
												$author$project$QRTypes$WifiWPA(val),
												hidden);
										})),
									$rtfeldman$elm_css$Html$Styled$Attributes$value(wpa),
									$rtfeldman$elm_css$Html$Styled$Attributes$type_('text')
								]),
							_List_Nil))
					]);
			case 1:
				var wep = password.a;
				return _List_fromArray(
					[
						A3(
						$author$project$Views$PrimitiveComponents$withLabel,
						'Password',
						_List_fromArray(
							[$author$project$Views$QRTypeOptionsView$inputSpacingStyles]),
						A2(
							$rtfeldman$elm_css$Html$Styled$input,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$Events$onInput(
									A2(
										$elm$core$Basics$composeL,
										$author$project$State$ChangeQRType,
										function (val) {
											return A3(
												$author$project$QRTypes$QRWifi,
												ssid,
												$author$project$QRTypes$WifiWEP(val),
												hidden);
										})),
									$rtfeldman$elm_css$Html$Styled$Attributes$value(wep),
									$rtfeldman$elm_css$Html$Styled$Attributes$type_('text')
								]),
							_List_Nil))
					]);
			default:
				return _List_Nil;
		}
	});
var $author$project$Views$QRTypeOptionsView$wifiOptions = F3(
	function (ssid, password, hidden) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_Nil,
			_Utils_ap(
				_List_fromArray(
					[
						A3(
						$author$project$Views$PrimitiveComponents$withLabel,
						'Network name (SSID)',
						_List_fromArray(
							[$author$project$Views$QRTypeOptionsView$inputSpacingStyles]),
						A2(
							$rtfeldman$elm_css$Html$Styled$input,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$Events$onInput(
									A2(
										$elm$core$Basics$composeL,
										$author$project$State$ChangeQRType,
										function (val) {
											return A3($author$project$QRTypes$QRWifi, val, password, hidden);
										})),
									$rtfeldman$elm_css$Html$Styled$Attributes$value(ssid),
									$rtfeldman$elm_css$Html$Styled$Attributes$type_('text')
								]),
							_List_Nil)),
						A3(
						$author$project$Views$PrimitiveComponents$withLabel,
						'Password type',
						_List_fromArray(
							[$author$project$Views$QRTypeOptionsView$inputSpacingStyles]),
						A2(
							$rtfeldman$elm_css$Html$Styled$div,
							_List_Nil,
							A2(
								$elm$core$List$map,
								function (_v0) {
									var value = _v0.a;
									var label = _v0.b;
									var pass_type = _v0.c;
									return A2(
										$rtfeldman$elm_css$Html$Styled$label,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$rtfeldman$elm_css$Html$Styled$input,
												_List_fromArray(
													[
														$rtfeldman$elm_css$Html$Styled$Attributes$type_('radio'),
														$rtfeldman$elm_css$Html$Styled$Attributes$name('password_type'),
														$rtfeldman$elm_css$Html$Styled$Attributes$value(value),
														$rtfeldman$elm_css$Html$Styled$Attributes$checked(
														_Utils_eq(
															$author$project$QRTypes$clearWifiPassword(password),
															$author$project$QRTypes$clearWifiPassword(pass_type))),
														$rtfeldman$elm_css$Html$Styled$Events$onCheck(
														function (selected) {
															return selected ? $author$project$State$ChangeQRType(
																A3($author$project$QRTypes$QRWifi, ssid, pass_type, hidden)) : $author$project$State$NoOp;
														})
													]),
												_List_Nil),
												$rtfeldman$elm_css$Html$Styled$text(label)
											]));
								},
								_List_fromArray(
									[
										_Utils_Tuple3(
										'wpa',
										'WPA / WPA2',
										$author$project$QRTypes$WifiWPA('')),
										_Utils_Tuple3(
										'wep',
										'WEP',
										$author$project$QRTypes$WifiWEP('')),
										_Utils_Tuple3('none', 'None', $author$project$QRTypes$WifiNone)
									]))))
					]),
				_Utils_ap(
					A3($author$project$Views$QRTypeOptionsView$wifiPasswordTypeOptions, ssid, password, hidden),
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$label,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$Attributes$css(
									_List_fromArray(
										[
											$rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$block)
										]))
								]),
							_List_fromArray(
								[
									A2(
									$rtfeldman$elm_css$Html$Styled$input,
									_List_fromArray(
										[
											$rtfeldman$elm_css$Html$Styled$Attributes$type_('checkbox'),
											$rtfeldman$elm_css$Html$Styled$Events$onCheck(
											function (checked) {
												return $author$project$State$ChangeQRType(
													A3($author$project$QRTypes$QRWifi, ssid, password, checked));
											})
										]),
									_List_Nil),
									$rtfeldman$elm_css$Html$Styled$text('Hidden')
								]))
						]))));
	});
var $author$project$Views$QRTypeOptionsView$qrTypeOptions = function (model) {
	return A2(
		$author$project$Views$PrimitiveComponents$styledGroup,
		_List_Nil,
		_List_fromArray(
			[
				function () {
				var _v0 = model.dz;
				switch (_v0.$) {
					case 0:
						var value = _v0.a;
						return $author$project$Views$QRTypeOptionsView$textOptions(value);
					case 1:
						var url = _v0.a;
						return $author$project$Views$QRTypeOptionsView$urlOptions(url);
					case 2:
						var address = _v0.a;
						var subject = _v0.b;
						var body = _v0.c;
						return A3($author$project$Views$QRTypeOptionsView$emailOptions, address, subject, body);
					case 3:
						var ssid = _v0.a;
						var password = _v0.b;
						var hidden = _v0.c;
						return A3($author$project$Views$QRTypeOptionsView$wifiOptions, ssid, password, hidden);
					case 4:
						var number = _v0.a;
						return $author$project$Views$QRTypeOptionsView$phoneOptions(number);
					case 5:
						var number = _v0.a;
						var message = _v0.b;
						return A2($author$project$Views$QRTypeOptionsView$smsOptions, number, message);
					case 6:
						var message = _v0.a;
						return $author$project$Views$QRTypeOptionsView$tweetOptions(message);
					default:
						var currency = _v0.a;
						var address = _v0.b;
						var amount = _v0.c;
						var message = _v0.d;
						return A4($author$project$Views$QRTypeOptionsView$cryptoOptions, currency, address, amount, message);
				}
			}()
			]));
};
var $author$project$QRTypes$clearQRType = function (qrType) {
	switch (qrType.$) {
		case 0:
			return $author$project$QRTypes$QRText('');
		case 1:
			return $author$project$QRTypes$QRUrl('');
		case 2:
			return A3($author$project$QRTypes$QREmail, '', '', '');
		case 3:
			return A3(
				$author$project$QRTypes$QRWifi,
				'',
				$author$project$QRTypes$WifiWPA(''),
				false);
		case 4:
			return $author$project$QRTypes$QRPhone('');
		case 5:
			return A2($author$project$QRTypes$QRSms, '', '');
		case 6:
			return $author$project$QRTypes$QRTweet('');
		default:
			return A4($author$project$QRTypes$QRCrypto, 0, '', '', '');
	}
};
var $author$project$QRTypes$getQRTypeLabel = function (qrType) {
	switch (qrType.$) {
		case 0:
			return 'Text';
		case 1:
			return 'URL';
		case 2:
			return 'Email';
		case 3:
			return 'Wifi';
		case 4:
			return 'Phone';
		case 5:
			return 'SMS';
		case 6:
			return 'Tweet';
		default:
			return 'Crypto';
	}
};
var $author$project$QRTypes$qrTypes = _List_fromArray(
	[
		$author$project$QRTypes$QRText(''),
		$author$project$QRTypes$QRUrl(''),
		A3($author$project$QRTypes$QREmail, '', '', ''),
		A3(
		$author$project$QRTypes$QRWifi,
		'',
		$author$project$QRTypes$WifiWPA(''),
		false),
		$author$project$QRTypes$QRPhone(''),
		A2($author$project$QRTypes$QRSms, '', ''),
		$author$project$QRTypes$QRTweet(''),
		A4($author$project$QRTypes$QRCrypto, 0, '', '', '')
	]);
var $author$project$Views$FormView$qrTypeSelect = function (model) {
	return A2(
		$author$project$Views$PrimitiveComponents$styledGroup,
		_List_Nil,
		A2(
			$elm$core$List$map,
			function (qrType) {
				return A2(
					$rtfeldman$elm_css$Html$Styled$label,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$css(
							_List_fromArray(
								[
									$rtfeldman$elm_css$Css$marginRight(
									$rtfeldman$elm_css$Css$px(10))
								]))
						]),
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$input,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$Attributes$type_('radio'),
									$rtfeldman$elm_css$Html$Styled$Attributes$checked(
									_Utils_eq(
										$author$project$QRTypes$clearQRType(qrType),
										$author$project$QRTypes$clearQRType(model.dz))),
									$rtfeldman$elm_css$Html$Styled$Attributes$name('qr_type_select'),
									$rtfeldman$elm_css$Html$Styled$Events$onCheck(
									function (checked) {
										return checked ? $author$project$State$ChangeQRType(qrType) : $author$project$State$NoOp;
									})
								]),
							_List_Nil),
							$rtfeldman$elm_css$Html$Styled$text(
							$author$project$QRTypes$getQRTypeLabel(qrType))
						]));
			},
			$author$project$QRTypes$qrTypes));
};
var $rtfeldman$elm_css$Css$Media$feature = F2(
	function (key, _v0) {
		var value = _v0.L;
		return {
			b7: key,
			L: $elm$core$Maybe$Just(value)
		};
	});
var $rtfeldman$elm_css$Css$Media$minWidth = function (value) {
	return A2($rtfeldman$elm_css$Css$Media$feature, 'min-width', value);
};
var $rtfeldman$elm_css$Css$Structure$OnlyQuery = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Media$only = $rtfeldman$elm_css$Css$Structure$OnlyQuery;
var $rtfeldman$elm_css$Css$Structure$Screen = 1;
var $rtfeldman$elm_css$Css$Media$screen = 1;
var $rtfeldman$elm_css$Css$Preprocess$WithMedia = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Media$withMedia = $rtfeldman$elm_css$Css$Preprocess$WithMedia;
var $author$project$MediaQueries$withMediaDesktop = $rtfeldman$elm_css$Css$Media$withMedia(
	_List_fromArray(
		[
			A2(
			$rtfeldman$elm_css$Css$Media$only,
			$rtfeldman$elm_css$Css$Media$screen,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$Media$minWidth(
					$rtfeldman$elm_css$Css$px(680))
				]))
		]));
var $author$project$Views$FormView$formView = function (model) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$form,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$css(
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$displayFlex,
						$rtfeldman$elm_css$Css$flexDirection($rtfeldman$elm_css$Css$column),
						$rtfeldman$elm_css$Css$flexGrow(
						$rtfeldman$elm_css$Css$int(1)),
						$rtfeldman$elm_css$Css$flexShrink(
						$rtfeldman$elm_css$Css$int(1)),
						$rtfeldman$elm_css$Css$width(
						$rtfeldman$elm_css$Css$pct(100)),
						$rtfeldman$elm_css$Css$Global$children(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$Global$everything(
								_List_fromArray(
									[
										$rtfeldman$elm_css$Css$marginBottom(
										$rtfeldman$elm_css$Css$px(12))
									]))
							])),
						$author$project$MediaQueries$withMediaDesktop(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$marginRight(
								$rtfeldman$elm_css$Css$px(6)),
								$rtfeldman$elm_css$Css$maxWidth(
								$rtfeldman$elm_css$Css$px(600))
							]))
					]))
			]),
		_List_fromArray(
			[
				$author$project$Views$FormView$qrTypeSelect(model),
				$author$project$Views$QRTypeOptionsView$qrTypeOptions(model),
				$author$project$Views$ErrorCorrectionView$qrErrorCorrectionSelect(model)
			]));
};
var $rtfeldman$elm_css$Css$backgroundAttachment = $rtfeldman$elm_css$Css$prop1('background-attachment');
var $rtfeldman$elm_css$Css$backgroundImage = $rtfeldman$elm_css$Css$prop1('background-image');
var $rtfeldman$elm_css$Css$backgroundRepeat = $rtfeldman$elm_css$Css$prop1('background-repeat');
var $rtfeldman$elm_css$Css$stringsToValue = function (list) {
	return $elm$core$List$isEmpty(list) ? {L: 'none'} : {
		L: A2(
			$elm$core$String$join,
			', ',
			A2(
				$elm$core$List$map,
				function (s) {
					return s;
				},
				list))
	};
};
var $rtfeldman$elm_css$Css$fontFamilies = A2(
	$elm$core$Basics$composeL,
	$rtfeldman$elm_css$Css$prop1('font-family'),
	$rtfeldman$elm_css$Css$stringsToValue);
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $rtfeldman$elm_css$VirtualDom$Styled$unstyledNode = $rtfeldman$elm_css$VirtualDom$Styled$Unstyled;
var $rtfeldman$elm_css$Css$Global$global = function (snippets) {
	return $rtfeldman$elm_css$VirtualDom$Styled$unstyledNode(
		A3(
			$elm$virtual_dom$VirtualDom$node,
			'style',
			_List_Nil,
			$elm$core$List$singleton(
				$elm$virtual_dom$VirtualDom$text(
					$rtfeldman$elm_css$Css$Preprocess$Resolve$compile(
						$elm$core$List$singleton(
							$rtfeldman$elm_css$Css$Preprocess$stylesheet(snippets)))))));
};
var $rtfeldman$elm_css$Css$repeat = {ap: 0, N: 0, L: 'repeat'};
var $rtfeldman$elm_css$Css$scroll = {aK: 0, bW: 0, ci: 0, aA: 0, dD: 0, L: 'scroll'};
var $rtfeldman$elm_css$Css$Global$selector = F2(
	function (selectorStr, styles) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$makeSnippet,
			styles,
			A2($rtfeldman$elm_css$Css$Structure$CustomSelector, selectorStr, _List_Nil));
	});
var $rtfeldman$elm_css$Css$url = function (urlValue) {
	return {ao: 0, L: 'url(' + (urlValue + ')')};
};
var $author$project$Views$AppView$globalStyles = $rtfeldman$elm_css$Css$Global$global(
	_List_fromArray(
		[
			A2(
			$rtfeldman$elm_css$Css$Global$selector,
			'body',
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$backgroundColor(
					$rtfeldman$elm_css$Css$hex('f9f9fc')),
					$rtfeldman$elm_css$Css$backgroundImage(
					$rtfeldman$elm_css$Css$url('https://www.toptal.com/designers/subtlepatterns/patterns/email-pattern.png')),
					$rtfeldman$elm_css$Css$backgroundAttachment($rtfeldman$elm_css$Css$scroll),
					$rtfeldman$elm_css$Css$backgroundRepeat($rtfeldman$elm_css$Css$repeat),
					$rtfeldman$elm_css$Css$padding(
					$rtfeldman$elm_css$Css$px(20)),
					$rtfeldman$elm_css$Css$fontFamilies(
					_List_fromArray(
						['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol']))
				]))
		]));
var $rtfeldman$elm_css$Css$justifyContent = function (fn) {
	return A3(
		$rtfeldman$elm_css$Css$Internal$getOverloadedProperty,
		'justifyContent',
		'justify-content',
		fn($rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty));
};
var $rtfeldman$elm_css$Css$marginTop = $rtfeldman$elm_css$Css$prop1('margin-top');
var $author$project$State$DownloadQRCodeAsPNG = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $rtfeldman$elm_css$Html$Styled$button = $rtfeldman$elm_css$Html$Styled$node('button');
var $rtfeldman$elm_css$Css$marginLeft = $rtfeldman$elm_css$Css$prop1('margin-left');
var $rtfeldman$elm_css$Html$Styled$Events$onClick = function (msg) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $rtfeldman$elm_css$Html$Styled$fromUnstyled = $rtfeldman$elm_css$VirtualDom$Styled$unstyledNode;
var $pablohirafuji$elm_qrcode$QRCode$Render$Svg$moduleSize = 5;
var $pablohirafuji$elm_qrcode$QRCode$Render$Svg$appendLastRect = function (_v0) {
	var lastRect = _v0.a;
	var rowLines = _v0.b;
	return A2(
		$elm$core$List$cons,
		'h' + $elm$core$String$fromInt(lastRect.cO * $pablohirafuji$elm_qrcode$QRCode$Render$Svg$moduleSize),
		rowLines);
};
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $elm$svg$Svg$Attributes$shapeRendering = _VirtualDom_attribute('shape-rendering');
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $elm$svg$Svg$Attributes$style = _VirtualDom_attribute('style');
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $pablohirafuji$elm_qrcode$QRCode$Render$Svg$toRowLines = F2(
	function (isDark, _v0) {
		var lastRect = _v0.a;
		var rowLines = _v0.b;
		return isDark ? ((!lastRect.ah) ? _Utils_Tuple2(
			_Utils_update(
				lastRect,
				{cO: lastRect.cO + 1}),
			rowLines) : _Utils_Tuple2(
			{ah: 0, cO: 1},
			A2(
				$elm$core$List$cons,
				$elm$core$String$concat(
					_List_fromArray(
						[
							(lastRect.cO > 0) ? ('h' + $elm$core$String$fromInt(lastRect.cO * $pablohirafuji$elm_qrcode$QRCode$Render$Svg$moduleSize)) : '',
							'm',
							$elm$core$String$fromInt(lastRect.ah * $pablohirafuji$elm_qrcode$QRCode$Render$Svg$moduleSize),
							' 0'
						])),
				rowLines))) : _Utils_Tuple2(
			_Utils_update(
				lastRect,
				{ah: lastRect.ah + 1}),
			rowLines);
	});
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $pablohirafuji$elm_qrcode$QRCode$Render$Svg$viewRow = F3(
	function (quietZoneSize, rowIndex, rowLines) {
		return A2(
			$elm$core$List$cons,
			'M0 ',
			A2(
				$elm$core$List$cons,
				$elm$core$String$fromInt(rowIndex * $pablohirafuji$elm_qrcode$QRCode$Render$Svg$moduleSize),
				rowLines));
	});
var $pablohirafuji$elm_qrcode$QRCode$Render$Svg$viewBase = F3(
	function (quietZoneSize, extraAttrs, matrix) {
		var quietZonePx = quietZoneSize * $pablohirafuji$elm_qrcode$QRCode$Render$Svg$moduleSize;
		var sizePx = $elm$core$String$fromInt(
			($elm$core$List$length(matrix) * $pablohirafuji$elm_qrcode$QRCode$Render$Svg$moduleSize) + (2 * quietZonePx));
		return A2(
			$elm$svg$Svg$svg,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$viewBox('0 0 ' + (sizePx + (' ' + sizePx))),
						$elm$svg$Svg$Attributes$shapeRendering('crispEdges'),
						$elm$svg$Svg$Attributes$stroke('#000'),
						$elm$svg$Svg$Attributes$strokeWidth(
						$elm$core$String$fromInt($pablohirafuji$elm_qrcode$QRCode$Render$Svg$moduleSize) + 'px')
					]),
				extraAttrs),
			function (d) {
				return _List_fromArray(
					[
						A2(
						$elm$svg$Svg$path,
						_List_fromArray(
							[
								d,
								$elm$svg$Svg$Attributes$transform(
								'translate(' + ($elm$core$String$fromInt(quietZonePx) + (', ' + ($elm$core$String$fromFloat(quietZonePx + ($pablohirafuji$elm_qrcode$QRCode$Render$Svg$moduleSize / 2)) + ')')))),
								$elm$svg$Svg$Attributes$style('stroke-width: 5px')
							]),
						_List_Nil)
					]);
			}(
				$elm$svg$Svg$Attributes$d(
					$elm$core$String$concat(
						$elm$core$List$concat(
							A2(
								$elm$core$List$indexedMap,
								$pablohirafuji$elm_qrcode$QRCode$Render$Svg$viewRow(quietZoneSize),
								A2(
									$elm$core$List$map,
									A2(
										$elm$core$Basics$composeR,
										A2(
											$elm$core$List$foldl,
											$pablohirafuji$elm_qrcode$QRCode$Render$Svg$toRowLines,
											_Utils_Tuple2(
												{ah: 0, cO: 0},
												_List_Nil)),
										A2($elm$core$Basics$composeR, $pablohirafuji$elm_qrcode$QRCode$Render$Svg$appendLastRect, $elm$core$List$reverse)),
									matrix)))))));
	});
var $pablohirafuji$elm_qrcode$QRCode$Render$Svg$viewWithoutQuietZone = $pablohirafuji$elm_qrcode$QRCode$Render$Svg$viewBase(0);
var $pablohirafuji$elm_qrcode$QRCode$toSvgWithoutQuietZone = F2(
	function (extraAttrs, _v0) {
		var matrix = _v0.aP;
		return A2($pablohirafuji$elm_qrcode$QRCode$Render$Svg$viewWithoutQuietZone, extraAttrs, matrix);
	});
var $author$project$Views$QRImageView$qrCodeImage = function (model) {
	var _v0 = A2(
		$pablohirafuji$elm_qrcode$QRCode$fromStringWith,
		model.da,
		$author$project$QRTypes$encodeQRType(model.dz));
	if (_v0.$ === 1) {
		return $rtfeldman$elm_css$Html$Styled$text('Something went wrong');
	} else {
		var code = _v0.a;
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							$rtfeldman$elm_css$Css$width(
							$rtfeldman$elm_css$Css$px(200)),
							$rtfeldman$elm_css$Css$height(
							$rtfeldman$elm_css$Css$px(200))
						]))
				]),
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$fromUnstyled(
					A2($pablohirafuji$elm_qrcode$QRCode$toSvgWithoutQuietZone, _List_Nil, code))
				]));
	}
};
var $author$project$Views$QRImageView$qrCodeView = function (model) {
	return A2(
		$author$project$Views$PrimitiveComponents$styledGroup,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$css(
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$flexShrink(
						$rtfeldman$elm_css$Css$int(0)),
						$author$project$MediaQueries$withMediaDesktop(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$marginLeft(
								$rtfeldman$elm_css$Css$px(6))
							]))
					]))
			]),
		_List_fromArray(
			[
				$author$project$Views$QRImageView$qrCodeImage(model),
				A2(
				$rtfeldman$elm_css$Html$Styled$button,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Events$onClick(
						A2($author$project$State$DownloadQRCodeAsPNG, 255, 4294967295)),
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$marginTop(
								$rtfeldman$elm_css$Css$px(12)),
								$rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$block)
							]))
					]),
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$text('Download PNG (white background)')
					])),
				A2(
				$rtfeldman$elm_css$Html$Styled$button,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Events$onClick(
						A2($author$project$State$DownloadQRCodeAsPNG, 255, 4294967040)),
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$marginTop(
								$rtfeldman$elm_css$Css$px(12)),
								$rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$block)
							]))
					]),
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$text('Download PNG (transparent background)')
					]))
			]));
};
var $rtfeldman$elm_css$Css$start = $rtfeldman$elm_css$Css$prop1('start');
var $author$project$Views$AppView$mainContent = function (model) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$css(
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$displayFlex,
						$rtfeldman$elm_css$Css$flexDirection($rtfeldman$elm_css$Css$column),
						$rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$center),
						$rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$start),
						$rtfeldman$elm_css$Css$marginTop(
						$rtfeldman$elm_css$Css$px(40)),
						$author$project$MediaQueries$withMediaDesktop(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$flexDirection($rtfeldman$elm_css$Css$row)
							]))
					]))
			]),
		_List_fromArray(
			[
				$author$project$Views$AppView$globalStyles,
				$author$project$Views$FormView$formView(model),
				$author$project$Views$QRImageView$qrCodeView(model)
			]));
};
var $rtfeldman$elm_css$Css$textAlign = function (fn) {
	return A3(
		$rtfeldman$elm_css$Css$Internal$getOverloadedProperty,
		'textAlign',
		'text-align',
		fn($rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty));
};
var $author$project$Views$AppView$appView = function (model) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$rtfeldman$elm_css$Html$Styled$h1,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$textAlign($rtfeldman$elm_css$Css$center)
							]))
					]),
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$text('QR Code Generator')
					])),
				$author$project$Views$AppView$mainContent(model)
			]));
};
var $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles = F2(
	function (_v0, styles) {
		var newStyles = _v0.b;
		var classname = _v0.c;
		return $elm$core$List$isEmpty(newStyles) ? styles : A3($elm$core$Dict$insert, classname, newStyles, styles);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute = function (_v0) {
	var val = _v0.a;
	return val;
};
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$virtual_dom$VirtualDom$keyedNodeNS = F2(
	function (namespace, tag) {
		return A2(
			_VirtualDom_keyedNodeNS,
			namespace,
			_VirtualDom_noScript(tag));
	});
var $elm$virtual_dom$VirtualDom$nodeNS = function (tag) {
	return _VirtualDom_nodeNS(
		_VirtualDom_noScript(tag));
};
var $rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml = F2(
	function (_v6, _v7) {
		var key = _v6.a;
		var html = _v6.b;
		var pairs = _v7.a;
		var styles = _v7.b;
		switch (html.$) {
			case 4:
				var vdom = html.a;
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					styles);
			case 0:
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v9 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v9.a;
				var finalStyles = _v9.b;
				var vdom = A3(
					$elm$virtual_dom$VirtualDom$node,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
			case 1:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v10 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v10.a;
				var finalStyles = _v10.b;
				var vdom = A4(
					$elm$virtual_dom$VirtualDom$nodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
			case 2:
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v11 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v11.a;
				var finalStyles = _v11.b;
				var vdom = A3(
					$elm$virtual_dom$VirtualDom$keyedNode,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
			default:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v12 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v12.a;
				var finalStyles = _v12.b;
				var vdom = A4(
					$elm$virtual_dom$VirtualDom$keyedNodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml = F2(
	function (html, _v0) {
		var nodes = _v0.a;
		var styles = _v0.b;
		switch (html.$) {
			case 4:
				var vdomNode = html.a;
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					styles);
			case 0:
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v2 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v2.a;
				var finalStyles = _v2.b;
				var vdomNode = A3(
					$elm$virtual_dom$VirtualDom$node,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
			case 1:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v3 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v3.a;
				var finalStyles = _v3.b;
				var vdomNode = A4(
					$elm$virtual_dom$VirtualDom$nodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
			case 2:
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v4 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v4.a;
				var finalStyles = _v4.b;
				var vdomNode = A3(
					$elm$virtual_dom$VirtualDom$keyedNode,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
			default:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v5 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v5.a;
				var finalStyles = _v5.b;
				var vdomNode = A4(
					$elm$virtual_dom$VirtualDom$keyedNodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
		}
	});
var $elm$core$Dict$singleton = F2(
	function (key, value) {
		return A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$stylesFromPropertiesHelp = F2(
	function (candidate, properties) {
		stylesFromPropertiesHelp:
		while (true) {
			if (!properties.b) {
				return candidate;
			} else {
				var _v1 = properties.a;
				var styles = _v1.b;
				var classname = _v1.c;
				var rest = properties.b;
				if ($elm$core$String$isEmpty(classname)) {
					var $temp$candidate = candidate,
						$temp$properties = rest;
					candidate = $temp$candidate;
					properties = $temp$properties;
					continue stylesFromPropertiesHelp;
				} else {
					var $temp$candidate = $elm$core$Maybe$Just(
						_Utils_Tuple2(classname, styles)),
						$temp$properties = rest;
					candidate = $temp$candidate;
					properties = $temp$properties;
					continue stylesFromPropertiesHelp;
				}
			}
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties = function (properties) {
	var _v0 = A2($rtfeldman$elm_css$VirtualDom$Styled$stylesFromPropertiesHelp, $elm$core$Maybe$Nothing, properties);
	if (_v0.$ === 1) {
		return $elm$core$Dict$empty;
	} else {
		var _v1 = _v0.a;
		var classname = _v1.a;
		var styles = _v1.b;
		return A2($elm$core$Dict$singleton, classname, styles);
	}
};
var $rtfeldman$elm_css$Css$Structure$ClassSelector = function (a) {
	return {$: 0, a: a};
};
var $rtfeldman$elm_css$VirtualDom$Styled$snippetFromPair = function (_v0) {
	var classname = _v0.a;
	var styles = _v0.b;
	return A2(
		$rtfeldman$elm_css$VirtualDom$Styled$makeSnippet,
		styles,
		$rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$ClassSelector(classname)
				])));
};
var $rtfeldman$elm_css$VirtualDom$Styled$toDeclaration = function (dict) {
	return $rtfeldman$elm_css$Css$Preprocess$Resolve$compile(
		$elm$core$List$singleton(
			$rtfeldman$elm_css$Css$Preprocess$stylesheet(
				A2(
					$elm$core$List$map,
					$rtfeldman$elm_css$VirtualDom$Styled$snippetFromPair,
					$elm$core$Dict$toList(dict)))));
};
var $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode = function (styles) {
	return A3(
		$elm$virtual_dom$VirtualDom$node,
		'style',
		_List_Nil,
		$elm$core$List$singleton(
			$elm$virtual_dom$VirtualDom$text(
				$rtfeldman$elm_css$VirtualDom$Styled$toDeclaration(styles))));
};
var $rtfeldman$elm_css$VirtualDom$Styled$unstyle = F3(
	function (elemType, properties, children) {
		var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			children);
		var childNodes = _v0.a;
		var styles = _v0.b;
		var styleNode = $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode(styles);
		return A3(
			$elm$virtual_dom$VirtualDom$node,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				styleNode,
				$elm$core$List$reverse(childNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$containsKey = F2(
	function (key, pairs) {
		containsKey:
		while (true) {
			if (!pairs.b) {
				return false;
			} else {
				var _v1 = pairs.a;
				var str = _v1.a;
				var rest = pairs.b;
				if (_Utils_eq(key, str)) {
					return true;
				} else {
					var $temp$key = key,
						$temp$pairs = rest;
					key = $temp$key;
					pairs = $temp$pairs;
					continue containsKey;
				}
			}
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$getUnusedKey = F2(
	function (_default, pairs) {
		getUnusedKey:
		while (true) {
			if (!pairs.b) {
				return _default;
			} else {
				var _v1 = pairs.a;
				var firstKey = _v1.a;
				var rest = pairs.b;
				var newKey = '_' + firstKey;
				if (A2($rtfeldman$elm_css$VirtualDom$Styled$containsKey, newKey, rest)) {
					var $temp$default = newKey,
						$temp$pairs = rest;
					_default = $temp$default;
					pairs = $temp$pairs;
					continue getUnusedKey;
				} else {
					return newKey;
				}
			}
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$toKeyedStyleNode = F2(
	function (allStyles, keyedChildNodes) {
		var styleNodeKey = A2($rtfeldman$elm_css$VirtualDom$Styled$getUnusedKey, '_', keyedChildNodes);
		var finalNode = $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode(allStyles);
		return _Utils_Tuple2(styleNodeKey, finalNode);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyed = F3(
	function (elemType, properties, keyedChildren) {
		var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			keyedChildren);
		var keyedChildNodes = _v0.a;
		var styles = _v0.b;
		var keyedStyleNode = A2($rtfeldman$elm_css$VirtualDom$Styled$toKeyedStyleNode, styles, keyedChildNodes);
		return A3(
			$elm$virtual_dom$VirtualDom$keyedNode,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				keyedStyleNode,
				$elm$core$List$reverse(keyedChildNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyedNS = F4(
	function (ns, elemType, properties, keyedChildren) {
		var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			keyedChildren);
		var keyedChildNodes = _v0.a;
		var styles = _v0.b;
		var keyedStyleNode = A2($rtfeldman$elm_css$VirtualDom$Styled$toKeyedStyleNode, styles, keyedChildNodes);
		return A4(
			$elm$virtual_dom$VirtualDom$keyedNodeNS,
			ns,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				keyedStyleNode,
				$elm$core$List$reverse(keyedChildNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$unstyleNS = F4(
	function (ns, elemType, properties, children) {
		var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			children);
		var childNodes = _v0.a;
		var styles = _v0.b;
		var styleNode = $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode(styles);
		return A4(
			$elm$virtual_dom$VirtualDom$nodeNS,
			ns,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				styleNode,
				$elm$core$List$reverse(childNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$toUnstyled = function (vdom) {
	switch (vdom.$) {
		case 4:
			var plainNode = vdom.a;
			return plainNode;
		case 0:
			var elemType = vdom.a;
			var properties = vdom.b;
			var children = vdom.c;
			return A3($rtfeldman$elm_css$VirtualDom$Styled$unstyle, elemType, properties, children);
		case 1:
			var ns = vdom.a;
			var elemType = vdom.b;
			var properties = vdom.c;
			var children = vdom.d;
			return A4($rtfeldman$elm_css$VirtualDom$Styled$unstyleNS, ns, elemType, properties, children);
		case 2:
			var elemType = vdom.a;
			var properties = vdom.b;
			var children = vdom.c;
			return A3($rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyed, elemType, properties, children);
		default:
			var ns = vdom.a;
			var elemType = vdom.b;
			var properties = vdom.c;
			var children = vdom.d;
			return A4($rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyedNS, ns, elemType, properties, children);
	}
};
var $rtfeldman$elm_css$Html$Styled$toUnstyled = $rtfeldman$elm_css$VirtualDom$Styled$toUnstyled;
var $author$project$Main$view = function (model) {
	return {
		cX: _List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$toUnstyled(
				$author$project$Views$AppView$appView(model))
			]),
		dI: 'QR Code Generator'
	};
};
var $author$project$Main$main = $elm$browser$Browser$document(
	{
		dk: function (_v0) {
			return $author$project$Main$init;
		},
		dG: function (_v1) {
			return $elm$core$Platform$Sub$none;
		},
		dJ: $author$project$State$update,
		dL: $author$project$Main$view
	});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));