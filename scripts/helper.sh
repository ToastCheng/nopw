#!/bin/bash


function print() {
  echo "`tput setaf 2`$1`tput sgr0`"
}

function get_tag() {
  local component=$1
  local flavor=$2
  local timestamp=$(get_timestamp)
  echo "${component}-${flavor}-$(get_commit_hash)-${timestamp}"
}

function get_timestamp() {
  echo "$(date +%Y%m%d%H%M%S)"
}

function get_commit_hash() {
  echo "$(git log -1 --format=%h)"
}

