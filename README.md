
<h1 align="center">Welcome to Crato 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-(0.7.0)-blue.svg?cacheSeconds=2592000" />
</p>

Crato is an open source framework for small applications to easily deploy centralized logging. Crato is built with Node.JS, Apache Kafka, InfluxDB, and AWS S3. This repo contains the core Crato product that receives, transforms, and stores log data for further analysis.

### 🏠 [Homepage](http://bit.ly/2TJckpZ)

## Crato Usage

Crato provides a CLI to make using the core system and tracking logs much easier. It requires installing both [NPM]([https://docs.npmjs.com/downloading-and-installing-node-js-and-npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)) and [NodeJS]([https://nodejs.org/en/download/](https://nodejs.org/en/download/)) .

After installing the above dependencies, run `npm link`  && `npm install` which will make the `crato` command available.

Here are a list of Crato commands:

|              Commands             	|                            Description                           	|
|:---------------------------------:	|:----------------------------------------------------------------:	|
| `services`                        	| Provides a listing and description of all of Crato's services    	|
| `deploy`                          	| Starts up Crato system                                           	|
| `shutdown`                        	| Shops Crato system and all services                              	|
| `start <service>`                 	| Starts a specific Crato service                                  	|
| `stop <service>`                  	| Stops a specific Crato service                                   	|
| `install-kafka`                   	| Installs Kafka cluster and textlogs & jsonlogs topics            	|
| `container-logs \| cl <service>`  	| Displays Docker container logs for a specific service            	|
| `live-tail \| lt`                 	| See all external logs streaming into Crato. Press Ctrl-C to exit 	|
| `shell \| sh <service>`           	| Attaches a shell for a specific Crato service                    	|
| `status`                          	| Displays the status of all of Crato's services                   	|
  
## Environment Variables

Crato uses some environment variables for its NodeJS consumer app to archive logs to Amazon Web Services (AWS) Simple Storage Service (S3).

Crato uses the `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET_NAME` to authenticate for AWS S3. Crato also requires `QUEUE_MAX_SIZE` to determine the number of logs to queue before being uploaded to AWS S3.

These environment variables should be written on a local machine and Docker will automatically read them if they are.

## Install

The Crato system is deployed and orchestrated through [Docker](https://docs.docker.com/install/) and [Docker-Compose](https://docs.docker.com/compose/install/) for the `docker-compose.yml` file. Both of these must be installed.

To install Crato, clone *this* repo. Then run `docker-compose pull` to download the necessary Docker images to build the service containers. The install can be finished via Crato CLI commands or Docker or Docker-Compose CLI commands. 

## Deploying Crato

Using Crato CLI

 1. `crato install-kafka`
 2. `crato deploy`

Using Docker-Compose CLI
1. `docker-compose up zookeeper`
2. `docker-compose up kafka`
3. `docker-compose exec kafka kafka-topics --create --zookeeper zookeeper:8092 --replication-factor 3 --partitions 6 --topic textlogs`
4. `docker-compose exec kafka kafka-topics --create --zookeeper zookeeper:8092 --replication-factor 3 --partitions 6 --topic jsonlogs`
5. `docker-compose up`

## Show your support

Give a ⭐️ if this project helped you!

***
