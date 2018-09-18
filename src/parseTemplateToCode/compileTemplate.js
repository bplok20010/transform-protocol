
const escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

const escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
};

const escapeChar = function (match) {
    return '\\' + escapes[match];
};

const templateSettings = {
    evaluate: /<[?%]([\s\S]+?)[?%]>/g,
    interpolate: /<[?%]=([\s\S]+?)[?%]>/g,
    escape: /<[?%]([a-zA-Z_0-9]*?)[!-]([\s\S]+?)[?%]>/g
};

// var __t, __p = '',
// 	__j = Array.prototype.join,
// 	print = function() {
// 		__p += __j.call(arguments, '');
// 	};
// __p += '\n{\n    status: "' + ((__t = (code)) == null ? '' : __t) + '",\n    data: ';
// json!data
// __p += '\n}\n';

function template(text, settings) {
    settings = Object.assign({}, settings, templateSettings);

    // Combine delimiters into one regular expression via alternation.
    const matcher = RegExp([
        settings.escape.source,
        settings.interpolate.source,
        settings.evaluate.source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    let index = 0;
    let source = "__p+='";
    text.replace(matcher, function (match, executor, escape, interpolate, evaluate, offset) {
        source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
        index = offset + match.length;

        if (escape) {
            source += `';
var executor = '${executor}' || 'json';
if (!$self[executor]) executor = 'json';
__t = ${escape} === undefined ? '' : ${escape};
__p += $self[executor](__t);\n__p+='`;
        } else if (interpolate) {
            source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
        } else if (evaluate) {
            source += "';\n" + evaluate + "\n__p+='";
        }

        // Adobe VMs need the match returned to produce the correct offset.
        return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    //if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
        "print=function(){__p+=__j.call(arguments,'');};\n" +
        source;

    return source;
}

export default template;