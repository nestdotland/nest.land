<br />
<p align="center">
  <a href="https://github.com/nestlandofficial/nest.land">
    <img src="https://github.com/nestlandofficial/nest.land/raw/master/web/src/assets/nest_light.png" alt="logo" width="110">
  </a>

  <h3 align="center">Eggs CLI</h3>

  <p align="center">
    The CLI used to publish and update packages in nest.land.
 </p>
</p>

[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/eggs)

# Contents
* [Installation](#installation)
* [List Of Commands](#list-of-commands)
    * [Link](#link)
    * [Init](#init)
    * [Publish](#publish)
    * [Update](#update)
* [Contributing](#contributing)

## Installation

**Note: You need to upgrade to Deno v1.1.0 or newer in order to use our CLI.**
```
deno install -A -f --unstable -n eggs https://x.nest.land/eggs@0.1.3/mod.ts
```
For more information, see the [documentation](https://nest.land/#docs).

## List Of Commands

### Link

Before publishing a package to our registry, you'll need to get an API key. Visit [nest.land](https://nest.land/#start) to generate one.

Then, use `link` to add it to the CLI:
```
$ eggs link <key>
```

Alternatively, you can manually create a `.nest-api-key` file at your user home directory.

### Init

To publish a package, you need to create an `egg.json` file at the root of your project as well. To do this easily, type:
```
$ eggs init
```
Note: If you'd like to specify a version that you'll publish to, you can include a `version` variable in `egg.json`.

### Publish

After you've filled in the information located in `egg.json`, you can publish your package to our registry with this command:
```
$ eggs publish
```

You'll receive a link to your package on our registry, along with an import URL for others to import your package from the Arweave blockchain!

Note: It may take some time for the transaction to process in Arweave. Until then, we upload your files to our server, where they are served for 20 minutes to give the transaction time to process.

### Update

* Will find the dependency file **at the user's current working directory**
    * If no `--file <filename>` is passed in, it will default to `deps.ts`
    * If `--file` is passed in, it will error
    * If `--file <filename>` is passed in, it will search that dependency file
    
* Will extract the dependencies from the command line
    * If no `--deps <...deps>` is passed in, defaults to updating all
    * If `--deps` is passed in, it will error
    * If `--deps http fs` is passed in, it will only update those modules
    
* Will pull all contents from that file, into an array of strings. Let's call this "dependencies to update".
    * Ignores any lines that don't include `https://` (eg the imported line)
    * If this array is empty (no dependencies), the CLI will exit
    * An example of how this array would look is:
      ```typescript
      [
          "import { something } from 'https://deno.land/std@v0.56.0/http/mod.ts'",
          "export { eggs } from 'https://x.nest.land/eggs@v0.1.0/mod.ts'"
      ]
      ```
      
* Will loop through each dependency to update, reading the following from the line:
    * The registry URL: `https://x.nest.land`
    * The imported version: `v0.1.0`
    * The name: `eggs`
    * If there are dependencies requested (`eggs update --deps http eggs`), only these will be checked and updated
    
* When the above information is gathered, we can now try get the latest version
    * If the registry is std, assigns Denos std latest version
    * If the registry is deno.land 3rd party, fetches Deno's `database.json`, get the module owner and repo name by the module name, sends a fetch request to that repository, extracts the latest version from the URL
    * If the registry is x.nest.land, sends a fetch request to Nest's API: `GET /api/package/:name`, and grabs the latest version from the response
    * Else if the registry is none of the above, the current iteration is skipped
    
* After each successful iteration, we construct the data to replace for the module, and what to replace it with, for example:
  ```typescript
  interface ModuleToUpdate {
    name: string // "eggs"
    importedVersion: string // "v0.1.0" or "0.1.0"
    latestRelease: string // "v.0.1.0" or "0.1.0"
    isStd: boolean // If the module is std
    updated: boolean // If the dependency is updated in the dependency file
    replaceStatement: string // "eggs@v0.1.0" or "std@0.55.0/fs"
    replaceWith: string // "eggs@v0.1.7" or "std@0.56.0/fs"
  }
  ```
  Example result:
  ```
  ┌───────┬───────────┬─────────────────┬───────────────┬───────┬──────────────────────┬──────────────────────┬─────────┐
  │ (idx) │   name    │ importedVersion │ latestRelease │ isStd │   replaceStatement   │     replaceWith      │ updated │
  ├───────┼───────────┼─────────────────┼───────────────┼───────┼──────────────────────┼──────────────────────┼─────────┤
  │   0   │   "fs"    │    "0.55.0"     │   "0.56.0"    │ true  │   "std@0.55.0/fs"    │   "std@0.56.0/fs"    │  false  │
  │   1   │ "version" │    "0.54.0"     │   "0.56.0"    │ true  │ "std@0.54.0/version" │ "std@0.56.0/version" │  false  │
  │   2   │  "drash"  │    "v1.0.2"     │   "v1.0.5"    │ false │    "drash@v1.0.2"    │    "drash@v1.0.5"    │  false  │
  │   3   │  "eggs"   │    "v0.1.0"     │   "v0.1.7"    │ false │    "eggs@v0.1.0"     │    "eggs@v0.1.7"     │  false  │
  └───────┴───────────┴─────────────────┴───────────────┴───────┴──────────────────────┴──────────────────────┴─────────┘

  ```

* This process carries on until all dependency lines are read, and we gather all the information needed

* Once the file contents of the users dependency file is read, we decode the contents of the dependency file, loop through each `dependencyToUpdate` and replace the `replaceStatement` with the `replaceWith` 

* Then it will write that above content (which is essentially a duplicate version of their dependency file with updated versions), back into their dependency file

* CLI exits

**Cautions**

* There may be a time where the deps are too out of date. They need to be out of date for `update` to update them,
  so just bump them up to the release before the latest std

**How it Works**

* This benchmark uses a separate `deps.ts` file. The reason for this is so we can have a 'realworld' example, where many dependencies are used, and from various registries

* All but 1 dependency are out of date, to fully represent the test, as the `update` would update all the out of date dependencies

* This benchmark shows the execution time for running `update` against 14 separate dependencies, all varying from:
    * deno.land/std/
    * deno.land/x/
    * x.nest.land

**How to Run**

* Requires the following Deno permissions:
    * `--allow-net` (fetch requests)
    * `--allow-read` (reading dependency file)
    * `--allow-write` (re-writing the dependency file with updated versions)

## Contributing

All contributions are welcome! If you can think of a command or feature that might benefit nest.land, fork this repository and make a pull request from your branch with the additions.