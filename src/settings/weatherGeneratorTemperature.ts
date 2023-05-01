import { Notice, Setting, TextComponent } from 'obsidian';
import WeatherCalendarSetting from './weatherGeneratorSetting';

export default class WeatherGeneratorTemperatureSetting extends WeatherCalendarSetting {
    private wgTemperatureSettingTextComp: TextComponent;

    public display(): void {
        const wgTemperature = this.plugin.getSettings().wgTemperature;

        const wgTemperatureSetting = new Setting(this.containerEl)
            .setName('Temperature')
            .setDesc('Which format should temperatures be displayed as?')
            .addDropdown((d) => {
                d.addOption("c", "Celcius");
                d.addOption("f", "Fahrenheit");
                d.setValue(wgTemperature);
                d.onChange(async (v) => {
                    this.plugin.getSettings().wgTemperature = v;
                    
                    await this.plugin.saveWeatherGeneratorData();
                });
            });
    }
}