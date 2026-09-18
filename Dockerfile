FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

ENV API_UPSTREAM=http://api:8000

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.sh /usr/local/bin/dashboard-entrypoint.sh
RUN chmod +x /usr/local/bin/dashboard-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/dashboard-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

EXPOSE 80