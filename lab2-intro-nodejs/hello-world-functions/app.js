function print(message) {
    console.log(message)
}

// a reference to the function is assigned to constant otherPrint; the function can be invoked through the constant
const otherPrint = function (message) {
    console.log(`Special type of printing: ${message}`)
}


// this function receives a reference to another function that is has to invoke; the second input to the function is passed as input to the function to call
function execute (functionToCall, message) {
    functionToCall(message)
}


// this function returns a reference to function (or a closure) that can subsequently be invoked.
// a closure (aka a stateful function) consists of a function (reference) along with a scope of variable values.
// The closure is a function constructed inside another function and has access to all variables in the other scope (local variables as well as input parameters).
// When the closure is returned, the references inside the function to variables that existed outside of it are still valid.
// In this case, the value of variable message outside of the function that is returned is still available when the function reference
// that is returned to the caller is invoked.
// Multiple calls to getPrintFunction with different values for input parameter message result in multiple closures with each
// their own value for message (taken from that input parameter) 

let printFunctionInstantiationCount = 0
function getPrintFunction(message) {
    let instanceSequence = ++printFunctionInstantiationCount // assign the current increased value to local variable to use in closure 
    return () => {
        console.log(`Printing from closure ${instanceSequence} the message ${message}`)
    }
}

print("Hello")

execute(print, "Hello")
execute(otherPrint, "Hello")

let pf1 = getPrintFunction("Hello")
let pf2 = getPrintFunction("World")

pf1() 
pf2()

execute(pf1)  // pf1 is still available, with the value of "Hello" set in the closure