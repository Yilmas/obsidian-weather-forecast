import { Notice, Setting, TextComponent } from 'obsidian';
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

                    console.log(seasons);

                    new Notice('Parse in progress...');
                    //setPath(newPath);
                    this.plugin.getSettings().fantasyCalendarJson = seasons;
                    await this.plugin.saveWeatherGeneratorData();
                    new Notice('...parsed successfully');
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