# Installation

It's very easy to begin using nest.land when pushing new Deno packages! You can install our CLI, **eggs**, via Deno.

```shell script
deno install -A -f --unstable -n eggs https://x.nest.land/eggs@0.1.0/mod.ts
```
> Note: You need to upgrade to Deno v1.1.0 or newer in order to use our CLI.
  
# Linking your API key
In order to publish packages to the blockchain with our CLI, you must first generate an API key. See [Getting Started](/#start).

After you generate your API key, you need to add it in the CLI. To do this, type:
```shell script
eggs link --key [your key]
```