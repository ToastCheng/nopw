#!/bin/bash
set -e

DIR=$(echo $(cd $(dirname ${BASH_SOURCE[0]})/.. && pwd))

# import helper functions
. ${DIR}/scripts/helper.sh

function help() {
  echo "Usage: $0 [-s svc]"
  echo "-s: specify service"
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
      if [ "$IMAGE" = "true" ]; then
        docker save \
          local/${svcname} \
          -o ${DIR}/images/${svcname}
      fi
    fi
  done
  print "done."
}



# read flags.
while getopts s:i:n option
do
  case $option in
  s)  SERVICE=$OPTARG;;
  n)  NOBUILD="true";;
  i)  IMAGE="true";;
  *)  help
      exit 1
  esac
done

# kubectl delete deploy --all --namespace default
# kubectl delete pod --all --namespace default

if [ "$NOBUILD" = "" ]; then
  build $SERVICE
fi

if [ "$SERVICE" = "" ]; then
  kubectl apply -f ${DIR}/deploy/
else
  kubectl delete deploy ${SERVICE}
  kubectl apply -f ${DIR}/deploy/${SERVICE}.yaml
fi

