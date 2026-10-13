#!/usr/bin/env bash
# Runs inside the emulator: install, launch, wait, then report logcat + screenshot stats.
# usage: android-smoke.sh <apk> <package> <outdir>
set -u
APK="$1"; PKG="$2"; OUT="$3"
mkdir -p "$OUT"
adb install -r "$APK" || { echo "INSTALL FAILED"; exit 1; }
adb logcat -c
adb shell monkey -p "$PKG" -c android.intent.category.LAUNCHER 1
sleep 20
echo "=== focus"; adb shell dumpsys window | grep -E "mCurrentFocus|mFocusedApp" | head -3
echo "=== pid"; adb shell pidof "$PKG" || echo "PROCESS NOT RUNNING (crashed or exited)"
adb exec-out screencap -p > "$OUT/screen.png"
adb logcat -d > "$OUT/logcat.txt"
echo "=== logcat (app / crashes)"
grep -iE "slint|pulse|rust|panic|AndroidRuntime|FATAL|SIGSEGV|libc|EGL|GLES|winit|NativeActivity|DEBUG" "$OUT/logcat.txt" | head -120
echo "=== screenshot stats"
python3 - "$OUT/screen.png" <<'PY'
import sys, subprocess
try:
    from PIL import Image
except ImportError:
    subprocess.run([sys.executable,"-m","pip","install","-q","pillow"],check=False)
    from PIL import Image
im = Image.open(sys.argv[1]).convert("RGB")
w,h = im.size
cols = im.getcolors(maxcolors=w*h)
cols.sort(reverse=True)
print("size", w, h, "distinct colors", len(cols))
for n,c in cols[:6]:
    print(f"  {n/(w*h)*100:5.1f}%  #{c[0]:02x}{c[1]:02x}{c[2]:02x}")
PY
