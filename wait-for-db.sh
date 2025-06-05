#!/bin/bash
# wait-for-db.sh

set -e

host="$1"
# Use environment variable with fallback
ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD:-password}

echo "Waiting for MySQL..."
until mysql -h "$host" -u root -p"$ROOT_PASSWORD" -e "SELECT 1" &> /dev/null; do
  echo "MySQL is unavailable - sleeping"
  sleep 2
done

echo "MySQL is up - continuing"
