# Pulse App - Slint implementation

This is the Slint (Rust) implementation of the Pulse benchmark app.

## Requirements
- Rust toolchain (latest stable)
- Slint CLI / tools

## Build & Run
To run natively:
```bash
cargo run --release
```

To build for Windows:
```bash
cargo build --release
# Executable is in target/release/slint.exe
```

To build for Web:
```bash
cargo build --target wasm32-unknown-unknown --release
# Alternatively, use wasm-pack
```
