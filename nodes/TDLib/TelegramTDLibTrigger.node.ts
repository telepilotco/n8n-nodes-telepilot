import { Container } from 'typedi';

import {
	IDataObject,
	INodeType,
	INodeTypeDescription, ITriggerFunctions, ITriggerResponse,
} from 'n8n-workflow';

import {TelegramTDLibNodeConnectionManager} from "./TelegramTDLibNodeConnectionManager";

export class TelegramTDLibTrigger implements INodeType {
	description: INodeTypeDescription = {
		// Basic node details will go here
		displayName: 'Telegram TDLib Trigger',
		name: 'telegramTdLibTrigger',
		icon: 'file:TelegramTDLib.png',
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
		],
	};
	// The execute method will go here

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		const credentials = await this.getCredentials('telegramTdLibApi');

		const cM = Container.get(TelegramTDLibNodeConnectionManager)

		// @ts-ignore
		const client = cM.getActiveTDLibClient(credentials.apiId as number, credentials.apiHash as string);

		client.on('update',
			(update: IDataObject) => {
				if (update._ === "updateNewMessage") {
					console.log('Got update:', JSON.stringify(update, null, 2))
					this.emit([this.helpers.returnJsonArray([update])]);
				}
			})

		// The "closeFunction" function gets called by n8n whenever
		// the workflow gets deactivated and can so clean up.
		async function closeFunction() {
			//tbd
		}

		// The "manualTriggerFunction" function gets called by n8n
		// when a user is in the workflow editor and starts the
		// workflow manually.
		// for AMQP it doesn't make much sense to wait here but
		// for a new user who doesn't know how this works, it's better to wait and show a respective info message
		const manualTriggerFunction = async () => {
			await new Promise((resolve, reject) => {
				setTimeout(() => {
					reject(
						new Error(
							'Aborted, no message received within 30secs. This 30sec timeout is only set for "manually triggered execution". Active Workflows will listen indefinitely.',
						),
					);
				}, 30000);
			});
		};

		return {
			closeFunction,
			manualTriggerFunction,
		};
	}
}
