var crypto = require('crypto');

var cypherKey = "mySecretKey";
const iv = crypto.randomBytes(16);

function encrypt(text){
  var cipher = crypto.createCipheriv('aes-256-cbc', cypherKey,iv)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted; //94grt976c099df25794bf9ccb85bea72
}

function decrypt(text){
  var decipher = crypto.createDecipheriv('aes-256-cbc',cypherKey,iv)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec; //myPlainText
}
console.log(encrypt("hello"));
// module.exports={encrypt,decrypt}

