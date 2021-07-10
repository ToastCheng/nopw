# build.
FROM node:12-alpine AS builder
WORKDIR /app
COPY ./yarn.lock ./package.json ./tsconfig.json ./
RUN yarn
COPY ./public public
COPY ./src src
# ENV PUBLIC_URL "/legacy"
RUN yarn build

FROM nginx:1.17.8-alpine
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build /etc/nginx/html/
RUN apk add --update --no-cache gettext
