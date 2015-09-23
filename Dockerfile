FROM selenium/standalone-chrome:2.47.1

USER root

RUN DEBIAN_FRONTEND=noninteractive apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get install -yq --no-install-recommends build-essential git-core bzip2 curl python

# Install Nodejs, bower and grunt
ENV NODE_VERSION 0.12.4
ENV NPM_VERSION 2.14.0

RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz" \
	&& curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
	&& gpg --verify SHASUMS256.txt.asc \
	&& grep " node-v$NODE_VERSION-linux-x64.tar.gz\$" SHASUMS256.txt.asc | sha256sum -c - \
	&& tar -xzf "node-v$NODE_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components=1 \
	&& rm "node-v$NODE_VERSION-linux-x64.tar.gz" SHASUMS256.txt.asc \
	&& npm install -g npm@"$NPM_VERSION" \
	&& npm cache clear \
	&& npm install -g bower grunt-cli gulp

# Install compass
RUN DEBIAN_FRONTEND=noninteractive apt-get install -yq --no-install-recommends ruby ruby-dev && gem install compass

# Install application dependencies
RUN bower --allow-root cache clean && git config --global url."https://".insteadOf git://

# Build ZUP Painel
RUN mkdir /tmp/zup-painel
WORKDIR /tmp/zup-painel
ADD ./bower.json ./bower.json
ADD ./package.json ./package.json
RUN npm install && bower install --allow-root
ADD . /tmp/zup-painel
RUN mv bower_components app/bower_components
RUN NODE_ENV=production grunt build
RUN ./node_modules/grunt-protractor-runner/scripts/webdriver-manager-update

COPY entry_point.sh /opt/bin/entry_point.sh
RUN chmod +x /opt/bin/entry_point.sh

USER seluser
