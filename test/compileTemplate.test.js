const compileTemplate = require('../lib/parseTemplateToCode/compileTemplate').default;

const template = `
{
    status: "<?=code?>",
    data: <?json!data?>
}
`;

console.log(compileTemplate(template))