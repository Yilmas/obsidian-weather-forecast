import { Notice, Setting, TextComponent, debounce } from 'obsidian';
import WeatherCalendarSetting from './weatherGeneratorSetting';

export default class FantasyCalendarDateFormatSetting extends WeatherCalendarSetting {
    private fcDateFormatSettingTextComp: TextComponent;
    private saveOnChange = debounce(async () => {
        const newFormat = this.fcDateFormatSettingTextComp.getValue();
        const oldFormat = this.plugin.getSettings().dateFormat;

        if(oldFormat === this.fcDateFormatSettingTextComp.getValue()) {
            return;
        }

        new Notice('Saving in progress...');
        //setPath(newPath);
        this.plugin.getSettings().dateFormat = newFormat;
        await this.plugin.saveWeatherGeneratorData();
        new Notice('...saved successfully');
    }, 500)

    public display(): void {
        const fantasyCalendarDateFormatSetting = new Setting(this.containerEl)
            .setName('Date Format')
            .setDesc('Define the date format the weather generator will display');
        
            fantasyCalendarDateFormatSetting.addText((text) => {
            this.fcDateFormatSettingTextComp = text;
            text.setValue(this.plugin.getSettings().dateFormat);
            text.onChange(this.saveOnChange)
        });
    }
}