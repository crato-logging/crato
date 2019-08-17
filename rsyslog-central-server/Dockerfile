FROM camptocamp/rsyslog-bin
RUN mkdir -p /var/spool/rsyslog /etc/rsyslog.confd/
RUN apt-get update
RUN apt-get install -y rsyslog rsyslog-kafka logrotate rsyslog-mmjsonparse rsyslog-doc rsyslog-imptcp rsyslog-gnutls rsyslog-openssl rsyslog-mmrm1stspace rsyslog-mmutf8fix apparmor
EXPOSE 514/tcp 514/udp 10514/tcp 10514/udp
COPY /49-crato-kafka.conf /etc/rsyslog.d
COPY /50-default.conf /etc/rsyslog.d
COPY rsyslog.conf /etc
COPY rsyslog.conf /etc/rsyslog-confd/
CMD ["/usr/sbin/rsyslogd", "-n", "-f", "/etc/rsyslog.conf"]