import { Notice, Setting, TextComponent } from 'obsidian';
import WeatherCalendarSetting from './weatherForecastSetting';

export default class WeatherForecastDebugSetting extends WeatherCalendarSetting {
    private wfDebugSettingTextComp: TextComponent;

    public display(): void {
        const weatherForecastDebug = new Setting(this.containerEl)
            .setName('Debug Mode')
            .setDesc('Enable to see console logs (you might need to restart Obsidian, for this setting to take effect.)');
        
        weatherForecastDebug.addToggle((t) => {
            t.setValue(this.plugin.getSettings().wfDebug);
            t.onChange(async (v) => {
                this.plugin.getSettings().wfDebug = v;
                await this.plugin.saveWeatherForecastData();
            });
        });
    }
}