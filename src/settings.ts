export interface I_fcJson {
	data: any[];
	locations: any[];
	global_settings?: any;
}

export interface I_SeasonMatch {
	fcSeason: string;
	wgSeason: string;
}

export interface WeatherGeneratorSettings {
	fantasyCalendarJson: I_fcJson | undefined;
	fantasyCalendarSeasons: Array<I_SeasonMatch>;
	wgShowFormula: boolean;
}

export const DEFAULT_SETTINGS: WeatherGeneratorSettings = {
	fantasyCalendarJson: undefined,
	fantasyCalendarSeasons: [],
	wgShowFormula: false
}

export const wgData = {
	wgSeason: "",
	fcSeason: "",
	day: {
		weather: "",
		wind: "",
		temp: "",
		tempreg: ""
	},
	night: {
		weather: "",
		wind: "",
		temp: "",
		tempreg: ""
	}
}