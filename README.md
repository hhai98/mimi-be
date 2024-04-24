## Installation

```bash
$ yarn install
```

## Running the app

```bash
# watch mode
$ yarn dev

# production mode
$ yarn start:prod
```

## Export the production database:

=> Run at local machine where you want to import database
=> You need to remove existing database and recreate
=> Need to setup and config the cron_send_backup_db.sh file

./copy_production_db_to_local.sh

## Setup mail sender

1. Turn on 2-step verification
https://myaccount.google.com/security

2. Goto to add password
https://myaccount.google.com/u/0/apppasswords

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Run docker

```bash
$ yarn dc:prod
```

## URL

```bash
# Run app
$ yarn dev => http://localhost:3000

# Swagger
$ http://localhost:3000/swagger

```

To create migration:
yarn migration:generate -- src/database/migrations/CreateNameTable

* Remember: After any changes at entities, we need to run following commands to sync database
yarn schema:sync


## VPS Information
...