@bank
Feature: Bank application behavior

  @positive @login
  Scenario: Valid user can sign in
    Given I am on the login page
    When I sign in with username "standard_user" and password "bank_sauce"
    Then I should be on the dashboard
    And I should see the welcome message "Welcome back, Alex"

  @positive @boundary @login
  Scenario: Valid credentials with surrounding spaces are accepted
    Given I am on the login page
    When I sign in with username "  standard_user  " and password "  bank_sauce  "
    Then I should be on the dashboard
    And I should see the welcome message "Welcome back, Alex"

  @negative @login
  Scenario: Wrong password is rejected
    Given I am on the login page
    When I sign in with username "standard_user" and password "wrong-password"
    Then I should remain on the login page
    And I should see the invalid credentials message

  @negative @login
  Scenario: Wrong user ID is rejected
    Given I am on the login page
    When I sign in with username "wrong-user" and password "bank_sauce"
    Then I should remain on the login page
    And I should see the invalid credentials message

  @negative @login
  Scenario: Credentials are case-sensitive
    Given I am on the login page
    When I sign in with username "Standard_User" and password "BANK_SAUCE"
    Then I should remain on the login page
    And I should see the invalid credentials message

  @boundary @negative @login
  Scenario Outline: Empty or whitespace-only credentials are rejected
    Given I am on the login page
    When I sign in with username "<username>" and password "<password>"
    Then I should remain on the login page
    And I should see the invalid credentials message

    Examples:
      | username      | password      |
      |               | bank_sauce    |
      | standard_user |               |
      |               |               |

  @boundary @negative @login
  Scenario: Whitespace-only credentials are rejected
    Given I am on the login page
    When I sign in with username "   " and password "   "
    Then I should remain on the login page
    And I should see the invalid credentials message

  @positive @login @usability
  Scenario: Password can be toggled to visible text
    Given I am on the login page
    When I enter password "bank_sauce"
    And I toggle password visibility
    Then the password field should display as text

  @positive @accounts
  Scenario: Accounts page shows the account list
    Given I am logged in to the bank app
    When I click the "Accounts" navigation link
    Then I should see the accounts table
    And I should see account rows for "Everyday Checking" and "High-Yield Savings"

  @positive @dashboard
  Scenario: Dashboard shows account summary and quick actions
    Given I am logged in to the bank app
    When I click the "Dashboard" navigation link
    Then I should see the account summary total "$17,050.00"
    And I should see the quick actions region
    And I should see a link to transfer money

  @positive @transactions @filter
  Scenario: Transactions can be filtered by search and type
    Given I am logged in to the bank app
    When I click the "Transactions" navigation link
    And I search for "Whole Foods Market"
    Then I should see the transaction row for "Whole Foods Market"
    And I should not see the transaction row for "Direct Deposit"
    When I clear the search
    And I filter by credits
    Then I should see the transaction row for "Direct Deposit"
    And I should not see the transaction row for "Whole Foods Market"
    When I filter by debits
    Then I should see the transaction row for "Whole Foods Market"
    And I should not see the transaction row for "Direct Deposit"

  @positive @transactions @search @boundary
  Scenario: Transaction search ignores letter case
    Given I am logged in to the bank app
    When I click the "Transactions" navigation link
    And I search for "whole foods market"
    Then I should see the transaction row for "Whole Foods Market"

  @boundary @transactions @search
  Scenario: Transaction search shows an empty state when there are no matches
    Given I am logged in to the bank app
    When I click the "Transactions" navigation link
    And I search for "No Such Merchant"
    Then I should see the empty transaction results message

  @positive @transactions @search @boundary
  Scenario: Clearing transaction search restores the full list
    Given I am logged in to the bank app
    When I click the "Transactions" navigation link
    And I search for "Whole Foods Market"
    And I clear the search
    Then I should see the transaction row for "Whole Foods Market"
    And I should see the transaction row for "Direct Deposit"

  @positive @transactions @filter
  Scenario: Credits filter shows credit transactions only
    Given I am logged in to the bank app
    When I click the "Transactions" navigation link
    And I filter by credits
    Then I should see the transaction row for "Direct Deposit"
    And I should not see the transaction row for "Whole Foods Market"

  @positive @transactions @filter
  Scenario: Debits filter shows debit transactions only
    Given I am logged in to the bank app
    When I click the "Transactions" navigation link
    And I filter by debits
    Then I should see the transaction row for "Whole Foods Market"
    And I should not see the transaction row for "Direct Deposit"

  @positive @dashboard
  Scenario: Dashboard recent activity includes recent transactions
    Given I am logged in to the bank app
    When I click the "Dashboard" navigation link
    Then I should see the recent transaction "Whole Foods Market"
    And I should see the recent transaction "Direct Deposit"

  @positive @accounts
  Scenario: Accounts list includes the travel fund account
    Given I am logged in to the bank app
    When I click the "Accounts" navigation link
    Then I should see the account row for "Travel Fund"

  @positive @dashboard @transfer
  Scenario: Dashboard quick action opens the transfer form
    Given I am logged in to the bank app
    When I click the "Dashboard" navigation link
    And I click the "Transfer Money" quick action
    Then I should see the transfer form fields

  @positive @transfer
  Scenario: Transfer form is available
    Given I am logged in to the bank app
    When I click the "Transfer" navigation link
    Then I should see the transfer form fields

  @positive @send-money
  Scenario: Send money form is available
    Given I am logged in to the bank app
    When I click the "Send Money" navigation link
    Then I should see the send money form fields

  @positive @bill-pay
  Scenario: Bill pay form is available
    Given I am logged in to the bank app
    When I click the "Bill Pay" navigation link
    Then I should see the bill pay form fields

  @positive @loan
  Scenario: Loan application history is available
    Given I am logged in to the bank app
    When I click the "Apply Loan" navigation link
    Then I should see the loan application history
