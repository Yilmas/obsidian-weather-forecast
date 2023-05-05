import WeatherForecast from "main";

export default abstract class WeatherCalendarSetting {
    protected plugin: WeatherForecast;
    protected containerEl: HTMLElement;

    constructor(plugin: WeatherForecast, containerEl: HTMLElement) {
        this.plugin = plugin;
        this.containerEl = containerEl;
    }

    public abstract display(): void;
}