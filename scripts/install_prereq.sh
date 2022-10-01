#!/bin/sh

echo "Installing rust..."
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

source "$HOME/.cargo/env"

echo "Installing wasm-pack..."
cargo install wasm-pack

/vercel/.cargo/bin/wasm-pack build ./wasm/wasm-life --release
