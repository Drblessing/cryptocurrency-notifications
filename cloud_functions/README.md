# Cloud Functions

Cloud functions for the frontend.

## 1) Coingecko Gainers Traders

Get's the top gainers from coingecko, finds the Ethereum contract addresses for those that have one,
and queries Google Big Query to find traders that have bought at least three of those tokens,
between 2-7 days ago. Sorted by the number of transacions they made involving these tokens, ascending.
This helps push arbitrage bots to the bottom of the list, and legit traders to the top.
