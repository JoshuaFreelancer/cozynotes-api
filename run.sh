#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

ensure_env_file() {
  local example_file="$BACKEND_DIR/.env.example"
  local env_file="$BACKEND_DIR/.env"

  if [[ -f "$env_file" ]]; then
    return
  fi

  if [[ -f "$example_file" ]]; then
    cp "$example_file" "$env_file"
    return
  fi

  cat > "$env_file" <<'EOF'
PORT=3000
DB_HOST=127.0.0.1
DB_USER=cozy_admin
DB_PASSWORD=cozy123
DB_NAME=cozy_notes
DB_DIALECT=mysql
JWT_SECRET=change_me
EOF
}

ensure_node_modules() {
  local project_dir="$1"

  if [[ ! -d "$project_dir/node_modules" ]]; then
    (cd "$project_dir" && npm install)
  fi
}

ensure_env_file
ensure_node_modules "$BACKEND_DIR"
ensure_node_modules "$FRONTEND_DIR"

(cd "$BACKEND_DIR" && npm run db:migrate && npm run db:seed)

(cd "$BACKEND_DIR" && npm start) &
BACKEND_PID=$!

(cd "$FRONTEND_DIR" && npm run dev -- --host 0.0.0.0 --port 5173) &
FRONTEND_PID=$!

cleanup() {
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
}

trap cleanup EXIT INT TERM
wait