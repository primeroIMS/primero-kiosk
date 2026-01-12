#!/bin/bash
set -euxo pipefail

# Grab the variables set in the defaults
# These must be passed in explicitly with --build-arg
# and the defined again as an
source ./defaults.env
test -e ./local.env && source ./local.env

USAGE="Usage ./build application|worker|all [-t <tag>] [-r <repository>] [-b <registry>] [-l]"

if [[ $# -eq 0 ]]; then
  echo "${USAGE}"
  exit 1
fi

image=${1}
shift || true

while getopts "t:r:b:l" opt ; do
  case ${opt} in
    t )
      t=$OPTARG
    ;;
    r )
      r=$OPTARG
    ;;
     b )
      b="${OPTARG}/"
    ;;
    l )
      l=true
    ;;
    \? )
      echo "${USAGE}"
      exit 1
    ;;
  esac
done
shift $((OPTIND -1)) || true

tag=${t:-latest}
repository=${r:-"uniprimeroxacrdev.azurecr.io"}
with_latest=${l:-false}
build_registry=${b:-""}

BUILD_APP="docker build -f application/Dockerfile ../ -t primero-kiosk/application:${tag} -t ${repository}/primero-kiosk/application:${tag} --build-arg APP_ROOT=${APP_ROOT} --build-arg RAILS_LOG_PATH=${RAILS_LOG_PATH} --build-arg APP_UID=${APP_UID} --build-arg APP_GID=${APP_GID} --build-arg BUILD_REGISTRY=${build_registry}"
BUILD_WORKER="docker build -f application/Dockerfile ../ -t primero-kiosk/worker:${tag} -t ${repository}/primero-kiosk/worker:${tag} --build-arg APP_ROOT=${APP_ROOT} --build-arg RAILS_LOG_PATH=${RAILS_LOG_PATH} --build-arg APP_UID=${APP_UID} --build-arg APP_GID=${APP_GID} --build-arg BUILD_REGISTRY=${build_registry} --build-arg IS_WORKER=true"

apply_tags () {
  local image=${1}
  local subtag=${2:-""}
  [[ -n "${subtag}" ]] && subtag="-${subtag}"

  docker tag "primero-kiosk/${image}:${tag}${subtag}" "primeroims-kiosk/${image}:${tag}${subtag}"
  docker tag "primero-kiosk/${image}:${tag}${subtag}" "${repository}/primero-kiosk/${image}:${tag}${subtag}"
  docker tag "primero-kiosk/${image}:${tag}${subtag}" "${repository}/primeroims-kiosk/${image}:${tag}${subtag}"
  if [[ "${with_latest}" == true ]] ; then
    docker tag "primero-kiosk/${image}:${tag}${subtag}" "primero-kiosk/${image}:latest${subtag}"
    docker tag "primero-kiosk/${image}:${tag}${subtag}" "primeroims-kiosk/${image}:latest${subtag}"
    docker tag "${repository}-kiosk/primero/${image}:${tag}${subtag}" "${repository}/primero-kiosk/${image}:latest${subtag}"
    docker tag "${repository}-kiosk/primero/${image}:${tag}${subtag}" "${repository}/primeroims-kiosk/${image}:latest${subtag}"
  fi
}

# this could use getopts for building multiple containers
case ${image} in
  application)
    eval "${BUILD_APP}" && apply_tags application
    ;;
  worker)
    eval "${BUILD_WORKER}" && apply_tags worker
    ;;
  all)
    eval "${BUILD_APP}" && apply_tags application
    eval "${BUILD_WORKER}" && apply_tags worker
    ;;
  *)
    echo "${USAGE}"
    exit 1
  ;;
esac
