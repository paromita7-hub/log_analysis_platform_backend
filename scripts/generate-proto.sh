#!/usr/bin/env bash
set -euo pipefail

PROTO_DIR="libs/shared/proto/proto"
OUT_DIR="libs/shared/proto/generated"

mkdir -p "${OUT_DIR}"

pnpm exec protoc \
  --plugin=./node_modules/.bin/protoc-gen-ts_proto \
  --ts_proto_out="${OUT_DIR}" \
  --ts_proto_opt=outputServices=grpc-js,esModuleInterop=true,env=node \
  -I "${PROTO_DIR}" \
  "${PROTO_DIR}/auth.proto" \
  "${PROTO_DIR}/metrics.proto" \
  "${PROTO_DIR}/service-registry.proto"
