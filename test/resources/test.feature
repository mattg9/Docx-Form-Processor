Feature: Form 74B

  Scenario: Fill in Paragraph 1
    Given a JSON file named "estate.json"
    And a template file named "rcp-e-74b-0921.docx"
    When I create file from template using values from the JSON
    Then file "rcp-e-74b-0921-result.docx" is expected:
      | Expects | Value                                            |
      | exists  | IN THE ESTATE OF Matthew, deceased.              |
      | exists  | Matthew, of Woodstock, make oath and say/affirm: |

  Scenario: Strike paragraph 5 from the form
    Given a JSON file named "estate.json"
    And a template file named "rcp-e-74b-0921.docx"
    When I create file from template using values from the JSON
    Then file "rcp-e-74b-0921-result.docx" is expected:
      | Expects        | Value                                            |
      | does not exist | Matthew, of Woodstock, make oath and say/affirm: |

  Scenario: Populate a table 6
    Given a JSON file named "estate.json"
    And a template file named "rcp-e-74b-0921.docx"
    When I create file from template using values from the JSON
    Then file "rcp-e-74b-0921-result.docx" is expected:
      | Expects | Value                                            |
      | exists  | IN THE ESTATE OF Matthew, deceased.              |
      | exists  | Matthew, of Woodstock, make oath and say/affirm: |
