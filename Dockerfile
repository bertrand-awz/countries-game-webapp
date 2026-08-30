FROM node:22-alpine AS builder

ARG VITE_GAME_SERVER_URL
ENV VITE_GAME_SERVER_URL=$VITE_GAME_SERVER_URL

WORKDIR /usr/src/app

RUN test -n "$VITE_GAME_SERVER_URL"

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.29-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
