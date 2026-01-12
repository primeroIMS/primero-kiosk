# Primero-kiosk Docker

## Overview

Docker for Primero-kiosk consists of the following containers: application, and worker. It is compatible with MacOS and modern
Linux distributions.

## Installing Docker and Docker-Compose on Linux

First, install Docker and Docker Compose from the [official docker
website.](https://docs.docker.com/install/).

## TLDR

Run everything from the `docker` directory:

```
cd docker
```

Build your container images and tag with `latest`:

```
./build.sh all
```

Create a `local.env` environment configuration file by
copying one of the sample files and modifying it accordingly.
The file `local.env.sample.production` represents the settings that
are recommended for production-like environments.
See below for configuration environment variables.

```
cp local.env.sample.production local.env
vi local.env
```

Start Primero-kiosk.

```
./compose.configure.sh
./compose.prod.sh up -d
```

## How to Configure the Containers

There are currently two configurations: production and local. The difference is
that production mode, by default, will try and generate Let's Encrypt signed
certificates. This must be configured in the env file. Each deployment
configuration has an env file. Additionally, there is a 'defaults' file which
always inherits from.

The docker containers are configured through environment variables. Environment
variables are defined in the .env files and are propagated into config files at
run time. Each configuration has a respective env file: production.env and
local.env.

Start by looking at the defaults.env file to get a look at which env options can
be modified.

## Folder Structure

All of the Docker components of Primero-kiosk live in the docker sub folder. Inside
the docker folder are sub folders for each container: application, development,
nginx, etc, and an app_common folder that contains shared resources between the
production and the development container.

## Building - Docker Build Context

To reduce build time, most of the containers have their build context set to the
docker directory. The reason for this is that for each container, the entire
build context (ie folder) must be sent to the docker instance. The downside is
that you cannot include files in a container outside of the build context. Thus,
the application container, which rely on configurations outside of the
docker dir, are set to include the entire project in their build context.

## Building - Instructions

Make sure you have created the file `docker/local.env`. At the very least it requires
an entry for `POSTGRES_PASSWORD`.

To build simply run: `./build.sh all`
This will build each container with the tag `latest`. These will be
referenced in the docker-compose files. Pass the `-t <tag>` parameter
to specify a tag other than `latest`. By default the UNICEF ACR service
repository `uniprimeroxacrdev.azurecr.io`, but that can be overwritten with the
`-r <repository>` parameter. The parameter and tag will be applied as a Docker tag on the image.

Note, docker-compose files should not be used as 'docker makefiles.' This will
cause issues down the line. Thus, it is important that building be provided
through other means than the docker-compose file.

## Deploying Locally with Docker Compose

To deploy locally, simply run: `./compose.local.sh up`. The default
configurations provided should work. Local is set to generate and use self
signed SSL certificates.

## Configuration Options - Environment Variables

Docker for Primero-kiosk is configured through environment variables. At runtime, the
containers will generate appropriate configuration files based on what values
you have the environment variables set to.

config option - parameter - description

PRIMERO_HOST - Required. Set this to the server domain hostname.

PRIMERO_HOST_SECRET_KEY_BASE - Required. A secure random number.
To generate, can use the command `LC_ALL=C < /dev/urandom tr -dc '_A-Z-a-z-0-9' | head -c"${1:-32}"`

DEVISE_SECRET_KEY - Required. A secure random number.
To generate, can use the command `LC_ALL=C < /dev/urandom tr -dc '_A-Z-a-z-0-9' | head -c"${1:-32}"`

PRIMERO_HOST_SECRET_KEY_BASE - Required. A secure random number.
To generate, can use the command `LC_ALL=C < /dev/urandom tr -dc '_A-Z-a-z-0-9' | head -c"${1:-32}"`

APP_ROOT - file path - this is where Primero-kiosk gets copied to in the app container.
Default is `srv/primero/application`. Changing this parameter has not been tested.

RAILS_ENV - production / development - sets the build / run mode for Primero-kiosk.

RAILS_LOG_PATH - path - where Primero-kiosk will store its logs. Set when you want the output logged
to a specific file instead of to the container's standard out.

LOCALE_DEFAULT - set this to the language which Primero-kiosk will use. `en` by
default.
