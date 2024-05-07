Feature: Form 74B

  Scenario: Fill in the estate information for paragraph 1
    Given a JSON file named "estate.json"
    And a template file named "rcp-e-74b-0921.docx"
    When I create file from template using values from the JSON
    Then file "rcp-e-74b-0921-result.docx" is expected:
      | Expects | Value                                                                                                        |
      | exists  | IN THE ESTATE OF Matthew, deceased.                                                                          |
      | exists  | Matthew, of Woodstock, make oath and say/affirm:                                                             |

  Scenario: Strike paragraph 5 from the form
    Given a JSON file named "without_will.json"
    And a template file named "rcp-e-74b-0921.docx"
    Then file "rcp-e-74b-0921-omit-paragraph5.docx" should not contain the following lines:
      """
      an extract of the part or parts of the Will or codicil relating to the gift, or a copy of the Will (and codicil(s), if any),
      in the case of an application served on or in respect of a person entitled only to a specified item of property or stated or
      determinable amount of money,a copy of the Will (and codicil(s), if any), in the case of an application served or in respect
      of any other beneficiary,a copy of the Will (and codicil(s), if any) and a statement of the estimated value of the interest of
      a minor or an adult described in the application as lacking capacity, as the case may be, if that value is not disclosed in
      the application form, in the case of an application served on the Office of the Children's Lawyer or the Office of the Public Guardian and Trustee
      """

  Scenario: Include paragraph 5 to the form
    Given a JSON file named "with_will_no_limit.json"
    And a template file named "rcp-e-74b-0921.docx"
    Then file "rcp-e-74b-0921-result.docx" should contain the following lines:
      """
      an extract of the part or parts of the Will or codicil relating to the gift, or a copy of the Will (and codicil(s), if any), 
      in the case of an application served on or in respect of a person entitled only to a specified item of property or stated or 
      determinable amount of money,a copy of the Will (and codicil(s), if any), in the case of an application served or in respect 
      of any other beneficiary,a copy of the Will (and codicil(s), if any) and a statement of the estimated value of the interest of 
      a minor or an adult described in the application as lacking capacity, as the case may be, if that value is not disclosed in 
      the application form, in the case of an application served on the Office of the Children's Lawyer or the Office of the Public Guardian and Trustee
      """

  Scenario: Fill in paragraph 6 table with multiple people not entitled to be served
    Given a JSON file named "not_entitled.json"
    And a template file named "rcp-e-74b-0921.docx"
    Then file "rcp-e-74b-0921-paragraph6.docx" should contain the following table:
      | Name  | Reason               |
      | Sally | Because I said so    |
      | John  | Conflict of Interest |

  # Additional Checks 
  # Scenario: No placeholders are undefined after processing
  #   Given a JSON file named "complete_valid_estate.json"
  #   And a template file named "rcp-e-74b-0921.docx"
  #   When I create file from template using values from the JSON
  #   Then file "rcp-e-74b-0921-result.docx" is expected:
  #     | Expects        | Value                                            |
  #     | does not exist | undefined                                        |
  #     | does not exist | insert name                                      |
