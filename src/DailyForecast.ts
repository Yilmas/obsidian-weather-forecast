import { Notice } from "obsidian";
import { WeatherForecastSettings } from "settings";

let wfDebug = false;

export class DailyForecast {
    season: string;
    fcSeasonIndex: number;
	fcSeason: string;
	weather: string;
	wind: string;
	temp: number;
	tempreg: number;
	nweather: string;
	nwind: string;
	ntemp: number;
	ntempreg: number;

	settings: WeatherForecastSettings;
	hasFC: boolean;

	displayCompact: boolean;
	displayDetail: boolean = true;
	displayWeek: boolean;

	constructor(source: string, wfSettings: WeatherForecastSettings, fc: boolean) {
		this.settings = wfSettings;
		wfDebug = this.settings.wfDebug;
		this.hasFC = fc;
		this.parseWeatherData(source);
					
		if(wfDebug) console.log(this);

		if([this.season, this.weather, this.wind, this.temp, this.tempreg, this.nweather, this.nwind, this.ntemp,this.ntempreg]
			.every(prop => prop !== undefined || prop !== null)) {
			switch(this.season) {
				case "wfWinter":
					this.computeWinterWeatherData(this);
					break;
				case "wfSpring":
					this.computeSpringWeatherData(this);
					break;
				case "wfSummer":
					this.computeSummerWeatherData(this);
					break;
				case "wfFall":
					this.computeFallWeatherData(this);
					break;
				default:
					new Notice("Season not recognized!")
					break;
			}
		}
	}

	parseWeatherData(source: string): void {
		const sourceArray = source.toLowerCase().split('\n');
		const weatherPart = sourceArray.find(part => part.startsWith('weather-gen:'))?.slice(12).trim();
		const autoPart = sourceArray.find(part => part.startsWith('auto-gen:'))?.slice(9).trim();
		const viewPart = sourceArray.find(part => part.startsWith('view:'))?.slice(5).trim();

		if(weatherPart) {
			weatherPart.split(/(--.+?\s)/).forEach((part, i, arr) => {
				if (part.startsWith("--")) {
					const key = part.trim().slice(2) as keyof DailyForecast;
					const nextPart = arr[i + 1].trim();
					if (nextPart && !nextPart.startsWith("--")) {
						(this[key] as string | number) = isNaN(Number(nextPart)) ? nextPart : Number(nextPart);
					}
				}
			});
		}

		if(autoPart) {
			// TODO: Fill in auto-generated values
		}

		// Check seasons
		this.setSeason();

		// Check requested view
		if(viewPart) this.parseViewSettings(viewPart);
	}

	parseViewSettings(view: string): void {
		view.split(' ').forEach((part, i, arr) => {
			if(part === "compact") {
				this.displayCompact = true;
				this.displayDetail = false;
			}
			if (part === "detail") {
				this.displayDetail = true;
			}
			if (part === "week") {
				this.displayWeek = true;
			}
		})

		// If both displayCompact and displayDetailed are true, default to displayDetailed as true
		// and set displayCompact as false. (remember to warn in console)
		if(this.displayCompact && this.displayDetail) {
			this.displayCompact = false;
			console.warn("Both compact and detail view are set as true, defaulting to detail!")
		}
	}

	toSeason(): string {
		if(this.fcSeason) {
			return this.fcSeason;
		}
		else {
			if(this.season.startsWith('wf')) {
				return this.season.replace('wf', '');
			}
			return this.season;
		}
	}

	getCurrentSeason() {
		const date = FantasyCalendarAPI.getHelper().current;
		const seasons = this.settings.fantasyCalendarJson?.data;

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

	setSeason() {
		if(!this.season) {
			if (this.hasFC) {
				this.fcSeason = this.getCurrentSeason().name;
				this.fcSeasonIndex = this.settings.fantasyCalendarSeasons.findIndex(x => x.fcSeason == this.fcSeason);
				this.season = this.settings.fantasyCalendarSeasons[this.fcSeasonIndex].wfSeason;
			}
		}
		else {
			throw new Error("To generate a forecast, it must know the season either through manual input or using FC.")
		}
	}

	computeWinterWeatherData(data: DailyForecast) {
		// Generate weather data for Winter
		if(wfDebug) console.log("Generating weather data for: \"Winter\"");
	}

	computeSpringWeatherData(data: DailyForecast) {
		// Generate weather data for Spring
		if(wfDebug) console.log("Generating weather data for: \"Spring\"");
		const allPropsHasValue = Object.values(data).every(x => x !== null && x !== undefined && x !== "");
		if(allPropsHasValue) return data;
		else console.log("no data, value of ntempreg:" + data.ntempreg);
	}

	computeSummerWeatherData(data: DailyForecast) {
		// Generate weather data for Summer
		if(wfDebug) console.log("Generating weather data for: \"Summer\"");
	}

	computeFallWeatherData(data: DailyForecast) {
		// Generate weather data for Fall
		if(wfDebug) console.log("Generating weather data for: \"Fall\"");
	}

	generateWeather(data: DailyForecast) {
		if(!data.weather) {
			// generate weather, based on season if available
		}

		if(!data.wind) {
			// generate wind, based on weather and then season if available
		}

		if(!data.temp) {
			// generate temp, based on weather then wind then season if available
		}
		
		if(!data.tempreg) {
			// generate tempreg, based on temp and season/location temp_low and temp_high if available
		}
		
		if(!data.nweather) {
			// generate weather, based on season if available
		}
		
		if(!data.nwind) {
			// generate wind, based on wind and then season if available
		}
		
		if(!data.ntemp) {
			// generate temp, based on weather then wind then season if available
		}
		
		if(!data.ntempreg) {
			// generate tempreg, based on temp and season/location temp_low and temp_high if available
		}
	}
}