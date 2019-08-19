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
kafka(|2|3)        Kafka Broker 1, 2, or 3
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
        exec(`docker-compose logs ${service}`).on('close', (err, stdout, stderr) => {
            console.log(stdout)
        });
    } else {
        log(`${service} is not a valid service.`)
        log(`{SERVICE_LISTING}`)
    }
}

const liveTail = () => {
    const tailingDockerCmd = () => exec('docker-compose exec rsyslog tail -f /var/log/syslog')
    log('Crato will shortly be live tailing logs streaming into the system...')
    log(`Enter Ctrl-C to exit live-tail mode`)
    setTimeout(tailingDockerCmd, 2000)
}

const stopCrato = () => {
    log('Crato is now shutting down...')
    exec('docker-compose stop')
}

const displaySystemStatus = () => (exec('docker ps', (err, stdout, stderr) => console.log(stdout)))

const startService = (name) => {
    name = name.toLowerCase
    if (SERVICES.includes(service)) {
        log(`Starting ${NAMES[service]}...`)
        exec(`docker-compose start ${service}`.on('close', () => {
            log(`${NAMES[service]} has successfully started`)
        }))
    } else if (!name) {
        log("Starting up Crato...")
        deployCrato()
    } else {
        log(`${service} is not a valid service.`)
        log(`{SERVICE_LISTING}`)
    }
}

const stopService = (name) => {
    name = name.toLowerCase()
    if (SERVICES.includes(service)) {
        log(`Starting ${NAMES[service]}...`)
        exec(`docker-compose stop ${service}`.on('close', () => {
            log(`${NAMES[service]} has been shut down`)
        }))
    } else if (!name) {
        log("Shutting down Crato...")
        stopCrato()
    } else {
        log(`${service} is not a valid service.`)
        log(`{SERVICE_LISTING}`)
    }
}

const installKafka = () => {

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
    .description('Stops Crato or a specific service')
    .action((service) => startService(service))

program.command('install-kafka')
    .description("Installs Kafka cluster and jsonlogs & textlogs topics")
    .action(installKafka)

program.command('container-logs <service>')
    .description(`Displays Docker container logs for a service`)
    .action((service) => displayDockerLogs(service))

program.command('live-tail')
    .description('See all logs streaming into Crato. Press Ctrl-C to exit.')
    .action(liveTail)

program.command('status')
    .description('Displays the status of all Docker service containers')
    .action(displaySystemStatus)

// Assert that a VALID command is provided
if (!process.argv.slice(2).length || !/[arudl]/.test(process.argv.slice(2))) {
    program.outputHelp();
    process.exit();
}
program.parse(process.argv)