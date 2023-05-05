import { Notice, Setting, TextComponent } from 'obsidian';
import WeatherCalendarSetting from './weatherForecastSetting';

export default class WeatherForecastTemperatureSetting extends WeatherCalendarSetting {
    private wfTemperatureSettingTextComp: TextComponent;

    public display(): void {
        const wfTemperature = this.plugin.getSettings().wfTemperature;

        const wfTemperatureSetting = new Setting(this.containerEl)
            .setName('Temperature')
            .setDesc('Which format should temperatures be displayed as?')
            .addDropdown((d) => {
                d.addOption("c", "Celcius");
                d.addOption("f", "Fahrenheit");
                d.setValue(wfTemperature);
                d.onChange(async (v) => {
                    this.plugin.getSettings().wfTemperature = v;
                    
                    await this.plugin.saveWeatherForecastData();
                });
            });
    }
}