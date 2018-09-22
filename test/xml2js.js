const xml2js = require('xml2js');
const parseString = xml2js.parseString;

let xml = `
<root name="xml">
    <to>George</to>
    <from>John</from>
    <heading>Reminder</heading>
    <body>Don't forget the meeting!</body>
</root>
`

let result;
parseString(xml, function (err, ret) {
    result = ret;
});

console.log(result);

var builder = new xml2js.Builder();
xml = builder.buildObject(result);

console.log(xml)