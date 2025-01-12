# sphinx-tribes

![Tribes](https://github.com/stakwork/sphinx-tribes/raw/master/img/sphinx-tribes.png)

Decentralized message broker for public groups in Sphinx. Anyone can run a **sphinx-tribes** server, to route group messages.

**sphinx-tribes** clients can be **sphinx-relay** nodes, apps, websites, or IoT devices.

### How

**sphinx-tribes** is an MQTT broker that any node can subscribe to. Message topics always have two parts: `{receiverPubKey}/{groupUUID}`. Only the owner of the group is allowed to publish to it: all messages from group members must be submitted to the owner as an Lightning keysend payment. The group `uuid` is a timestamp signed by the owner.

![Tribes](https://github.com/stakwork/sphinx-tribes/raw/master/img/tribes.jpg)

### Authentication

Authentication is handled by [sphinx-auth](https://github.com/stakwork/sphinx-auth)

### build

docker build --no-cache -t sphinx-tribes .

### run against sphinx-stack

To run tribes frontend locally, use these ports:

- tribes: `yarn start:tribes:docker` (localhost:23000)
- people: `yarn start:people:docker` (localhost:23007)

### Run frontend locally against people.sphinx.chat
If you would like to run just the frontend do the following

line 77 in `frontend/app/src/App.tsx` change `'localhost:3000': Mode.TRIBES` -> `'localhost:3000': Mode.COMMUNITY`

in `frontend/app/src/host.ts` return `"people.sphinx.chat"`
