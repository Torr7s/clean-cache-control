Feature: Online Connection

"As a User with an internet connection
I want the system to show me my purchases"

Scenario: Get data from an Api

Given User has an internet connection
When User requests to load his purchases
Then The system must show the user's purchases coming from an Api

##

Feature: Offline Connection

"As a User without an internet connection
I want the system to show me my last purchases data"

Scenario: Get data from the cache

Given User has no internet connection
And There is some data in the cache
And The data in the cache is newer than 3 days
When User requests to load his purchases
Then The system must show the user's purchases from the cache

Given User has no internet connection
And There is some data in the cache
And The data in the cache is older than or equal to 3 days
When User requests to load his purchases
Then The system must show an error message

Given User has no internet connection
And There is no data in the cache
When User requests to load his purchases
Then The system must show an error message
