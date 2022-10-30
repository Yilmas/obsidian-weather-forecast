import { App, PluginSettingTab } from 'obsidian';
import WeatherGenerator from '../main';
import FantasyCalendarDateFormatSetting from './fantasyCalendarDateFormat';
import FantasyCalendarJsonPathSetting from './fantasyCalendarJsonPath';

export class WeatherGeneratorSettingTab extends PluginSettingTab {
	private plugin: WeatherGenerator;

	constructor(app: App, plugin: WeatherGenerator) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
        const { plugin, containerEl, app } = this;
        containerEl.empty();

        containerEl.createEl('h3', {text: 'Fantasy Calendar' });
        new FantasyCalendarJsonPathSetting(plugin, containerEl).display();
        new FantasyCalendarDateFormatSetting(plugin, containerEl).display();
	}
}