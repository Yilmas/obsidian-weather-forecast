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

let hasFantasyCalendar = false;

export default class WeatherGenerator extends Plugin {
	private data: Record<string, boolean | string | WeatherGeneratorSettings>;

	async onload() {
		console.log(`Weather Generator v${this.manifest.version} loaded.`);
		await this.loadWeatherGeneratorData();

		if (app.workspace.on("fantasy-calendars-settings-loaded", () => {
			hasFantasyCalendar = true;
		})) { }

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('cloud', 'Weather Generator', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			if (hasFantasyCalendar) {
				

				console.log(FantasyCalendarAPI.getHelper().currentDate + " - " + this.getCurrentSeason().name);
				console.log(this.getCurrentSeason());
			}
			else {
				new Notice("Fantasy Calendar isn't loaded");
			}
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new WeatherGeneratorSettingTab(this.app, this));

		//
		// Start WEATHER GEN
		//
		this.registerMarkdownPostProcessor(
			async (el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
				let nodeList = el.querySelectorAll("code");
				console.log("Markdown Processor Started");
				console.log("Is FC Enabled: " + hasFantasyCalendar)

				if (!nodeList.length) return;

				const path = ctx.sourcePath;
				const info = ctx.getSectionInfo(el);
				const lineStart = ctx.getSectionInfo(el)?.lineStart;
				const file = this.app.vault.getAbstractFileByPath(ctx.sourcePath);

				if (!file || !(file instanceof TFile)) return;

				let fileContent: string[];
				let weatherFound: boolean = false;

				for (let index = 0; index < nodeList.length; index++) {
					const node = nodeList[index];

					if (/weather-gen:/.test(node.innerText) && info) {
						try {
							const weatherArgs = node.innerText.split('--');

							for (let index = 0; index < weatherArgs.length; index++) {
								const arg = weatherArgs[index];
								const item = arg.match(/(\w+)\s(.*)/);

								if(!item) continue;

								if(item[1] === "season") wgData.season = item[2].trimEnd();
								else if (item[1] === "weather") wgData.day.weather = item[2].trimEnd();
								else if (item[1] === "wind") wgData.day.wind = item[2].trimEnd();
								else if (item[1] === "temp") wgData.day.temp = item[2].trimEnd();
								else if (item[1] === "tempreg") wgData.day.tempreg = item[2].trimEnd();
								else if (item[1] === "nweather") wgData.night.weather = item[2].trimEnd();
								else if (item[1] === "nwind") wgData.night.wind = item[2].trimEnd();
								else if (item[1] === "ntemp") wgData.night.temp = item[2].trimEnd();
								else if (item[1] === "ntempreg") wgData.night.tempreg = item[2].trimEnd();
							}

							
							if(!wgData.season) {
								if(hasFantasyCalendar) wgData.season = this.getCurrentSeason().name;
								else {
									new Notice("You must define a season using --season or make use of Fantasy Calendar");
								}
							}

							if(!wgData.day.weather) {
								// generate weather, based on season if available
							}

							if(!wgData.day.wind) {
								// generate wind, based on weather and then season if available
							}

							if(!wgData.day.temp) {
								// generate temp, based on weather then wind then season if available
							}
							
							if(!wgData.day.tempreg) {
								// generate tempreg, based on temp and season/location temp_low and temp_high if available
							}
							
							if(!wgData.night.weather) {
								// generate weather, based on season if available
							}
							
							if(!wgData.night.wind) {
								// generate wind, based on wind and then season if available
							}
							
							if(!wgData.night.temp) {
								// generate temp, based on weather then wind then season if available
							}
							
							if(!wgData.night.tempreg) {
								// generate tempreg, based on temp and season/location temp_low and temp_high if available
							}

							//console.log(wgData);
						} catch (ex) {
							console.error(ex);
						}
					}
				}
			}
		)
	}

	capitalizeWords(arr) {
		return arr.map(element => {
			return element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
		}).join(' ');
	}

	getCurrentSeason() {
		if (hasFantasyCalendar) {
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