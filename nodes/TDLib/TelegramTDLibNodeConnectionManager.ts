import { Service } from 'typedi';
// import { Client } from "tdl";
const { Client } = require('tdl');
const { TDLib } = require('tdl-tdlib-addon');



@Service()
export class TelegramTDLibNodeConnectionManager {

	private client: typeof Client | undefined;


	constructor() {

	}

	getActiveTDLibClient(apiId: number, apiHash: string): typeof Client {
		if (this.client === undefined) {
			this.client = new Client(new TDLib(
				"/Users/skopchalyuk/projects/2023-n8n-tdlib-node/bannerets-tdl/examples/libtdjson.dylib",
				"/Users/skopchalyuk/projects/2023-n8n-tdlib-node/bannerets-tdl/packages/tdl-tdlib-addon/build/Release/td.node"
			), {
				apiId,//: 1371420, // Your api_id
				apiHash,//: '10c6868cae8a1ce09f7d87f27d691bbd',
				// useTestDc: true

			});
		}

		return this.client;
	}

}
