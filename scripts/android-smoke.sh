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
adb exec-out screencap > "$OUT/screen.raw"
python3 - "$OUT/screen.raw" <<'PY'
import sys, struct
d = open(sys.argv[1], "rb").read()
w, h, fmt = struct.unpack("<III", d[:12])
hdr = len(d) - w*h*4
px = d[hdr:]
print("size", w, h, "format", fmt, "header", hdr)
from collections import Counter
c = Counter()
for i in range(0, len(px), 4):
    c[(px[i], px[i+1], px[i+2])] += 1
tot = w*h
print("distinct colors", len(c))
for col, n in c.most_common(8):
    print("  %5.1f%%  #%02x%02x%02x" % (n/tot*100, *col))
# coarse picture: 32 cols x 48 rows, one char per block by dominant bucket
def bucket(r, g, b):
    if abs(r-0xF6)<8 and abs(g-0xF4)<8 and abs(b-0xFB)<8: return "."   # Tokens.background
    if r>245 and g>245 and b>245: return "W"                            # white
    if abs(r-0x67)<20 and abs(g-0x50)<20 and abs(b-0xA4)<25: return "P" # primary
    if r<60 and g<60 and b<60: return "#"                               # dark
    return "o"
cols, rows = 32, 48
bw, bh = w//cols, h//rows
print("coarse picture (. = app background, W = white, P = primary purple, # = dark, o = other):")
for ry in range(rows):
    line = ""
    for cx in range(cols):
        cnt = Counter()
        for y in range(ry*bh, ry*bh+bh, max(1, bh//3)):
            for x in range(cx*bw, cx*bw+bw, max(1, bw//3)):
                o = hdr_off = (y*w + x)*4
                cnt[bucket(px[o], px[o+1], px[o+2])] += 1
        line += cnt.most_common(1)[0][0]
    print(line)
PY
