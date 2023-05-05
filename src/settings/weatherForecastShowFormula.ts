import { Notice, Setting, TextComponent } from 'obsidian';
import WeatherCalendarSetting from './weatherForecastSetting';

export default class WeatherForecastShowFormulaSetting extends WeatherCalendarSetting {
    private wfShowFormulaSettingTextComp: TextComponent;

    public display(): void {
        const weatherForecastShowFormula = new Setting(this.containerEl)
            .setName('Save Formula')
            .setDesc('Keep the formula in code');
        
        weatherForecastShowFormula.addToggle((t) => {
            t.setValue(this.plugin.getSettings().wfShowFormula);
            t.onChange(async (v) => {
                this.plugin.getSettings().wfShowFormula = v;
                await this.plugin.saveWeatherForecastData();
            });
        });
    }
}