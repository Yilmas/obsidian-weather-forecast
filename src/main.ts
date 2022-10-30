import { App, Editor, MarkdownView, Modal, Notice, Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, WeatherGeneratorSettings } from './settings';
import { WeatherGeneratorSettingTab } from './settings/index';

export default class WeatherGenerator extends Plugin {
	private data: Record<string, boolean | string | WeatherGeneratorSettings>;

	async onload() {
		console.log(`Weather Generator v${this.manifest.version} loaded.`);
		await this.loadWeatherGeneratorData();
		//setPath(this.getSettings().fantasyCalendarJsonPath);
		
		console.log(FantasyCalendarAPI.getHelper().current);

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