# nest.land CLI - Eggs

## Installation

```
deno install --allow-read --allow-run --allow-write -f --unstable https://x.nest.land/eggs@0.0.1
```
For more information, see the [documentation](https://nest.land/#docs).

## Usage

Before publishing a package to our registry, you'll need to get an API key. Visit [nest.land](https://nest.land/#start) to generate one.

Once you have an API key, you need to make a `.nest-land-key` file at the root of your project. Note: If you're using source control, you'll want to add this file to `.gitignore`!

### Publishing a package

To publish a package, you need to create a `egg.json` file at the root of your project as well. To do this easily, type:
```
$ eggs init
```

After you've filled in the information located in `egg.json`, you can publish a package to our registry with this command:
```
$ eggs publish
```

It may take a couple minutes for your transaction to process in Arweave. Once uploading finishes, you'll receive a link to your package on our registry, along with an import URL for others to import your package from the Arweave blockchain!

## Contributing

All contributions are welcome! If you can think of a command or feature that might benefit nest.land, fork this repository and make a pull request from your branch with the additions.