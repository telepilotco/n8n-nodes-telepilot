import 'reflect-metadata';
import { Service } from 'typedi';
import {IDataObject} from "n8n-workflow";
const { Client } = require('tdl');
const { BridgeLib } = require('../../bridge');

const debug = require('debug')('telepilot-cm')
var QRCode = require('qrcode-terminal');

const fs = require('fs/promises');

// const path = require('path')
// function prebuild (pathcomps/*: string[] */) {
// 	return path.resolve(__dirname, '../../../prebuilds', ...pathcomps)
// }
//
// function getTdjson ()/*: string */ {
// 	if (process.arch !== 'arm64')
// 		throw new Error(`The ${process.arch} architecture is not supported`)
// 	switch (process.platform) {
// 		case 'darwin': return prebuild(['tdlib-macos-arm64', 'lib.dylib'])
// 		default: throw new Error(`The ${process.platform} OS is not supported`)
// 	}
// }

function sleep(ms: number) {
	return new Promise( resolve => setTimeout(resolve, ms) );
}

@Service()
export class TelePilotNodeConnectionManager {

	private clients: Record<number, typeof Client> = {};

	private TD_DATABASE_PATH_PREFIX = "/tmp"
	private TD_FILES_PATH_PREFIX = "/tmp"


	constructor() {

	}

	async closeLocalSession(apiId: number) {
		let clients_keys = Object.keys(this.clients);
		if (!clients_keys.includes(apiId.toString()) || this.clients[apiId] === undefined) {
			throw new Error ("Unauthorized, please Login first")
		}
		const client = this.clients[apiId];

		let result = await client.invoke({
			_: 'close'
		})
		delete this.clients[apiId];
		return result;
	}
	async deleteLocalInstance(apiId: number): Promise<Record<string, string>> {
		let clients_keys = Object.keys(this.clients);
		if (!clients_keys.includes(apiId.toString()) || this.clients[apiId] === undefined) {
			throw new Error ("Unauthorized, please Login first")
		}
		const client = this.clients[apiId];

		try {
			await client.invoke({
				_: 'close'
			})
		} catch (e) {
			debug("Connection was already closed")
		}

		let result: Record<string, string> = {}
		const removeDir = async (dirPath: string) => {
			await fs.rm(dirPath, {recursive: true});
		}

		const db_database_path = this.getTdDatabasePathForClient(apiId);
		await removeDir(db_database_path)
		result["db_database"] = `Removed ${db_database_path}`

		const db_files_path = this.getTdFilesPathForClient(apiId);
		await removeDir(db_files_path)
		result["db_files"] = `Removed ${db_files_path}`

		delete this.clients[apiId];
		return result;
	}

	getTdDatabasePathForClient(apiId: number) {
		return `${this.TD_DATABASE_PATH_PREFIX}/${apiId}/_td_database`
	}

	getTdFilesPathForClient(apiId: number) {
		return `${this.TD_FILES_PATH_PREFIX}/${apiId}/_td_files`
	}

	async getActiveClient(apiId: number, apiHash: string): Promise<typeof Client> {
		let clients_keys = Object.keys(this.clients);
		debug('getActiveClient.keys:' + clients_keys);
		debug('getActiveClient.in keys:' + !clients_keys.includes(apiId.toString()));
		debug('getActiveClient.value:' + this.clients[apiId]);
		if (!clients_keys.includes(apiId.toString()) || this.clients[apiId] === undefined) {
			throw new Error ("Unauthorized, please Login first")
		}
		return this.clients[apiId];
	}

	async terminateSession(apiId: number, apiHash: string): Promise<typeof Client> {

	}

	async clientLoginWithQRCode(apiId: number, apiHash: string): Promise<string> {
		let clients_keys = Object.keys(this.clients);
		debug('clientLoginWithQRCode.keys:' + clients_keys);
		debug('clientLoginWithQRCode.in keys:' + !clients_keys.includes(apiId.toString()));
		debug('clientLoginWithQRCode.value:' + this.clients[apiId]);
		let qrCode = ""
		if (!clients_keys.includes(apiId.toString()) || this.clients[apiId] === undefined) {
			// }

			let _prefix = process.platform + "-x86_64";
			if (process.arch === "arm64") {
				_prefix = process.platform + "-" + process.arch;
			}

			debug('new TelePilot Client:' + apiId)
			// if (this.client === undefined) {

			let libraryFile = "";
			if (process.arch === "x64") {
				switch(process.platform) {
					case "win32":
						//libraryFile = __dirname + "/../../../../prebuilt-tdlib/prebuilds/tdlib-windows-x64/tdjson.dll";
						throw new Error("non-supported architecture. x64 win32")
						break;
					case 'darwin':
						//libraryFile = __dirname + "/../../../../prebuilt-tdlib/prebuilds/tdlib-macos-x64/libtdjson.dylib";
						throw new Error("non-supported architecture. x64 darwin")
						break;
					default:
						// libraryFile = __dirname + "/../../../../prebuilt-tdlib/prebuilds/tdlib-linux-x64/libtdjson.so";
						libraryFile = __dirname + "/../../../prebuilds/lib/" + _prefix + ".so"
				}
			} else if (process.arch == "arm64") {
				if (process.platform == "darwin") {
					libraryFile = __dirname + "/../../../prebuilds/lib/" + _prefix + ".dylib" // process.env.LIBRARY_FILE,
				} else if (process.platform == "linux") {
					// libraryFile = __dirname + "/../../../prebuilds/lib/" + _prefix + ".so" // process.env.LIBRARY_FILE,
					throw new Error("non-supported architecture. arm64 !darwin !linux")
				} else {
					throw new Error("non-supported architecture. arm64 !darwin !linux")
				}
			}

			let client = new Client(new BridgeLib(
				libraryFile,
				__dirname + "/../../../prebuilds/bridge/" + _prefix + ".node"// process.env.ADDON_PATH
			), {
				apiId,//: 1371420, // Your api_id
				apiHash,//: '10c6868cae8a1ce09f7d87f27d691bbd',
				databaseDirectory: this.getTdDatabasePathForClient(apiId),
				filesDirectory: this.getTdFilesPathForClient(apiId)
				// useTestDc: true
			});

			this.clients[apiId] = client;

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

				const qrCodeWriter = (s: string) => {
					debug(s)
					qrCode+=s;
				}

				if (update._ === "updateAuthorizationState") {
					debug('Got update:', JSON.stringify(update, null, 2))
					const authorization_state = update.authorization_state as IDataObject;
					if (authorization_state._ === 'authorizationStateWaitOtherDeviceConfirmation') {
						const qr_link = authorization_state.link;
						debug("qr_link:" + qr_link);
						QRCode.setErrorLevel('Q');
						debug("generating qr code");
						QRCode.generate(qr_link,{ small: true }, function(code: any) {qrCodeWriter(code)});
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

			// if (authenticated < 0) {
			// 	throw new Error(qrCode);
			// 	// throw new Error('Not authenticated');
			// }
		} else if (false) {

		} else if (this.clients[apiId]._client == null) {
			await this.deleteLocalInstance(apiId);
			throw new Error("DB Deleted, please log in again");
		} else {
			throw new Error("Already logged in");
		}

		debug("returning for " + apiId)
		// return this.clients[apiId];
		return qrCode;
	}

}
