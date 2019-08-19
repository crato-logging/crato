#!/usr/bin/env node

const commander = require('commander')
const { fork, exec } = require('child_process');
const program = new commander.Command();

const SERVICES = ['rsyslog', 'kafka', 'kafka2', 'kafka3', 'zookeeper', 'influxdb', 'chronograf', 'consumer']

const SERVICE_LISTING = `
service            description
-------            -----------
rsyslog            Rsyslog Central Server
zookeeper          Apache Zookeeper
kafka              Kafka Broker 1
kafka2             Kafka Broker 2
kafka3             Kafka Broker 3
influxdb           InfluxDB
chronograf         Chronograf
consumer           Kafka Consumer for AWS S3 & InfluxDB`

const NAMES = {
    'rsyslog': 'Rsyslog Central Server',
    'zookeeper': 'Zookeeper',
    'kafka': 'Kafka Broker 1',
    'kafka2': 'Kafka Broker 2',
    'kafka3': 'Kafka Broker 3',
    'influxdb': 'influxdb',
    'chronograf': 'chronograf',
    'consumer': 'Consumers API Server',
};

const configQuestions = [{
        type: 'input',
        name: 'AWS_ACCESS_KEY_ID',
        message: 'Enter your Amazon Web Services (AWS) access key ID...'
    },
    {
        type: 'input',
        name: 'AWS_SECRET_ACCESS_KEY',
        message: 'Enter your Amazon Web Services (AWS) secret access key...'
    },
    {
        type: 'input',
        name: 'AWS_S3_BUCKET_NAME',
        message: 'Enter your Amazon Web Services (AWS) S3 bucket name...'
    },
    {
        type: 'input',
        name: 'QUEUE_MAX_SIZE',
        message: 'Enter the maximum number of logs to be queued before being uploaded to AWS S3'
    }
];

const log = (message) => {
    console.log(`📦 ${message}`)
}

const deployCrato = () => {
    log('Crato is booting up the system...')
    log('This may take several minutes to install all dependencies.')
    exec('docker-compose up -d zookeeper', (err, stdout, stderr) => {
        setTimeout(() => {
            exec('docker-compose up -d').on('close', (err, stdout, stderr) => {
                log('Crato is now fully running.')
            });
        }, 7000);
    });
}

const displayDockerLogs = (service) => {
    service = service.toLowerCase()
    if (SERVICES.includes(service)) {
        log(`Displaying logs for ${NAMES[service]}...`)
        exec(`docker-compose logs ${service}`, (err, stdout, stderr) => {
            console.log(stdout)
        });
    } else {
        log(`${service} is not a valid service.`)
        log(`{SERVICE_LISTING}`)
    }
}

const liveTail = () => {
    const tailingDockerCmd = () => exec('docker-compose exec rsyslog tail -f /var/log/syslog', (err, stdout, stderr) => {
      console.log(stdout)
    })
    log('Crato will shortly be live tailing logs streaming into the system...')
    log(`Enter Ctrl-C to exit live-tail mode`)
    setTimeout(tailingDockerCmd, 2000)
}

const stopCrato = () => {
    log('Crato is now shutting down...')
    exec('docker-compose stop')
}

const displaySystemStatus = () => (exec('docker ps', (err, stdout, stderr) => console.log(stdout)))

const startService = (service) => {
    service = service.toLowerCase()
    if (SERVICES.includes(service)) {
        log(`Starting ${NAMES[service]}...`)
        exec(`docker-compose start ${service}`).on('close', () => {
            log(`${NAMES[service]} has successfully started`)
        });
    } else if (!service) {
        log("Starting up Crato...")
        deployCrato()
    } else {
        log(`${service} is not a valid service.`)
        log(`{SERVICE_LISTING}`)
    }
}

const stopService = (service) => {
    service = service.toLowerCase()
    if (SERVICES.includes(service)) {
        log(`Stopping ${NAMES[service]}...`)
        exec(`docker-compose stop ${service}`).on('close', () => {
            log(`${NAMES[service]} has been shut down`)
        });
    } else if (!service) {
        log("Shutting down Crato...")
        stopCrato()
    } else {
        log(`${service} is not a valid service.`)
        log(`{SERVICE_LISTING}`)
    }
}

const installKafka = () => {
    log('Installing Kafka...');
    exec('docker-compose up -d zookeeper', (err, stdout, stderr) => {
        log('Starting Zookeeper...');
        setTimeout(() => {
            log('Starting Kafka Brokers...');
            exec('docker-compose up -d kafka').on('close', () => {
                log('1st Kafka Broker running');
                exec('docker-compose up -d kafka2').on('close', () => {
                    log('2nd Kafka Broker running');
                    exec('docker-compose up -d kafka3').on('close', () => {
                        log('3rd Kafka Broker running');

                        setTimeout(() => {
                            log("Setting up 'textlogs' & 'jsonlogs' topic...")
                            exec('docker-compose exec kafka kafka-topics --create --zookeeper zookeeper:8092 --create --topic textlogs --replication-factor 3 --partitions 6 --if-not-exists').on('close', () => {
                                log('textlogs topic created')
                                exec('docker-compose exec kafka kafka-topics --create --zookeeper zookeeper:8092 --create --topic jsonlogs --replication-factor 3 --partitions 6 --if-not-exists').on('close', () => {
                                    log('jsonlogs topic created')
                                    exec('docker-compose stop');
                                    log('Stopping Zookeeper and Kafka Brokers...')
                                })
                            })

                        }, 7000);
                    });
                });
            });
            log('Kafka cluster created with 3 brokers!');
        }, 7000);
    });
}


program.version('0.7')
    .description('Crato: Log Management Framework.')

program.command('services')
    .description("Provides a listing and description of all of Crato's services")
    .action(() => { console.log(SERVICE_LISTING) })

program.command('deploy')
    .description('Start up Crato system')
    .action(deployCrato)

program.command('start <service>')
    .description('Starts a specific Crato service')
    .action((service) => startService(service))

program.command('stop <service>')
    .description('Stops a specific Crato service')
    .action((service) => stopService(service))

program.command('install-kafka')
    .description("Installs Kafka cluster and textlogs & jsonlogs topics")
    .action(installKafka)

program.command('container-logs <service>')
    .alias('cl')
    .description(`Displays Docker container logs for a specific service`)
    .action((service) => displayDockerLogs(service))


program.command('live-tail')
    .alias('lt')
    .description('See all logs streaming into Crato. Press Ctrl-C to exit')
    .action(liveTail)

program.command('status')
    .description('Displays the status of all Crato services')
    .action(displaySystemStatus)

// Assert that a VALID command is provided
if (!process.argv.slice(2).length || !/[arudl]/.test(process.argv.slice(2))) {
    program.outputHelp();
    process.exit();
}
program.parse(process.argv)