FROM camptocamp/rsyslog-bin
RUN mkdir --p /var/spool/rsyslog
RUN apt-get update
RUN apt-get install -y rsyslog rsyslog-kafka rsyslog-mmjsonparse
EXPOSE 514/tcp
EXPOSE 514/udp
EXPOSE 10514/tcp
EXPOSE 10514/udp
COPY /49-crato-kafka.conf /etc/
COPY /50-default.conf /etc/
COPY rsyslog.conf /etc
COPY rsyslog.conf /etc/rsyslog-confd/
CMD ["/usr/sbin/rsyslogd", "-n", "-f", "/etc/rsyslog.conf"]