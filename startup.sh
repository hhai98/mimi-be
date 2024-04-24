#!/bin/bash
yarn schema:sync && yarn seed:run && yarn start:prod
