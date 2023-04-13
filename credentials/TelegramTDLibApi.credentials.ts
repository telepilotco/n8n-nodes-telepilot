// @ts-ignore
import {
	ICredentialType,
	INodeProperties,
	ICredentialDataDecryptedObject,
	// IHttpRequestOptions,
} from 'n8n-workflow';
import {Container} from "typedi";
import {TelegramTDLibNodeConnectionManager} from "../nodes/TDLib/TelegramTDLibNodeConnectionManager";

const debug = require('debug')('tdl-cred')

export class TelegramTDLibApi implements ICredentialType {
	name = 'telegramTdLibApi';
	displayName = 'Telegram API Using TdLib API';
	properties: INodeProperties[] = [
		{
			displayName: 'Use Test DC?',
			name: 'use_test_dc',
			type: 'boolean',
			default: false,
			description: 'TBD',
			required: true,
		},
		{
			displayName: 'App api_id',
			name: 'apiId',
			type: 'string',
			placeholder: '12348745646878',
			default: '',
			description: 'TBD',
			required: true,
		},
		{
			displayName: 'App api_hash',
			name: 'apiHash',
			type: 'string',
			placeholder: '17d2f8ab587',
			default: '',
			description: 'TBD',
			required: true,
		},
		{
			displayName: 'Private Key',
			name: 'phoneNumber',
			type: 'string',
			default: '',
			placeholder:
				'+49171111111111',
			description:
				'Your Telegram Account Phone Number TBD',
			required: true,
		},
		{
			displayName: 'Auth Code',
			name: 'auth_code',
			type: 'string',
			default: '',
			placeholder:
				'123857',
			description:
				'Telegram 2FA Auth code that was sent after you tried to connect for the first time',
			required: false,
		},
	];

	async authenticate(
		credentials: ICredentialDataDecryptedObject,
		requestOptions: any,
	): Promise<any> {
		const {
			apiId,
			apiHash,
			phoneNumber,
			auth_code
		} = credentials as { apiId: number, apiHash: string, phoneNumber: string, auth_code: string };

		debug('authenticate: ' + apiId);

		try {
			const client = Container.get(TelegramTDLibNodeConnectionManager).getActiveTDLibClient(
				apiId as number,
				apiHash as string
			)

			client.on('error', console.error)

			await client.login(() => ({
				getPhoneNumber: () => {
					return phoneNumber
				},
				getAuthCode: (retry: boolean) => {
					return auth_code
				}
			}))
			// await client.close();
		} catch (error) {
			return {
				status: 'Error',
				message: error.message,
			};
		}
		return {
			status: 'OK',
			message: 'Connection successful!',
		};


	}
}
