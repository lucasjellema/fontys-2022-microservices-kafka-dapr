# Introduction to Dapr.io and

- [Introduction to Dapr.io and](#introduction-to-daprio-and)
  - [1. Setting up Dapr.io](#1-setting-up-daprio)
    - [a. Installing the Dapr.io CLI](#a-installing-the-daprio-cli)
    - [b. Initialize Dapr in your local environment](#b-initialize-dapr-in-your-local-environment)
  - [2. Playing with Dapr State Store capability](#2-playing-with-dapr-state-store-capability)
  - [3. Using a MySQL Database as a Dapr State Store](#3-using-a-mysql-database-as-a-dapr-state-store)
  - [4. Telemetry](#4-telemetry)
  - [Closure](#closure)
  - [Resources](#resources)

In this lab, you will install Dapr.io in your local environment and explore some of its capabilities as a *personal assistant* for applications and microservices. Dapr.io offers a variety of services to applications, including state management, asynchronous communication (pub & sub), handling secrets and configuration data, protection, routing and load balancing of communication and interacting with external services and technology platforms. Applications rely on Dapr.io to handle *dirty details* such as technology specific APIs and configuration - and only talk to Dapr.io in civilized terms - a standardized, functional API.  

## 1. Setting up Dapr.io

Dapr.io runs very well on Kubernetes. However, for simplicity sake we will go for the more straightforward approach. You will need an environment - MacOS, Windows, Linux - that has Docker running.  

Note: there is the possibility to run Dapr.io without Docker at all - see [Dapr.io self hosted without Docker](https://docs.dapr.io/operations/hosting/self-hosted/self-hosted-no-docker/) for details; however, that requires a lot of additional work and will limit your progress through today's hands on labs.

### a. Installing the Dapr.io CLI

Follow the instructions for installing the Dapr.io CLI that are provided on [this page](https://docs.dapr.io/getting-started/install-dapr-cli/).

Using
```
dapr
```
you should now have feedback that indicates a properly installed Dapr environment.

### b. Initialize Dapr in your local environment

Follow the instructions for initializing the Dapr environment that are provided on [this page](https://docs.dapr.io/getting-started/install-dapr-selfhost/). The outcome of this step should be three running containers: Dapr, Zipkin and Redis. The Redis container provides the default implementation for State Store and Pub Sub broker used by Dapr based on the Redis in memory cache. Zipkin collects telemetry and provides insight in tracing of requests to and from microservices through Dapr.

At this point, you have a virtual pool of personal assistants to draw support from for each of the applications and microservices you will run. These potential assistants when called into action can make use of the standard Dapr facilities for state management and pub/sub and for collecting telemetry and routing requests. We can easily add - and will so later in this lab - additional capabilities that these PAs can make use of.  

## 2. Playing with Dapr State Store capability

Follow the instructions for trying out the default Dapr state store implementation (based on Redis cache) as described in this document [Making the Dapr PA hold and return state ](https://docs.dapr.io/getting-started/get-started-api/). 

In these steps, you run a Dapr Sidecar (the technical term for the personal assistant) for an application called *myapp*. That application does not actually exist. What we do is hire a personal assistant for a manager who has not arrived yet. The PA can start doing their work - but not yet pass messages on to the person they are the PA for. In this case, we can ask the sidecar for example to save state and publish messages - but any attempt to invoke the *myapp* application will fail because it is not there yet. 

When you check the logs after executing the first command, you will see messages indicating that the sidecar (again, the technical term for the personal assstant) is running. Because we did not explicitly configure components for state store and pub sub, the default implementations in Dapr are used - based on Redis and leveraging the Docker Container running the Redis image.

After completing the steps in that document, execute the following command:
```
curl -X POST -H "Content-Type: application/json" -d '[{ "key": "name", "value": "Your Own Name"}]' http://localhost:3500/v1.0/state/statestore
```
This sets a new value for the state stored under the key *name*, updating the value stored previously under that key. Note that in the URL we refer to localhost and the port on which the sidecar was started through the *dapr run* command. The path segment *v1.0* refers to the version of the Dapr APIs. The segment *state* indicates that we are invoking the State Store API. Finally, the URL path segment *statestore* indicates the name of the state store that we want to save state to. A Daprized application - or rather its Dapr sidecar - can work with multple state stores that each have their own name and can each have their own implementation. 

## 3. Using a MySQL Database as a Dapr State Store

As was discussed before, Dapr.io supports many different technologies. It provides for example over a dozen implementations of the state store component - each leveraging a different database or cloud storage service. In the previous section we used the out of the Dapr.io box provided Redis Cache as state store. In this step we are going to use a MySQL Database to serve the same purpose.

To run a MySQL Database

```
docker run --name dapr-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:latest
```

To connect to the MySQL server from the MySQL client application from inside the container running MySQL:
```
docker exec -it dapr-mysql mysql -uroot -p
```
and type the password: `my-secret-pw`

You can list the databases:
```
show databases;
```
Create a database and then create tables.

However, let's not do that right now. Let's configure Dapr to use this MySQL instance to create a database and table to store state in.

Details can be found in the [documentation on the Dapr MySQL State Store building block](https://docs.dapr.io/reference/components-reference/supported-state-stores/setup-mysql/).

Start a new terminal session. Create a file called `mysql-statestore.yaml` and add the following content to the file:

```
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: durable-statestore
spec:
  type: state.mysql
  version: v1
  metadata:
  - name: connectionString
    value: "root:my-secret-pw@tcp(localhost:3306)/?allowNativePasswords=true"
```

Then run a Dapr sidecar from the directory that contains file `mysql-statestore.yaml`, as follows:
```
dapr run --app-id myotherapp --dapr-http-port 3510 --components-path .
```
Note: if the current directory contains other yaml-files you may see unexpected and unintended effects as Dapr tries to interpret them as well.

This instruction starts a Dapr sidecar (a personal assistant) and instructs the sidecar about a state store called *durable-statestore*. This statestore is backed by a MySQL Database for which the connection details are provided. Now when anyone asks this sidecar to save state and specifies the *durable-statestore* as the state store to use for that request, the Dapr sidecar will know where to go and because of the many built in building blocks in Dapr it also knows what to do in order to talk state affairs with MySQL.

You will find lines like these ones in the logging produced by Dapr when starting up:
```
INFO[0000] Creating MySql schema 'dapr_state_store'      app_id=myotherapp instance=DESKTOP-NIQR4P9 scope=dapr.contrib type=log ver=edge
INFO[0000] Creating MySql state table 'state'            app_id=myotherapp instance=DESKTOP-NIQR4P9 scope=dapr.contrib type=log ver=edge
INFO[0000] component loaded. name: durable-statestore, type: state.mysql/v1  app_id=myotherapp instance=DESKTOP-NIQR4P9 scope=dapr.runtime type=log ver=edge
```

This confirms that Dapr initialized communications with the MySQL instance, it also created the default schema and default table in it for storing state.

Let us now create some state, in exactly the same way as we created state before - when it was saved in Redis Cache.

```
curl -X POST -H "Content-Type: application/json" -d '[{ "key": "name", "value": "Your Own Name"}]' http://localhost:3510/v1.0/state/durable-statestore
```
Note that the portname at which we access the Dapr sidecar is 3510 and the name of the statestore requested is passed in the URL path as well. Let's check if the state was saved. First by retrieving it from the sidecar:
```
curl http://localhost:3510/v1.0/state/durable-statestore/name
```

And next by checking directly in the MySQL Database.
To connect to the MySQL server as you did before, run this next statement that opens the MySQL client in the container running MySQL:
```
docker exec -it dapr-mysql mysql -uroot -p
```
and type the password: `my-secret-pw`

You can list the databases:
```
show databases;
```
and you will notice a database called *dapr_state_store* has been created. 

Use these next statements to switchh to the *dapr_state_store* database, to list all tables and to select all records from the one table *STATE* that Dapr created when it initialized the *durable-statestore* component.

```
use dapr_state_store;
show tables;
select * from state;
```
The last statement returns a result similar to this one:
```
+------------------+-----------------+----------+---------------------+---------------------+--------------------------------------+
| id               | value           | isbinary | insertDate          | updateDate          | eTag                                 |
+------------------+-----------------+----------+---------------------+---------------------+--------------------------------------+
| myotherapp||name | "Your Own Name" |        0 | 2022-03-01 18:00:01 | 2022-03-01 18:00:01 | 0a4d1bb3-e208-4c03-8296-eb9f1a544ff3 |
+------------------+-----------------+----------+---------------------+---------------------+--------------------------------------+
```
Note how the *key* in column *id* is composed of two parts: the name of the application for which the sidecar was managing state concatenated to the actual key you specified. 

The state held in table *STATE* should typically be managed only through Dapr. However, if you were to change the state directly through SQL:
```
update state set value = '"Somebody Else Altogether"';
```
You can exit the mysql client by typing `exit`. This returns you to the command prompt.

You will find that when you ask Dapr for the state held under key *name* it will return the updated value, once again proving that Dapr interacts with MySQL when it comes to state. 
```
curl http://localhost:3510/v1.0/state/durable-statestore/name
```
Just as a manager would like to ask the same questions of their personal assistant when it comes to remembering stuff, regardless of whether the PA writes things down on paper, memorizes them or uses a friend to retain the information, it is a fine thing for application developers to be able to use the same interaction with Dapr regardless of whether state is stored in MySQL, Redis Cache or any of the other types of state store that Dapr supports. In fact, an application developer does not need to know how and where the state will be stored and this can be changed at deployment time as the application administrator sees fit.

## 4. Telemetry

Dapr sidecars keep track of all interactions they handle. It is something like an audit trail that can be used for various purposes:
* explore dependencies
* analyze performance chararteristics and bottle necks
* report on usage of resources and applications
* solve problems

The default installation of Dapr comes with Zipkin, running in its own container. All telemetry is published by the sidecars to the Zipkin endpoint. 

Open [localhost:9411/](http://localhost:9411/) in your browser to bring up the Zipkin user interface. Click on the *Run Query* button (in the *Find a Trace* tab). A list is presented of the traces collected by Zipkin. Among them should be calls to *myapp* and *myotherapp*. Click on the *Show* button for one of the traces to see what additional information Zipkin offers. You will find details about the HTTP request and response. Click

You will find that as we add real applications that receive requests through their sidecars and that leverage Dapr's services, the value of the telemetry quickly increases. To get this information without any additional effort in either development or configuration is a big boon. 

## Closure

To complete this lab, you can now stop dapr: `dapr stop`. You can also stop the MySQL container:

```
docker stop dapr-mysql
```


## Resources

[Dapr.io Docs - Getting Started](https://docs.dapr.io/getting-started/)
[Dapr.io Docs - MySQL State Store component](https://docs.dapr.io/reference/components-reference/supported-state-stores/setup-mysql/)
[Dapr.io Docs - State Management](https://docs.dapr.io/developing-applications/building-blocks/state-management/)

[MySQL Container Image docs](https://hub.docker.com/_/mysql/)