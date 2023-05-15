import 'reflect-metadata';
import { Service } from 'typedi';
import {IDataObject, sleep} from "n8n-workflow";
// import { Client } from "tdl";
const { Client } = require('tdl');
const { TDLib } = require('tdl-tdlib-addon');
const { getTdjson } = require('prebuilt-tdlib-m1')

const debug = require('debug')('tdl-cm')
var QRCode = require('qrcode-terminal');



@Service()
export class TelegramTDLibNodeConnectionManager {

	private clients: Record<number, typeof Client> = {};


	constructor() {

	}

	async getActiveTDLibClientAndLogin(apiId: number, apiHash: string): Promise<typeof Client> {
		let client = await this.getActiveTDLibClient(apiId, apiHash);
		// await client.login();
		//FIXME: return null if not logged in - need to listen to event
		return client;
	}

	async getActiveTDLibClient(apiId: number, apiHash: string): Promise<typeof Client> {
		let clients_keys = Object.keys(this.clients);
		debug('getActiveTDLibClients.keys:' + clients_keys);
		debug('getActiveTDLibClients.in keys:' + !clients_keys.includes(apiId.toString()));
		debug('getActiveTDLibClients.value:' + this.clients[apiId]);
		if (!clients_keys.includes(apiId.toString()) || this.clients[apiId] === undefined) {
			// }

			debug('new TDLibClient:' + apiId)
			// if (this.client === undefined) {
			let client = new Client(new TDLib(
				getTdjson(), // process.env.LIBRARY_FILE,
				// process.env.ADDON_PATH
			), {
				apiId,//: 1371420, // Your api_id
				apiHash,//: '10c6868cae8a1ce09f7d87f27d691bbd',
				databaseDirectory: `/tmp/${apiId}/_td_database`,
				filesDirectory: `/tmp/${apiId}/_td_files`
				// useTestDc: true
			});

			// this.client.on('update',
			// 	(update: IDataObject) => {
			// 		debug('triggered in manager: ' + update._ + ":" + JSON.stringify(update, null, 2));
			// 		if (update._ === "updateNewMessage") {
			// 			console.log('Got update:', JSON.stringify(update, null, 2))
			// 			// this.emit([this.helpers.returnJsonArray([update])]);
			// 		}
			// 	});
			let authenticated = 0;
			/*
			client.on('update', (update: IDataObject) => {
				// debug(update);
				if (update._ === "updateAuthorizationState") {
					console.log(update);

					if (update.authorization_state !== 'authorizationStateReady') {
						authenticated = -1;//FIXME - check return
					} else {
						authenticated = 1;//FIXME - check return
					}
				}
			});
			*/

			///////////////////////////

			const qrCodeAuthHandler = (update: IDataObject) => {
				if (update._ === "updateAuthorizationState") {
					debug('Got update:', JSON.stringify(update, null, 2))
					const authorization_state = update.authorization_state as IDataObject;
					if (authorization_state._ === 'authorizationStateWaitOtherDeviceConfirmation') {
						const qr_link = authorization_state.link;
						debug("qr_link:" + qr_link);
						QRCode.setErrorLevel('Q');
						debug("generating qr code");
						QRCode.generate(qr_link, function(code: any) {debug(code)});
						debug("generated qr code");
						// return {
						// 	status: 'Authenticating',
						// 	message: code,
						// };
					}
				} else if (update._ == 'authorizationStateReady') {
					debug('Got update:', JSON.stringify(update, null, 2))
					client.removeListener('on', qrCodeAuthHandler);
					authenticated = 1;//FIXME - check return
					debug("removed 'on' update handler: qrCodeAuthHandler")
				} else if (update._ === 'authorizationStateWaitPhoneNumber' || update._ === 'authorizationStateWaitTdlibParameters') {

				} else {
					authenticated = -1;//FIXME - check return
				}
			}

			client
				.on('update', qrCodeAuthHandler)

			let result = await client.invoke({
				_: 'requestQrCodeAuthentication'
			});

			debug(JSON.stringify(result));
			///////////////////////////////


			while (authenticated == 0) {
				await sleep(500);
			}
			this.clients[apiId] = client;

			if (authenticated < 0) {
				throw new Error('Not authenticated');
			}


		}

		debug("returning for " + apiId)
		return this.clients[apiId];
	}

}
