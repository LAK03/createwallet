var express = require("express");
var web3 = require("web3");
//import { default as Web3} from 'web3';
var app = express();
var port = 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/wallets");

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log("Server listening on port " + port);
});

var nameSchema = new mongoose.Schema({
  UserName: String,
  WalletAddress: String
});
var Wallet = mongoose.model("Wallet", nameSchema);

app.post("/addDetails", async(req, res) => {
  let address = await createWalletforUser();
  console.log("address returned:" + address);
  var name = req.body.UserName;
  console.log("name:"+name);

  var myData = new Wallet({UserName: name, WalletAddress: address} );
  console.log("Print data mongo record: " + myData);
  myData.save()
    .then(item => {
      res.send("item saved to database:" + myData);
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

async function createWalletforUser() {
  //getweb3();
  var web34 = new web3(new web3.providers.HttpProvider("http://34.213.252.82:8000"));
  let add = await web34.eth.personal.newAccount('test');
  console.log("Wallet Created :" + add);
  return add;
}

function getweb3() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like AWS")

    web3 = new web3(new web3.providers.HttpProvider("http://localhost:8545"));

    //console.log("Connectiong to localhost - if->"+window.web3);
  }

  //	EventReg.setProvider(window.web3.currentProvider);

  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert('There was an error fetching your accounts.');
      return;
    }
    if (accs.length == 0) {
      alert("Coundn't get any accounts!");
      return;
    }

    console.log('No of accounts->' + accs.length);
    accounts = accs;
    console.log('account ' + accounts[0])
    //  console.log('account '+accounts[1])
    account = accounts[0];


  });

}
