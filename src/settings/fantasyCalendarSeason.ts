import { Notice, Setting, TextComponent } from 'obsidian';
import WeatherCalendarSetting from './weatherGeneratorSetting';

export default class FantasyCalendarSeasonSetting extends WeatherCalendarSetting {
    private fcSeasonSettingTextComp: TextComponent;
    fcSeasonsEl: HTMLDivElement;

    public display(): void {

        this.fcSeasonsEl = this.containerEl.createDiv("fc-seasons");
        this.fcSeasonsEl.empty();

        const fcSeasonData = this.plugin.getSettings().fantasyCalendarJson?.data;
        if(!fcSeasonData) return;

        for (let index = 0; index < fcSeasonData.length; index++) {
            const fcSeason = this.plugin.getSettings().fantasyCalendarJson?.data[index];

            const preIndex = this.plugin.getSettings().fantasyCalendarSeasons.findIndex(x => x.fcSeason == fcSeason.name);

            const fantasyCalendarSeasonSetting = new Setting(this.fcSeasonsEl)
                .setName('Season: ' + fcSeason.name)
                .setDesc('What does this season most commonly resemble?')
                .addDropdown((d) => {
                    d.addOption("none", "Please select a default");
                    d.addOption("wgSpring", "Spring");
                    d.addOption("wgSummer", "Summer");
                    d.addOption("wgFall", "Fall / Autumn");
                    d.addOption("wgWinter", "Winter");
                    d.setValue(this.plugin.getSettings().fantasyCalendarSeasons[preIndex].wgSeason);
                    d.onChange(async (v) => {
                        const postIndex = this.plugin.getSettings().fantasyCalendarSeasons.findIndex(x => x.fcSeason == fcSeason.name);
                        this.plugin.getSettings().fantasyCalendarSeasons[postIndex].wgSeason = v;
                        
                        await this.plugin.saveWeatherGeneratorData();
                    });
                });
        }
        
    }
}