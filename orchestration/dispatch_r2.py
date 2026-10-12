import json,subprocess
B="claude/framework-visual-testing-g9c22n"
RULE=("RULE (spec/COMPAT.md, 'Skip granularity'): skip the FEATURE, not the PLATFORM. If a few capabilities are very hard on a platform, skip just those and build the rest. "
"Skip a whole platform only if almost everything on it is hard. 'Complex' alone is not a reason - if the framework's own animation/gesture/scroll APIs can do it, build it. "
"Read spec/DESIGN.md, spec/COMPAT.md, spec/CI.md and the existing apps/{fw}/NOTES.md first. Work ONLY in apps/{fw}/** and .github/workflows/{fw}.yml. "
"Do not propose or restate a plan - implement directly. Update apps/{fw}/NOTES.md (flip statuses, per-platform notes) and append a 'Round 2' section to apps/{fw}/FEEDBACK.md. "
"Keep the existing CI green; if a new CI job is fragile after 2 honest attempts mark it continue-on-error and document it. Open ONE PR titled '[{fw}] round 2'.")
T={
"avalonia":"Round-2 tasks: (1) add the Android target (it was skipped due to a local SDK conflict; CI runners are clean - try it, skip individual features that cannot work on mobile, not the platform); (2) implement the skipped C03 staggered list entrance, C06 animated number switcher, C07 spring physics on the drag card, C09 collapsing parallax header, C16 deep link /detail/:id on web; (3) attempt C04 hero flight (animated clone of the thumbnail) and skip only if it truly needs framework changes.",
"fyne":"Round-2 tasks: implement with fyne.Animation / canvas objects: C03 staggered entrance, C06 number switcher, C13 shimmer skeleton, then C07 spring card, C08 swipe-to-dismiss, C09 collapsing/parallax header; try C04 (flying clone) and C16; skip an individual feature only if it needs custom native code.",
"slint":"Round-2 tasks: (1) add the Android target (try cargo-apk/cargo-ndk in CI; skip individual features that fail on mobile, not the platform); (2) make C12 dialog/bottom sheet/toast real (Slint popups with the specified animations, not static blocks); (3) C16 deep link on web; (4) C18 test/accessibility ids on every id in DESIGN.md; (5) C04 attempt via a flying clone element.",
"dioxus":"Round-2 tasks: add the Android target (dx serve/build --platform android in CI; skip individual features that fail on mobile, not the platform). Also improve C09 parallax header and C06 number switcher if they are still approximated and doable with CSS/Web Animations.",
"ionic":"Round-2 tasks: add the Windows target using Capacitor-Electron or an Electron wrapper of the built web app (artifact app-ionic-windows.zip). Skip individual features that fail on Windows, not the platform.",
"quasar":"Round-2 tasks: (1) add the Windows target using Quasar's Electron mode (`quasar build -m electron`), artifact app-quasar-windows.zip; (2) C04 hero flight via an animated clone of the thumbnail or the View Transitions API; (3) C07 spring physics with a real spring (Web Animations / small JS spring).",
"maui":"Round-2 tasks: C17 keyboard + hover states (PointerGestureRecognizer, key handlers on Windows); attempt C04 hero flight with an animated clone overlay; improve C07 with a real spring if feasible; stabilise the Windows CI job. MAUI Web stays skipped (no web target).",
"qt":"Round-2 tasks: C16 deep link / back handling on the WebAssembly build (history API via Emscripten), attempt C04 hero flight with an animated clone; look at making the WebAssembly CI job reliable.",
"uno":"Round-2 tasks: C14 animated whole-screen theme switch (interpolate colour resources over the 'slow' token instead of instant RequestedTheme); upgrade the approximated C02/C06/C07 to real implicit animations / spring where doable.",
}
out={}
for k,t in T.items():
    prompt=f"[{k}] round 2 - {t}\n\n"+RULE.replace("{fw}",k)
    body={"prompt":prompt,"title":f"[{k}] round 2","requirePlanApproval":False,"automationMode":"AUTO_CREATE_PR",
          "sourceContext":{"source":"sources/github/shubham-sharma-1994/ultimate-ui-framework-benchmark","githubRepoContext":{"startingBranch":B}}}
    r=subprocess.run(["curl","-sS","--max-time","90","-X","POST","https://jules.googleapis.com/v1alpha/sessions","-H","Content-Type: application/json","-d",json.dumps(body)],capture_output=True,text=True)
    try: out[k]=json.loads(r.stdout).get("id") or r.stdout[:200]
    except Exception: out[k]=r.stdout[:200]
    print(k,out[k],flush=True)
json.dump(out,open("sessions_r2.json","w"),indent=1)
