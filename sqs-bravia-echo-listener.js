const http = require('http')
var bravia = require('./lib');
var AWS = require('aws-sdk');
const Consumer = require('sqs-consumer');

// Configuration
const port = 5006
const tvIP = '192.168.0.10'
const pskKey = '0000'
const sqsQueueUrl = "https://sqs.us-east-2.amazonaws.com/602522139067/alexa_sony_tv";

// Set the region 
AWS.config.update({region: 'us-east-2'});


function sendMessageToSonyTV(code) {
    console.log("Running code:" + code);

    // Call the Bravia function. 
    bravia(tvIP, pskKey, function(client) {
      // Call a command
      client.exec(code);
    });
}

const app = Consumer.create({
  queueUrl: sqsQueueUrl,
  visibilityTimeout: 5,
  waitTimeSeconds: 20,
  handleMessage: (message, done) => {
    // do some work with `message`
    console.log("Body:" + JSON.stringify(message));
    var body = JSON.parse(message.Body);

    sendMessageToSonyTV(body.Message);
    done();
  }
});
 
app.on('error', (err) => {
  console.log(err.message);
});
 
app.start();
