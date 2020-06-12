# Benchmarks

Documentation for benchmarks of CLI commands.

# Contents
* [Commands](#commands)
    * [Update](#update)

# Commands

## Update

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

```
cd nest.land/eggs/benchmarks/commands/update
deno run --allow-run update_benchmark.ts
```

**Result**

Ran at 12/06/2018 (12th of June)

Ran on a MacBook Pro, 2018, 2.3GHz Intel Core i5, 8GB RAM

```
Edwards-MacBook-Pro:update edwardbebbington$ deno run --allow-run update_benchmark.ts
Compile file:///Users/edwardbebbington/Development/docker/environments/nest.land/eggs/benchmarks/commands/update/update_benchmark.ts
running 1 benchmark ...
benchmark updateCommand ... 
    3968ms
benchmark result: DONE. 1 measured; 0 filtered
```