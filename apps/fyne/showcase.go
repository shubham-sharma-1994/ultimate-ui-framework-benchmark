package main

import (
	"bytes"
	_ "embed"
	"encoding/json"
	"fmt"
	"image/color"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/canvas"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/theme"
	"fyne.io/fyne/v2/widget"
)

//go:embed data.json
var dataJSON []byte

type ItemData struct {
	ID       int      `json:"id"`
	Title    string   `json:"title"`
	Subtitle string   `json:"subtitle"`
	Score    int      `json:"score"`
	Colors   []string `json:"colors"`
	Body     string   `json:"body"`
}

type Data struct {
	Items []ItemData `json:"items"`
}

var tapCount int

func makeShowcasePage() fyne.CanvasObject {
	// App bar
	title := widget.NewLabelWithStyle("Pulse", fyne.TextAlignLeading, fyne.TextStyle{Bold: true})
	themeToggle := widget.NewButtonWithIcon("", theme.ViewRefreshIcon(), func() {
		toggleTheme()
	})
	appBar := container.NewBorder(nil, nil, title, themeToggle)

	// Hero Card
	heroText := canvas.NewText("Same app. Every framework.", color.NRGBA{R: 255, G: 255, B: 255, A: 255})
	heroText.TextSize = 22
	heroText.TextStyle.Bold = true
	// Fallback for linear gradient custom painting
	heroBg := canvas.NewRectangle(color.NRGBA{R: 0x67, G: 0x50, B: 0xA4, A: 255})
	heroBg.SetMinSize(fyne.NewSize(0, 180))
	heroCard := container.NewStack(heroBg, container.NewCenter(heroText))

	// Counter Row
	counterLabel := widget.NewLabel("Taps")
	counterValue := widget.NewLabelWithStyle("0", fyne.TextAlignCenter, fyne.TextStyle{Bold: true})
	counterBtn := widget.NewButtonWithIcon("+", theme.ContentAddIcon(), func() {
		tapCount++
		counterValue.SetText(fmt.Sprintf("%d", tapCount))
	})
	counterRow := container.NewBorder(nil, nil, counterLabel, counterBtn, container.NewCenter(counterValue))

	// Controls Card
	notifySwitch := widget.NewCheck("Notifications", func(bool) {})
	intensitySlider := widget.NewSlider(0, 100)
	// Approximated chips
	chipGroup := widget.NewSelect([]string{"Low", "Medium", "High"}, func(string) {})
	controlsCard := container.NewVBox(
		notifySwitch,
		widget.NewLabel("Intensity"),
		intensitySlider,
		widget.NewLabel("Chips (approximated as Select)"),
		chipGroup,
	)

	// Text Field
	nameInput := widget.NewEntry()
	nameInput.SetPlaceHolder("Your name")
	greeting := widget.NewLabel("")
	nameInput.OnChanged = func(s string) {
		if s == "" {
			greeting.SetText("")
		} else {
			greeting.SetText(fmt.Sprintf("Hello, %s", s))
		}
	}
	inputGroup := container.NewVBox(nameInput, greeting)

	// List Items
	listData := loadData()
	listVBox := container.NewVBox()
	for _, item := range listData.Items {
		itemCopy := item
		btn := widget.NewButton(item.Title+"\n"+item.Subtitle, func() {
			navigateTo(makeDetailPage(itemCopy))
		})
		listVBox.Add(btn)
	}

	content := container.NewVBox(
		appBar,
		heroCard,
		counterRow,
		controlsCard,
		inputGroup,
		listVBox,
	)

	return container.NewVScroll(container.NewPadded(content))
}

func loadData() Data {
	var d Data
	if err := json.NewDecoder(bytes.NewReader(dataJSON)).Decode(&d); err != nil {
		fmt.Println("Error decoding embedded data.json:", err)
	}
	return d
}
