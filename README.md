# Getting Started
## Pre-requisites 
Node should be installed on their local machines.

## Backend
From the fetch-rewards folder, run the following commands to start:
```
$ npm install // only once to install dependencies
$ npm start
```

The application is run on http://127.0.0.1:5000/ by default.

# Error Handling

The API will return error when requests fail:

- 400: Bad Request

# API Reference
### POST  /transaction
- Creates a new transaction using the submitted payer, points, and timestamp. 
- Returns a list of transactions if the post succeeded. This call will return an error if incorrect transaction form submitted.
```
curl -X POST 'localhost:5000/transaction' -H 'Content-Type: application/json' --data-raw '{ "payer": "DANNON", "points": 300, "timestamp": "2020-10-31T10:00:00Z" }'
```

### POST  /spend
- Spends points using the submitted points. 
- Returns a list of { "payer": <string>, "points": <integer> } if the post succeeded. This call will return an error if incorrect transaction form submitted or if it exceeded the maximum balance.
```
curl -X POST 'localhost:5000/spend' -H 'Content-Type: application/json' --data-raw '{"points":5000}'
```
[\
  { "payer": "DANNON", "points": -100 },\
  { "payer": "UNILEVER", "points": -200 },\
  { "payer": "MILLER COORS", "points": -4,700 }\
]
  
### GET  /balance
- Retrieves the current account balance.
- Returns all payer point balances.
```
curl -X GET 'localhost:5000/balance'
```
{\
"DANNON": 1000,\
"UNILEVER": 0,\
"MILLER COORS": 5300\
}



