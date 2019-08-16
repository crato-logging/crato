FROM ubuntu:18.04
COPY /49-crato-kafka.conf /etc/
COPY /50-default.conf /etc/
RUN mkdir --p /var/spool/rsyslog
RUN apt-get update
RUN apt-get install -y rsyslog
RUN apt-get install -y rsyslog-kafka
COPY rsyslog.conf /etc
COPY rsyslog.conf etc/rsyslog-confd/
RUN apt-get install nano
RUN apt-get install vnstat
EXPOSE 514/tcp
EXPOSE 514/udp

EXPOSE 10514/tcp
EXPOSE 10514/udp
CMD ["/usr/sbin/rsyslogd", "-d", "-n", "-f", "/etc/rsyslog.conf"]