import {
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TelePilotApi implements ICredentialType {
	name = 'telePilotApi';
	displayName = 'Personal Telegram Co-Pilot API';
	properties: INodeProperties[] = [
		// {
		// 	displayName: 'Use Test DC?',
		// 	name: 'use_test_dc',
		// 	type: 'boolean',
		// 	default: false,
		// 	description: 'TBD',
		// 	required: true,
		// },
		{
			displayName: 'License Key',
			name: 'license_key',
			type: 'string',
			default: 'FREE_LICENSE',
			placeholder:
				'123857',
			description:
				'License key to use this product',
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
		// {
		// 	displayName: 'Phone Number',
		// 	name: 'phoneNumber',
		// 	type: 'string',
		// 	default: '',
		// 	placeholder:
		// 		'+49171111111111',
		// 	description:
		// 		'Your Telegram Account Phone Number',
		// 	required: false,
		// },
		{
			displayName: 'Use QR Code Authentication',
			name: 'use_qr_code_auth',
			type: 'boolean',
			default: true,
			description: 'QR Code Authentication',
			required: false,
		},
	];

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'http://ls.telepilot.co:4413',
			url: '=?key={{$credentials.license_key}}',
			method: 'POST',
		},
	};
}
