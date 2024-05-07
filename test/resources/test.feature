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
    Given a JSON file named "noWill.json"
    And a template file named "rcp-e-74b-0921.docx"
    Then file "rcp-e-74b-0921-paragraph5.docx" should not contain the following lines:
      """
      a.	an extract of the part or parts of the Will or codicil relating to the gift, or a copy of the Will 
      (and codicil(s), if any), in the case of an application served on or in respect of a person entitled 
      only to a specified item of property or stated or determinable amount of money,
      """

  Scenario: Fill in paragraph 6 table with multiple people not entitled to be served
    Given a JSON file named "notEntitled.json"
    And a template file named "rcp-e-74b-0921.docx"
    Then file "rcp-e-74b-0921-paragraph6.docx" should contain the table:
      | Name  | Reason               |
      | Sally | Because I said so    |
      | John  | Conflict of Interest |
