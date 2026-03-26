# -------------------------------------------------------------------- BUILD STAGE
ARG BUILD_REGISTRY
ARG RUBY_VERSION=3.4.7
ARG ALPINE_VERSION=alpine3.22
FROM ${BUILD_REGISTRY}ruby:${RUBY_VERSION}-${ALPINE_VERSION} AS build-env

ENV NODE_VERSION=22.22
ENV BUILD_PACKAGES="bash curl wget curl-dev build-base tzdata git"
ENV PYTHON_PACKAGES="python3 py3-pip"
ENV BUILD_DEP_PACKAGES="postgresql-dev yaml-dev"
ENV RUNTIME_PACKAGES="libc6-compat nodejs=~${NODE_VERSION} gettext libintl npm vips"
ENV RAILS_ENV=production
ENV PYTHON=/usr/bin/python

# Grab our path from --build-arg and store it in an env
ARG APP_ROOT
ENV APP_ROOT=${APP_ROOT}

# Temporary build-time secrets needed to run rails processes.
# These are never persisted in the container images
ENV PRIMERO_SECRET_KEY_BASE=PRIMERO_SECRET_KEY_BASE

# Test if variables have been defined by build script
# otherwise return 1 and stop docker build
RUN set -ex ; \
        test -n "$APP_ROOT" || (printf "APP_ROOT not defined\n" ; \
        return 1);

# Install our packages
RUN set -euox pipefail \
        ; apk update \
        ; apk add $BUILD_PACKAGES \
        ; apk add --no-cache $PYTHON_PACKAGES \
        ; ln -sf python3 /usr/bin/python \
        ; apk add $BUILD_DEP_PACKAGES \
        ; apk add --no-cache $RUNTIME_PACKAGES \
        ; rm -rf /var/cache/apk/*

# Install Gems first for docker cache
WORKDIR ${APP_ROOT}

COPY [ "Gemfile", "Gemfile.lock", "$APP_ROOT/" ]

# Run bundle install
RUN set -euox pipefail \
        ; if [ $RAILS_ENV == "production" ]; \
        then \
        export BUNDLER_WITHOUT="development test" \
        ; else \
        export BUNDLER_WITHOUT="" \
        ; fi \
        && bundle install

# Run pnpm install
COPY [ "package.json", "pnpm-lock.yaml", "$APP_ROOT/" ]

RUN set -euox pipefail \
        ; npm install -g pnpm@latest-10; pnpm install

# Note: This has its build context set to the root dir so prepend 'docker' to
# items that need to be copied from that directory
#
# Now copy over primero kiosk and do setup

COPY [ ".", "$APP_ROOT" ]

RUN set -euox pipefail \
        ; mkdir -p "$APP_ROOT/tmp/export" \
        ; mkdir -p "$APP_ROOT/tmp/exports"

# Intentionally cached seperately
# Generates 32 random characters for the build-id...build id MUST be 32 characters (as its hardcoded)
RUN set -euox pipefail \
        ; mkdir -p /srv/kiosk/public \
        ; touch /srv/kiosk/public/build-id \
        ; echo "$RANDOM" > /srv/kiosk/public/build-id

# Build UI
RUN set -euox pipefail \
        ; rails primero_kiosk:i18n_js \
        ; SECRET_KEY_BASE_DUMMY=1 ./bin/rails assets:precompile

RUN set -euox pipefail \
        ; rm -rf node_modules .tmp \
        package.json pnpm-lock.yaml babel.config.js app/frontend \
        /usr/local/bundle/bundler/gems/*/.git \
        /usr/local/bundle/cache/

# -------------------------------------------------------------------- FINAL
ARG BUILD_REGISTRY
FROM ${BUILD_REGISTRY}ruby:${RUBY_VERSION}-${ALPINE_VERSION}

ENV BUILD_PACKAGES=bash
ENV RUNTIME_PACKAGES="libpq gettext libintl vips tini curl"

ARG APP_UID
ARG APP_GID
ENV USER_ID=${APP_UID}
ENV GROUP_ID=${APP_GID}

ARG APP_ROOT
ENV APP_ROOT=${APP_ROOT}
ENV RAILS_ENV=production

# Install our packages
RUN set -euox pipefail \
        ; apk update \
        ; apk add --no-cache $BUILD_PACKAGES \
        ; apk add --no-cache $RUNTIME_PACKAGES \
        ; rm -rf /var/cache/apk/*

COPY [ "docker/sub.sh", "docker/application/root/", "/" ]
COPY --from=build-env /usr/local/bundle/ /usr/local/bundle/
COPY --from=build-env $APP_ROOT $APP_ROOT

WORKDIR $APP_ROOT

# Creating User primero to run the contianer instead of root.  Also chaniging permissions and
# ownership of the APP_ROOT, and the storage and pubic volumes.
RUN set -euox pipefail \
        ; addgroup -g $GROUP_ID docker-primero \
        ; adduser --disabled-password --gecos '' -u $USER_ID -G docker-primero docker-primero \
        ; mkdir -p /srv/kiosk/storage \
        ; chmod -R 700 /srv/kiosk/storage \
        ; chown -R docker-primero:docker-primero "$APP_ROOT" \
        ; mkdir -p /share/public \
        ; chmod -R 755 /share/public \
        ; chown -R docker-primero:docker-primero /share/public

# Switching to User primero to run the container.
USER docker-primero

ENTRYPOINT ["/sbin/tini", "--", "/entrypoint.sh"]

CMD [ "primero-start" ]
