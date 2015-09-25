ZUP Painel
=========

This document describes how to install and build the ZUP Painel project.

# Requirements

 - nvm >= 0.26.0
 - npm >= 2.7.0

# Setup

After cloning the repository:
  
    cd zup-painel
    nvm install
    npm run setup

Create a file name `.env` at the repository's root with the following content:

    THEME=zup
    BASE_URL=127.0.0.1
    API_URL=http://your-api.zupinstance.com
    MAP_LAT=-23.549671
    MAP_LNG=-46.6321713
    MAP_ZOOM=11
    DEFAULT_CITY="São Bernado do Campo"
    DEFAULT_STATE=SP
    DEFAULT_COUNTRY=Brasil
  
In order to run tests you also need to set up the following:

    PAINEL_URL=http://127.0.0.1:9001
    USER_EMAIL=teste.zup@gmail.com
    USER_PASSWORD=123456

Change the `API_URL` to point to your instance. `MAP`'s `LAT` and `LNG` is used to center the maps starting position. 
`DEFAULT`'s City, State and Country is used an default value for report's addresses fields. If you need to access though
a virtual machine, you should change the `BASE_URL` to the IP `0.0.0.0`. This project supports themes and there is an
 environment variable named `THEME` that should be set up to `zup` or `unicef`.

# Production build

    npm run prod-build

The `dist` directory will contain the ready-to-deploy assets.

# Dev server

    npm run dev-server
 
# Running tests

    npm run test

