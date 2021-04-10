const express = require("express");

const app = express();
app.use(express.json());

const dataBase = {
  balance: {},
  totalBalance: 0,
  record: [],
  transactions: [],
};

app.post("/transaction", (req, res) => {
  const { payer, points, timestamp } = req.body;
  if (!payer || !points) {
    return res.status(400).json("incorrect transaction form submitted");
  }
  dataBase.balance[payer]
    ? ((dataBase.balance[payer] += points), (dataBase.totalBalance += points))
    : ((dataBase.balance[payer] = points), (dataBase.totalBalance += points));
  dataBase.record.push(req.body);
  dataBase.transactions.push({
    payer: payer,
    points: points,
    timestamp: timestamp || new Date(),
  });
  res.json(dataBase.transactions);
});

app.listen(5000, () => {
  console.log("app is running on port 5000");
});
