<div align="center">
  <h1 align="center">
    scriptrepo
  </h1>
</div>
<p align="center">
  <a href="https://www.npmjs.com/package/scriptrepo">
    <img src="https://img.shields.io/npm/v/scriptrepo.svg">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg">
  </a>
  <a href="https://travis-ci.com/joshuatvernon/scriptrepo">
    <img src="https://travis-ci.com/joshuatvernon/scriptrepo.svg?branch=main">
  </a>
  <a href="https://codecov.io/gh/joshuatvernon/scriptrepo">
    <img src="https://codecov.io/gh/joshuatvernon/scriptrepo/branch/main/graph/badge.svg?token=ZKLQ2C1EOF"/>
  </a>
  <a href="https://snyk.io/test/github/joshuatvernon/scriptrepo">
    <img src="https://snyk.io/test/github/joshuatvernon/scriptrepo/badge.svg" />
  <a/>
</p>
<pre align="center">npm i scriptrepo -g</pre>
<p align="center">📜</p>

<hr>

## Description

`scriptrepo` allows you to upload scripts to a git repo. This allows you to use the same scripts across computers or even share them with a team.

## Support Scripts

Currently, `scriptrepo` supports `.sh`, `.js`, `.ts` and `.py` scripts.

## Repo Config

Optionally, you can add a repo config file named `scriptrepo.json` or `.scriptrepo.json` to configure your repo.

## Script Config

Optionally, you can add script configs named `<script-name>.scriptrepo.json` or `.<script-name>.scriptrepo.json` to configure your scripts.



## Example Script Repo

Check out these example script repos:

- [team-scripts](https://github.com/joshuatvernon/team-scripts)

## Usage

```sh
Usage: scriptrepo [options]

Add, update and run scripts from git repos

Options:
  -V, --version      output the version number
  -h, --help         display help for command

Commands:
  add [options]      Add script
  remove [options]   Remove script
  update [options]   Update scripts
  execute [options]  Execute scripts
  list               List scripts
  help [command]     display help for command
```
