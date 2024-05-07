const { Given, When, Then } = require("@cucumber/cucumber");
const WordExtractor = require("word-extractor");
const DocxTemplater = require('docxtemplater');
const PizZip = require('pizzip');
const fs = require('fs');
const { expect } = require('chai');

const DATA_DIR = 'test/resources/data';
const TEMPLATE_DIR = 'test/resources/form';
const RESULT_DIR = 'test/resources/result';

let jsonData;
let templateForm;
const estateForm = "rcp-e-74b-0921-result.docx";

/**
 * Define the jsonData from parsed file given
 * @param {string} jsonFileName - The name of the JSON file
 * @throws {Error} - If the JSON file does not exist
 */
Given('a JSON file named {string}', async function (jsonFileName) {
    const jsonFilePath = `${DATA_DIR}/${jsonFileName}`;
    // Check if the file exists
    if (!fs.existsSync(jsonFilePath)) {
        throw new Error(`JSON file '${jsonFileName}' does not exist.`);
    }
    jsonData = JSON.parse(fs.readFileSync(jsonFilePath));
});

/**
 * Define the templateForm from given docx file
 * @param {string} docxFileName - The name of the template file
 * @throws {Error} - If the template file does not exist or is not a .docx file
 */
Given('a template file named {string}', async function (docxFileName) {
    const docxFilePath = `${TEMPLATE_DIR}/${docxFileName}`;
    // Check if the file exists
    if (!fs.existsSync(docxFilePath)) {
        throw new Error(`Template file '${docxFileName}' does not exist.`);
    }
    // Check if the file has a .docx extension
    if (!docxFileName.toLowerCase().endsWith('.docx')) {
        throw new Error(`Template file '${docxFileName}' is not a .docx file.`);
    }
    templateForm = docxFilePath;
});

When('I create file from template using values from the JSON', async function () {
    writeDocument();
});

/**
 * Check given file for expected content
 * @param {string} file - The name of the file
 * @param {DataTable} table - Table containing expectations
 * @throws {Error} - If expectations are not met
 */
Then('file {string} is expected:', async function (file, table) {
    content = await readDocument(`${RESULT_DIR}/${file}`);

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

/**
 * Check given file does not contain text provided:
 * @param {string} file - The name of the file
 * @param {string} lines - Lines that should not be present in the file
 * @throws {AssertionError} - If the lines are found in the file
 */
Then('file {string} should not contain the following lines:', async function (file, lines) {
    const lineToCheck = lines.split('\n').map(line => line.trim()).join(' ');
    const fileContent = await readDocument(`${RESULT_DIR}/${file}`);
    expect(fileContent).to.not.contain(lineToCheck);
  });

/**
 * Check given file does contain text provided:
 * @param {string} file - The name of the file
 * @param {string} lines - Lines that should not be present in the file
 * @throws {AssertionError} - If the lines are not found in the file
 */
Then('file {string} should contain the following lines:', async function (file, lines) {
    const lineToCheck = lines.split('\n').map(line => line.trim()).join(' ');
    const fileContent = await readDocument(`${RESULT_DIR}/${file}`);
    expect(fileContent).to.contain(lineToCheck);
});

/**
 * Check file contains the following table entires, name and reason, separated by a tab
 * @param {string} file - The name of the file
 * @param {DataTable} table - Table containing expected names and corresponding reasons
 * @throws {Error} - If expected content is not found in the file
 */
Then('file {string} should contain the following table:', async function (file, table) {
    content = await readDocument(`${RESULT_DIR}/${file}`);

    const _table = table.hashes();
    const errors = [];
    _table.map((row) => {
        const name = row['Name'];
        const reason = row['Reason'];
        if (!content.includes(`${name}\t${reason}`)) {
            errors.push(`"${name}\t${reason}" was expected to exist.`);
        }
    });

    if (errors.length) {
        throw new Error(errors.join('\n'));
    }
});

/**
 * Reads given Word document and extracts its contents.
 * @param {string} file - Path to the Word document file.
 * @returns {Promise<string>} - Resolves with the extracted content of the document.
 */
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

/**
 * Fills a Word document template with data and writes the modified document to results directory.
 */
async function writeDocument() {
    const doc = new DocxTemplater();
    const DOCXBuffer = fs.readFileSync(templateForm);
    const zip = new PizZip(DOCXBuffer);
    doc.loadZip(zip);
    willStatus = (jsonData.estate.will) ? "with a Will" : "without a Will";
    doc.setData({
        "insert name": jsonData.estate.name,
        "insert city or town and county or district of residence" : jsonData.estate.residence,
        "insert “applicant”, “lawyer for applicant”, etc." : jsonData.estate.role,
        "insert either “with a Will” or “without a Will”" : willStatus
    });
    doc.render();
    const modifiedDocxBuffer = doc.getZip().generate({ type: 'nodebuffer' });
    fs.writeFileSync(`${RESULT_DIR}/${estateForm}`, modifiedDocxBuffer);
    console.log('Modified document written successfully.');
}
