# Pulse App (.NET MAUI)

This is the .NET MAUI implementation of the Pulse benchmark app.

## Building and Running

You need the .NET 9 SDK and the MAUI workloads installed.

```bash
# Install workloads
dotnet workload install maui

# Run Android
dotnet build -t:Run -f net9.0-android

# Run Windows
dotnet build -t:Run -f net9.0-windows10.0.19041.0
```
