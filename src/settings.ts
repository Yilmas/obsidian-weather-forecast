export interface WeatherGeneratorSettings {
	fantasyCalendarJsonPath: string;
	dateFormat: string;
}

export const DEFAULT_SETTINGS: WeatherGeneratorSettings = {
	fantasyCalendarJsonPath: '-',
	dateFormat: 'YYYY-MM-DD'
}