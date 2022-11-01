import { Notice, Setting, TextComponent } from 'obsidian';
import WeatherCalendarSetting from './weatherGeneratorSetting';

export default class WeatherGeneratorShowFormulaSetting extends WeatherCalendarSetting {
    private wgShowFormulaSettingTextComp: TextComponent;

    public display(): void {
        const weatherGeneratorShowFormula = new Setting(this.containerEl)
            .setName('Save Formula')
            .setDesc('Keep the formula in code');
        
        weatherGeneratorShowFormula.addToggle((t) => {
            t.setValue(this.plugin.getSettings().wgShowFormula);
            t.onChange(async (v) => {
                this.plugin.getSettings().wgShowFormula = v;
                await this.plugin.saveWeatherGeneratorData();
            });
        });
    }
}