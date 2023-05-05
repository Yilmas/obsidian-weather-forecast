import { App, Editor, EventRef, MarkdownPostProcessorContext, MarkdownView, Modal, Notice, Plugin, TFile, setIcon } from 'obsidian';
import { DEFAULT_SETTINGS, WeatherForecastSettings } from './settings';
import { WeatherForecastSettingTab } from './settings/index';
import { DailyForecast } from 'DailyForecast';

let wfDebug = false;

export default class WeatherForecast extends Plugin {
	private data: Record<string, boolean | string | WeatherForecastSettings>;

	async onload() {
		console.log(`Weather Forecast v${this.manifest.version} loaded.`);

		this.app.workspace.onLayoutReady(async () => {
			await this.loadWeatherForecastData();
			if(wfDebug) console.log('Debug Mode enabled for Weather Forecast');
			if(wfDebug) console.log("Is FC enabled and loaded: " + this.hasFantasyCalendar);

			this.addSettingTab(new WeatherForecastSettingTab(this.app, this));

			this.registerMarkdownCodeBlockProcessor("forecast", (source, el) => {
				try {	
					const forecast = new DailyForecast(
						source, 
						this.getSettings(), 
						this.hasFantasyCalendar
					);
					
					if(forecast.displayCompact || forecast.displayDetail) {
						const wfBox = el.createDiv("wf-container");
					
						// Setup Compact View if displayCompact is true
						if(forecast.displayCompact) {
							const wfCompact = wfBox.createDiv("wf-compact");

							// Column 1: Description
							const wfCompactDesc = wfCompact.createDiv("wf-compact-desc");
							wfCompactDesc.createDiv("wf-compact-desc-date").appendText("May 3");
							wfCompactDesc.createDiv("wf-compact-desc-name").appendText("Wednesday");
							wfCompactDesc.createDiv("wf-compact-desc-season").appendText(forecast.toSeason());
							// ----------------------------------------------------

							// Column 2: Day
							const wfCompactDay = wfCompact.createDiv("wf-compact-day");

							// Title
							const wfCompactDayTitle = wfCompactDay.createDiv();
							wfCompactDayTitle.createDiv("wf-compact-title").appendText("Day");

							// Weather & Temp
							const wfCompactDayWeather = wfCompactDay.createDiv("wf-bulletin");
							const weatherIconDay = wfCompactDayWeather.createDiv("wf-weather-icon-small");
							if(forecast.weather === "foggy") setIcon(weatherIconDay, "cloud-sun");
							wfCompactDayWeather.createDiv("wf-bold").appendText(this.parseTemperature(forecast.temp, false, false))

							// Wind
							const wfCompactDayWind = wfCompactDay.createDiv("wf-bulletin");
							setIcon(wfCompactDayWind, "arrow-down-left");
							wfCompactDayWind.createDiv().appendText("8 m/s")
							// ----------------------------------------------------

							// Column 3: Night
							const wfCompactNight = wfCompact.createDiv("wf-compact-night");

							// Title
							const wfCompactNightTitle = wfCompactNight.createDiv();
							wfCompactNightTitle.createDiv("wf-compact-title").appendText("Night");

							// Weather & Temp
							const wfCompactNightWeather = wfCompactNight.createDiv("wf-bulletin");
							const weatherIconNight = wfCompactNightWeather.createDiv("wf-weather-icon-small");
							if(forecast.weather === "foggy") setIcon(weatherIconNight, "cloudy");
							wfCompactNightWeather.createDiv("wf-bold").appendText(this.parseTemperature(forecast.temp, false, false))

							// Wind
							const wfCompactNightWind = wfCompactNight.createDiv("wf-bulletin");
							setIcon(wfCompactNightWind, "arrow-down");
							wfCompactNightWind.createDiv().appendText("12 m/s")
							// ----------------------------------------------------

							// Display Week, if displayWeek is true
							if(forecast.displayWeek) {
								// Setup week
								const wfWeek = wfBox.createDiv("wf-week");
								for (let i = 0; i < 4; i++) {
									const wfDay = wfWeek.createDiv("wf-day");
									// Set the day of the week
									wfDay.createDiv("wf-date").appendText("dd/MM");
			
									// Set the weather icon
									const weatherIconDay = wfDay.createDiv("wf-weather-icon-medium");
									if(forecast.weather === "foggy") setIcon(weatherIconDay, "cloud-fog");
			
									// Set the temperature
									const wfDayTemp = wfDay.createDiv("wf-day-temp");
									wfDayTemp.createSpan().appendText(this.parseTemperature(forecast.temp, false))
									
									// Set the wind
									//wfDay.createDiv("wf-wind").appendText(forecast.wind);	

									const wfDayWind = wfDay.createDiv("wf-wind");
									setIcon(wfDayWind, "arrow-up-right");
									wfDayWind.createDiv().appendText("5 m/s");
								}
							}
						}
	
						// Setup Detailed View if displayDetailed is true
						if(forecast.displayDetail) {
							// Setup current day
							const wfCurrent = wfBox.createDiv("wf-current");
							const wfCurrentDay = wfCurrent.createDiv("wf-current-day")
							wfCurrentDay.createDiv("wf-current-day-season").appendText(forecast.toSeason());
							wfCurrentDay.createDiv("wf-current-day-date").appendText("May 3");
							wfCurrentDay.createDiv("wf-current-day-name").appendText("Wednesday");
	
							const wfCurrentDayTemp = wfCurrentDay.createDiv("wf-bulletin-large");
							setIcon(wfCurrentDayTemp, "thermometer"); //thermometer-snowflake thermometer-sun
							wfCurrentDayTemp.createDiv("wf-current-day-temp").appendText(this.parseTemperature(forecast.temp, false, false));
							wfCurrentDayTemp.createSpan("wf-current-day-ntemp").appendText("/ "+this.parseTemperature(forecast.ntemp, false, true));
							
							wfCurrentDay.createDiv("wf-current-day-temp-desc").appendText("Warmer than normal");
		
							// Set the weather icon
							const wfCurrentWeather = wfCurrent.createDiv("wf-current-weather");
							const weatherIcon = wfCurrentWeather.createDiv("wf-weather-icon-large");
							if(forecast.weather === "foggy") setIcon(weatherIcon, "cloud-sun");
							//weatherIcon.createDiv("wf-weather-icon-description").appendText(forecast.weather.toLowerCase());

							// Define right sidebar
							const wfCurrentReadings = wfCurrent.createDiv("wf-current-readings");

							// Night
							const wfCurrentNight = wfCurrentReadings.createDiv("wf-current-night");
							wfCurrentNight.createDiv().appendText("Night");

							const wfCurrentNightDetails = wfCurrentNight.createDiv("wf-current-night-details");

							const wfCurrentNightWeather = wfCurrentNightDetails.createDiv("wf-bulletin");
							setIcon(wfCurrentNightWeather, "moon");
							wfCurrentNightWeather.createDiv().appendText("Cloudy");

							const wfCurrentNightWind = wfCurrentNightDetails.createDiv("wf-bulletin");
							setIcon(wfCurrentNightWind, "arrow-up-right");
							wfCurrentNightWind.createDiv().appendText("5 m/s");
							// Night End
		
							const wfCurrentReadingsPanel = wfCurrentReadings.createDiv("wf-current-readings-panel");

							const wfCurrentSunrise = wfCurrentReadingsPanel.createDiv("wf-bulletin");
							setIcon(wfCurrentSunrise, "sunrise");
							wfCurrentSunrise.createDiv().appendText("Sunrise 7:00");
		
							const wfCurrentSunset = wfCurrentReadingsPanel.createDiv("wf-bulletin");
							setIcon(wfCurrentSunset, "sunset");
							wfCurrentSunset.createDiv().appendText("Sunset 19:20");
		
							const wfCurrentHumidity = wfCurrentReadingsPanel.createDiv("wf-bulletin");
							setIcon(wfCurrentHumidity, "droplets");
							wfCurrentHumidity.createDiv().appendText("60%");
		
							const wfCurrentWindSpeed = wfCurrentReadingsPanel.createDiv("wf-bulletin");
							setIcon(wfCurrentWindSpeed, "wind");
							wfCurrentWindSpeed.createDiv().appendText("10 m/s");
		
							const wfCurrentWindDirection = wfCurrentReadingsPanel.createDiv("wf-bulletin");
							setIcon(wfCurrentWindDirection, "compass");
							wfCurrentWindDirection.createDiv().appendText("North-East");
							
							// Display Week, if displayWeek is true
							if(forecast.displayWeek) {
								// Setup week
								const wfWeek = wfBox.createDiv("wf-week");
								for (let i = 0; i < 5; i++) {
									const wfDay = wfWeek.createDiv("wf-day");
									// Set the day of the week
									wfDay.createDiv("wf-date").appendText("dd/MM");
			
									// Set the weather icon
									const weatherIconDay = wfDay.createDiv("wf-weather-icon-medium");
									if(forecast.weather === "foggy") setIcon(weatherIconDay, "cloud-fog");
			
									// Set the temperature
									const wfDayTemp = wfDay.createDiv("wf-day-temp");
									wfDayTemp.createSpan().appendText(this.parseTemperature(forecast.temp, false))
									
									// Set the wind
									//wfDay.createDiv("wf-wind").appendText(forecast.wind);	

									const wfDayWind = wfDay.createDiv("wf-wind");
									setIcon(wfDayWind, "arrow-up-right");
									wfDayWind.createDiv().appendText("5 m/s");
								}
							}
	
						}
					}
				} catch (error) {
					console.error(error); 
				}
			})
		});		
	}

