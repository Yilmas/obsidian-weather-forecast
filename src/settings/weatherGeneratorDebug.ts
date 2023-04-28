import { Notice, Setting, TextComponent } from 'obsidian';
import WeatherCalendarSetting from './weatherGeneratorSetting';

export default class WeatherGeneratorDebugSetting extends WeatherCalendarSetting {
    private wgDebugSettingTextComp: TextComponent;

    public display(): void {
        const weatherGeneratorDebug = new Setting(this.containerEl)
            .setName('Debug Mode')
            .setDesc('Enable to see console logs (you might need to restart Obsidian, for this setting to take effect.)');
        
        weatherGeneratorDebug.addToggle((t) => {
            t.setValue(this.plugin.getSettings().wgDebug);
            t.onChange(async (v) => {
                this.plugin.getSettings().wgDebug = v;
                await this.plugin.saveWeatherGeneratorData();
            });
        });
    }
}