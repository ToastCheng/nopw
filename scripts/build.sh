#!/bin/bash
set -e

DIR=$(echo $(cd $(dirname ${BASH_SOURCE[0]})/.. && pwd))

# import helper functions
. ${DIR}/scripts/helper.sh

function help() {
  echo "Usage: $0 [-s svc] [-i 0]"
  echo "-s: specify a docker-compose service"
}

function build() {
  print "build images.."
  for dockerfile in ${DIR}/docker/*.Dockerfile
  do
    dockername=$(basename ${dockerfile})
    svcname=${dockername%.*} # remove extension.
    if [ "$1" = "" ] || [ "$1" = "$svcname" ]; then
      docker build \
        -f ${dockerfile} \
        -t local/${svcname} \
        ${DIR}/src/${svcname}
      if [ $IMAGE ]; then
        docker save \
          local/${svcname} \
          -o ${DIR}/images/${svcname}
      fi
    fi
  done
  print "done."
}

# read flags.
while getopts d:f:s:n:i option
do
  case $option in
  s)  SERVICE=$OPTARG;;
  i)  IMAGE=true;;
  *)  help
      exit 1
  esac
done

# build and save images.
build $SERVICE

