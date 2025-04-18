export interface TDLibMessage {
	chat_id: number;
}

export interface TDLibUpdate {
	_: string;
	message?: TDLibMessage;
	[key: string]: any;
}
