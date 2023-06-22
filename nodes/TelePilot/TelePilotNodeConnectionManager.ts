import 'reflect-metadata';
import { Service } from 'typedi';
import {IDataObject} from "n8n-workflow";
const { Client } = require('tdl');
const { BridgeLib } = require('../../bridge');
const childProcess = require('child_process');

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
			throw new Error ("You need to login first, please check our guide at https://telepilot.co/login-howto")
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
			throw new Error ("You need to login first, please check our guide at https://telepilot.co/login-howto")
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
			throw new Error ("You need to login first, please check our guide at https://telepilot.co/login-howto")
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
			let _prebuilt_package = "telepilot-prebuilt-" + process.platform + "-x86_64";
			if (process.arch === "arm64") {
				_prefix = process.platform + "-" + "arm64";
			}

			debug('new TelePilot Client:' + apiId)
			// if (this.client === undefined) {

			let libFile = "";
			let bridgeFile = "";
			if (process.arch === "x64") {
				switch(process.platform) {
					case "win32":
						//libFile = __dirname + "/../../../../prebuilt-tdlib/prebuilds/tdlib-windows-x64/tdjson.dll";
						throw new Error("Your n8n installation is currently not supported, " +
							"please refer to https://telepilot.co/nodes/telepilot/#win-x64")
						break;
					case 'darwin':
						//libFile = __dirname + "/../../../../prebuilt-tdlib/prebuilds/tdlib-macos-x64/libtdjson.dylib";
						throw new Error("Your n8n installation is currently not supported, " +
							"please refer to https://telepilot.co/nodes/telepilot/#macos-x64")
						break;
					default:
						// libFile = __dirname + "/../../../../prebuilt-tdlib/prebuilds/tdlib-linux-x64/libtdjson.so";
						const output = childProcess.execSync("getconf GNU_LIBC_VERSION 2>&1 || true; ldd --version 2>&1 || true", { encoding: 'utf8' });
						if (output.includes("glibc")) {
							debug("glibc detected");
							libFile = __dirname + "/../../../../" + _prebuilt_package + "/lib/" + _prefix + "-glibc.so"
							bridgeFile = __dirname + "/../../../../" + _prebuilt_package + "/bridge/" + _prefix + "-glibc.node";
						} else if (output.includes("musl")) {
							debug("musl detected");
							libFile = __dirname + "/../../../../" + _prebuilt_package + "/lib/" + _prefix + "-musl.so"
							bridgeFile = __dirname + "/../../../../" + _prebuilt_package + "/bridge/" + _prefix + "-musl.node";
						}
						// libFile = __dirname + "/../../../prebuilds/lib/" + _prefix + ".so"
				}
			} else if (process.arch == "arm64") {
				if (process.platform == "darwin") {
					//libFile = __dirname + "/../../../prebuilds/lib/" + _prefix + ".dylib" // process.env.LIBRARY_FILE,
					throw new Error("Your n8n installation is currently not supported, " +
						"please refer to https://telepilot.co/nodes/telepilot/#macos-arm64")
				} else if (process.platform == "linux") {
					// libFile = __dirname + "/../../../prebuilds/lib/" + _prefix + ".so" // process.env.LIBRARY_FILE,
					// throw new Error("non-supported architecture. arm64 !darwin linux")
					const output = childProcess.execSync("getconf GNU_LIBC_VERSION 2>&1 || true; ldd --version 2>&1 || true", { encoding: 'utf8' });
					if (output.includes("glibc")) {
						debug("glibc detected");
						libFile = __dirname + "/../../../../" + _prebuilt_package + "/lib/" + _prefix + "-glibc.so"
						bridgeFile = __dirname + "/../../../../" + _prebuilt_package + "/bridge/" + _prefix + "-glibc.node";
					} else if (output.includes("musl")) {
						debug("musl detected");
						libFile = __dirname + "/../../../../" + _prebuilt_package + "/lib/" + _prefix + "-musl.so"
						bridgeFile = __dirname + "/../../../../" + _prebuilt_package + "/bridge/" + _prefix + "-musl.node";
					}
				} else {
					throw new Error("Your n8n installation is currently not supported, " +
						"please refer to https://telepilot.co/nodes/telepilot/#win-arm64")
				}
			}

			// let bridgeFile = __dirname + "/../../../prebuilds/bridge/" + _prefix + ".node";
			let client = new Client(new BridgeLib(
				libFile,
				bridgeFile
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
					debug('Got update1:', JSON.stringify(update, null, 2))
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
						authenticated = -1
					} else if (authorization_state._ === 'authorizationStateReady') {
						debug("setting authenticated to 1")
						authenticated = 1
					} else if (authorization_state._ === 'authorizationStateWaitTdlibParameters') {
						debug("need to disable requestQrCodeAuthentication call")
					}
				} else if (update._ == 'authorizationStateReady') {
					debug('Got update2:', JSON.stringify(update, null, 2))
					client.removeListener('on', qrCodeAuthHandler);
					authenticated = 1;//FIXME - check return
					debug("removed 'on' update handler: qrCodeAuthHandler")
				} else if (update._ === 'authorizationStateWaitPhoneNumber') {

				} else if (update._ === 'authorizationStateWaitTdlibParameters') {

				} else {
					// debug("strange else")
					// debug(update._)
					// authenticated = -1;//FIXME - check return
				}
			}

			client
				.on('update', qrCodeAuthHandler)

			await sleep(1000);
			debug("authenticated=" + authenticated);

			if (authenticated < 1) {
				let result = await client.invoke({
					_: 'requestQrCodeAuthentication'
				});
				debug(JSON.stringify(result));
			}


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
			throw new Error("TD database was deleted, please log in again. Please check our guide at https://telepilot.co/login-howto");
		} else {
			return 'Already logged in';
		}

		debug("returning for " + apiId)
		// return this.clients[apiId];
		return qrCode;
	}

}
