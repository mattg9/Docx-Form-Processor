const { Then } = require("@cucumber/cucumber");
const WordExtractor = require("word-extractor");
const fs = require('fs');

let jsonData;
let docxFile;

Given('a JSON file {string} and a template file {string}', function (jsonFileName, docxFileName) {
    jsonData = JSON.parse(fs.readFileSync(jsonFileName, 'utf-8'));
    docxFile = fs.readFileSync(docxFileName);
  });

Then('file {string} is expected:', async function (file, table) {
    const extractor = new WordExtractor();
    const DOCXBuffer = fs.readFileSync(file);
    const extracted = await extractor.extract(DOCXBuffer);
    const content = extracted
        .getBody()
        .split('\n')
        .filter((line) => /[a-zA-Z0-9]/.test(line))
        .map((line) => line.replace(/^[ ]+/, ''))
        .join('');

    console.log(content)

    const _table = table.hashes();
    const errors = [];
    _table.map((row) => {
        const expects = row['Expects'];
        const value = row['Value'];
        if (expects === 'exists' && !content.includes(value)) {
            errors.push(`"${value}" was expected to exist.`);
        } else if (expects === 'non exists' && content.includes(value)) {
            errors.push(`"${value}" was expected to not exist.`);
        }
    });

    if (errors.length) {
        throw new Error(errors.join('\n'));
    }
});
