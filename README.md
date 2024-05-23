# Cucumber Test Suite

## Introduction
This repository contains a suite of Cucumber tests designed to validate the contents of processed forms given as Word Documents.

## Getting Started
To get started with running the tests, follow these steps:
1. **Install Dependencies**: 
`npm install`

2. **Execute Tests**:
`npm run test-cucumber`

##  Word Document Template
The form to be processed consists of areas text should replaced, optionally inserted or removed, and checkboxes that must be checked.

##  Repository

- **test/resources/data**: Includes sample schema and inputs to expect.
- **features/step_definitions/steps.js**:
Includes _When_ condition to mock document being processed by external system.
- **test/resources/form**:
Includes sample template forms for _Given_ condition.
- **test/resources/result**:
Includes sample output to expect checked by _Then_ conditions.
