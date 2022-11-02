import { Notice, Setting, TextComponent } from 'obsidian';
import { I_SeasonMatch } from 'settings';
import WeatherCalendarSetting from './weatherGeneratorSetting';

export default class FantasyCalendarJsonParseSetting extends WeatherCalendarSetting {
    private fcJsonPathSettingTextComp: TextComponent;

    public display(): void {
        const fantasyCalendarJsonParseSetting = new Setting(this.containerEl)
            .setName('Fantasy Calendar Json')
            .setDesc('Select json export from fantasy-calendar.com');
        
        fantasyCalendarJsonParseSetting.addButton((b) => {
            const input = createEl("input", {
                attr: {
                    type: "file",
                    name: "merge",
                    accept: ".json",
                    multiple: false,
                    style: "display: none;"
                }
            });
            input.onchange = async () => {
                const { files } = input;

                if(!files) {
                    return;
                }

                try {
                    const {static_data: {seasons}} = JSON.parse(await files[0].text());

                    new Notice('Parse in progress...');

                    this.plugin.getSettings().fantasyCalendarJson = seasons;

                    this.plugin.getSettings().fantasyCalendarSeasons.length = 0;

                    for (let i = 0; i < seasons.data.length; i++) {
                        const season: I_SeasonMatch = {
                            fcSeason: seasons.data[i].name,
                            ref: ""
                        };

                        this.plugin.getSettings().fantasyCalendarSeasons?.push(season);
                    }

                    new Notice('...parsed successfully');

                    await this.plugin.saveWeatherGeneratorData();

                    new Notice('Saved changes')
                } catch (e) {
                    new Notice(
                        `There was an error while importing the calendar${
                            files.length == 1 ? "" : "s"
                        }.`
                    );
                    console.error(e);
                }

                input.value = '';
            };
            b.setButtonText("Choose Files");
            b.buttonEl.addClass("calendar-file-upload");
            b.buttonEl.appendChild(input);
            b.onClick(() => input.click());
        });
    }
}