FROM node:lts-alpine as build-stage

ENV VUE_APP_API_HOST=https://api.sandbox.overledger.io
ENV VUE_APP_SUBSCRIPTION_UPDATE_API=https://demo-app-backend.dev-sandbox.testing.quantnetwork.net

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
ENV NODE_ENV=production
RUN yarn build --mode production
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
