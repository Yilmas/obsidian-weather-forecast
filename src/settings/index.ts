import { App, PluginSettingTab } from 'obsidian';
import WeatherForecast from '../main';
import WeatherForecastDebugSetting from './weatherForecastDebug';
import WeatherForecastShowFormulaSetting from './weatherForecastShowFormula';
import WeatherForecastLocationSetting from './weatherForecastLocation';
import WeatherForecastTemperatureSetting from './weatherForecastTemperature';
import FantasyCalendarJsonParseSetting from './fantasyCalendarJsonParse';
import FantasyCalendarSeasonSetting from './fantasyCalendarSeason';

export class WeatherForecastSettingTab extends PluginSettingTab {
	private plugin: WeatherForecast;

	constructor(app: App, plugin: WeatherForecast) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
        const { plugin, containerEl, app } = this;
        containerEl.empty();

        containerEl.createEl('h3', {text: 'Weather Forecast' });
		new WeatherForecastDebugSetting(plugin, containerEl).display();
		new WeatherForecastShowFormulaSetting(plugin, containerEl).display();
		new WeatherForecastLocationSetting(plugin, containerEl).display();
		new WeatherForecastTemperatureSetting(plugin, containerEl).display();

        containerEl.createEl('h2', {text: 'Fantasy Calendar' });
        new FantasyCalendarJsonParseSetting(plugin, containerEl).display();
		new FantasyCalendarSeasonSetting(plugin, containerEl).display();
	}
}