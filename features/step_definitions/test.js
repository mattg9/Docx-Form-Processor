const { Given, When, Then } = require("@cucumber/cucumber");
const WordExtractor = require("word-extractor");
const DocxTemplater = require('docxtemplater');
const fs = require('fs');

const DATA_DIR = 'test/resources/data';
const TEMPLATE_DIR = 'test/resources/form';
let jsonData;
let fileContent;
let templateFileName;
let estateFileName;

Given('a JSON file named {string}', async function (jsonFileName) {
    const jsonFilePath = `${DATA_DIR}/${jsonFileName}`;
    jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
});

Given('a template file named {string}', async function (docxFileName) {
    const docxFilePath = `${TEMPLATE_DIR}/${docxFileName}`;
    templateFileName = docxFileName;
    estateFileName = docxFileName.replace('.docx', `-${jsonData.estate.name}.docx`);
    fileContent = await readDocument(templateFileName);
});

When('I create file from template using values from the JSON', async function () {
    if (!jsonData || !fileContent) {
        throw new Error('JSON data or DOCX file not available');
    }
    fileContent = fileContent.replace('(insert name)', jsonData.estate.name);
    fileContent = fileContent.replace('(insert city or town and county or district of residence)', jsonData.estate.residence);
    fileContent = fileContent.replace('(insert “applicant”, “lawyer for applicant”, etc.)', jsonData.estate.applicant);
    console.log(fileContent);
    await writeDocument(estateFileName, fileContent);
});

Then('file {string} is expected:', async function (file, table) {
    content = readDocument(file);

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

async function writeDocument(file, content) {
    const doc = new DocxTemplater();
    const DOCXBuffer = fs.readFileSync(templateFileName);
    doc.loadZip(DOCXBuffer);
    doc.setData({
        body: content
    });
    doc.render();
    const modifiedDocxBuffer = doc.getZip().generate({ type: 'nodebuffer' });
    fs.writeFileSync(file, modifiedDocxBuffer);
    console.log('Modified document written successfully.');
}
