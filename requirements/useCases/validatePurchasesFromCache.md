# Validate purchases from cache

## Success cases
1. The system executes the command "Validate Purchases"
2. The system loads data from the cache
3. The system validates if cache timestamp is newer than 3 days

## Exception - Error when loading data from cache
1. The system cleans the cache

## Exception - Expired cache
1. The system cleans the cache