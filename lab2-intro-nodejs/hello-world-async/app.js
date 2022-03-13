function later(message, timeout) {
    setTimeout(() => {
        console.log(message)
    }, timeout)
}

later("Hello", 2000)
later("World", 1000)
console.log("Goodbye!")


const https = require('https')

https.get('https://raw.githubusercontent.com/chrisbuttery/greeting/master/greetings.json',
    function (res) {
        res.setEncoding('utf8');
        res.on('data', (chunk) => { // function to callback when body of http response is received
            let greetingsArray = JSON.parse(`{ "data" : ${chunk} }`).data
            let randomGreetingIndex = Math.floor(Math.random() * greetingsArray.length)
            console.log(greetingsArray[randomGreetingIndex])
        });
    })

later("World", 1)
console.log("Hello")

const slow = async function (name) { // async function returns a Promise, not yet a real value
    return ("Hello " + name)
}

async function main() {
    console.log("Start")
    let message = await slow("Joanne") // await forces a wait until the Promise can render the real value
    console.log("Slow Message: " + message)
    let message2 = slow("Johnny") // without await, the value of message2 is the (initially unresolved) Promise
    console.log("Slow Message: " + message2) // no proper message is available yet
    message2.then((msg) => { console.log("Slow Message after the Promise was resolved: " + msg) }) // .then is a way to force a wait for the promise to be resolved into a real value

    let p1 = slow("Mary")
    let p2 = slow("Edith")
    let p3 = slow("Tom")

    Promise.all([p1, p2, p3]).then(function (values) {
        for (const message of values) {
            console.log(message)
        }
    });
}

main()