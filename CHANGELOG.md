<!-- markdownlint-disable MD024 MD025 -->
<!-- markdown-link-check-disable -->

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.1.0](https://github.com/mcarvin8/sf-package-list/compare/v3.0.1...v3.1.0) (2026-08-21)


### Features

* **parser:** replace txml with an in-house XML parser ([#100](https://github.com/mcarvin8/sf-package-list/issues/100)) ([a40d60d](https://github.com/mcarvin8/sf-package-list/commit/a40d60d8183c9679c9501f9fd89666af42f0022d))
* publish as native GitHub Actions ([#102](https://github.com/mcarvin8/sf-package-list/issues/102)) ([5347123](https://github.com/mcarvin8/sf-package-list/commit/5347123deb073cf8c5c7f2570bfb0f2a049b3eb9))


### Bug Fixes

* **actions:** consolidate to a single GitHub Action with a mode input ([#103](https://github.com/mcarvin8/sf-package-list/issues/103)) ([a462dbe](https://github.com/mcarvin8/sf-package-list/commit/a462dbe069525bbfdb6fce5bcc58de0772468523))

## [3.0.1](https://github.com/mcarvin8/sf-package-list/compare/v3.0.0...v3.0.1) (2026-08-19)


### Bug Fixes

* **listToPackageXml:** replace fast-xml-builder with custom writer ([#98](https://github.com/mcarvin8/sf-package-list/issues/98)) ([092876e](https://github.com/mcarvin8/sf-package-list/commit/092876eeb1eaff05c9ae97ff0adefdc0ada8d86c))

## [3.0.0](https://github.com/mcarvin8/sf-package-list/compare/v2.1.0...v3.0.0) (2026-08-18)


### ⚠ BREAKING CHANGES

* **manifest:** metadata type names are no longer validated or case-normalized against Salesforce's metadata registry in either direction. Manifests are now checked only for structural correctness (a single <Package> root with well-formed <types>/<members>/<version> elements). A misspelled or nonexistent metadata type will pass through to the output instead of being rejected here.

### Features

* **manifest:** parse package.xml in-house instead of via source-deploy-retrieve ([#96](https://github.com/mcarvin8/sf-package-list/issues/96)) ([46007b5](https://github.com/mcarvin8/sf-package-list/commit/46007b56d5800f7e1267805195cdf9d3950269f4))

## [2.1.0](https://github.com/mcarvin8/sf-package-list/compare/v2.0.0...v2.1.0) (2026-08-16)


### Features

* **metadata:** support AiAgentDefinition, AiAgentDefinitionVersion ([f9d22c3](https://github.com/mcarvin8/sf-package-list/commit/f9d22c344a128ddf603381071229ca803297395b))


### Bug Fixes

* **deps:** bump the dependencies group across 1 directory with 4 updates ([#93](https://github.com/mcarvin8/sf-package-list/issues/93)) ([8c90478](https://github.com/mcarvin8/sf-package-list/commit/8c904783c03c15d8bca5be0479305be876d33a1a))

## [2.0.0](https://github.com/mcarvin8/sf-package-list/compare/v1.8.0...v2.0.0) (2026-08-05)


### ⚠ BREAKING CHANGES

* **engines:** minimum supported node version raised from 22.0.0 to 22.19.0.

### Bug Fixes

* **engines:** raise node engine floor to 22.19.0 to match dep tree ([938752e](https://github.com/mcarvin8/sf-package-list/commit/938752eee4c2279d3c47216b552a7f4e2b820f41))

## [1.8.0](https://github.com/mcarvin8/sf-package-list/compare/v1.7.0...v1.8.0) (2026-08-01)


### Features

* **metadata:** refresh SDR registry to 12.37.2 ([5b78cc1](https://github.com/mcarvin8/sf-package-list/commit/5b78cc1b5d5a90da9a305d39228bab51f907d40d))

## [1.7.0](https://github.com/mcarvin8/sf-package-list/compare/v1.6.1...v1.7.0) (2026-07-01)


### Features

* **metadata:** bump @salesforce/source-deploy-retrieve ([#85](https://github.com/mcarvin8/sf-package-list/issues/85)) ([456a0c0](https://github.com/mcarvin8/sf-package-list/commit/456a0c0cb16d17b4ea5a1a9c745083fbd5b5ba0f))

## [1.6.1](https://github.com/mcarvin8/sf-package-list/compare/v1.6.0...v1.6.1) (2026-06-29)


### Bug Fixes

* **deps:** bump all deps, remove Node 20 support ([#83](https://github.com/mcarvin8/sf-package-list/issues/83)) ([8e4e679](https://github.com/mcarvin8/sf-package-list/commit/8e4e679ed2b7914c0463114b378e5664fd5894d6))

## [1.6.0](https://github.com/mcarvin8/sf-package-list/compare/v1.5.0...v1.6.0) (2026-06-22)


### Features

* **metadata:** bump @salesforce/source-deploy-retrieve ([#78](https://github.com/mcarvin8/sf-package-list/issues/78)) ([dc87de2](https://github.com/mcarvin8/sf-package-list/commit/dc87de264a78c71bf09c6165c4d724a8acc0abd4))

## [1.5.0](https://github.com/mcarvin8/sf-package-list/compare/v1.4.0...v1.5.0) (2026-06-10)


### Features

* **core:** validate metadata types against SDR registry in listToPackageXml ([#75](https://github.com/mcarvin8/sf-package-list/issues/75)) ([3f40a66](https://github.com/mcarvin8/sf-package-list/commit/3f40a66588f6434f1558ba11d6725821c19cc2b4))
* **metadata:** bump @salesforce/source-deploy-retrieve ([#73](https://github.com/mcarvin8/sf-package-list/issues/73)) ([b14921e](https://github.com/mcarvin8/sf-package-list/commit/b14921e1a181810ad72c7286b6a63fd8aeb98a9f))

## [1.4.0](https://github.com/mcarvin8/sf-package-list/compare/v1.3.1...v1.4.0) (2026-06-02)


### Features

* **metadata:** bump @salesforce/source-deploy-retrieve ([#71](https://github.com/mcarvin8/sf-package-list/issues/71)) ([636f9fa](https://github.com/mcarvin8/sf-package-list/commit/636f9fac7670292cb85f82053348327a9eda72c8))

## [1.3.1](https://github.com/mcarvin8/sf-package-list/compare/v1.3.0...v1.3.1) (2026-05-26)


### Bug Fixes

* **deps:** pin direct dependencies to exact versions ([#69](https://github.com/mcarvin8/sf-package-list/issues/69)) ([e6b1493](https://github.com/mcarvin8/sf-package-list/commit/e6b149343cfe63c9dc99fe0c445f541d33c7a663))

## [1.3.0](https://github.com/mcarvin8/sf-package-list/compare/v1.2.13...v1.3.0) (2026-05-01)


### Features

* **metadata:** bump @salesforce/source-deploy-retrieve ([#67](https://github.com/mcarvin8/sf-package-list/issues/67)) ([b599d64](https://github.com/mcarvin8/sf-package-list/commit/b599d64af836915d96e1544a73414625536b65fd))

## [1.2.13](https://github.com/mcarvin8/sf-package-list/compare/v1.2.12...v1.2.13) (2026-04-23)


### Bug Fixes

* **builder:** switch from fast-xml-parser to fast-xml-builder ([#61](https://github.com/mcarvin8/sf-package-list/issues/61)) ([550d534](https://github.com/mcarvin8/sf-package-list/commit/550d534f27cb49cd9f406962162d783c911fc902))

## [1.2.12](https://github.com/mcarvin8/sf-package-list/compare/v1.2.11...v1.2.12) (2026-02-02)


### Bug Fixes

* update all salesforce dependencies and include sdr messages in error logs ([#59](https://github.com/mcarvin8/sf-package-list/issues/59)) ([0faa24a](https://github.com/mcarvin8/sf-package-list/commit/0faa24a6379f2a0fbb45cf431d65a3802df93de5))

## [1.2.11](https://github.com/mcarvin8/sf-package-list/compare/v1.2.10...v1.2.11) (2025-07-14)


### Bug Fixes

* upgrade node requirement to 20 ([3df55d2](https://github.com/mcarvin8/sf-package-list/commit/3df55d20d12f7518202b1d2a4232446ad3c5c6ac))

## [1.2.10](https://github.com/mcarvin8/sf-package-list/compare/v1.2.9...v1.2.10) (2025-07-01)


### Bug Fixes

* **deps:** bump @oclif/core from 4.3.0 to 4.4.0 ([#36](https://github.com/mcarvin8/sf-package-list/issues/36)) ([6fc9a1e](https://github.com/mcarvin8/sf-package-list/commit/6fc9a1e63e5a64c510e3e1af1f2fd289364c9ebd))
* **deps:** bump @salesforce/source-deploy-retrieve ([#40](https://github.com/mcarvin8/sf-package-list/issues/40)) ([79c4e97](https://github.com/mcarvin8/sf-package-list/commit/79c4e97da6d6af0c165b0d2b992119882fe38049))

## [1.2.9](https://github.com/mcarvin8/sf-package-list/compare/v1.2.8...v1.2.9) (2025-06-13)


### Bug Fixes

* add jest to hit full coverage and move cmd logic into functions ([#34](https://github.com/mcarvin8/sf-package-list/issues/34)) ([b8b11bf](https://github.com/mcarvin8/sf-package-list/commit/b8b11bf7e9cee79f1f49d97f054aa86cc3c88231))

## [1.2.8](https://github.com/mcarvin8/sf-package-list/compare/v1.2.7...v1.2.8) (2025-06-01)


### Bug Fixes

* **deps:** bump @salesforce/core from 8.10.2 to 8.11.4 ([#28](https://github.com/mcarvin8/sf-package-list/issues/28)) ([3e75fc0](https://github.com/mcarvin8/sf-package-list/commit/3e75fc05d86575295fc0353bc6980f68a5a523f1))
* **deps:** bump @salesforce/sf-plugins-core from 12.2.1 to 12.2.2 ([5787654](https://github.com/mcarvin8/sf-package-list/commit/57876540caf14fa34dbc739e10f6c3a9017b44b8))

## [1.2.7](https://github.com/mcarvin8/sf-package-list/compare/v1.2.6...v1.2.7) (2025-05-28)


### Bug Fixes

* move writeFile to functions ([0b3fd95](https://github.com/mcarvin8/sf-package-list/commit/0b3fd95ea10fb719641fdd9d064cb3efb41a55a0))

## [1.2.6](https://github.com/mcarvin8/sf-package-list/compare/v1.2.5...v1.2.6) (2025-05-26)


### Bug Fixes

* use component set to build package list ([#24](https://github.com/mcarvin8/sf-package-list/issues/24)) ([bba031b](https://github.com/mcarvin8/sf-package-list/commit/bba031b89716db830a1018d0a00ae19e080c9531))

## [1.2.5](https://github.com/mcarvin8/sf-package-list/compare/v1.2.4...v1.2.5) (2025-05-06)


### Bug Fixes

* **deps:** bump @salesforce/sf-plugins-core from 12.2.0 to 12.2.1 ([ca19282](https://github.com/mcarvin8/sf-package-list/commit/ca192823c106812261c0a3f51010839a09c5de17))
* **deps:** bump @salesforce/source-deploy-retrieve ([392b76c](https://github.com/mcarvin8/sf-package-list/commit/392b76c2f578c35a0394ed5eafeedf834d94218f))

## [1.2.4](https://github.com/mcarvin8/sf-package-list/compare/v1.2.3...v1.2.4) (2025-04-15)


### Bug Fixes

* only allow commas to separate members in list ([87444dd](https://github.com/mcarvin8/sf-package-list/commit/87444ddd8bafee6490c48d5cb75099ed7288f510))
* only allow commas to separate members in list ([c27f7b8](https://github.com/mcarvin8/sf-package-list/commit/c27f7b80134d0e393b05fb328e5cabd9b6f2d87b))

## [1.2.3](https://github.com/mcarvin8/sf-package-list/compare/v1.2.2...v1.2.3) (2025-04-14)


### Bug Fixes

* default to empty package or list output ([911c3c8](https://github.com/mcarvin8/sf-package-list/commit/911c3c8a27cd4268513f15f1ace6bf2383b4a18d))

## [1.2.2](https://github.com/mcarvin8/sf-package-list/compare/v1.2.1...v1.2.2) (2025-04-01)


### Bug Fixes

* **deps:** bump @salesforce/source-deploy-retrieve ([476c939](https://github.com/mcarvin8/sf-package-list/commit/476c93945783a24d528d468cf340b5ad00150209))

## [1.2.1](https://github.com/mcarvin8/sf-package-list/compare/v1.2.0...v1.2.1) (2025-03-24)


### Bug Fixes

* add warnings for invalid packages or lists ([ab099c3](https://github.com/mcarvin8/sf-package-list/commit/ab099c32081daff5f66d3ce19b9c2cd9db6e0ba9))

## [1.2.0](https://github.com/mcarvin8/sf-package-list/compare/v1.1.0...v1.2.0) (2025-03-24)


### Features

* add `no-api-version` flag ([1e5d7ab](https://github.com/mcarvin8/sf-package-list/commit/1e5d7abd6b23b4e8da642dbad2957dac8f1ba28c))

## [1.1.0](https://github.com/mcarvin8/sf-package-list/compare/v1.0.0...v1.1.0) (2025-03-19)


### Features

* allow commas or spaces to separate list members ([6a59927](https://github.com/mcarvin8/sf-package-list/commit/6a5992701a4b77f203be0f3a2e5ac28a812ef11d))

## 1.0.0 (2025-03-16)


### Features

* init release ([dc90c2e](https://github.com/mcarvin8/sf-package-list/commit/dc90c2e5702aa7f870afaea7d90d73e929a9e6fe))
