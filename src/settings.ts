export interface I_fcJson {
	data: any[];
	locations: any[];
	global_settings?: any;
}

export interface WeatherGeneratorSettings {
	fantasyCalendarJson: I_fcJson | undefined;
	wgShowFormula: boolean;
}

export const DEFAULT_SETTINGS: WeatherGeneratorSettings = {
	fantasyCalendarJson: undefined,
	wgShowFormula: false
}

export let wgData = {
	season: "",
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