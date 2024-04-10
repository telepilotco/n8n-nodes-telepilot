import { Container } from 'typedi';

import {
	IDataObject,
	INodeType,
	INodeTypeDescription, ITriggerFunctions, ITriggerResponse,
} from 'n8n-workflow';

const debug = require('debug')('telepilot-trigger')

import {TelePilotNodeConnectionManager, TelepilotAuthState} from "./TelePilotNodeConnectionManager";
import { TDLibUpdateEvents } from './tdlib/updateEvents';
import {Client} from "@telepilotco/tdl";


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
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: [
					{
						name: '*',
						value: '*',
					},
					...TDLibUpdateEvents
				],
				default: ['updateNewMessage', 'updateMessageContent'],
			},
		],
	};
	// The execute method will go here


	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		const credentials = await this.getCredentials('telePilotApi');

		const cM = Container.get(TelePilotNodeConnectionManager)

		let client: Client;
		const clientSession = await cM.createClientSetAuthHandlerForPhoneNumberLogin(
			credentials?.apiId as number,
			credentials?.apiHash as string,
			credentials?.phoneNumber as string,
		);
		debug("trigger.clientSession.authState: " + clientSession.authState)
		if (clientSession.authState != TelepilotAuthState.WAIT_READY) {
			await cM.closeLocalSession(credentials?.apiId as number)
			this.emit([this.helpers.returnJsonArray([{a: "Telegram account not logged in. " +
				"Please use ChatTrigger node together with loginWithPhoneNumber action. " +
				"Please check our guide at https://telepilot.co/login-howto"}])])
		}

		client = clientSession.client;

		const updateEventsArray = this.getNodeParameter('events', '') as string;

		const _emit = (data: IDataObject) => {
			this.emit([this.helpers.returnJsonArray([data])]);
		}

		const _listener = (update: IDataObject) => {
			const incomingEvent = update._ as string;
			if (updateEventsArray.includes(incomingEvent) || updateEventsArray.length == 0) {
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
							'Aborted, no message received within 30secs. This 30sec timeout is only set for "manually triggered execution". Active Workflows will listen indefinitely.',
						),
					);
				}, 30000);

				const _listener2 = (update: IDataObject) => {
					const incomingEvent = update._ as string;
					if (updateEventsArray.includes(incomingEvent) || updateEventsArray.length == 0) {
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
