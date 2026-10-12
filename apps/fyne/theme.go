package main

import (
	"image/color"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/theme"
)

type pulseTheme struct {
	isDark bool
}

func (p pulseTheme) Color(name fyne.ThemeColorName, variant fyne.ThemeVariant) color.Color {
	if name == theme.ColorNameBackground {
		if p.isDark {
			return color.NRGBA{R: 0x12, G: 0x10, B: 0x16, A: 0xFF}
		}
		return color.NRGBA{R: 0xF6, G: 0xF4, B: 0xFB, A: 0xFF}
	}
	if name == theme.ColorNameButton {
		if p.isDark {
			return color.NRGBA{R: 0x26, G: 0x23, B: 0x2E, A: 0xFF} // surfaceAlt
		}
		return color.NRGBA{R: 0xEE, G: 0xEA, B: 0xF7, A: 0xFF}
	}
	if name == theme.ColorNameDisabledButton {
		return theme.DefaultTheme().Color(name, variant)
	}
	if name == theme.ColorNameForeground {
		if p.isDark {
			return color.NRGBA{R: 0xE6, G: 0xE0, B: 0xE9, A: 0xFF} // text
		}
		return color.NRGBA{R: 0x1D, G: 0x1B, B: 0x20, A: 0xFF}
	}
	if name == theme.ColorNamePrimary {
		if p.isDark {
			return color.NRGBA{R: 0xCF, G: 0xBC, B: 0xFF, A: 0xFF}
		}
		return color.NRGBA{R: 0x67, G: 0x50, B: 0xA4, A: 0xFF}
	}
	if name == theme.ColorNameHover {
		if p.isDark {
			return color.NRGBA{R: 0x26, G: 0x23, B: 0x2E, A: 0xFF}
		}
		return color.NRGBA{R: 0xEE, G: 0xEA, B: 0xF7, A: 0xFF}
	}
	// Add other mappings
	return theme.DefaultTheme().Color(name, variant)
}

func (p pulseTheme) Font(style fyne.TextStyle) fyne.Resource {
	return theme.DefaultTheme().Font(style)
}

func (p pulseTheme) Icon(name fyne.ThemeIconName) fyne.Resource {
	return theme.DefaultTheme().Icon(name)
}

func (p pulseTheme) Size(name fyne.ThemeSizeName) float32 {
	return theme.DefaultTheme().Size(name)
}
