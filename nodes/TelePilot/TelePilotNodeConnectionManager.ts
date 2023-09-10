import 'reflect-metadata';
import { Service } from 'typedi';
import {IDataObject} from "n8n-workflow";
// const { Client } = require('../../tdl');
const { Client } = require('@telepilotco/tdlib-addon-prebuilt/dist/tdl');
const { BridgeLib } = require('@telepilotco/tdlib-addon-prebuilt/dist/bridge');
// const childProcess = require('child_process');

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
			// throw new Error ("You need to login first, please check our guide at https://telepilot.co/login-howto")
			debug("logging in from getActiveClient(..)")
			let authenticated = 0;
			let qrCode = "";
			this.createClientSetAuthHandler(apiId, apiHash, qrCode, authenticated);
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
		// if (!clients_keys.includes(apiId.toString()) || this.clients[apiId] === undefined) {
		if (true) {
			debug('new TelePilot Client:' + apiId)
			let authenticated = 0;
			if (!clients_keys.includes(apiId.toString())) {
				qrCode = this.createClientSetAuthHandler(apiId, apiHash, qrCode, authenticated);
			}
			let client = this.clients[apiId];
			authenticated = client.authenticated;

			await sleep(1000);
			debug("authenticated=" + authenticated);

			if (authenticated === undefined || authenticated < 1) {
				let result = await client.invoke({
					_: 'requestQrCodeAuthentication'
				});
				debug(JSON.stringify(result));
			} else {
				return 'Already logged in';
			}

			///////////////////////////////

			while (authenticated == 0) {
				await sleep(500);
			}
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

	private createClientSetAuthHandler(apiId: number, apiHash: string, qrCode: string, authenticated: number) {
		let {libFile, bridgeFile} = this.locateBinaryModules();
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

		///////////////////////////

		const qrCodeAuthHandler = (update: IDataObject) => {

			const qrCodeWriter = (s: string) => {
				debug(s)
				qrCode += s;
			}

			if (update._ === "updateAuthorizationState") {
				debug('Got update1:', JSON.stringify(update, null, 2))
				const authorization_state = update.authorization_state as IDataObject;
				if (authorization_state._ === 'authorizationStateWaitOtherDeviceConfirmation') {
					const qr_link = authorization_state.link;
					debug("qr_link:" + qr_link);
					QRCode.setErrorLevel('Q');
					debug("generating qr code");
					QRCode.generate(qr_link, {small: true}, function (code: any) {
						qrCodeWriter(code)
					});
					debug("generated qr code");
					// return {
					// 	status: 'Authenticating',
					// 	message: code,
					// };
					this.clients[apiId].authenticated = 1
				} else if (authorization_state._ === 'authorizationStateReady') {
					debug("setting authenticated to 1")
					this.clients[apiId].authenticated = 1
				} else if (authorization_state._ === 'authorizationStateWaitTdlibParameters') {
					this.clients[apiId].authenticated = 0
					debug("need to disable requestQrCodeAuthentication call")
				}
			} else if (update._ == 'authorizationStateReady') {
				debug('Got update2:', JSON.stringify(update, null, 2))
				client.removeListener('on', qrCodeAuthHandler);
				this.clients[apiId].authenticated = 1;//FIXME - check return
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
		// this.clients[apiId].authenticated = authenticated;
		return qrCode;
	}

	private locateBinaryModules() {
		let _prefix = process.platform + "-x64";
		let _lib_prebuilt_package = "@telepilotco/tdlib-binaries-prebuilt-" + process.platform + "-x64";
		let _bridge_prebuilt_package = "@telepilotco/tdlib-addon-prebuilt-" + process.platform + "-x64";
		if (process.arch === "arm64") {
			_prefix = "libdtjson";
			_lib_prebuilt_package = "tdlib-binaries-prebuilt/prebuilds/";
			_bridge_prebuilt_package = "tdlib-addon-prebuilt/prebuilds/";
		}
		// if (this.client === undefined) {

		let libFile = "";
		let bridgeFile = "";

		const libFolder = __dirname + "/../../../../" + _lib_prebuilt_package;
		const bridgeFolder = __dirname + "/../../../../" + _bridge_prebuilt_package;

		// function detectLibc() {
		// 	const output = childProcess.execSync("getconf GNU_LIBC_VERSION 2>&1 || true; ldd --version 2>&1 || true", {encoding: 'utf8'});
		// 	return output;
		// }

		if (process.arch === "x64") {
			switch (process.platform) {
				case "win32":
					throw new Error("Your n8n installation is currently not supported, " +
						"please refer to https://telepilot.co/nodes/telepilot/#win-x64")
					break;
				case 'darwin':
					throw new Error("Your n8n installation is currently not supported, " +
						"please refer to https://telepilot.co/nodes/telepilot/#macos-x64")
					break;
				case 'linux':
					// const libcString = detectLibc();
					// if (libcString.includes("glibc")) {
					// 	debug("glibc detected");
					// 	libFile = libFolder + _prefix + ".so"
					// 	bridgeFile = bridgeFolder + _prefix + ".node";
					// } else if (libcString.includes("musl")) {
					// 	debug("musl detected");
						libFile = libFolder + _prefix + ".so"
						bridgeFile = bridgeFolder + _prefix + ".node";
					// }
					break;
				default:
					throw new Error("Not implemented for " + process.platform);
			}
		} else if (process.arch == "arm64") {
			if (process.platform == "darwin") {
				// 	"please refer to https://telepilot.co/nodes/telepilot/#macos-arm64")
				libFile = libFolder + "darwin-arm64" + ".dylib"
				bridgeFile = bridgeFolder + "addon" + ".node";
			} else if (process.platform == "linux") {
				// const libcString = detectLibc();
				// if (libcString.includes("glibc")) {
				// 	debug("glibc detected");
				// 	libFile = libFolder + _prefix + ".so"
				// 	bridgeFile = bridgeFolder + _prefix + ".node";
				// } else if (libcString.includes("musl")) {
				// 	debug("musl detected");
					libFile = libFolder + _prefix + ".so"
					bridgeFile = bridgeFolder + _prefix + ".node";
				// }
			} else {
				throw new Error("Your n8n installation is currently not supported, " +
					"please refer to https://telepilot.co/nodes/telepilot/#win-arm64")
			}
		}
		return {libFile, bridgeFile};
	}
}
