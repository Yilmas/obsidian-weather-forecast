import { Notice, Setting, TextComponent } from 'obsidian';
import WeatherCalendarSetting from './weatherForecastSetting';

export default class WeatherForecastLocationSetting extends WeatherCalendarSetting {
    private wfLocationSettingTextComp: TextComponent;

    public display(): void {
        const wfLocation = this.plugin.getSettings().wfLocation;

        const wfLocationSetting = new Setting(this.containerEl)
            .setName('Location')
            .setDesc('What climate should the weather be based on?')
            .addDropdown((d) => {
                d.addOption("Polar", "Polar");
                d.addOption("Continental", "Continental");
                d.addOption("Temperate", "Temperate");
                d.addOption("Dry", "Dry");
                d.addOption("Tropical", "Tropical");
                d.setValue(wfLocation);
                d.onChange(async (v) => {
                    this.plugin.getSettings().wfLocation = v;
                    
                    await this.plugin.saveWeatherForecastData();
                });
            });
    }
}