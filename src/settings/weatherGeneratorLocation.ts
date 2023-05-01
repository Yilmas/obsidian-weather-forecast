import { Notice, Setting, TextComponent } from 'obsidian';
import WeatherCalendarSetting from './weatherGeneratorSetting';

export default class WeatherGeneratorLocationSetting extends WeatherCalendarSetting {
    private wgLocationSettingTextComp: TextComponent;

    public display(): void {
        const wgLocation = this.plugin.getSettings().wgLocation;

        const wgLocationSetting = new Setting(this.containerEl)
            .setName('Location')
            .setDesc('What climate should the weather be based on?')
            .addDropdown((d) => {
                d.addOption("Polar", "Polar");
                d.addOption("Continental", "Continental");
                d.addOption("Temperate", "Temperate");
                d.addOption("Dry", "Dry");
                d.addOption("Tropical", "Tropical");
                d.setValue(wgLocation);
                d.onChange(async (v) => {
                    this.plugin.getSettings().wgLocation = v;
                    
                    await this.plugin.saveWeatherGeneratorData();
                });
            });
    }
}