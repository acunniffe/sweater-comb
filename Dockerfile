FROM node:14-alpine AS build-env
WORKDIR /sweater-comb
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install
COPY . .
RUN yarn build

FROM node:14-alpine AS clean-env
COPY --from=build-env /sweater-comb/build /sweater-comb
COPY --from=build-env /sweater-comb/package*.json /sweater-comb/
WORKDIR /sweater-comb
RUN yarn install --production

FROM gcr.io/distroless/nodejs:14
ENV NODE_ENV production
COPY --from=clean-env /sweater-comb /sweater-comb
WORKDIR /sweater-comb
USER 1000
ENTRYPOINT ["/nodejs/bin/node", "index.js"]
