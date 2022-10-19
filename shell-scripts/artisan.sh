#!/bin/bash
# echo "Starting Artisan Script"
# docker-compose exec php php /var/www/html/artisan $*
# docker-compose run --rm artisan migrate
# docker-compose run --rm app php artisan $@
docker-compose exec app php artisan $@