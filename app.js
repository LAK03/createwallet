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
  email: { type: String, index: { unique: true } },
  WalletAddress: String
});
var Wallet = mongoose.model("Wallet", nameSchema);

async function getUserWalletAddress(email){
  var user_add;
  await Wallet.find({'email':email}).then(result => {
    user_add = result[0].WalletAddress;
    console.log("user wallet address:"+user_add);

  }).catch(err => {
    console.log("User doesnt exist");

  });
  return user_add;

}

app.post("/getWalletDetails", (req, res) => {

  //var myData = new Wallet({email: name, WalletAddress: address} );
    var user_email = req.body.email ;

    Wallet.find({'email':user_email},{ '_id':0, 'email':0}).then(result => {
      res.send("user Wallet :"+result[0].WalletAddress);
    }).catch(err => {
      res.status(400).send("User doesnt exist");
    });

});



app.post("/WalletForUser", async(req, res) => {
let address = await createWalletforUser();

  console.log("address returned:" + address);
  var name = req.body.email;
  console.log("name:"+name);

  var myData = new Wallet({email: name, WalletAddress: address} );
  console.log("Print data mongo record: " + myData);
  myData.save()
    .then(item => {
      res.send("Created a ETH wallet for user :" + address);
    })
    .catch(err => {
      res.status(400).send("User already exists .Unable to save to database");
    });
});

async function createWalletforUser() {
  //getweb3();
  var web34 = new web3(new web3.providers.HttpProvider("<GETH NODE SERVER>"));
  let add = await web34.eth.personal.newAccount('test');
  console.log("Wallet Created :" + add);
  return add;
}

app.post("/sendTransaction", async(req, res) => {
  var user_email = req.body.email;
  var to_address = req.body.to_address;
  var value = req.body.amount;
  let from_address = await getUserWalletAddress(user_email);
  console.log("user address (from_address)==>"+from_address);
  
  var web34 = new web3(new web3.providers.HttpProvider(<GETH NODE SERVER>));
  await web34.eth.personal.unlockAccount(from_address,"test",15000);
  let BuserAccBalance = await web34.eth.getBalance(from_address);
  let tran_hash = await web34.eth.sendTransaction({from:from_address,to:to_address,value:value});
  console.log("Transaction Hash:"+JSON.stringify(tran_hash));
  let AuserAccBalance = await web34.eth.getBalance(from_address);
  res.send("User Balance before Transaction:"+BuserAccBalance+" User Balance after Transaction:"+AuserAccBalance+"\nTransaction successfull and Transaction Hash is:"+tran_hash.transactionHash);

});

app.post("/receiveTransaction", async(req, res) => {
  var user_email = req.body.email;
  var from_address = req.body.from_address;
  var value = req.body.amount;
  let to_address = await getUserWalletAddress(user_email);
  console.log("user address (to_address)==>"+to_address);

  var web34 = new web3(new web3.providers.HttpProvider(<GETH NODE SERVER>));
  await web34.eth.personal.unlockAccount(from_address,"test",15000);
  let BuserAccBalance = await web34.eth.getBalance(to_address);
  let tran_hash = await web34.eth.sendTransaction({from:from_address,to:to_address,value:value});
  console.log("Transaction Hash:"+JSON.stringify(tran_hash));
  let AuserAccBalance = await web34.eth.getBalance(to_address);
  res.send("User Balance before Transaction:"+BuserAccBalance+" User Balance after Transaction:"+AuserAccBalance+"\nTransaction successfull and Transaction Hash is:"+tran_hash.transactionHash);

});