	get hasFantasyCalendar() {
		return this.app.plugins.getPlugin("fantasy-calendar") != null;
	}

	capitalizeWords(arr) {
		return arr.map(element => {
			return element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
		}).join(' ');
	}

	onunload() {
		console.log("Weather Forecast unloaded");
	}

	public getSettings(): WeatherForecastSettings {
		return this.data.settings as WeatherForecastSettings;
	}

	async loadWeatherForecastData(): Promise<void> {
		const data = await this.loadData();
		if (data) {
			Object.entries(DEFAULT_SETTINGS).forEach(([k, v]) => {
				if (!data.settings[k]) {
					data.settings[k] = v;
				}
			});
		}
		this.data = Object.assign({ settings: { ...DEFAULT_SETTINGS } }, {}, data);
		wfDebug = this.getSettings().wfDebug;
	}

	async saveWeatherForecastData(): Promise<void> {
		await this.saveData(this.data);
		wfDebug = this.getSettings().wfDebug;
	}

	parseTemperature(temp: string | number, includeSign: boolean = true, includeUnit: boolean = true): string {
		if(!this.getSettings()) console.error("Settings are not loaded");
		const tempSetting = this.getSettings().wfTemperature;

		if (typeof temp === 'string' || typeof temp === 'number') {
			const temperature = typeof temp === 'string' ? parseFloat(temp) : temp;
			const convertedTemperature = tempSetting === 'f' ? temperature.celsiusToFahrenheit() : temperature;
			const unit = includeUnit ? (tempSetting === 'f' ? 'F' : 'C') : '';
			const signed = includeSign ? (convertedTemperature >= 0 ? '+' : '-') : (convertedTemperature < 0 ? '-' : '');

			return `${signed}${convertedTemperature}°${unit}`;
		} else {
			throw new Error('Source is not a valid string or number!');
		}
	}
}

declare global {
	interface String {
	  	celsiusToFahrenheit(): string;
	}
	interface Number {
		celsiusToFahrenheit(): number;
	}
}
  
String.prototype.celsiusToFahrenheit = function (): string {
	const celsius = parseFloat(this);
	if (isNaN(celsius)) {
	  	return "Invalid temperature";
	}
	return celsius.celsiusToFahrenheit().toFixed(0);
};
Number.prototype.celsiusToFahrenheit = function (): number {
	const celsius = this;
	const fahrenheit = (celsius * 9/5) + 32;
	return fahrenheit;
};
  