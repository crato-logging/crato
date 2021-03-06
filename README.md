
![Crato Banner](https://i.imgur.com/cfeEUFu.png)

<h1 align="center">Welcome to Crato 👋</h1>

![Crato](https://img.shields.io/badge/Crato-%F0%9F%93%A6-1e4470?style=plastic) 
![version](https://img.shields.io/badge/version-0.7.0-1e4470?style=plastic) 
![license](https://img.shields.io/github/license/crato-logging/crato?color=1e4470&style=plastic)

Crato is an open source framework for small applications to easily deploy centralized logging. Crato is built with Node.js, Rsyslog, Apache Kafka, InfluxDB, and AWS S3. This repo contains the core Crato project that receives, transforms, and stores log data for further analysis.

### 🏠 [Homepage](http://bit.ly/2TJckpZ)

## Table of Contents
- [Crato Usage](#crato-usage)
- [Environment Variables](#environment-variables)
- [Install](#install)
- [Deploying Crato](#deploying-crato)
- [Networking](#Networking)
- [Show Your Support](#show-your-support)


## Crato Usage

Crato provides a CLI to make using the core system and tracking logs much easier. It requires installing both [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and [Node.js](https://nodejs.org/en/download/).

After installing the above dependencies, run `npm install`  && `npm link` which will make the `crato` command available.

Here are a list of Crato commands:

|              Commands             	|                            Description                           	|
|:---------------------------------:	|:----------------------------------------------------------------:	|
| `services`                        	| Provides a listing and description of all of Crato's services    	|
| `deploy`                          	| Starts up Crato system                                           	|
| `shutdown`                        	| Stops Crato system and all services                              	|
| `start <service>`                 	| Starts a specific Crato service                                  	|
| `stop <service>`                  	| Stops a specific Crato service                                   	|
| `install-kafka`                   	| Installs Kafka cluster and textlogs & jsonlogs topics            	|
| `container-logs \| cl <service>`  	| Displays Docker container logs for a specific service            	|
| `live-tail \| lt`                 	| See all external logs streaming into Crato. Press Ctrl-C to exit 	|
| `shell \| sh <service>`           	| Attaches a shell for a specific Crato service                    	|
| `status`                          	| Displays the status of all of Crato's services                   	|            

## Environment Variables

Crato uses some environment variables for its Node.js consumer app mainly to archive logs to Amazon Web Services (AWS) Simple Storage Service (S3).

Crato uses `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET_NAME` to authenticate for AWS S3. We also require the `QUEUE_MAX_SIZE` to determine the number of logs to queue, before being uploaded to AWS S3.

These environment variables should be written on your local machine and Docker will automatically read them if they are. See [this](https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html) great guide by Twilio for how to set environment variables on different operating systems.

## Install

The Crato system is deployed and orchestrated through [Docker](https://docs.docker.com/install/) and [Docker-Compose](https://docs.docker.com/compose/install/) with the `docker-compose.yml` file. Both of these must be installed.

To install Crato, clone *this* repo. Then run `docker-compose pull` to download the necessary Docker images to build the service containers. The install can be finished via Crato CLI commands or Docker or Docker-Compose CLI commands. 

## Deploying Crato

Using Crato CLI

1. `crato install-kafka`
2. `crato deploy`

Using Docker-Compose CLI
1. `docker-compose up -d zookeeper`
2. `docker-compose up -d kafka`
3. `docker-compose exec kafka kafka-topics --create --zookeeper zookeeper:8092 --replication-factor 3 --partitions 6 --topic textlogs`
4. `docker-compose exec kafka kafka-topics --create --zookeeper zookeeper:8092 --replication-factor 3 --partitions 6 --topic jsonlogs`
5. `docker-compose up -d`

Use `crato status` or `docker ps -a` to check the status of the service containers that have been created.

## Networking

Crato exposes ports `514` and `10514` for receiving log data into the system. On your own host machine where Crato is deployed, make sure these are available.

## Show your support

Give a ⭐️ if you liked this project!

***
