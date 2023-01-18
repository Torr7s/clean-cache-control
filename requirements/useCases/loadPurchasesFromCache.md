# Load purchases from cache

## Success cases
1. The system executes the command "Load Purchases"
2. The system loads data from the cache
3. The system validates if cache timestamp is newer than 3 days
4. The system creates a purchasing list from the cache data
5. The system returns the purchasing list

## Exception - Error when loading data from cache
1. The system cleans the cache
2. The system returns an empty list

## Exception - Expired cache
1. The system cleans the cache
2. The system returns an empty list

## Exception - Empty cache
1. The system returns an empty list