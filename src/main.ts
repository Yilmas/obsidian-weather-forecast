import { App, Editor, MarkdownView, Modal, Notice, Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, WeatherGeneratorSettings } from './settings';
import { WeatherGeneratorSettingTab } from './settings/index';

let hasFantasyCalendar = false;

export default class WeatherGenerator extends Plugin {
	private data: Record<string, boolean | string | WeatherGeneratorSettings>;

	async onload() {
		console.log(`Weather Generator v${this.manifest.version} loaded.`);
		await this.loadWeatherGeneratorData();
		//setPath(this.getSettings().fantasyCalendarJsonPath);

		if(app.workspace.on("fantasy-calendars-settings-loaded", () => {
			hasFantasyCalendar = true;
		})) {}

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('cloud', 'Weather Generator', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			if(hasFantasyCalendar) {
				const date = FantasyCalendarAPI.getHelper().current;
				const seasons = this.getSettings().fantasyCalendarJson.data;

				// A day is within a given season if DayOfYear - DaysOfSeason =< 0, iterated through each season.
				let remainingDays = FantasyCalendarAPI.getHelper().dayNumberForDate(date);
				let currentSeason;

				for (let i = 0; i < seasons.length; i++) {
					const season = seasons[i];
					remainingDays = remainingDays - season.length;

					if(remainingDays <= 0) {
						currentSeason = season;
						break;
					}
				}

				console.log(FantasyCalendarAPI.getHelper().currentDate + " - " + currentSeason.name);
				console.log(currentSeason);
			}
			else {
				new Notice("Fantasy Calendar isn't loaded");
			}
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new WeatherGeneratorSettingTab(this.app, this));
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
				if(!data.settings[k]) {
					data.settings[k] = v;
				}
			});
		}
		this.data = Object.assign({settings: { ...DEFAULT_SETTINGS}}, {}, data);
	}

	async saveWeatherGeneratorData(): Promise<void> {
		await this.saveData(this.data);
	}
}