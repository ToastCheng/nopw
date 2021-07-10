FROM mysql:8.0.17
# mysql will run every *.sql file in /docker-entrypoint-initdb.d by default
# but it will check if /var/lib/mysql is empty
COPY ./init.sql /docker-entrypoint-initdb.d