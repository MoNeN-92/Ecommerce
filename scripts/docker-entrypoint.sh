#!/bin/sh
set -eu

npx prisma db push
exec node server.js
