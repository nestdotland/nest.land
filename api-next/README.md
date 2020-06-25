<img src="./images/cover.jpg">

# Nest API - Rust

A graphql API for the nest.land registry.

> Note: Currently only read-only

## Usage

### server

```bash
cargo run (or ``cargo watch -x run``)
# Started http server: 127.0.0.1:8080
```

### web client

[http://127.0.0.1:8080/graphiql](http://127.0.0.1:8080/graphiql)

_Query example:_
```graphql
{
  package(name: "eggs") {
    name,
    owner,
    normalizedName,
    latestVersion,
    latestStableVersion,
    packageUploadNames
  }
}
```
_Result:_
```json
{
  "data": {
    "package": {
      "name": "eggs",
      "owner": "nest.land",
      "normalizedName": "eggs",
      "latestVersion": "v0.1.0",
      "latestStableVersion": "v0.1.0",
      "packageUploadNames": [
        "eggs"
      ]
    }
  }
}
```

_Mutation example:_

```graphql
mutation {
  createPackage(newPackage: {name: "autopilot", normalizedName: "autopilot", owner: "divy", description: "Cross-platform desktop automation", repository: "https://github.com/divy-work/nest-api-rust", latestVersion: "v0.1.0", latestStableVersion: "v0.1.0", packageUploadNames: ["autopilot"], locked: false, malicious: false, unlisted: false, updatedAt: "sometime", createdAt: "sometime"}) {
    name
    owner
    normalizedName
    latestVersion
    latestStableVersion
    packageUploadNames
  }
}
```

_Result:_
```json
{
  "data": {
    "createPackage": {
      "name": "autopilot",
      "owner": "autopilot",
      "normalizedName": "autopilot",
      "latestVersion": "v0.1.0",
      "latestStableVersion": "v0.1.0",
      "packageUploadNames": [
        "autopilot"
      ]
    }
  }
}
```
