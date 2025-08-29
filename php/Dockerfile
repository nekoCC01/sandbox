FROM php:8.3-apache

RUN a2enmod rewrite
RUN cp /etc/apache2/mods-available/headers.load /etc/apache2/mods-enabled/

COPY ./ /var/www/html/