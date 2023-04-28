import { App, PluginSettingTab } from 'obsidian';
import WeatherGenerator from '../main';
import FantasyCalendarJsonParseSetting from './fantasyCalendarJsonParse';
import FantasyCalendarSeasonSetting from './fantasyCalendarSeason';
import WeatherGeneratorShowFormulaSetting from './weatherGeneratorShowFormula';
import WeatherGeneratorDebugSetting from './weatherGeneratorDebug';

export class WeatherGeneratorSettingTab extends PluginSettingTab {
	private plugin: WeatherGenerator;

	constructor(app: App, plugin: WeatherGenerator) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
        const { plugin, containerEl, app } = this;
        containerEl.empty();

        containerEl.createEl('h3', {text: 'Weather Generator' });
		new WeatherGeneratorDebugSetting(plugin, containerEl).display();
		new WeatherGeneratorShowFormulaSetting(plugin, containerEl).display();

        containerEl.createEl('h2', {text: 'Fantasy Calendar' });
        new FantasyCalendarJsonParseSetting(plugin, containerEl).display();
		new FantasyCalendarSeasonSetting(plugin, containerEl).display();
	}
}