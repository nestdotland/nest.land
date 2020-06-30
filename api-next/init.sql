-- psql -U nest -W -d nest -h localhost

CREATE TABLE users (
  name VARCHAR(20) NOT NULL UNIQUE,
  normalizedName VARCHAR(20) NOT NULL UNIQUE,
  password VARCHAR(256) NOT NULL,
  apiKey VARCHAR(256) NOT NULL,
  packageNames VARCHAR [],
  createdAt timestamptz
);

CREATE TABLE packages (
  name VARCHAR(40) NOT NULL UNIQUE,
  normalizedName VARCHAR(40) NOT NULL UNIQUE,
  owner VARCHAR(250) NOT NULL,
  description TEXT,
  repository TEXT,
  latestVersion VARCHAR(61),
  latestStableVersion VARCHAR(61),
  packageUploadNames VARCHAR [],
  locked BOOLEAN NOT NULL,
  malicious BOOLEAN NOT NULL,
  unlisted  BOOLEAN NOT NULL,
  updatedAt timestamptz,
  createdAt timestamptz
);

CREATE TABLE "package-uploads" (
  name VARCHAR(40) NOT NULL UNIQUE,
  package VARCHAR(40) NOT NULL,
  entry VARCHAR(60),
  version VARCHAR(20) NOT NULL,
  prefix VARCHAR(20),
  malicious BOOLEAN,
  files JSON,
  createdAt timestamptz
);

-- INSERT INTO users (name, normalizedName, password, apiKey, packageNames, createdAt) VALUES ('divy', 'divy', 'weird-password@ok-boomer', 'weird-api-key@bruh-yey', ARRAY [ 'sass' ], '2016-06-22 19:10:25-07');
-- INSERT INTO packages (name, normalizedName, owner, description, repository, latestVersion, latestStableVersion, packageUploadNames, locked, malicious, unlisted, createdAt, updatedAt) VALUES ('sass', 'sass', 'divy', 'Deno Sass Compiler', 'https://github.com/divy-work/deno-sass', 'v0.2.0', 'v0.2.0', ARRAY ['sass'], false, false, false, '2016-06-22 19:10:25-07', '2016-06-22 19:10:25-07');
