<div align="center">

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
    <img src="public/favicon-512x512.png" alt="Logo Countries Game" width="140" height="140">
  </a>

  <h1 align="center">
    Countries Game — Application web
  </h1>
</div>

Countries Game est un jeu de géographie multijoueur dans lequel les joueurs nomment des pays à tour de
rôle avant la fin du temps imparti. Cette application web, développée en TypeScript avec Vue 3 et Vite,
permet de créer une salle, d'inviter ses amis et de suivre les pays trouvés sur un globe interactif.

L'interface est disponible en français et en anglais. Elle affiche les scores, la progression par
continent et le temps restant, et communique en temps réel avec le
[serveur de jeu Colyseus](https://github.com/bertrand-awz/countries-game-colyseus-server).

## Prérequis

Pour exécuter l'application ou contribuer au projet, installez :

1. Node.js 22, version 22.13.0 ou ultérieure dans cette branche, avec npm.
2. Le [serveur Countries Game](https://github.com/bertrand-awz/countries-game-colyseus-server), démarré
   localement ou accessible à distance, pour charger la carte et jouer.

Docker est optionnel et permet de construire l'application et de la servir avec Nginx à partir du
`Dockerfile`.

---

## Commandes à connaître

Les commandes suivantes s'exécutent à la racine du projet web.

### 1. Installer et configurer le projet

```bash
npm ci
cp .env.example .env
```

Le fichier `.env` doit contenir l'adresse du serveur de jeu :

```dotenv
VITE_GAME_SERVER_URL=http://localhost:2567
```

Cette variable est obligatoire et sert à la fois au client Colyseus et aux appels HTTP de la carte.
Utilisez une adresse `http://` ou `https://` accessible depuis le navigateur. Si le serveur utilise un
autre port ou une autre machine, adaptez cette valeur, puis redémarrez Vite.

### 2. Démarrer l'application en développement

Démarrez le serveur de jeu dans un autre terminal, puis lancez :

```bash
npm run dev
```

Ouvrez l'adresse affichée par Vite, généralement `http://localhost:5173`. Créez une salle, partagez son
identifiant ou son lien d'invitation, puis démarrez la partie une fois les joueurs présents.

### 3. Compiler le projet

```bash
npm run build
```

Cette commande vérifie les types avec `vue-tsc`, puis génère l'application dans le dossier `dist/`.

Pour prévisualiser cette version localement :

```bash
npm run preview
```

Ouvrez l'adresse affichée par Vite, généralement `http://localhost:4173`.

**Note :** `VITE_GAME_SERVER_URL` est intégrée à l'application lors de la compilation. Toute
modification de l'adresse du serveur nécessite une nouvelle compilation, y compris avec Docker.

### 4. Lancer les tests

```bash
npm test
```

Cette commande vérifie les types des tests, puis lance les tests du dossier `tests/` avec le lanceur
intégré à Node.js. Ils couvrent notamment les cas d'utilisation, les stores et les adaptateurs Colyseus.
`npm run tests` exécute la même suite.

### 5. Vérifier et appliquer le style

Le projet utilise ESLint pour l'analyse du code et Prettier pour le formatage.

Pour vérifier le code et son formatage :

```bash
npm run lint
npm run format:check
```

Pour appliquer les corrections automatiques et le formatage :

```bash
npm run lint:fix
npm run format
```

### 6. Démarrer avec Docker

Le `Dockerfile` compile l'application avec Vite, puis sert le contenu de `dist/` avec Nginx sur le port
`80` du conteneur. Démarrez d'abord le serveur de jeu sur `http://localhost:2567`, puis, depuis la racine
du projet web, construisez l'image et démarrez le conteneur en arrière-plan :

```bash
docker build \
  --build-arg VITE_GAME_SERVER_URL=http://localhost:2567 \
  -t name-countries-game-webapp .

docker run --rm -d --name name-countries-game-webapp \
  -p 127.0.0.1:5173:80 name-countries-game-webapp
```

L'application est accessible sur `http://localhost:5173`. En production, remplacez l'argument de
construction par l'adresse publique de l'API, par exemple `https://api.domain.dev`.

L'adresse du serveur est utilisée par le navigateur : pour jouer localement, `localhost` désigne la
machine sur laquelle vous ouvrez l'application. Les ports des deux conteneurs sont accessibles
uniquement depuis la machine hôte avec les commandes proposées.

Pour arrêter le conteneur web :

```bash
docker stop name-countries-game-webapp
```

L'option `--rm` supprime le conteneur à son arrêt. Pour le relancer, réexécutez la commande `docker run`.

---

## Structure du projet

| Emplacement           | Rôle                                                         |
| --------------------- | ------------------------------------------------------------ |
| `src/app/`            | Initialisation, configuration, navigation et traductions.    |
| `src/domain/`         | Modèles du jeu, contraintes et interfaces des services.      |
| `src/application/`    | Cas d'utilisation, stores Pinia et réactions aux événements. |
| `src/infrastructure/` | Clients Colyseus et HTTP, sons et notifications.             |
| `src/presentation/`   | Vues et composants Vue, dont le globe interactif avec D3.    |
| `src/assets/`         | Icônes et fichiers audio.                                    |
| `tests/`              | Tests du domaine, de l'application et des adaptateurs.       |
| `test-support/`       | Résolution des alias pour l'exécution des tests.             |

---

## Comment contribuer au projet

Après vos modifications, lancez les tests, les vérifications de style et la compilation avec les
commandes ci-dessus. Pour une modification des échanges réseau, vérifiez la compatibilité avec le
serveur de jeu. Pensez également à mettre à jour les traductions françaises et anglaises si vous
modifiez les textes de l'interface.

<!-- BADGES LINKS -->
<!-- Symbole Colyseus : https://github.com/colyseus/colyseus/blob/master/media/logo.svg -->

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
