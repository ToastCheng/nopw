FROM golang:1.12.9-alpine as compiler
RUN apk add --update --no-cache git

ENV GO111MODULE=on
# cache module
WORKDIR /
COPY ./go.mod ./go.sum ./
RUN go mod download

# build release
ADD . ./
RUN go build -o ./bin/server .

FROM alpine:3.11.3
WORKDIR /fido
RUN apk add --update --no-cache ca-certificates tzdata
RUN cp /usr/share/zoneinfo/Asia/Taipei /etc/localtime && echo "Asia/Taipei" > /etc/timezone
COPY --from=compiler /bin/server .
CMD ["./server"]