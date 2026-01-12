#! /bin/sh
set -euox

exec "./compose.sh" --profile db -f "docker-compose.db.yml" -f "docker-compose.local.yml" "${@}"
