# Contributing

## Developing

Install locally by running the following commands

```sh
npm run refresh
```

## Versioning

The `scripts` section of the `scriptrepo` package.json file includes _pre_, _post_ and other version commands. Simply by running `npm version <patch|minor|major>` a new version will be created and a new commit and tags will be created and pushed to the remote branch.

```json
{
  "preversion": "npm run lint",
  "version": "genversion --semi version.js && git add version.js",
  "postversion": "npm run --silent tag:update-latest && git push -u origin $(git rev-parse --abbrev-ref HEAD) && git push --follow-tags",
  "version:current": "echo $npm_package_version",
  "version:latest-published": "npm view scriptrepo version"
}
```

### Patch

```sh
npm version patch
```

### Minor

```sh
npm version minor
```

### Major

```sh
npm version major
```
