# Obsidian Weather Generator
Spiritual continuation of: https://github.com/Syrkres/templates/tree/main/WeatherGenerator

This plugin will allow the user to create a markdown populated with weather data.
The user will provide the plugin with as much data as they want, and the plugin will compute anything missing, within the parameters of the supplied data.

## Optional Plugin Requirements
Below you can see the plugins I recommend to get the full experience of this plugin.

- Fantasy Calendar (Allow more comprehensive weather generation)
- ITS Theme (Allows for more visual ways to view the weather data)
- Templater (Alternate ways to generate weather data)

## Fantasy Calendar
If you use fantasy-calendar.com and/or Fantasy Calendar by Jeremy Valentine, this plugin will have options to load in data from both to help make the weather be more realistic.

From FC it makes use of:
- Current Date
- Seasons
- Locations

## Roadmap
Below you can see the nodes I will attempt to cover throughout the plugins development.

- Core: Generate weather based on seasonal and location data from fantasy-calendar.com
- Generate weather through markdown code block
- Generate a weather note using a command and/or Templater
- Generate a week of forecast for the weather, any day used within this forecast will make use of the forecast as part of the randomness