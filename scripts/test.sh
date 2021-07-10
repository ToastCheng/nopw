#!/bin/bash
set -e

DIR=$(echo $(cd $(dirname ${BASH_SOURCE[0]})/.. && pwd))

# import helper functions
. ${DIR}/scripts/helper.sh

docker run \
  -p 5050:80 \
  --rm \
  --name localweb \
  local/web

kubectl apply -f ${DIR}/deploy/