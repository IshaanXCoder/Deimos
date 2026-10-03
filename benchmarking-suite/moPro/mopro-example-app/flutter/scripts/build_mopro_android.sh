#!/usr/bin/env bash
set -euo pipefail

app_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
mopro_dir=$(cd -- "$app_dir/../.." && pwd)
ndk_dir=${ANDROID_NDK_HOME:-${ANDROID_SDK_ROOT:-}/ndk/28.2.13676358}
toolchain="$ndk_dir/toolchains/llvm/prebuilt/linux-x86_64/bin"

if [[ ! -x "$toolchain/aarch64-linux-android24-clang" ]]; then
  echo "Android NDK 28.2.13676358 is required; set ANDROID_NDK_HOME." >&2
  exit 1
fi

export ANDROID_NDK_HOME="$ndk_dir"
export CC="$toolchain/aarch64-linux-android24-clang"
export CXX="$toolchain/aarch64-linux-android24-clang++"
export AR="$toolchain/llvm-ar"
export RANLIB="$toolchain/llvm-ranlib"
export CARGO_TARGET_AARCH64_LINUX_ANDROID_LINKER="$CC"
export CARGO_PROFILE_RELEASE_DEBUG=0
export CARGO_PROFILE_RELEASE_LTO=false
export CARGO_BUILD_JOBS=${CARGO_BUILD_JOBS:-2}

cd "$mopro_dir"
cargo build --locked --release -p mopro-example-app --target aarch64-linux-android

jni_dir="$app_dir/mopro_flutter_plugin/android/src/main/jniLibs/arm64-v8a"
mkdir -p "$jni_dir"
install -m 0644 \
  "$mopro_dir/target/aarch64-linux-android/release/libmopro_example_app.so" \
  "$jni_dir/libmopro_example_app.so"
install -m 0644 \
  "$ndk_dir/toolchains/llvm/prebuilt/linux-x86_64/sysroot/usr/lib/aarch64-linux-android/libc++_shared.so" \
  "$jni_dir/libc++_shared.so"
echo "Installed $jni_dir/libmopro_example_app.so"
echo "Installed $jni_dir/libc++_shared.so"
