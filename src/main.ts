import { App, Editor, EventRef, MarkdownPostProcessorContext, MarkdownView, Modal, Notice, Plugin, TFile } from 'obsidian';
import { DEFAULT_SETTINGS, WeatherGeneratorSettings, wgData, WeatherData } from './settings';
import { WeatherGeneratorSettingTab } from './settings/index';

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
					const weatherData = this.parseWeatherData(source);
					weatherData.season = this.setSeason(weatherData.season);
					if(wgDebug) console.log(weatherData);

					switch(weatherData.season) {
						case "wgWinter":
							this.computeWinterWeatherData(weatherData);
							break;
						case "wgSpring":
							this.computeSpringWeatherData(weatherData);
							break;
						case "wgSummer":
							this.computeSummerWeatherData(weatherData);
							break;
						case "wgFall":
							this.computeFallWeatherData(weatherData);
							break;
						default:
							new Notice("Season not recognized!")
							break;
					}

					el.createDiv("asd").appendText("this is a text "+this.parseTemperature("25"));
					el.createDiv("asd").appendText("this is a text "+this.parseTemperature(35));
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

	getCurrentSeason() {
		const date = FantasyCalendarAPI.getHelper().current;
		const seasons = this.getSettings().fantasyCalendarJson?.data;

		if (!seasons) return;

		// A day is within a given season if DayOfYear - DaysOfSeason =< 0, iterated through each season.
		let remainingDays = FantasyCalendarAPI.getHelper().dayNumberForDate(date);
		let currentSeason;
		seasons.some(season => {
			remainingDays = remainingDays - season.length;
			
			if (remainingDays <= 0) {
				currentSeason = season;
				return true;
			}
			return false;
		})

		return currentSeason;
	}

	parseWeatherData(source: string): WeatherData {
		const [weatherPart, autoPart] = source.split("\n");
		const weatherData: Partial<WeatherData> = {};

		weatherPart.split(/(--.+?\s)/).forEach((part, i, arr) => {
			if (part.startsWith("--")) {
				const key = part.trim().slice(2) as keyof WeatherData;
				const nextPart = arr[i + 1].trim();
				if (nextPart && !nextPart.startsWith("--")) {
					(weatherData[key] as string | number) = isNaN(Number(nextPart)) ? nextPart : Number(nextPart);
				}
			}
		});

		return { ...weatherData } as WeatherData;
	}

	setSeason(season: string) {
		if(!season) {
			if (this.hasFantasyCalendar) {
				const fcSeason = this.getCurrentSeason().name;
				const postIndex = this.getSettings().fantasyCalendarSeasons.findIndex(x => x.fcSeason == fcSeason);
				season = this.getSettings().fantasyCalendarSeasons[postIndex].wgSeason;
			}
			else {
				new Notice("You must define a season using --season or setup Fantasy Calendar in this plugins settings");
			}
		}

		return season;
	}

	computeWinterWeatherData(weatherData: WeatherData) {
		// Generate weather data for Winter
		if(wgDebug) console.log("Generating weather data for: \"Winter\"");
	}

	computeSpringWeatherData(weatherData: WeatherData) {
		// Generate weather data for Spring
		if(wgDebug) console.log("Generating weather data for: \"Spring\"");
		const allPropsHasValue = Object.values(weatherData).every(x => x !== null && x !== undefined && x !== "");
		if(allPropsHasValue) return weatherData;
		else console.log("no data, value of ntempreg:" + weatherData.ntempreg);
	}

	computeSummerWeatherData(weatherData: WeatherData) {
		// Generate weather data for Summer
		if(wgDebug) console.log("Generating weather data for: \"Summer\"");
	}

	computeFallWeatherData(weatherData: WeatherData) {
		// Generate weather data for Fall
		if(wgDebug) console.log("Generating weather data for: \"Fall\"");
	}

	generateWeather(weatherData: WeatherData) {
		if(!weatherData.weather) {
			// generate weather, based on season if available
		}

		if(!weatherData.wind) {
			// generate wind, based on weather and then season if available
		}

		if(!weatherData.temp) {
			// generate temp, based on weather then wind then season if available
		}
		
		if(!weatherData.tempreg) {
			// generate tempreg, based on temp and season/location temp_low and temp_high if available
		}
		
		if(!weatherData.nweather) {
			// generate weather, based on season if available
		}
		
		if(!weatherData.nwind) {
			// generate wind, based on wind and then season if available
		}
		
		if(!weatherData.ntemp) {
			// generate temp, based on weather then wind then season if available
		}
		
		if(!weatherData.ntempreg) {
			// generate tempreg, based on temp and season/location temp_low and temp_high if available
		}
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

	parseTemperature(source: string | number) {
		if(!this.getSettings()) console.error("Settings are not loaded");
		const tempSetting = this.getSettings().wgTemperature;

		if (typeof source === 'string' || typeof source === 'number') {
			const temperature = typeof source === 'string' ? parseFloat(source) : source;
			const convertedTemperature = tempSetting === 'f' ? temperature.celsiusToFahrenheit() : temperature;
			const unit = tempSetting === 'f' ? '°F' : '°C';
			return `${convertedTemperature}${unit}`;
		} else {
			console.error('Source is not a valid string or number!');
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
  