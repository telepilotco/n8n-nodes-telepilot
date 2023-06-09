import { Container } from 'typedi';

import {
	IDataObject,
	INodeType,
	INodeTypeDescription, ITriggerFunctions, ITriggerResponse,
} from 'n8n-workflow';

const debug = require('debug')('telepilot-trigger')

import {TelePilotNodeConnectionManager} from "./TelePilotNodeConnectionManager";

export class TelePilotTrigger implements INodeType {
	description: INodeTypeDescription = {
		// Basic node details will go here
		displayName: 'Telegram CoPilot Trigger',
		name: 'telePilotTrigger',
		icon: 'file:TelePilot.svg',
		group: ['trigger'],
		version: 1,
		description: 'Your Personal Telegram CoPilot Listener',
		defaults: {
			name: 'TelePilot Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'telePilotApi',
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
		const credentials = await this.getCredentials('telePilotApi');

		const cM = Container.get(TelePilotNodeConnectionManager)

		const client = await cM.getActiveClient(credentials?.apiId as number, credentials?.apiHash as string);

		const updateEvents = this.getNodeParameter('updateEvents', '') as string;
		const updateEventsArray = updateEvents.split(',');

		const _emit = (data: IDataObject) => {
			this.emit([this.helpers.returnJsonArray([data])]);
		}

		const _listener = (update: IDataObject) => {
			const incomingEvent = update._ as string;
			if (updateEventsArray.includes(incomingEvent) || updateEvents.length == 0) {
				debug('Got update: ' + JSON.stringify(update, null, 2));
				_emit(update);
			}
		}

		if (this.getMode() !== 'manual') {
			client.on('update', _listener);
			client.on('error', debug);
		}

		async function closeFunction() {
			debug('closeFunction(' + updateEventsArray + ')');
			client.removeListener('update', _listener);
		}

		const manualTriggerFunction = async () => {
			await new Promise((resolve, reject) => {
				const timeoutHandler = setTimeout(() => {
					reject(
						new Error(
							'555Aborted, no message received within 30secs. This 30sec timeout is only set for "manually triggered execution". Active Workflows will listen indefinitely.',
						),
					);
				}, 30000);

				const _listener2 = (update: IDataObject) => {
					const incomingEvent = update._ as string;
					if (updateEventsArray.includes(incomingEvent) || updateEvents.length == 0) {
						debug('Got update in manual: ' + JSON.stringify(update, null, 2));
						_emit(update);

						clearTimeout(timeoutHandler);
						client.removeListener('update', _listener2);
						resolve(true);
					}
				}
				client.on('update',	_listener2);
			});
		};

		return {
			closeFunction,
			manualTriggerFunction,
		};
	}
}

exports.TelePilotTrigger = TelePilotTrigger;
