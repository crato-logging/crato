FROM jumanjiman/rsyslog
COPY /49-crato-kafka.conf /etc/
COPY /50-default.conf /etc/
COPY rsyslog.conf /etc
RUN mkdir -p /var/spool/rsyslog
RUN adduser -u 888 syslog adm -D
RUN /usr/sbin/rsyslogd -n -f /etc/rsyslog.conf
EXPOSE 514/udp
EXPOSE 514/tcp
EXPOSE 10514/tcp
CMD ["tail" "-f" "/dev/null"] #keep it running