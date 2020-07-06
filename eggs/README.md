<br />
<p align="center">
  <a href="https://github.com/nestdotland/nest.land">
    <img src="https://github.com/nestdotland/nest.land/raw/master/web/src/assets/nest_light.png" alt="logo" width="110">
  </a>

  <h3 align="center">Eggs CLI</h3>

  <p align="center">
    The CLI used to publish and update packages in nest.land.
  </p>
  <p align="center">
    <a href="https://nest.land/package/eggs">
      <img src="https://nest.land/badge.svg" alt="nest.land badge">
    </a>
    <img src="https://github.com/nestdotland/nest.land/workflows/Eggs%20Test/badge.svg" alt="Eggs Test">
  </p>
</p>

# Contents

* [Installation](#installation)
* [List Of Commands](#list-of-commands)
    * [Link](#link)
    * [Init](#init)
    * [Publish](#publish)
    * [Update](#update)
    * [Install](#install)
    * [Upgrade](#upgrade)
* [Contributing](#contributing)

## Installation

**Note: You need to upgrade to Deno v1.1.0 or newer in order to use our CLI.**
```
deno install -A -f --unstable -n eggs https://x.nest.land/eggs@0.1.8/mod.ts
```
For more information, see the [documentation](https://nest.land/#docs).

## List Of Commands

### Link

Before publishing a package to our registry, you'll need to get an API key. Visit [nest.land](https://nest.land/#start) to generate one.

Then, use `link` to add it to the CLI:
```shell script
eggs link <key>
```

Alternatively, you can manually create a `.nest-api-key` file at your user home directory.

### Init

To publish a package, you need to create an `egg.json` file at the root of your project as well. To do this easily, type:
```shell script
eggs init
```
Note: If you'd like to specify a version that you'll publish to, you can include a `version` variable in `egg.json`.

### Publish

After you've filled in the information located in `egg.json`, you can publish your package to our registry with this command:
```shell script
eggs publish
```

You'll receive a link to your package on our registry, along with an import URL for others to import your package from the Arweave blockchain!

Note: It may take some time for the transaction to process in Arweave. Until then, we upload your files to our server, where they are served for 20 minutes to give the transaction time to process.

### Update

You can easily update your dependencies and global scripts with the `update` command.
```shell script
eggs update [deps] <options>
```

Your dependencies are by default checked in the `deps.ts` file (current working directory). You can change this with `--file`
```shell script
eggs update # default to deps.ts
eggs update --file dependencies.ts 
```

In regular mode, all your dependencies are updated. You can choose which ones will be modified by adding them as arguments.
```shell script
eggs update # Updates everything
eggs update http fs eggs # Updates only http, fs, eggs
```

Scripts installed with `eggs install` can also be updated with the `-g` parameter.
```shell script
eggs update -g # Updates every script installed with eggs install
eggs update eggs denon -g # Updates only eggs, denon
```

Several registries are supported. The current ones are:
 - x.nest.land
 - deno.land/x
 - deno.land/std
 - raw.githubusercontent.com
 - denopkg.com

If you want to add a registry, open an issue by specifying the registry url and we'll add it.

An example of updated file:
```ts
import * as colors from "https://deno.land/std@v0.55.0/fmt/colors.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.0/mod.ts"
import * as eggs from "https://x.nest.land/eggs@v0.1.0/mod.ts"
import * as http from "https://deno.land/std/http/mod.ts"
```
After `eggs update`:
```ts
import * as colors from "https://deno.land/std@0.58.0/fmt/colors.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.1/mod.ts"
import * as eggs from "https://x.nest.land/eggs@0.1.3/mod.ts"
import * as http from "https://deno.land/std/http/mod.ts"
```

### Install

Just like `deno install`, you can install scripts globally with eggs. By installing it this way, you will be notified if an update is available for your script. 

The verification is smart, it can't be done more than once a day. To install a script, simply replace `deno` with `eggs`.

```shell script
deno install --allow-write --allow-read -n [NAME] https://x.nest.land/[MODULE]@[VERSION]/cli.ts
```
Becomes
```shell script
eggs install --allow-write --allow-read -n [NAME] https://x.nest.land/[MODULE]@[VERSION]/cli.ts
```

The supported registries are the same as for the update command.

### Upgrade

To upgrade the eggs CLI, use the command shown:

```shell script
eggs upgrade
```

## Contributing

All contributions are welcome! If you can think of a command or feature that might benefit nest.land, fork this repository and make a pull request from your branch with the additions.