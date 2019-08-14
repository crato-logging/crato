FROM ubuntu:18.04
COPY /49-crato-kafka.conf /etc/
COPY /50-default.conf /etc/
RUN mkdir --p /var/spool/rsyslog
RUN apt-get update
RUN apt-get -y install rsyslog
COPY rsyslog.conf /etc
COPY rsyslog.conf etc/rsyslog-confd/
RUN apt-get install nano
EXPOSE 514/udp
EXPOSE 514/tcp

EXPOSE 10514/tcp
CMD ["/usr/sbin/rsyslogd", "-n", "-f", "/etc/rsyslog.conf"]