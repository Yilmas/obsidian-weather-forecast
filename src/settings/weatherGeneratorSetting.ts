import WeatherGenerator from "main";

export default abstract class WeatherCalendarSetting {
    protected plugin: WeatherGenerator;
    protected containerEl: HTMLElement;

    constructor(plugin: WeatherGenerator, containerEl: HTMLElement) {
        this.plugin = plugin;
        this.containerEl = containerEl;
    }

    public abstract display(): void;
}