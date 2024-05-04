const { Given, When, Then } = require("@cucumber/cucumber");
const WordExtractor = require("word-extractor");
const fs = require('fs');

const DATA_DIR = 'test/resources/data';
const TEMPLATE_DIR = 'test/resources/form';
let jsonData;
let docxFile;

Given('a JSON file named {string}', async function (jsonFileName) {
    const jsonFilePath = `${DATA_DIR}/${jsonFileName}`;
    jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
    console.log(jsonData);
});

Given('a template file named {string}', async function (docxFileName) {
    const docxFilePath = `${TEMPLATE_DIR}/${docxFileName}`;
    docxFile = fs.readFileSync(docxFilePath);
    console.log(docxFile);
});

When('I modify the template using values from the JSON', async function () {
    if (!jsonData || !docxFile) {
        throw new Error('JSON data or DOCX file not available');
    }
    // modifyDocx(docxFile, jsonData);
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
