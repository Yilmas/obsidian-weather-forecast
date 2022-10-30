import { Notice, Setting, TextComponent } from 'obsidian';
import WeatherCalendarSetting from './weatherGeneratorSetting';

export default class FantasyCalendarJsonPathSetting extends WeatherCalendarSetting {
    private fcJsonPathSettingTextComp: TextComponent;

    public display(): void {
        const fantasyCalendarJsonPathSetting = new Setting(this.containerEl)
            .setName('Fantasy Calendar Json')
            .setDesc('Define the path to the json exported from fantasy-calendar.com');
        
        fantasyCalendarJsonPathSetting.addButton((b) => {
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
                    // for (let file of Array.from(files)) {
                    //     data.push(JSON.parse(await file.text()));
                    // }

                    console.log(seasons);
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