#!/bin/sh
set -euo pipefail

mongosh --quiet "mongodb://localhost:27017/admin" <<-'EOSQL'
  const adminDb = db.getSiblingDB("admin");
  const appDbName = process.env.MONGO_DB_NAME;
  const appUser = process.env.MONGO_APP_USER;
  const appPassword = process.env.MONGO_APP_PASSWORD;

  if (!appDbName || !appUser || !appPassword) {
    throw new Error("MongoDB application credentials are not fully set");
  }

  const existingUser = adminDb.getUser(appUser);
  if (existingUser) {
    adminDb.updateUser(appUser, { pwd: appPassword });
  } else {
    adminDb.createUser({
      user: appUser,
      pwd: appPassword,
      roles: [
        { role: "readWrite", db: appDbName },
        { role: "read", db: "admin" }
      ]
    });
  }

  const appDb = db.getSiblingDB(appDbName);
  const hasMarker = appDb.getCollectionNames().includes("init_marker");
  if (!hasMarker) {
    appDb.createCollection("init_marker");
  }
EOSQL

