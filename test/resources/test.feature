Feature: Form 74B

    Scenario: Fill in Paragraph 1
    Given a JSON file "estate.json" and a template file "rcp-e-74b-0921.docx"
    When I modify the template using values from the JSON file
    Then file "rcp-e-74b-0921.docx" is expected:
    | Expects | Value                 |
    | exists  | I have attached       |
    | exists  | AFFIDAVIT OF SERVICE  |
