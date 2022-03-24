const http = require('http')
const url = require('url')

const producer = require('./produce')
const consumer = require('./consume')

const importer = require('./customerImporter')
const PORT = 3008

const customers = {} // a map with customer objects as values and the customer identifiers as key

// create an HTTP server that handles HTTP requests; it is handed two parameters: the request and response objects
const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        handleGetCustomer(req, res)
    } else
        if (req.method === 'POST') {
            // expected: /customers/<customerId (for an update)  or /customers (for a create)
            const pathSegments = url.parse(req.url, true).path.split('/')
            if ("customers" == pathSegments[1]) {
                handlePostCustomer(req, res, pathSegments[2])
            } else {
                res.statusCode = 400
                res.statusMessage = "This call cannot be handled; supported paths are /customers/<customerId> and /customers"
                res.end()
            }
        }//POST
})
server.listen(PORT);
console.log(`CRM Service is listening at port ${PORT} for HTTP GET or POST requests`)

function handlePostCustomer(req, res, pathIdentifier) {
    let customerId = pathIdentifier
    // if a customerId is passed, check if we have a customer with this customerIdentifier; if not, we reject the request
    if (customerId && !customers[customerId]) { // customerId that was specified does not exist
        res.statusCode = 404
        res.statusMessage = "This customer is not known in the CRM service; update can not be performed"
        res.end()
        return // quit processing
    }
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {  // if the full request has been received, then start the actual processing
        // the expected body has this structure:
        // {
        //     "firstName": "Molly",
        //     "lastName": "Peterson",
        //     "city": "Zeewolde",
        //     "connectionId": "928",
        //     "connectionMandate": "0"
        // }
        customer = JSON.parse(body)
        customer.customerId = customerId
        customerId = processCustomer(customer)
        res.statusCode = 201
        res.statusMessage = `Tremendous success! Customer was processed with customer id ${customerId}`
        res.end(JSON.stringify(customer))
    });
} //handlePostCustomer

function handleGetCustomer(req, res) {
    // get all query parameters from the URL
    const query = url.parse(req.url, true).query
    if (query.customerId) {
        console.log(`Request received for customer ${query.customerId}`)
        // return the HTTP response; use the value of the name parameter if it was provided, or use World if it was not
        res.setHeader('Content-Type', 'application/json')
        if (customers[query.customerId]) {
            res.end(JSON.stringify(customers[query.customerId]))
        }
        else {
            res.statusCode = 404
            res.statusMessage = "This customer is not known in the CRM service"
            res.end()
        }
    }
    else { // return a full list of all customers
        res.statusCode = 200
        res.end(JSON.stringify(customers))
    }
}// handleGetCustomer


const processCustomer = function (customerObject) {
    const customerId = customerObject.customerId // check if the object already contains a customer identifier
        ? customerObject.customerId
        // derive the value as one higher than the current maximum value of all customer identifier values
        : (Object.keys(customers).map(el => parseInt(el)).reduce((max, cur) => Math.max(max, cur)) + 1).toString()
    const oldCustomer = customers[customerId]
    if (oldCustomer) {
        console.log("Updating existing customer")
    }
    else {
        customerObject.customerId = customerId;
        console.log(`creating new customer with customer identifier ${customerId} `)
    }
    customers[customerId] = customerObject
    return customerId;
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function prepareCRMDatabase() {
    importer.importCustomers(processCustomer)
}
prepareCRMDatabase()

const handleQuestion = async function  (questionMessage) {
    const question = JSON.parse(questionMessage.value.toString())
    const questionCategory = question["questionCategory"]
    console.log(`Received Question in category ${questionCategory}`)
    if ("customer" == questionCategory) {
        console.log(`Answer question about customer ${question.payload.customerIdentifier}`)
        answerQuestion(question.payload.customerIdentifier, question.qaIdentifier )        
    }
    else {
        // ignore this workflow instruction because this microservice cannot/does not have to handle it 
        console.log(`Ignore question in category ${questionCategory}; the CRM microservice does not answer that type of question.`)
    }
}
consumer.setMessageHandler("questions-topic", handleQuestion)
consumer.initializeConsumer()

const answerQuestion = async function( customerIdentifier, qaIdentifier ) {
   console.log(`GO and answer question ${qaIdentifier}` )
   await sleep(2500) // a little pause in answering 
   const customer = customers[customerIdentifier]
   const answer = {"qaIdentifier": qaIdentifier, "answer": customer}
   producer.produceMessage(JSON.stringify(answer))
}