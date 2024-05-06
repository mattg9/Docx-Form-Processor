Feature: Form 74B

  Scenario: Fill in the estate information for paragraph 1
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
    Then file "rcp-e-74b-0921-paragraph5.docx" is expected:
      | Expects        | Value                                            |
      | does not exist | Matthew, of Woodstock, make oath and say/affirm: |

  Scenario: Fill in paragraph 6 table with multiple people
    Given a JSON file named "notEntitled.json"
    And a template file named "rcp-e-74b-0921.docx"
    Then file "rcp-e-74b-0921-paragraph6.docx" is expected:
      | Expects | Value                                            |
      | exists  | IN THE ESTATE OF Matthew, deceased.              |
      | exists  | Matthew, of Woodstock, make oath and say/affirm: |
