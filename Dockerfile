###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development
WORKDIR /usr/src/app
COPY package.json yarn.lock startup.sh .env.production ./
RUN yarn install --frozen-lockfile
COPY . .

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build
WORKDIR /usr/src/app
COPY package.json yarn.lock startup.sh .env.production ./
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY . .
# RUN yarn build:prod
RUN yarn build
# Removes the existing node_modules directory and passing in --prod ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN yarn install --prod --frozen-lockfile && yarn cache clean --all
RUN yarn global add @nestjs/cli typescript ts-node env-cmd

###################
# PRODUCTION
###################

FROM node:18-alpine As production
WORKDIR /app
# Copy the bundled code from the build stage to the production image
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY package.json ./
COPY .env.production .env
EXPOSE $PORT
CMD [ "yarn", "start:prod" ]

