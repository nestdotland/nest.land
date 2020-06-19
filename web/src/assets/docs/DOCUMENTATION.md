# Introduction

Welcome to [nest.land](https://nest.land)!
Nest.land is a blazing-fast and easy to use [Deno](https://deno.land) package registry. 
Using the power of Blockchain, you can publish your Deno modules to the permaweb through Nest.land, where they can **never** be removed from. With this feature, you can make sure that your users will always have the required resources for their projects, via Deno's web-based package imports. 

# Installation

To initialize and publish your first package to Nest.land, you will need our CLI, **eggs**. You can install it using this command:

```shell script
deno install -A -f --unstable -n eggs https://x.nest.land/eggs@0.1.3/mod.ts
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

You'll need to initialize a package with the eggs in order to publish it. To do this, you need to type the following command in the root directory of your project:
```shell script
eggs init
```
By doing this, you'll be granted with a setup screen, where you will be asked to enter:
#### Package name
The name of your new package
#### Package description
The description of your new package
#### Is this a stable version?
Wether the current version of your package is stable or not. You will be able to update this with each new publish
#### Enter the files and relative directories that nest.land will publish separated by a comma.
All the files you want to publish with your package. You should include your README.md file here next to all the imported / required files of your module. 

# Publishing a Package
To publish a package, just navigate to the root of your package and use the command shown:
```shell script
eggs publish
```
That's it! After this, you'll be returned a link that you can use in your Deno projects. Your package will also be added to the package lists on our servers, so other users will be able to find it on the [Gallery](/gallery)
>Note: The same command is used to publish a new version to an existing package!
 
# Updating all of your packages
  
Updating your Nest.land package versions is a breeze thanks to [@ebebbington](https://github.com/ebebbington)'s addition to the CLI. 
Just type the command shown to automatically check for and update all nest.land package imports. Not only does this update nest.land packages, but it also can update [deno.land/std/](https://deno.land/std/) and [deno.land/x/](https://deno.land/x/) packages!

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

## Technical questions?
   
Find us on Discord: tate#5885, zorbyte#4500, and blob#8718