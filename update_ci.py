import re

with open('.github/workflows/maui.yml', 'r') as f:
    content = f.read()

content = content.replace("Setup .NET 9.0", "Setup .NET 8.0")
content = content.replace("dotnet-version: '9.0.x'", "dotnet-version: '8.0.x'")
content = content.replace("net9.0-android", "net8.0-android")
content = content.replace("net9.0-windows10.0.19041.0", "net8.0-windows10.0.19041.0")

# For windows build, add -r win10-x64 and see if it stabilizes.
content = content.replace(
    "-f net8.0-windows10.0.19041.0 -c Release -p:WindowsPackageType=None -p:SelfContained=false",
    "-f net8.0-windows10.0.19041.0 -c Release -p:WindowsPackageType=None -p:SelfContained=false -r win10-x64"
)

with open('.github/workflows/maui.yml', 'w') as f:
    f.write(content)

with open('apps/maui/Pulse.csproj', 'r') as f:
    content = f.read()

content = content.replace("net9.0-android", "net8.0-android")
content = content.replace("net9.0-windows10.0.19041.0", "net8.0-windows10.0.19041.0")

with open('apps/maui/Pulse.csproj', 'w') as f:
    f.write(content)
