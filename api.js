const MinHeap = require("./minHeap.js");
const express = require("express");

const app = express();
app.use(express.json());

let minHeap = new MinHeap();
const database = {
  balance: {},
  totalBalance: 0,
  record: [],
  transactions: [],
  availablePoints: minHeap,
};

app.get("/balance", (req, res) => {
  res.json(dataBase.balance);
});

app.post("/transaction", (req, res) => {
  const { payer, points, timestamp } = req.body;
  if (!payer || !points) {
    return res.status(400).json("incorrect transaction form submitted");
  }
  database.balance[payer]
    ? ((database.balance[payer] += points), (database.totalBalance += points))
    : ((database.balance[payer] = points), (database.totalBalance += points));
  database.record.push(req.body);
  database.transactions.push({
    payer: payer,
    points: points,
    timestamp: timestamp || new Date(),
  });
  res.status(200).json("ok");
});

app.post("/spend", (req, res) => {
  let spendPoints = req.body.points;
  if (spendPoints < 0) {
    return res.status(400).json("incorrect spend form submitted");
  }
  if (spendPoints > database.totalBalance) {
    return res.status(400).json("exceeding of the maximum balance");
  }
  availablePointsHandler();
  let responseObj = {};
  let response = [];
  while (spendPoints > 0) {
    let { payer, points, timestamp } = database.availablePoints.peek();
    if (spendPoints >= points) {
      database.availablePoints.pop();
      spendPoints -= points;
      database.balance[payer] -= points;
      responseObj[payer] ? (responseObj[payer] += -points) : (responseObj[payer] = -points);
    } else {
      database.balance[payer] -= spendPoints;
      database.availablePoints._heap[0].points -= spendPoints;
      responseObj[payer] ? (responseObj[payer] += -spendPoints) : (responseObj[payer] = -spendPoints);
      spendPoints = 0;
    }
  }
  for (const prop in responseObj) {
    response.push({
      payer: prop,
      points: responseObj[prop],
    });
  }
  res.json(response);
});

const availablePointsHandler = () => {
  database.transactions.sort((a, b) => {
    return a.timestamp > b.timestamp ? -1 : a.timestamp < b.timestamp ? 1 : 0;
  });
  while (database.transactions.length) {
    let transaction = database.transactions.pop();
    let points = transaction.points;
    if (points > 0) {
      database.availablePoints.push(transaction);
    } else if (points < 0) {
      let ind = 0;
      let max = database.availablePoints._heap.length;
      while (ind < max) {
        let validTrans = database.availablePoints._heap[ind];
        if(validTrans.payer === transaction.payer && validTrans.points > Math.abs(points)){
          validTrans.points += points;
          break;
        } else if (validTrans.payer === transaction.payer && validTrans.points === Math.abs(points)){
          database.availablePoints._heap.splice(ind, 1);
          break;
        } else if (validTrans.payer === transaction.payer && validTrans.points < Math.abs(points)){
          database.availablePoints._heap.splice(ind, 1);
          points += validTrans.points;
        }
        ind++;
      }
    }
  }
};

app.listen(5000, () => {
  console.log("app is running on port 5000");
});
