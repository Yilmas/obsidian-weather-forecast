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

			this.registerMarkdownCodeBlockProcessor("weather", (source, el) => {
				try {	
					const forecast = new DailyForecast(
						source, 
						this.getSettings(), 
						this.hasFantasyCalendar
					);
					
					const wfBox = el.createDiv("wf-container");
					
					// Setup Compact View if displayCompact is true
					if(forecast.displayCompact) {
						//...
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
						wfCurrentDayTemp.createDiv("wf-current-day-temp").appendText(this.parseTemperature(forecast.temp, false));
						
						wfCurrentDay.createDiv("wf-current-day-temp-desc").appendText("Warmer than normal");
	
						// Set the weather icon
						const wfCurrentWeather = wfCurrent.createDiv("wf-current-weather");
						const weatherIcon = wfCurrentWeather.createDiv("wf-weather-icon-large");
						if(forecast.weather === "foggy") setIcon(weatherIcon, "cloud-sun");
						weatherIcon.createDiv("wf-weather-icon-description").appendText(forecast.weather.toLowerCase());
	
						// Define right sidebar
						const wfCurrentReadings = wfCurrent.createDiv("wf-current-readings")
	
						const wfCurrentSunrise = wfCurrentReadings.createDiv("wf-bulletin");
						setIcon(wfCurrentSunrise, "sunrise");
						wfCurrentSunrise.createDiv().appendText("Sunrise 7:00");
	
						const wfCurrentSunset = wfCurrentReadings.createDiv("wf-bulletin");
						setIcon(wfCurrentSunset, "sunset");
						wfCurrentSunset.createDiv().appendText("Sunset 19:20");
	
						const wfCurrentHumidity = wfCurrentReadings.createDiv("wf-bulletin");
						setIcon(wfCurrentHumidity, "droplets");
						wfCurrentHumidity.createDiv().appendText("60%");
	
						const wfCurrentWindSpeed = wfCurrentReadings.createDiv("wf-bulletin");
						setIcon(wfCurrentWindSpeed, "wind");
						wfCurrentWindSpeed.createDiv().appendText("10 m/s");
	
						const wfCurrentWindDirection = wfCurrentReadings.createDiv("wf-bulletin");
						setIcon(wfCurrentWindDirection, "arrow-up-right");
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
								const weatherIconDay = wfDay.createDiv("wf-weather-icon-small");
								if(forecast.weather === "foggy") setIcon(weatherIconDay, "cloud-fog");
		
								// Set the temperature
								const wfDayTemp = wfDay.createDiv("wf-day-temp");
								wfDayTemp.createSpan().appendText(this.parseTemperature(forecast.temp))
								
								// Set the wind
								wfDay.createDiv("wf-wind").appendText(forecast.wind);												
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

	parseTemperature(source: string | number, includeSign: boolean = true): string {
		if(!this.getSettings()) console.error("Settings are not loaded");
		const tempSetting = this.getSettings().wfTemperature;

		if (typeof source === 'string' || typeof source === 'number') {
			const temperature = typeof source === 'string' ? parseFloat(source) : source;
			const convertedTemperature = tempSetting === 'f' ? temperature.celsiusToFahrenheit() : temperature;
			const unit = tempSetting === 'f' ? '°F' : '°C';
			const signed = includeSign && convertedTemperature !== 0 ? convertedTemperature > 0 ? '+' : '-' : '';
			return `${signed}${convertedTemperature}${unit}`;
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
  