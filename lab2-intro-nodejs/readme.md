# Introducing NodeJS
- [Introducing NodeJS](#introducing-nodejs)
  - [Environment](#environment)
  - [Gentle introduction to Node applications](#gentle-introduction-to-node-applications)
    - [HelloWorld in Node](#helloworld-in-node)
    - [HelloWorld with NPM](#helloworld-with-npm)
    - [Handle HTTP Request with Node](#handle-http-request-with-node)
  - [Node and Dapr](#node-and-dapr)
  - [Node and Dapr - Pub/Sub for Asynchronous Communications](#node-and-dapr---pubsub-for-asynchronous-communications)
  - [Leverage Dapr Pub/Sub between Front App and Node App](#leverage-dapr-pubsub-between-front-app-and-node-app)
  - [Telemetry, Traces and Dependencies](#telemetry-traces-and-dependencies)
  - [Resources](#resources)


This lab is only a very brief introduction of NodeJS and how to get started with it. You will run a few prepared Node applications, learn about some key aspects of the NodeJS programming language and the package system that Node applications use and you will implement a REST API using Node. 

## Environment

Downloads of the Node runtime for various Operating Systems are available on this [download page ](https://nodejs.org/en/download/). The installation of the Node runtime will include the installation of the *npm* package manager - that will be needed for some of the demo applications.

If you are new to Node, you may want to read a little introduction on Node and its history: [Introduction to Node](https://nodejs.dev/introduction-to-nodejs). 

When the installation is done, verify its success by running

`node -v`

on the commandline. This should run successfully and return the version label for the installed Node version.

Also run:

`npm -v`

on the commandline to verify whether *npm* is installed successully. This should return the version label for the installed version of *npm*. NPM is the Node Package Manager - the component that takes care of downloading and installing packages that provide modules with reusable functionality. Check the website [npmjs.com](https://www.npmjs.com/) to explore the wealth of the more than 1 Million packages available on NPM.

Fetch the resources for this hands on by cloning the Git repository:
```
git clone https://github.com/lucasjellema/fontys-2022-microservices-kafka-dapr
```
This creates a directory `fontys-2022-microservices-kafka-dapr` that contains the resources you will need.

## Gentle introduction to Node applications

We will very quickly take a look at Node applications. If you have seen Node in action before, you skip this section and continue on to the next section where you will work with Dapr.io and NodeJS microservices.

The results from the steps described below are available in the corresponding directories in the cloned Git repository. Instead of creating folders and files yourself, you can also inspect and run the sources in the Git repository. 
    
### HelloWorld in Node

On the machine and environment with the Node runtime, create a folder called *hello-world*. In this folder, create a file called *app.js*. Edit this file and add the following line of code:
```
console.log("Hello World!")
```
Save the file. On the command line, execute:
`node app.js`

This will run the Node runtime, load file app.js and interpret and execute its contents. You should see the string *Hello World* printed in the console. It may not be much yet, but it is your first Node application right there!

### HelloWorld with NPM

On the machine and environment with the Node runtime, create a folder called *hello-world-npm*. Navigate to this folder and run `npm init` to create a new application.

```
cd hello-world-npm
npm init
```
Walk through the command line wizard. Feel free to either accept all default answers or provide your own values. When asked `Is this OK? (yes)` press enter. NPM will now create a package.json file based on your responses. Inspect the contents of this file.

Add a line with this content: `,    "start": "node index.js"` to the file, inside the `scripts` element and right under the line with the *test* script property. Save the file. 

Create a new file called *index.js* in this same directory. Add the line
```
console.log("Hello World!")
```
to this file. Now type `npm start` at the command line and press enter. We now leverage npm to take care of running the application. For this very simple application, you will not really see any difference yet: the code in *index.js* is executed.

### Handle HTTP Request with Node
We will make a Node application now that is a little bit more interesting than what we did before. This application will be capable of handling an HTTP request that passes in a query parameter; it will read the parameter and return an appropriate and friendly message.

On the machine and environment with the Node runtime, create a folder called *hello-world-web*. Navigate to this folder and run `npm init` to create a new application.

```
cd hello-world-web
npm init
```
Walk through the command line wizard. Feel free to either accept all default answers or provide your own values. When asked `Is this OK? (yes)` press enter. NPM will now create a package.json file based on your responses. Inspect the contents of this file.

Add a line with this content: `,    "start": "node index.js"` to the file, inside the `scripts` element and right under the line with the *test* script property. Save the file. 

Create a new file called *index.js* in this same directory. Add the following contents to the file:

```
const http = require('http')
const url = require('url')
const PORT = 3000

// create an HTTP server that handles HTTP requests; it is handed to parameters: the request and response objects
const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        // get all query parameters from the URL
        const query = url.parse(req.url, true).query
        // return the HTTP response; use the value of the name parameter if it was provided, or use World if it was not
		res.setHeader('Content-Type', 'text/html');
        res.end(`Hello ${query.name ? query.name : "World"}`)
    }
})
server.listen(PORT);
console.log(`HTTP Server is listening at port ${PORT} for HTTP GET requests`)
```
Save the file.

On the command line, type `npm start` to execute the application. The HTTP Server is now listening for HTTP Requests at `localhost`, on *port 3000*.

From the command line using *curl* or *wget* or from your browser send an HTTP Request: [http://localhost:3000?name=John+Doe](http://localhost:3000?name=John+Doe)

```
curl http://localhost:3000?name=John+Doe 
```

Resource: [Node documentation on http-module](https://nodejs.org/api/http.html), [Introduction to cURL](https://developer.ibm.com/articles/what-is-curl-command/)

## Node and Dapr


npm i dapr-client

Check package.json. It now includes the dependency of the Node application on the dapr-client module.

```
export DAPR_HTTP_PORT=3510
export APP_PORT=3110
dapr run --app-id nodeapp  --app-port $APP_PORT --dapr-http-port $DAPR_HTTP_PORT node app.js
```


curl http://localhost:3110/?name=Joseph

curl localhost:3510/v1.0/invoke/nodeapp/method/?name=Joseph



export NODE_APP_DAPR_PORT=3510
export APP_PORT=3220
export DAPR_HTTP_PORT=3620
dapr run --app-id frontapp  --app-port $APP_PORT --dapr-http-port $DAPR_HTTP_PORT node front-app.js

curl localhost:3220/?name=Johnny

frontapp has registered with nodeapp, so this call will work - invoking frontapp via sidecar for nodeapp:
curl localhost:3510/v1.0/invoke/frontapp/method/greet?name=Klaas

curl localhost:3510/v1.0/invoke/nodeapp/method/?name=Joseph

Kill nodeapp.

Try
curl localhost:3220/?name=Johnny

An exception is reported (because front-could not reach nodeapp)

Restart nodeapp.

The application instance number is increased compared to before when you make these calls - into frontapp (and indirectly to nodeapp) and directly to nodeapp 

curl localhost:3510/v1.0/invoke/frontapp/method/greet?name=Klaas

curl localhost:3510/v1.0/invoke/nodeapp/method/?name=Joseph

Note that the greeting # keeps increasing: the name and the number times it has occurred is stored as state and persists across application restarts.

However, it is not ideal that frontapp depends on nodeapp in this way, and has to report an exception when nodeapp is not available.

We will make some changes:
* frontapp will publish a message to a pub/sub component (in Dapr, this is by default implemented on Redis)
* nodeapp will consume messages from the pub/sub component and will write the name to the state store and increase the occurrence count
* frontapp will no longer get information from nodeapp; it will read directly from the state store; however: it will not write to the state store, that is the task for nodeapp. 

## Node and Dapr - Pub/Sub for Asynchronous Communications

Focus now on folder *hello-world-async-dapr*. It contains the app.js and front-app.js files that we have seen before - but they have been changed to handle asynchronous communications via the built in Pub/Sup support in Dapr based in this case on the out of the box Redis based message broker.

Run 
```
npm install
```
to have the required npm modules loaded to the *node-modules* directory.

Check file *~/.dapr/components/pubsub.yaml* to see how the default Pub/Sub component is configured. It gives a fairly good idea about how other brokers could be configured with Dapr, brokers such as RabbitMQ or Apache Kafka.
```
cat ~/.dapr/components/pubsub.yaml
```
The name of the component is *pubsub* and its type is *pubsub.redis*. Daprized applications will only mention *pubsub* when they want to publish or consume messages, not refer to *redis* in any way. They do not know about the *redis* sub type and if it changes (when for example a Pulsar or Hazelcast message broker is introduced), they are not impacted.

Run a simple sample message consuming application *order-processor*:
```
export APP_PORT=6002
export DAPR_HTTP_PORT=3602
dapr run --app-id order-processor --app-port $APP_PORT --dapr-http-port $DAPR_HTTP_PORT --dapr-grpc-port 60002 node consumer.js
```

Check the logging to find that the application is listening on HTTP port 6002 to receive any messages that the Dapr sidecar (the personal assistant to the application) may pick up based on the topic subscription.

To publish a message to the *orders* topic in the default *pubsub* component:
```
dapr publish --publish-app-id order-processor --pubsub pubsub --topic orders --data '{"orderId": "100"}' 
```
Check in the logging from the consumer application if the message has been handed over by the Dapr sidecar to the application.

The publisher application *orderprocessing* is a simple Node application that sends random messages to the *orders* topic on *pubsub*. Run the application with the following statement, and check if the messages it produces reach the consumer:

```
export APP_PORT=6001
export DAPR_HTTP_PORT=3601
dapr run --app-id orderprocessing --app-port $APP_PORT --dapr-http-port $DAPR_HTTP_PORT --dapr-grpc-port 60001 node publisher.js 
```
Note that the messages in the log on the receiving end are not in the exact same order as they were sent in. They are delivered in the original order and each is processed in its own instance of the handler function. Since the messages in this case arrive almost at the same time and the processing times for the messages can vary slightly, the order of the log messages is not determined. 

Stop the consumer application. 

Run the publisher application again. Messages are produced. And they are clearly not received at this point because the consumer is not available for consuming them. Are these messages now lost? Has communication broken down?

Start the consumer application once more to find out:
```
export APP_PORT=6002
export DAPR_HTTP_PORT=3602
dapr run --app-id order-processor --app-port $APP_PORT --dapr-http-port $DAPR_HTTP_PORT --dapr-grpc-port 60002 node consumer.js
```

You should see that the messages published by the publisher application when the consumer was stopped are now received by the consumer now that it is running again. This is a demonstration of asynchronous communication: two applications exchange messages through a middle man - the pubsub component - and have no dependency between them.  

The handshake between Dapr sidecar and pubsub component on behalf of the consumer is identified through the app-id. Messages are delivered only once to a specific consumer. When a new consumer arrives on the scene - with an app-id that has not been seen before - it will receive all messages the queue is still retaining on the topic in question.

Stop the consumer application.

Start the consumer application *with a new identity* - defined by the *app-id* parameter: 
```
dapr run --app-id new-order-processor --app-port $APP_PORT --dapr-http-port $DAPR_HTTP_PORT node consumer.js
```
and watch it receive all earlier published messages. 

## Leverage Dapr Pub/Sub between Front App and Node App
As was discussed before, we want to break the synchronous dependency in the front-app on the node-app. To achieve this, we will make these changes:
* the frontapp will publish a message to the *names* topic on the default pub/sub component 
* the nodeapp will consume messages from this *names* topic on the pub/sub component and will write the name from each message it consumes to the state store and increase the occurrence count for that name
* the frontapp will no longer get information from synchronous calls to the nodeapp; it will read directly the occurrence count for a name from the state store; however: it will not write to the state store, that is the task for nodeapp. 

Here we see a very simplistic application of the *CQRS* pattern where we segregate the responsibility for reading from a specific data set and writing data in that set.



```
export APP_PORT=6030
export DAPR_HTTP_PORT=3630
dapr run --app-id greeter --app-port $APP_PORT --dapr-http-port $DAPR_HTTP_PORT node front-app.js 
```


```
export APP_PORT=6031
export SERVER_PORT=6032
export DAPR_HTTP_PORT=3631
dapr run --app-id name-processor --app-port $APP_PORT --dapr-http-port $DAPR_HTTP_PORT node app.js 
```
Make a number of calls that will be handled by the front-app:
```
curl localhost:6030?name=Jonathan
curl localhost:6030?name=Jonathan
curl localhost:6030?name=Jonathan
```
You will notice that the number of occurrences of the name is not increasing. However, when you check the logging for the name-processor, you should also see that it is triggered by an event that contains the name *Jonathan* and it is keeping correct count. So whay does the front-app not produce the same number of occurrences?

This has to do with different modes of operation of the Dapr state store. By default, every application has its own private area within the state store. Values stored by one application are not accessible to other applications. In this example, name-processor records the name and the occurence count. And when the front-app retrieves the name from the state store, it will not find it (in its own private area).

We can instruct Dapr to use a state store as a global, shared area that is accessible to all applications.  See [Dape Docs on global state store](https://docs.dapr.io/developing-applications/building-blocks/state-management/howto-share-state/).

Copy the default state store component configuration to the local directory, as well as the *pubsub* component configuration: 
```
cp ~/.dapr/components/statestore.yaml .
cp ~/.dapr/components/pubsub.yaml .
```
Check the contents of the file that specifies the state store component:
```
cat statestore.yaml
```
You see how the state store component is called *statestore* and is of type *state.redis*. Now edit the file and add a child element under metadata in the spec (at the same level as redisHost):
```
  - name: keyPrefix
    value: none  # none means no prefixing. Multiple applications share state across different state stores
```
This setting instructs Dapr to treat keys used for accessing state in the state store as global keys - instead of application specific keys that are automatically prefixed with the application identifier.

Save the file.

Stop both the greeter and the name-processor applications.

Start both applications - with the added components-path parameter. This parameter tells Dapr to initialize components as defined by all the yaml files in the indicated directory (in this case the current directory). That is why you had to copy the pubsub.yaml file as well to the current directory, even though it is not changed. If you would not, it is not found by Dapr and call attempts to publish messages to topics on *pubsub* or subscribe to such topics will fail.

In one terminal, start the *greeter* application:
```
export APP_PORT=6030
export DAPR_HTTP_PORT=3630
dapr run --app-id greeter --app-port $APP_PORT --dapr-http-port $DAPR_HTTP_PORT --components-path .  node front-app.js 
```
and in a second terminal run *name-processor*:
```
export APP_PORT=6031
export SERVER_PORT=6032
export DAPR_HTTP_PORT=3631
dapr run --app-id name-processor --app-port $APP_PORT --dapr-http-port $DAPR_HTTP_PORT --components-path . node app.js 
```

Again, make a number of calls that will be handled by the front-app:
```
curl localhost:6030?name=Michael
curl localhost:6030?name=Michael
curl localhost:6030?name=Michael
curl localhost:6030?name=Jonathan
```
At this point, the front-app should get the increased occurrence count from the state store, saved by the name-processor app, because now both apps work against the global shared state store. 

## Telemetry, Traces and Dependencies
Open the URL [localhost:9411/](http://localhost:9411/) in your browser. This opens Zipkin, the telemetry collector shipped with Dapr.io. It provides insight in the traces collected from interactions between Daprized applications and via Dapr sidecars. This helps us understand which interactions have taken place, how long each leg of an end-to-end flow has lasted, where things went wrong and what the nature was of each interaction. And it also helps learn about indirect interactions.

Query Zipkin for traces. You should find traces that start at *greeter* and also include *name-processor*. You now that we have removed the dependency from *greeter* on *name-processor* by having the information flow via the pubsub component. How does Zipkin know that greeter and name-processor are connected? Of course this is based on information provided by Dapr. Every call made by Dapr Sidecars includes a special header that identifies a trace or conversation. This header is added to messages published to a pubsub component and when a Dapr sidecar consumes such a message, it reads the header value and reports to Zipkin that it has processed a message on behalf of its application and it includes the header in that report. Because Zipkin already received that header when the Dapr sidecar that published the message (on behalf of the greeter application) reported its activity, Zipkin can construct the overall picture.

When you go to the Dependencies tab in Zipkin, you will find a visual representation of the dependencies Zipkin has learned about. Granted, there are not that many now, but you can imagine how this type of insight in a complex network of microservices could add useful insights.

## Resources

[Dapr Docs - Pub/Sub](https://docs.dapr.io/developing-applications/building-blocks/pubsub/pubsub-overview/)
[Dapr Docs - State Management](https://docs.dapr.io/developing-applications/building-blocks/state-management/state-management-overview/)
[Dapr Docs - Shared State between Applications](https://docs.dapr.io/developing-applications/building-blocks/state-management/state-management-overview/#shared-state-between-applications)


