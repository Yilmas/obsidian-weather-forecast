export interface I_fcJson {
	data: any[];
	locations: any[];
	global_settings?: any;
}

export interface I_SeasonMatch {
	fcSeason: string;
	wfSeason: string;
}

export interface WeatherForecastSettings {
	fantasyCalendarJson: I_fcJson | undefined;
	fantasyCalendarSeasons: Array<I_SeasonMatch>;
	wfShowFormula: boolean;
	wfLocation: string;
	wfTemperature: string;
	wfDebug: boolean;
}

export const DEFAULT_SETTINGS: WeatherForecastSettings = {
	fantasyCalendarJson: undefined,
	fantasyCalendarSeasons: [],
	wfShowFormula: false,
	wfLocation: "Temperate",
	wfTemperature: "c",
	wfDebug: false
}