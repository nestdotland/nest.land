# Introduction

Welcome to [nest.land](https://nest.land)!

Nest.land is a first-of-its-kind decentralized package registry and CDN built for [Deno](https://deno.land).

Using the power of blockchain, you can publish your Deno modules to the [Arweave Permaweb](https://www.arweave.org/) through nest.land, where they can **never** be deleted. With this feature, you can make sure that your users will always have the required resources for their projects, via Deno's web-based package imports.

# Installation

To initialize and publish your first package to nest.land, you will need our CLI, **eggs**. You can install it using this command:

```shell script
deno install -A -f --unstable -n eggs https://x.nest.land/eggs@0.1.5/mod.ts
```
Please make sure to use the `-A` flag to grant all permissions to eggs, so you can enjoy all features seamlessly.
> Note: You need to upgrade to Deno v1.1.0 or newer in order to use our CLI.

# Linking your API key

In order to publish packages to the blockchain with our CLI, you must first generate an API key. See [Getting Started](/#start).

After you generate your API key, you need to add it in the CLI. To do this, type:
```shell script
eggs link --key [your key]
```

# Initializing a package

You'll need to initialize a package with eggs in order to publish it. To do this, you need to type the following command in the root directory of your project:
```shell script
eggs init
```
By doing this, you'll be prompted with a setup screen, where you will be asked to enter:
#### Package name
The name of your new package
#### Package description
The description of your new package
#### Is this a stable version?
Whether the current version of your package is stable or not. You will be able to update this with each new publish
#### Enter the files and relative directories that nest.land will publish separated by a comma.
All the files you want to publish with your package. You should include your README.md file here next to all the imported / required files of your module.
#### Config format
Choose between your preffered config format among yaml and json.

# Configuration

After you've initialized a project, you'll see a brand new `egg.json` or `egg.yml` file depending on the config format you've chosen. This file is specific to nest.land and needed for the registry.
> Note: `egg.json` is different than Node's `package.json` for several reasons! [Here is why](https://github.com/nestlandofficial/nest.land/issues/52#issuecomment-643038042).

Here is a template egg configuration file with all available fields:

__JSON__:
```json
{
    "name": "package-name",
    "description": "Your brief package description",
    "version": "0.0.1",
    "entry": "./src/main.ts",
    "stable": true,
    "unlisted": false,
    "fmt": true,
    "repository": "https://github.com/your_name/your_project",
    "files": [
        "./mod.ts",
        "./src/**/*",
        "./README.md"
    ]
}
```

__YAML__:
```yaml
name: package-name
description: Your brief package description
version: 0.0.1
entry: ./src/main.ts
stable: true
unlisted: false
fmt: true
repository: https://github.com/your_name/your_project
files:
  - ./mod.ts
  - ./src/**/*
  - ./README.md
```

## Field information:

- name:
    - The name of your package.
    - Required: true
- description:
    - A description of your package that will appear on the gallery.
    - Required: true
- version:
    - Your package version.
    - Required: false
        - If not specified, we automatically increment your package version by `0.0.1` on each publish.
- entry:
    - The "index file" of your project. This is what users will see when they try to import your package from our registry!
    - Required: false
        - Defaults to `./mod.ts`
- stable:
    - Is this version stable?
    - Required: false
        - Defaults to false
- unlisted:
    - Should people be able to find this package/version on the gallery?
    - Required: false
        - Defaults to false
- fmt:
    - Automatically format your code before publishing to the blockchain network
    - Required: false
         - Defaults to false    
- repository:
    - A link to your repository.
    - Required: false
        - Defaults to null
- files:
    - All the files that should be uploaded to nest.land.
    - Required: true

# Publishing a package

To publish a package, just navigate to the root of your package and use the command shown:
```shell script
eggs publish
```
Boom! After this, you'll be returned a link to your package on our [Gallery](gallery).

> Note: The same command is used to publish a new version to an existing package!

## Badge

In addition, you'll have the option of adding our official badge to your project docs, courtesy of [@maximousblk](https://github.com/maximousblk). This is the best way you can support our registry and help us grow. We'd really appreciate seeing it on your project!

![nest badge](https://nest.land/badge.svg)

```
[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/your-package)
```

or if you want to support us *louder*, you can use the large badge.

![nest badge](https://nest.land/badge-large.svg)

```
[![nest badge](https://nest.land/badge-large.svg)](https://nest.land/package/your-package)
```

# Updating your packages

Updating your nest.land package versions is a breeze thanks to [@ebebbington](https://github.com/ebebbington)'s addition to the CLI.

Just type the command shown to automatically check for and update all nest.land package imports. Not only does this update nest.land packages, but it can also update [deno.land/std/](https://deno.land/std/) and [deno.land/x/](https://deno.land/x/) packages!

```shell script
eggs update --file file.ts --deps http fs // use specified file and modules
```

```shell script
eggs update --file file.ts // update all in file.ts
```

```shell script
eggs update --deps http fs // update fs and http in default deps.ts
```

More detailed information about this service is avaliable on our CLI [README](https://github.com/nestlandofficial/nest.land/tree/master/eggs).

# Upgrade eggs

To upgrade the eggs CLI, use the command shown:

```shell script
eggs upgrade
```

## Technical questions?

Start a [GitHub issue](https://github.com/nestlandofficial/nest.land/issues) or find us on Discord: tate#5885 and zorbyte#4500
