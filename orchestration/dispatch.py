import json,subprocess,sys
B="claude/framework-visual-testing-g9c22n"
FW={
"flutter":("Flutter","Flutter stable (Dart). Reference implementation: build it first-class; all other apps are compared to it. Web: flutter build web (CanvasKit). Android APK. Windows desktop."),
"react-native":("React Native","Expo or bare RN with the New Architecture; react-native-reanimated + gesture-handler are allowed. Web via react-native-web, Windows via react-native-windows."),
"ionic":("Ionic","Ionic + Angular or React (your pick, standalone), Capacitor for Android. Windows: skip unless Electron-based Capacitor is straightforward. Use CSS/Web Animations; Ionic components only where spec says native."),
"uno":("Uno Platform","Uno Platform (C#/WinUI XAML) single project: WebAssembly, Android, Windows (WinAppSDK or Skia desktop)."),
"compose":("Compose Multiplatform","Kotlin Compose Multiplatform: Android, Desktop (Windows via jpackage/portable distribution) and Wasm/JS web."),
"avalonia":("Avalonia","Avalonia UI (C#): Browser (WASM), Android and Desktop (Windows)."),
"qt":("Qt","Qt 6 with QML/Qt Quick: Windows, Android, WebAssembly (optional/experimental). Use aqtinstall / install-qt-action in CI."),
"maui":("NET MAUI",".NET MAUI: Android and Windows. Web is unsupported - skip with a note."),
"dioxus":("Dioxus","Dioxus (Rust) 0.6+: web (wasm), desktop (Windows), mobile Android only if it works with reasonable effort."),
"fyne":("Fyne","Fyne (Go): desktop Windows, Android via fyne package; web (WASM) is experimental - attempt once then skip. Custom canvas animations via fyne.Animation."),
"tauri":("Tauri","Tauri v2 with a plain Vite + TypeScript (no UI framework, CSS + Web Animations) frontend: web (frontend only), Android, Windows."),
"slint":("Slint","Slint (Rust or C++ - Rust preferred): Windows, Android, Web (WASM). Use Slint's built-in animate/states."),
"electron":("Electron","Electron with a Vite + TypeScript frontend (plain DOM/CSS/Web Animations; the same frontend is the web build). Windows only; Android unsupported - skip."),
"quasar":("Quasar","Quasar (Vue 3, Vite): SPA web build, Capacitor mode for Android, Electron mode for Windows. Use Quasar components only where spec says native."),
}
only=sys.argv[1:] or list(FW)
out={}
for k in only:
    name,hint=FW[k]
    prompt=f"""[{k}] Pulse app - {name}
Read spec/AGENT_BRIEF.md first and follow it. Your framework folder is apps/{k}/ and your CI file is .github/workflows/{k}.yml. Do not touch anything else.
Framework hint: {hint}
PROPOSE A PLAN AND WAIT FOR APPROVAL before writing code. Targets: Web, Android, Windows (skip with a note if unsupported). Moderate effort, no force-fitting.
PR title: "[{k}] Pulse app"."""
    body={"prompt":prompt,"title":f"[{k}] Pulse app","requirePlanApproval":True,"automationMode":"AUTO_CREATE_PR",
          "sourceContext":{"source":"sources/github/shubham-sharma-1994/ultimate-ui-framework-benchmark","githubRepoContext":{"startingBranch":B}}}
    r=subprocess.run(["curl","-sS","-X","POST","https://jules.googleapis.com/v1alpha/sessions","-H","Content-Type: application/json","-d",json.dumps(body)],capture_output=True,text=True)
    try:
        d=json.loads(r.stdout); out[k]=d.get("id") or d
    except Exception: out[k]=r.stdout[:300]
    print(k,out[k],flush=True)
a=json.load(open("sessions.json")); a.update(out); json.dump(a,open("sessions.json","w"),indent=1)
