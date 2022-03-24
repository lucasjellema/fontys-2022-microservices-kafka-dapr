const neatCsv = require('neat-csv'); // NPM module for easy CSV file handling
const fs = require('fs')

// I made use of this article for creating this module: https://flaviocopes.com/node-read-csv/ 
const importCustomers = function (addCustomerFunction) {
    // read customers from CSV file and feed the file contents as data into the processing function 
    fs.readFile('./customer-database.csv', async (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        // process CSV data into array of objects (one object per line, one property per field, property names derived from fields in first record in file )
        const customers = await neatCsv(data)
        console.log(`imported ${JSON.stringify(customers)}`)
        // invoke the addCustomerFunction for every object in the customers array
        customers.forEach(addCustomerFunction)
    })
}

module.exports = { importCustomers };