const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTHTOKEN;
const client = require('twilio')(accountSid, authToken)
client.messages
  .create({
     body: 'Just Testing from Nectly. Do you want eat some food?',
     from: '+12053902209',
     to: '+62895354636192'
   })
  .then(message => console.log(message.sid))
  .catch(error => console.log(error))