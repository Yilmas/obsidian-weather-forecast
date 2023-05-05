import { App, Editor, EventRef, MarkdownPostProcessorContext, MarkdownView, Modal, Notice, Plugin, TFile, setIcon } from 'obsidian';
import { DEFAULT_SETTINGS, WeatherGeneratorSettings } from './settings';
import { WeatherGeneratorSettingTab } from './settings/index';
import { DailyForecast } from 'DailyForecast';

let wgDebug = false;

export default class WeatherGenerator extends Plugin {
	private data: Record<string, boolean | string | WeatherGeneratorSettings>;

	async onload() {
		console.log(`Weather Generator v${this.manifest.version} loaded.`);

		this.app.workspace.onLayoutReady(async () => {
			await this.loadWeatherGeneratorData();
			if(wgDebug) console.log('Debug Mode enabled for Weather Generator');
			if(wgDebug) console.log("Is FC enabled and loaded: " + this.hasFantasyCalendar);

			this.addSettingTab(new WeatherGeneratorSettingTab(this.app, this));

			this.registerMarkdownCodeBlockProcessor("weather", (source, el) => {
				try {	
					const forecast = new DailyForecast(
						source, 
						this.getSettings(), 
						this.hasFantasyCalendar
					);
					
					const wgBox = el.createDiv("wg-container");
					
					// Setup Compact View if displayCompact is true
					if(forecast.displayCompact) {
						//...
					}

					// Setup Detailed View if displayDetailed is true
					if(forecast.displayDetail) {
						// Setup current day
						const wgCurrent = wgBox.createDiv("wg-current");
						const wgCurrentDay = wgCurrent.createDiv("wg-current-day")
						wgCurrentDay.createDiv("wg-current-day-season").appendText(forecast.toSeason());
						wgCurrentDay.createDiv("wg-current-day-date").appendText("May 3");
						wgCurrentDay.createDiv("wg-current-day-name").appendText("Wednesday");

						const wgCurrentDayTemp = wgCurrentDay.createDiv("wg-bulletin-large");
						setIcon(wgCurrentDayTemp, "thermometer"); //thermometer-snowflake thermometer-sun
						wgCurrentDayTemp.createDiv("wg-current-day-temp").appendText(this.parseTemperature(forecast.temp, false));
						
						wgCurrentDay.createDiv("wg-current-day-temp-desc").appendText("Warmer than normal");
	
						// Set the weather icon
						const wgCurrentWeather = wgCurrent.createDiv("wg-current-weather");
						const weatherIcon = wgCurrentWeather.createDiv("wg-weather-icon-large");
						if(forecast.weather === "foggy") setIcon(weatherIcon, "cloud-sun");
						weatherIcon.createDiv("wg-weather-icon-description").appendText(forecast.weather.toLowerCase());
	
						// Define right sidebar
						const wgCurrentReadings = wgCurrent.createDiv("wg-current-readings")
	
						const wgCurrentSunrise = wgCurrentReadings.createDiv("wg-bulletin");
						setIcon(wgCurrentSunrise, "sunrise");
						wgCurrentSunrise.createDiv().appendText("Sunrise 7:00");
	
						const wgCurrentSunset = wgCurrentReadings.createDiv("wg-bulletin");
						setIcon(wgCurrentSunset, "sunset");
						wgCurrentSunset.createDiv().appendText("Sunset 19:20");
	
						const wgCurrentHumidity = wgCurrentReadings.createDiv("wg-bulletin");
						setIcon(wgCurrentHumidity, "droplets");
						wgCurrentHumidity.createDiv().appendText("60%");
	
						const wgCurrentWindSpeed = wgCurrentReadings.createDiv("wg-bulletin");
						setIcon(wgCurrentWindSpeed, "wind");
						wgCurrentWindSpeed.createDiv().appendText("10 m/s");
	
						const wgCurrentWindDirection = wgCurrentReadings.createDiv("wg-bulletin");
						setIcon(wgCurrentWindDirection, "arrow-up-right");
						wgCurrentWindDirection.createDiv().appendText("North-East");
						
						// Display Week, if displayWeek is true
						if(forecast.displayWeek) {
							// Setup week
							const wgWeek = wgBox.createDiv("wg-week");
							for (let i = 0; i < 5; i++) {
								const wgDay = wgWeek.createDiv("wg-day");
								// Set the day of the week
								wgDay.createDiv("wg-date").appendText("dd/MM");
		
								// Set the weather icon
								const weatherIconDay = wgDay.createDiv("wg-weather-icon-small");
								if(forecast.weather === "foggy") setIcon(weatherIconDay, "cloud-fog");
		
								// Set the temperature
								const wgDayTemp = wgDay.createDiv("wg-day-temp");
								wgDayTemp.createSpan().appendText(this.parseTemperature(forecast.temp))
								
								// Set the wind
								wgDay.createDiv("wg-wind").appendText(forecast.wind);												
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
		console.log("Weather Generator unloaded");
	}

	public getSettings(): WeatherGeneratorSettings {
		return this.data.settings as WeatherGeneratorSettings;
	}

	async loadWeatherGeneratorData(): Promise<void> {
		const data = await this.loadData();
		if (data) {
			Object.entries(DEFAULT_SETTINGS).forEach(([k, v]) => {
				if (!data.settings[k]) {
					data.settings[k] = v;
				}
			});
		}
		this.data = Object.assign({ settings: { ...DEFAULT_SETTINGS } }, {}, data);
		wgDebug = this.getSettings().wgDebug;
	}

	async saveWeatherGeneratorData(): Promise<void> {
		await this.saveData(this.data);
		wgDebug = this.getSettings().wgDebug;
	}

	parseTemperature(source: string | number, includeSign: boolean = true): string {
		if(!this.getSettings()) console.error("Settings are not loaded");
		const tempSetting = this.getSettings().wgTemperature;

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
  