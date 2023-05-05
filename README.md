# Obsidian Weather Forecast
Spiritual continuation of: https://github.com/Syrkres/templates/tree/main/WeatherGenerator

This plugin will allow the user to create a markdown populated with weather data.
The user will provide the plugin with as much data as they want, and the plugin will compute anything missing, within the parameters of the supplied data.

## Block Configuration
A weather forecast can be generated with:
``
```forecast
weather-gen: --season Spring ...
view: compact
```
``

There are currently two primary views: "Compact" and "Detail". Each have an addon called "Week". If both are set, or neither, it will default to "Detail".  

## Settings
- **Debug Mode:** Will enable console logs of most things that occur in the plugin.
- **[WIP] Keep Formula:** When you enter the "Reading Mode" the plugin would normally strip the formula to save performance. However, it comes with the downside of not being able to generate a new forecast should you dislike what it generated. By enabling this field, you keep any parameters you entered originally.
- **Location:** By default all forecasts will be based on a Temperate climate zone, however you can change this using the dropdown menu. If FC at some point loads location values, this plugin will attempt to use those values instead.
    - **Polar:** Very cold and snowy.
    - **Continental:** Is similar to dry, except it is cold.
    - **Temperate:** "Europe". More rain starts to occur, and longer summers.
    - **Dry:** Rain becomes rare, the temperature raises and the humidity falls. Winds can often be brutal in these areas.
    - **Tropical:** Rain becomes heavy, the humidity is high, but it is generally not too windy.
- **FC Seasons:** You can load the json that FC used to parse, to get seasonal data. This option will be expanded further down the line.

## Optional Plugins
Below you can see the plugins I recommend to get the full experience of this plugin.

- Fantasy Calendar (Allow more comprehensive weather forecasting)
- [NOT IMPLEMENTED] Templater (Alternate way to insert weather data)

### Fantasy Calendar
_Highly advisable!_
If you use fantasy-calendar.com and/or Fantasy Calendar, this plugin will have options to load in data from both to help make the weather more accurate.

From FC it makes use of:
- Current Date
- Seasons
- Locations

If FC at some point loads in weather data and more, I will try to use that as well as a baseline - if present.

## Roadmap
Below you can see the elements I will attempt to cover throughout the plugins development.
Note: The order is not a true representation of development.

- Generate weather based on seasonal and location data from fantasy-calendar.com
- Generate weather through markdown code block, where the raw data/parameters are stored in the editor view, and presented in the reading mode. (Similar to Dataview)
- Generate a weather note using a command and/or Templater
- Generate a week of forecast for the weather, any day used within this forecast will make use of the forecast as part of the randomness
- Allow weather to be placed within infoboxes and similar (`> weather`)
- Offload weather computations to "The Cloud", to allow for more advance forecast algorithms.
- Lucide doesn't have icons for moon phases, will need something else for that.