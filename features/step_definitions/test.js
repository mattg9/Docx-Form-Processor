const { Given, When, Then } = require("@cucumber/cucumber");
const WordExtractor = require("word-extractor");
const DocxTemplater = require('docxtemplater');
const PizZip = require('pizzip');
const fs = require('fs');

const DATA_DIR = 'test/resources/data';
const TEMPLATE_DIR = 'test/resources/form';

let jsonData;
let fileContent;
let templateFile;
let estateFile;

Given('a JSON file named {string}', async function (jsonFileName) {
    const jsonFilePath = `${DATA_DIR}/${jsonFileName}`;
    jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
});

Given('a template file named {string}', async function (docxFileName) {
    const docxFilePath = `${TEMPLATE_DIR}/${docxFileName}`;
    templateFile = docxFilePath;
    estateFile = docxFileName.replace('.docx', `-result.docx`);
    fileContent = await readDocument(templateFile);
});

When('I create file from template using values from the JSON', async function () {
    if (!jsonData || !fileContent) {
        throw new Error('JSON data or DOCX file not available');
    }
    writeDocument(estateFile);
});

Then('file {string} is expected:', async function (file, table) {
    content = await readDocument(file);

    const _table = table.hashes();
    const errors = [];
    _table.map((row) => {
        const expects = row['Expects'];
        const value = row['Value'];
        if (expects === 'exists' && !content.includes(value)) {
            errors.push(`"${value}" was expected to exist.`);
        } else if (expects === 'does not exist' && content.includes(value)) {
            errors.push(`"${value}" was expected to not exist.`);
        }
    });

    if (errors.length) {
        throw new Error(errors.join('\n'));
    }
});

async function readDocument(file) {
    const extractor = new WordExtractor();
    const DOCXBuffer = fs.readFileSync(file);
    const extracted = await extractor.extract(DOCXBuffer);
    const content = extracted
        .getBody()
        .split('\n')
        .filter((line) => /[a-zA-Z0-9]/.test(line))
        .map((line) => line.replace(/^[ ]+/, ''))
        .join('');
    return content;
}

async function writeDocument(file) {
    const doc = new DocxTemplater();
    const DOCXBuffer = fs.readFileSync(templateFile);
    const zip = new PizZip(DOCXBuffer);
    doc.loadZip(zip);
    doc.setData({
        "insert name": jsonData.estate.name,
        "insert city or town and county or district of residence" : jsonData.estate.residence,
        "insert \"applicant\", \"lawyer for applicant\", etc." : jsonData.estate.applicant
    });
    doc.render();
    const modifiedDocxBuffer = doc.getZip().generate({ type: 'nodebuffer' });
    fs.writeFileSync(file, modifiedDocxBuffer);
    console.log('Modified document written successfully.');
}
