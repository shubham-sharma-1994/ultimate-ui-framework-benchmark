package main

import (
	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
)

var (
	pulseApp fyne.App
	window   fyne.Window
	isDark   bool
)

func main() {
	pulseApp = app.New()
	pulseApp.Settings().SetTheme(&pulseTheme{isDark: false})

	window = pulseApp.NewWindow("Pulse")
	window.Resize(fyne.NewSize(390, 844))

	showcasePage := makeShowcasePage()
	window.SetContent(showcasePage)

	window.ShowAndRun()
}

func toggleTheme() {
	isDark = !isDark
	pulseApp.Settings().SetTheme(&pulseTheme{isDark: isDark})
}

func navigateTo(content fyne.CanvasObject) {
	window.SetContent(content)
}
