Feature: Form 74B

    Scenario: Fill in Section 1
    Then file "rcp-e-74b-0921.docx" is expected:
    | Expects | Value                 |
    | exists  | I have attached       |
    | exists  | AFFIDAVIT OF SERVICE  |
