#! /bin/sh
: "${PROJECT_NAME:=primero-kiosk}"

set -euox
exec docker compose -p "${PROJECT_NAME}" --project-directory "../"  --profile app -f "docker-compose.yml" "${@}"
