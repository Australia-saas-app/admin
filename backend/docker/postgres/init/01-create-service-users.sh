#!/bin/sh
set -euo pipefail

psql -v ON_ERROR_STOP=1 \
  -v backend_db_user="${BACKEND_DB_USER}" \
  -v backend_db_password="${BACKEND_DB_PASSWORD}" \
  -v backend_db_name="${BACKEND_DB_NAME}" \
  -v sso_db_user="${SSO_DB_USER}" \
  -v sso_db_password="${SSO_DB_PASSWORD}" \
  -v sso_db_name="${SSO_DB_NAME}" \
  -v admin_db_user="${ADMIN_DB_USER}" \
  -v admin_db_password="${ADMIN_DB_PASSWORD}" \
  -v admin_db_name="${ADMIN_DB_NAME}" \
  --username "${POSTGRES_USER}" <<-'EOSQL'
  DO
  $$
  BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = :'backend_db_user') THEN
      EXECUTE format('CREATE ROLE %I WITH LOGIN PASSWORD %L', :'backend_db_user', :'backend_db_password');
    END IF;

    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = :'backend_db_name') THEN
      EXECUTE format('CREATE DATABASE %I OWNER %I', :'backend_db_name', :'backend_db_user');
    ELSE
      EXECUTE format('ALTER DATABASE %I OWNER TO %I', :'backend_db_name', :'backend_db_user');
    END IF;

    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = :'sso_db_user') THEN
      EXECUTE format('CREATE ROLE %I WITH LOGIN PASSWORD %L', :'sso_db_user', :'sso_db_password');
    END IF;

    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = :'sso_db_name') THEN
      EXECUTE format('CREATE DATABASE %I OWNER %I', :'sso_db_name', :'sso_db_user');
    ELSE
      EXECUTE format('ALTER DATABASE %I OWNER TO %I', :'sso_db_name', :'sso_db_user');
    END IF;

    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = :'admin_db_user') THEN
      EXECUTE format('CREATE ROLE %I WITH LOGIN PASSWORD %L', :'admin_db_user', :'admin_db_password');
    END IF;

    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = :'admin_db_name') THEN
      EXECUTE format('CREATE DATABASE %I OWNER %I', :'admin_db_name', :'admin_db_user');
    ELSE
      EXECUTE format('ALTER DATABASE %I OWNER TO %I', :'admin_db_name', :'admin_db_user');
    END IF;
  END
  $$
  ;
EOSQL
