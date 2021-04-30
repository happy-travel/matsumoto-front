FROM node:16.0.0-alpine as builder

RUN apk update && \
    apk add --no-cache git

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ARG IDENTITY_URL
ARG EDO_URL
ARG OSAKA_URL
ARG SENTRY_DSN
ARG SENTRY_ENVIRONMENT
ARG BUILD_VERSION

ENV BUILD_VERSION=$BUILD_VERSION
ENV IDENTITY_URL=$IDENTITY_URL
ENV EDO_URL=$EDO_URL
ENV OSAKA_URL=$OSAKA_URL
ENV SENTRY_DSN=$SENTRY_DSN
ENV SENTRY_ENVIRONMENT=$SENTRY_ENVIRONMENT

RUN npm run build

FROM nginx:1.20.0-alpine

RUN apk update && \
    apk add --no-cache curl

COPY --from=builder /usr/src/app/build /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

HEALTHCHECK --interval=1m --timeout=3s CMD curl --fail http://127.0.0.1/health || exit 1
EXPOSE 80

ENTRYPOINT ["nginx","-g","daemon off;"]