#!/bin/bash
# echo "Starting Composer Script"
# docker run --rm -it -v "$(pwd)":/app composer composer $*
# docker-compose run --rm app composer $@
docker-compose exec app composer $*