import { Container } from 'typedi';

import {
	IDataObject,
	INodeType,
	INodeTypeDescription, ITriggerFunctions, ITriggerResponse,
} from 'n8n-workflow';

const debug = require('debug')('tdl-trigger')

import {TelegramTdLibNodeConnectionManager} from "./TelegramTdLibNodeConnectionManager";

// import {Client} from "tdl";
// const { TDLib } = require('tdl-tdlib-addon')

export class TelegramTdLibTrigger implements INodeType {
	description: INodeTypeDescription = {
		// Basic node details will go here
		displayName: 'Telegram TDLib Trigger',
		name: 'telegramTdLibTrigger',
		icon: 'file:TelegramTDLib.svg',
		group: ['trigger'],
		version: 1,
		description: 'Listens to events using Telegram API via TDLib',
		defaults: {
			name: 'Telegram TDLib Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'telegramTdLibApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'updateEvents',
				name: 'updateEvents',
				type: 'string',
				default: '',
				placeholder: 'updateNewMessage,updateMessageContent',
				description: 'Comma-separated update events, that should activate this trigger',
			},
		],
	};
	// The execute method will go here

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		const credentials = await this.getCredentials('telegramTdLibApi');

		const cM = Container.get(TelegramTdLibNodeConnectionManager)

		const client = await cM.getActiveTDLibClient(credentials?.apiId as number, credentials?.apiHash as string);

		const updateEvents = this.getNodeParameter('updateEvents', '') as string;
		const updateEventsArray = updateEvents.split(',');

		function _emit(_this: ITriggerFunctions, data: IDataObject) {
			_this.emit([_this.helpers.returnJsonArray([data])]);
		}

		function _listener(this: ITriggerFunctions, update: IDataObject) {
			const incomingEvent = update._ as string;
			if (updateEventsArray.includes(incomingEvent) || updateEventsArray.length == 0) {
				debug('Got update: ' + JSON.stringify(update, null, 2));
				_emit(this, update);
			}
		}

		if (this.getMode() !== 'manual') {
			client.on('update', _listener);
			client.on('error', debug);
		}

		// The "closeFunction" function gets called by n8n whenever
		// the workflow gets deactivated and can so clean up.
		async function closeFunction() {
			debug('closeFunction(' + updateEventsArray + ')');
			client.removeListener('update', _listener);
		}

		// The "manualTriggerFunction" function gets called by n8n
		// when a user is in the workflow editor and starts the
		// workflow manually.
		// for AMQP it doesn't make much sense to wait here but
		// for a new user who doesn't know how this works, it's better to wait and show a respective info message
		const manualTriggerFunction = async () => {
			await new Promise((resolve, reject) => {
				const timeoutHandler = setTimeout(() => {
					reject(
						new Error(
							'555Aborted, no message received within 30secs. This 30sec timeout is only set for "manually triggered execution". Active Workflows will listen indefinitely.',
						),
					);
				}, 30000);
				client.on('update',
					(update: IDataObject) => {
						const incomingEvent = update._ as string;
						if (updateEventsArray.includes(incomingEvent) || updateEvents.length == 0) {
							debug('Got update in manual: ' + JSON.stringify(update, null, 2));
							_emit(this, update);

							clearTimeout(timeoutHandler);
							resolve(true);
						}
					});
			});
		};

		return {
			closeFunction,
			manualTriggerFunction,
		};
	}
}

exports.TelegramTDLibTrigger = TelegramTdLibTrigger;
