import 'reflect-metadata';
import { Service } from 'typedi';
import {IDataObject} from "n8n-workflow";
const { Client } = require('@telepilotco/tdl');
const tdl = require('@telepilotco/tdl');
// const childProcess = require('child_process');

const debug = require('debug')('telepilot-cm')
var QRCode = require('qrcode-terminal');

const fs = require('fs/promises');

var pjson = require('../../package.json');
const nodeVersion = pjson.version;

const binaryVersion = pjson.dependencies["@telepilotco/tdlib-binaries-prebuilt"].replace("^", "");
const addonVersion = pjson.dependencies["@telepilotco/tdl"].replace("^", "");


function sleep(ms: number) {
	return new Promise( resolve => setTimeout(resolve, ms) );
}

@Service()
export class TelePilotNodeConnectionManager {

	private clients: Record<number, typeof Client> = {};

	private TD_DATABASE_PATH_PREFIX = process.env.HOME + "/.n8n/nodes/node_modules/@telepilotco/n8n-nodes-telepilot/db"
	private TD_FILES_PATH_PREFIX = process.env.HOME + "/.n8n/nodes/node_modules/@telepilotco/n8n-nodes-telepilot/db"


	constructor() {

	}

	async closeLocalSession(apiId: number) {
		debug("closeLocalSession apiId:" + apiId)
		let clients_keys = Object.keys(this.clients);
		if (!clients_keys.includes(apiId.toString()) || this.clients[apiId] === undefined) {
			throw new Error ("You need to login first, please check our guide at https://telepilot.co/login-howto")
		}
		const client = this.clients[apiId];
		let result = await client.invoke({
			_: 'close'
		})
		delete this.clients[apiId];
		debug(Object.keys(this.clients))
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
		debug('getActiveClient.in keys:' + clients_keys.includes(apiId.toString()));
		debug('getActiveClient.value:' + this.clients[apiId]);
		if (!clients_keys.includes(apiId.toString()) || this.clients[apiId] === undefined) {
			// throw new Error ("You need to login first, please check our guide at https://telepilot.co/login-howto")
			debug("logging in from getActiveClient(..)")
			let authenticated = 0;
			let qrCode = "";
			this.clients[apiId] = this.createClientSetAuthHandler(apiId, apiHash, qrCode, authenticated);
			await sleep(1000);
		}
		return this.clients[apiId];
	}

	async terminateSession(apiId: number, apiHash: string): Promise<typeof Client> {

	}

	async clientLoginWithQRCode(apiId: number, apiHash: string): Promise<string> {
		let clients_keys = Object.keys(this.clients);
		debug('clientLoginWithQRCode.keys:' + clients_keys);
		debug('clientLoginWithQRCode.in keys:' + clients_keys.includes(apiId.toString()));
		debug('clientLoginWithQRCode.value:' + this.clients[apiId]);
		let qrCode = ""
		// if (!clients_keys.includes(apiId.toString()) || this.clients[apiId] === undefined) {
		if (true) {
			debug('new TelePilot Client:' + apiId)
			let authenticated = 0;
			// if (!clients_keys.includes(apiId.toString())) {
			let client = this.createClientSetAuthHandler(apiId, apiHash, qrCode, authenticated);
			// }
			this.clients[apiId] = client;

			await sleep(1000);
			debug("authenticated=" + this.clients[apiId].authenticated);

			if (this.clients[apiId].authenticated === undefined || this.clients[apiId].authenticated < 1) {
				let result = await client.invoke({
					_: 'requestQrCodeAuthentication'
				});
				debug(JSON.stringify(result));
			}

			///////////////////////////////

			while (this.clients[apiId].authenticated == 0) {
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
		return this.clients[apiId].qrCode;
	}

	private createClientSetAuthHandler(apiId: number, apiHash: string, qrCode: string, authenticated: number) {
		let clients_keys = Object.keys(this.clients);
		let {libFolder, libFile} = this.locateBinaryModules();
		let client: typeof Client = undefined;
		debug("nodeVersion:", nodeVersion);
		debug("binaryVersion:", binaryVersion);
		debug("addonVersion:", addonVersion);
		if (!clients_keys.includes(apiId.toString()) || this.clients[apiId] === undefined) {
			tdl.configure({
				libdir: libFolder,
				tdjson: libFile
			});
			client = tdl.createClient({
				apiId,
				apiHash,
				databaseDirectory: this.getTdDatabasePathForClient(apiId),
				filesDirectory: this.getTdFilesPathForClient(apiId),
				nodeVersion,
				binaryVersion,
				addonVersion
				// useTestDc: true
			});
		} else {
			client = this.clients[apiId];
		}
		client.qrCode = qrCode;

		///////////////////////////

		const qrCodeAuthHandler = (update: IDataObject) => {

			const qrCodeWriter = (s: string) => {
				debug(s)
				client.qrCode += s;
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
					client.authenticated = 1
				} else if (authorization_state._ === 'authorizationStateReady') {
					debug("setting authenticated to 1")
					client.authenticated = 1
				} else if (authorization_state._ === 'authorizationStateWaitTdlibParameters') {
					client.authenticated = 0
					debug("need to disable requestQrCodeAuthentication call")
				} else if (authorization_state._ === 'authorizationStateClosed') {
					client.authenticated = 0
					debug("authorizationStateClosed for apiId:" + apiId)
					// let ret = this.closeLocalSession(apiId);
					delete this.clients[apiId];
					// debug(ret);
				}
			} else if (update._ == 'authorizationStateReady') {
				debug('Got update2:', JSON.stringify(update, null, 2))
				client.removeListener('on', qrCodeAuthHandler);
				client.authenticated = 1;//FIXME - check return
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
		return client;
	}

	// @ts-ignore
	private locateBinaryModules() {
		let _lib_prebuilt_package = "tdlib-binaries-prebuilt/prebuilds/";

		let libFile = "";
		const libFolder = __dirname + "/../../../../" + _lib_prebuilt_package;

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
						// libFile = libFolder + "libtdjson" + ".so"
						libFile = "libtdjson" + ".so"
					break;
				default:
					throw new Error("Not implemented for " + process.platform);
			}
		} else if (process.arch == "arm64") {
			switch (process.platform) {
				case "darwin":
					// 	"please refer to https://telepilot.co/nodes/telepilot/#macos-arm64")
					libFile = "libtdjson" + ".dylib"
					break;
				case "linux":
					libFile = "libtdjson" + ".so"
					break;
				default:
					throw new Error("Your n8n installation is currently not supported, " +
						"please refer to https://telepilot.co/nodes/telepilot/#win-arm64")
			}
		}
		// return {libFile, bridgeFile};
		return {libFolder, libFile};
	}

	markClientAsClosed(apiId: number) {
		debug("markClientAsClosed apiId:" + apiId)
		this.closeLocalSession(apiId);
	}
}
