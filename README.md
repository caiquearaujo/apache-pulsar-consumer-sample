# Apache Pulsar Sample (Consumer API)

> This repository is for study purposes. Not ready for the production environment.

Apache Pulsar is a high-performance solution for server-to-server messaging. This repository implements Apache Pulsar into two Fastify APIs, are they:

- `/producer`: send a JSON to a message topic;
- `/consumer`: subscribe to a message topic and listen to messages.

## Git Hooks

This repository uses the `husky` library to subscribe to git hooks locally. After cloning it, you must run `npx husky install` on the code base to enable all hooks.

- On pre-commit: will format with Prettier, lint with ESLint and test with Jest.

## Docker

> ⚠️ This application depends on other applications. It's better to use Docker Composer or similar to deploy it. See on Compose section.

### Standalone

If you want to keep it as an individual container you must share at least the network, by default it's `bride`.

1. Run a standalone pulsar container:
   ```sh
	docker run -it -p 6650:6650 -p 8080:8080 \
	 --mount source=pulsardata,target=/pulsar/data \
	 --mount source=pulsarconf,target=/pulsar/conf \
	 apachepulsar/pulsar:2.11.0 bin/pulsar standalone
	 ```
2. Build docker image for consumer `docker build -t apache-pulsar-consumer -f ./Dockerfile.dev .`;
3. Run image in background, mapping the application port and specifying a shared network: `docker run -d -p 3000:3000 --volume $(pwd):/usr/app apache-pulsar-consumer`;
4. After running, you may see it's running with `docker ps` command.

> When usign docker, you may set env variables inline command with `-e` argument or define it on `docker-compose.yml`. To avoid use to many `-e` arguments on development or test env, you may without `docker-compose` or similar, you may use the `.env.development` or `.env.test` files and setting only `ENVIRONMENT` variable on server env.

# Compose

In a parent folder, create the producer and the consumer folder with their code base. Then create the `docker-compose.yml` file on parent folder. You may see the `docker-compose.yml` sample in the `/sample` folder.