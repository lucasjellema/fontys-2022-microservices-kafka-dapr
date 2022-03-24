const http = require('http')
const producer = require('./produce')
const PORT = 3007

// create an HTTP server that handles HTTP requests; it is handed two parameters: the request and response objects
const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        handlePostedCustomerIdentifiers(req, res)
    } else {
        res.statusCode = 400
        res.statusMessage = "This call cannot be handled"
        res.end()
    }

})
server.listen(PORT);
console.log(`Billing Run Coordinator Service is listening at port ${PORT} for HTTP POST requests`)

function handlePostedCustomerIdentifiers(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {  // if the full request has been received, then start the actual processing
        // the expected body has this structure - an array of customer identifiers:
        // {"customerIdentifiers": [ "23","123","32"]}
        let customerIdentifiers = JSON.parse(body).customerIdentifiers
        customerIdentifiers.forEach(orderBillForCustomer)
        res.statusCode = 201
        res.statusMessage = `Tremendous success! Workflow orders have been produced to the queue - you only have to wait for the results to be generated`
        res.end()
    });
} //handlePostedCustomerIdentifiers

function orderBillForCustomer(customerIdentifier) {
    const workflowOrder = {
        "workflow-type": "bill-generation"
        , "workflow-id": new Date().getTime()+ Math.random()
        , "create-time": new Date().toISOString()
        , "payload": { "customerIdentifier": customerIdentifier }
    }
    producer.produceMessage(JSON.stringify(workflowOrder))
}