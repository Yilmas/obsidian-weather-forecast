import { App, Editor, EventRef, MarkdownPostProcessorContext, MarkdownView, Modal, Notice, Plugin, TFile } from 'obsidian';
import { DEFAULT_SETTINGS, WeatherGeneratorSettings, wgData } from './settings';
import { WeatherGeneratorSettingTab } from './settings/index';

// declare module "obsidian" {
// 	interface Workspace {
// 		trigger(name: "fantasy-calendars-settings-loaded"): void;
// 		on(
// 			name: "fantasy-calendars-settings-loaded",
// 			callback: () => any
// 		): EventRef;
// 	}
// }

export default class WeatherGenerator extends Plugin {
	private data: Record<string, boolean | string | WeatherGeneratorSettings>;


	async onload() {
		console.log(`Weather Generator v${this.manifest.version} loaded.`);

		this.app.workspace.onLayoutReady(async () => {
			await this.loadWeatherGeneratorData();

			console.log("Is FC enabled and loaded: " + this.hasFantasyCalendar);

			this.addSettingTab(new WeatherGeneratorSettingTab(this.app, this));

			this.registerMarkdownPostProcessor(
				async (el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
					console.log("Markdown Processor Started");

					let nodeList = el.querySelectorAll("code");
					console.log(nodeList);

					if (!nodeList.length) return;

					const path = ctx.sourcePath;
					const info = ctx.getSectionInfo(el);
					const lineStart = ctx.getSectionInfo(el)?.lineStart;
					const file = this.app.vault.getAbstractFileByPath(ctx.sourcePath);

					if (!file || !(file instanceof TFile)) return;

					let fileContent: string[];
					let weatherFound: boolean = false;

					for (let i = 0; i < nodeList.length; i++) {
						const node = nodeList[i];

						console.log("Iterating nodes, this is node: " + i + " out of: " + nodeList.length);
						console.log(node);

						if (/weather-gen:/.test(node.innerText) && info) {
							try {
								const wgDataTemp = {
									wgSeason: "",
									fcSeason: "",
									day: {
										weather: "",
										wind: "",
										temp: "",
										tempreg: ""
									},
									night: {
										weather: "",
										wind: "",
										temp: "",
										tempreg: ""
									}
								};

								const weatherArgs = node.innerText.split('--');

								for (let index = 0; index < weatherArgs.length; index++) {
									const arg = weatherArgs[index];
									const item = arg.match(/(\w+)\s(.*)/);

									if(!item) continue;

									if(item[1] === "season") wgDataTemp.wgSeason = item[2].trimEnd();
									else if (item[1] === "weather") wgDataTemp.day.weather = item[2].trimEnd();
									else if (item[1] === "wind") wgDataTemp.day.wind = item[2].trimEnd();
									else if (item[1] === "temp") wgDataTemp.day.temp = item[2].trimEnd();
									else if (item[1] === "tempreg") wgDataTemp.day.tempreg = item[2].trimEnd();
									else if (item[1] === "nweather") wgDataTemp.night.weather = item[2].trimEnd();
									else if (item[1] === "nwind") wgDataTemp.night.wind = item[2].trimEnd();
									else if (item[1] === "ntemp") wgDataTemp.night.temp = item[2].trimEnd();
									else if (item[1] === "ntempreg") wgDataTemp.night.tempreg = item[2].trimEnd();
								}
								
								if(!wgDataTemp.wgSeason) {
									if (this.hasFantasyCalendar) {
										wgDataTemp.fcSeason = this.getCurrentSeason().name;
										const postIndex = this.getSettings().fantasyCalendarSeasons.findIndex(x => x.fcSeason == wgDataTemp.fcSeason);
										wgDataTemp.wgSeason = this.getSettings().fantasyCalendarSeasons[postIndex].wgSeason;
									}
									else {
										new Notice("You must define a season using --season or make use of Fantasy Calendar");
									}
								}

								switch(wgDataTemp.wgSeason) {
									case "wgWinter":
										this.computeWinterWeatherData();
										break;
									case "wgSpring":
										this.computeSpringWeatherData();
										break;
									case "wgSummer":
										this.computeSummerWeatherData();
										break;
									case "wgFall":
										this.computeFallWeatherData();
										break;
									default:
										//new Notice("Season not recognized!")
										console.log("Season not recognized!")
										break;
								}

								if(!wgDataTemp.day.weather) {
									// generate weather, based on season if available
								}

								if(!wgDataTemp.day.wind) {
									// generate wind, based on weather and then season if available
								}

								if(!wgDataTemp.day.temp) {
									// generate temp, based on weather then wind then season if available
								}
								
								if(!wgDataTemp.day.tempreg) {
									// generate tempreg, based on temp and season/location temp_low and temp_high if available
								}
								
								if(!wgDataTemp.night.weather) {
									// generate weather, based on season if available
								}
								
								if(!wgDataTemp.night.wind) {
									// generate wind, based on wind and then season if available
								}
								
								if(!wgDataTemp.night.temp) {
									// generate temp, based on weather then wind then season if available
								}
								
								if(!wgDataTemp.night.tempreg) {
									// generate tempreg, based on temp and season/location temp_low and temp_high if available
								}

							} catch (ex) {
								console.error(ex);
							}
						}
					}
					console.log("Markdown Processor Ended");
				}
			)
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

	computeWinterWeatherData() {
		// Generate weather data for Winter
		console.log("Generating weather data for: \"Winter\"");
	}

	computeSpringWeatherData() {
		// Generate weather data for Spring
		console.log("Generating weather data for: \"Spring\"");
	}

	computeSummerWeatherData() {
		// Generate weather data for Summer
		console.log("Generating weather data for: \"Summer\"");
	}

	computeFallWeatherData() {
		// Generate weather data for Fall
		console.log("Generating weather data for: \"Fall\"");
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
	}

	async saveWeatherGeneratorData(): Promise<void> {
		await this.saveData(this.data);
	}
}