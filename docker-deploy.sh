#!/bin/sh

rm -rf dist/

yarn
yarn build:force

date=$(date +%s)
tag="$DOCKERHUB_USERNAME"/e-commerce-admin-client:"$date"
latest="$DOCKERHUB_USERNAME"/e-commerce-admin-client:latest

docker build . --file Dockerfile -t "$tag" -t "$latest"

docker push "$tag"
docker push "$latest"