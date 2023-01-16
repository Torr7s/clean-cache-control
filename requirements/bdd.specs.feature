Feature: Connection

Scenario: User required data 

Given User made a request even without an internet connection
And There is some data in the cache
And The data in the cache is newer than 3 days
When User requests to load his purchases
Then The system must show the user's purchases from the cache

Given User made a request even without an internet connection
And There is some data in the cache
And The data in the cache is older than or equal to 3 days
When User requests to load his purchases
Then The system must show an error message

Given User made a request even without an internet connection
And There is no data in the cache
When User requests to load his purchases
Then The system must show an error message
