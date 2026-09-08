<div align="center">

[English](README.md) | [Français](README.fr.md)

[![Made with Vue 3][vue-shield]][vue-url]
[![Made with TypeScript][typescript-shield]][typescript-url]
[![Built with Vite][vite-shield]][vite-url]
[![Styled with Tailwind CSS][tailwindcss-shield]][tailwindcss-url]
[![State with Pinia][pinia-shield]][pinia-url]
[![Powered by Colyseus][colyseus-shield]][colyseus-url]
[![Powered by Docker][docker-shield]][docker-url]

</div>

<div align="center">
  <a href="./">
    <img src="public/favicon-512x512.png" alt="Countries Game logo" width="140" height="140">
  </a>

  <h1 align="center">
    Countries Game — Web Application
  </h1>
</div>

Countries Game is a multiplayer geography game where players take turns naming countries before time
runs out. Built with TypeScript, Vue 3 and Vite, this web application lets you create a room, invite
friends and track discovered countries on an interactive globe.

The interface is available in French and English. It displays scores, progress by continent and the
remaining time, and communicates in real time with the
[Colyseus game server](https://github.com/bertrand-awz/countries-game-colyseus-server).

## Prerequisites

To run the application or contribute to the project, install:

1. Node.js 22 (version 22.13.0 or later in the 22.x series) with npm.
2. The [Countries Game server](https://github.com/bertrand-awz/countries-game-colyseus-server), running
   locally or accessible remotely, to load the map and play.

Docker is optional and lets you build the application and serve it with Nginx using the `Dockerfile`.

---

## Useful commands

Run the following commands from the web project's root directory.

### 1. Install and configure the project

```bash
npm ci
cp .env.example .env
```

The `.env` file must contain the game server's URL:

```dotenv
VITE_GAME_SERVER_URL=http://localhost:2567
```

This variable is required and is used by both the Colyseus client and the map's HTTP requests.
Use an `http://` or `https://` URL that is accessible from the browser. If the server runs on a
different port or machine, update this value and restart Vite.

### 2. Start the development server

Start the game server in another terminal, then run:

```bash
npm run dev
```

Open the URL displayed by Vite, usually `http://localhost:5173`. Create a room, share its ID or
invitation link, then start the game once the players have joined.

### 3. Build the project

```bash
npm run build
```

This command checks types with `vue-tsc`, then builds the application into the `dist/` directory.

To preview this build locally:

```bash
npm run preview
```

Open the URL displayed by Vite, usually `http://localhost:4173`.

**Note:** `VITE_GAME_SERVER_URL` is embedded in the application at build time. Changing the server URL
requires a new build, including when using Docker.

### 4. Run tests

```bash
npm test
```

This command checks the test types, then runs the tests in `tests/` using Node.js's built-in test
runner. They cover use cases, stores and Colyseus adapters, among other components.
`npm run tests` runs the same suite.

### 5. Check and apply code style

The project uses ESLint for code analysis and Prettier for formatting.

To check the code and its formatting:

```bash
npm run lint
npm run format:check
```

To apply automatic fixes and formatting:

```bash
npm run lint:fix
npm run format
```

### 6. Run with Docker

The `Dockerfile` builds the application with Vite, then serves the contents of `dist/` with Nginx on
container port `80`. First, start the game server at `http://localhost:2567`. Then, from the web
project's root directory, build the image and start the container in the background:

```bash
docker build \
  --build-arg VITE_GAME_SERVER_URL=http://localhost:2567 \
  -t name-countries-game-webapp .

docker run --rm -d --name name-countries-game-webapp \
  -p 127.0.0.1:5173:80 name-countries-game-webapp
```

The application is available at `http://localhost:5173`. In production, replace the build argument
with the public API URL, such as `https://api.domain.dev`.

The server URL is used by the browser: when playing locally, `localhost` refers to the machine where
you open the application. With the commands shown here, both containers' ports are accessible only
from the host machine.

To stop the web container:

```bash
docker stop name-countries-game-webapp
```

The `--rm` option removes the container when it stops. To start it again, rerun the `docker run`
command.

---

## Project structure

| Location              | Purpose                                                       |
| --------------------- | ------------------------------------------------------------- |
| `src/app/`            | Initialization, configuration, routing and translations.      |
| `src/domain/`         | Game models, constraints and service interfaces.              |
| `src/application/`    | Use cases, Pinia stores and event reactions.                  |
| `src/infrastructure/` | Colyseus and HTTP clients, sounds and notifications.          |
| `src/presentation/`   | Vue views and components, including the interactive D3 globe. |
| `src/assets/`         | Icons and audio files.                                        |
| `tests/`              | Tests for the domain, application and adapters.               |
| `test-support/`       | Alias resolution for running tests.                           |

---

## Contributing

After making changes, run the tests, style checks and build using the commands above. When changing
network communication, check compatibility with the game server. Also update the French and English
translations when changing interface text.

Keep the English and French README files in sync when updating the documentation.

<!-- BADGES LINKS -->
<!-- Colyseus symbol: https://github.com/colyseus/colyseus/blob/master/media/logo.svg -->

[vue-shield]: https://img.shields.io/badge/Made%20with-Vue%203-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[vue-url]: https://vuejs.org/
[typescript-shield]: https://img.shields.io/badge/Made%20with-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=3178C6
[typescript-url]: https://www.typescriptlang.org/
[vite-shield]: https://img.shields.io/badge/Built%20with-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=646CFF
[vite-url]: https://vite.dev/
[tailwindcss-shield]: https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=06B6D4
[tailwindcss-url]: https://tailwindcss.com/
[pinia-shield]: https://img.shields.io/badge/State%20with-Pinia-FFD859?style=for-the-badge&logo=pinia&logoColor=FFD859
[pinia-url]: https://pinia.vuejs.org/
[colyseus-shield]: assets/img/colyseus-badge.svg
[colyseus-url]: https://colyseus.io/
[docker-shield]: https://img.shields.io/badge/Powered%20by-Docker-blue?style=for-the-badge&logo=docker
[docker-url]: https://www.docker.com/
