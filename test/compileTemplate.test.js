const compileTemplate = require('../lib/parseTemplateToCode/compileTemplate').default;
const parseTemplateToCode = require('../lib/parseTemplateToCode').default;

const template = `
{
    status: <?=code?>,
    data: <?json!data?>
}
`;

parseTemplateToCode(template, {
    code: 1,
    data: [1, 2, 3]
})