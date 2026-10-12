package main

import (
	"fmt"
	"image/color"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/canvas"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/dialog"
	"fyne.io/fyne/v2/theme"
	"fyne.io/fyne/v2/widget"
)

func makeDetailPage(item ItemData) fyne.CanvasObject {
	backBtn := widget.NewButtonWithIcon("Back", theme.NavigateBackIcon(), func() {
		navigateTo(makeShowcasePage())
	})

	headerTitle := canvas.NewText(item.Title, theme.DefaultTheme().Color(theme.ColorNameForeground, theme.VariantDark))
	headerTitle.TextSize = 32
	headerTitle.TextStyle.Bold = true
	headerBg := canvas.NewRectangle(color.NRGBA{R: 0x67, G: 0x50, B: 0xA4, A: 255})
	headerBg.SetMinSize(fyne.NewSize(0, 240))

	// Approximating the hero header with a stack
	headerContainer := container.NewStack(headerBg, container.NewCenter(headerTitle), container.NewVBox(container.NewHBox(backBtn)))

	progressBar := widget.NewProgressBar()
	progressBar.SetValue(float64(item.Score) / 100.0)
	progressLabel := canvas.NewText(fmt.Sprintf("%d%%", item.Score), theme.DefaultTheme().Color(theme.ColorNameForeground, theme.VariantDark))
	progressLabel.TextSize = 24
	progressLabel.TextStyle.Bold = true

	progressCard := container.NewVBox(
		widget.NewLabel("Progress"),
		progressBar,
		container.NewCenter(progressLabel),
	)

	// Accordion Approximation (VBox with toggle button)
	detailsContent := widget.NewLabel(item.Body)
	detailsContent.Wrapping = fyne.TextWrapWord
	detailsContent.Hide()
	accordionBtn := widget.NewButton("Details (tap to toggle)", func() {
		if detailsContent.Hidden {
			detailsContent.Show()
		} else {
			detailsContent.Hide()
		}
	})
	accordion := container.NewVBox(accordionBtn, detailsContent)

	// Buttons Row
	btnDialog := widget.NewButton("Show dialog", func() {
		d := dialog.NewInformation("Dialog", "This is a native dialog.", window)
		d.Show()
	})
	btnSheet := widget.NewButton("Show sheet (Skipped)", func() {})
	btnToast := widget.NewButton("Toast (Skipped)", func() {})
	buttonsRow := container.NewHBox(btnDialog, btnSheet, btnToast)

	content := container.NewVBox(
		headerContainer,
		progressCard,
		accordion,
		widget.NewLabel("Draggable card (skipped)"),
		widget.NewLabel("Swipe list (skipped)"),
		buttonsRow,
	)

	return container.NewVScroll(container.NewPadded(content))
}
