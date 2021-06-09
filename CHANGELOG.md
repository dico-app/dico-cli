# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.8](https://github.com/dico-app/dico-cli/compare/v0.0.7...v0.0.8) (2021-06-09)


### Chore

* **deps:** maintain dependencies ([883ec6d](https://github.com/dico-app/dico-cli/commit/883ec6dcf19f4a69cf3dd4fda718e68b7c44240e))


### Documentation

* update link to docs ([d1667d0](https://github.com/dico-app/dico-cli/commit/d1667d0d36573edde38be9462d91af34ef270b97))

### [0.0.7](https://github.com/dico-app/dico-cli/compare/v0.0.6...v0.0.7) (2021-06-07)


### Features

* add dico fetch command ([0fcabd1](https://github.com/dico-app/dico-cli/commit/0fcabd1337d1fbec68ae01838704bb23eeb2e5c3))


### Refactor

* make endpoint not default to /api ([8149c0f](https://github.com/dico-app/dico-cli/commit/8149c0f3b822e82ab3269d338d8d1e7fa1a3b56d))

### [0.0.6](https://github.com/dico-app/dico-cli/compare/v0.0.5...v0.0.6) (2021-06-03)


### Features

* add dico push command ([3b2d94f](https://github.com/dico-app/dico-cli/commit/3b2d94f5378f21474d5c82a5db515cb8329e74e7))
* handle correctly unauthorized actions ([002e488](https://github.com/dico-app/dico-cli/commit/002e4889d1d37f5c95657f5f5e4978a5147fab49))
* provide line and column information when crawling files ([8e9d00a](https://github.com/dico-app/dico-cli/commit/8e9d00a58bbc6fa38af50ccf2f6a5603a13979c3))


### Refactor

* extract ProjectKey into proper interface ([9e4d278](https://github.com/dico-app/dico-cli/commit/9e4d278fead46f76f028845f96f0a0534726ec7a))
* move unique key function to listr tasks ([b67a43f](https://github.com/dico-app/dico-cli/commit/b67a43fe1b77e42d0ffd653078ed8bcd76b3dd99))


### Chore

* **config:** update commitlint ([2d17f51](https://github.com/dico-app/dico-cli/commit/2d17f5167a9513de8eb3c605137dc3839a8e9fb2))
* **deps:** cleanup dependencies ([34bd956](https://github.com/dico-app/dico-cli/commit/34bd95684314d2374263e5843e4677713815bbbe))
* **deps:** maintain dependencies ([d598abb](https://github.com/dico-app/dico-cli/commit/d598abbef42bf0bfaa55e32c446aca4c78aa03ac))

### [0.0.5](https://github.com/dico-app/dico-cli/compare/v0.0.4...v0.0.5) (2021-06-02)


### Features

* add dico build command ([d1d3c0d](https://github.com/dico-app/dico-cli/commit/d1d3c0d8ff3919bfe38aa102516584615cd0fe7c))
* add force option for dico init ([540827b](https://github.com/dico-app/dico-cli/commit/540827b60b16e0bb28774e161b21c24967306718))
* improve help message ([b8c3669](https://github.com/dico-app/dico-cli/commit/b8c36691b5ef36becf22be1810a99d636bb3e48d))


### Documentation

* add playground ([347f7c9](https://github.com/dico-app/dico-cli/commit/347f7c919e1227fa308b04eb960975ece3a34b29))
* rename playground files to prevent conflicts ([32365e9](https://github.com/dico-app/dico-cli/commit/32365e9b74e3bbcb2bf4891d2dce43888f688329))
* update readme ([b34f0f0](https://github.com/dico-app/dico-cli/commit/b34f0f08e1c1286be9fcef9ec03eb4481b4859e1))

### [0.0.4](https://github.com/dico-app/dico-cli/compare/v0.0.3...v0.0.4) (2021-06-01)


### Features

* add `dico init` command ([6a61930](https://github.com/dico-app/dico-cli/commit/6a61930da35beb0bba9d3e8d43c557234d8b13d8))


### Bug Fixes

* don't throw on 401 ([e9d989a](https://github.com/dico-app/dico-cli/commit/e9d989a924af3890f7cd2d2d441d44ba458453b8))

### [0.0.3](https://github.com/dico-app/dico-cli/compare/v0.0.2...v0.0.3) (2021-05-27)


### Features

* use endpoint from .dicorc or fallback to production ([ce4a6ec](https://github.com/dico-app/dico-cli/commit/ce4a6ece0a5c4dab93dace88a1fc21b25b1714a0))


### Documentation

* update install process ([d6be728](https://github.com/dico-app/dico-cli/commit/d6be72875d92b13e7c3b3772297e95df6a3cb956))


### Refactor

* make const top level ([d734832](https://github.com/dico-app/dico-cli/commit/d7348322824b830040019bd7cce886ffaae0bfbd))
* refactor help message ([82dee62](https://github.com/dico-app/dico-cli/commit/82dee625b5d665dc71e95a8c22ab8ad28bed08e2))

### 0.0.2 (2021-05-27)


### Features

* setup cli and helpers ([85b2da0](https://github.com/dico-app/dico-cli/commit/85b2da0549236acde42c29b163f9ebe032ee513e))
* setup client and dicorc libraries ([5456dd0](https://github.com/dico-app/dico-cli/commit/5456dd0998a5f5bf512f16ee828aea8796085fa8))
* setup default commands ([cc0eeb9](https://github.com/dico-app/dico-cli/commit/cc0eeb90f42c4ff7dcb1207bfbaccd046dbd2d70))
* setup user auth commands (signin/out/whoami) ([215d217](https://github.com/dico-app/dico-cli/commit/215d217bbe499efd840956d545e75775e1f3e17e))


### Chore

* setup repository ([a6aa71b](https://github.com/dico-app/dico-cli/commit/a6aa71b7ba7df263a2d36e386de0c1659fd5aa08))
