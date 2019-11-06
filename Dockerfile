FROM node:12.3.1-alpine as builder

RUN apk update && \
    apk add --no-cache git

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM opentracing/nginx-opentracing:0.9.0

# RUN apk update && \
#     apk add --no-cache curl

COPY --from=builder /usr/src/app/build /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/jaeger-config.json /etc/jaeger-config.json

# HEALTHCHECK --interval=1m --timeout=3s CMD curl --fail http://127.0.0.1/health || exit 1
EXPOSE 80

ENTRYPOINT ["nginx","-g","daemon off;"]