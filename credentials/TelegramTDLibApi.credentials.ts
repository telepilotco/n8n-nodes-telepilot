import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

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
			displayName: 'Phone Number',
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
			displayName: 'Use QR Code Authentication',
			name: 'use_qr_code_auth',
			type: 'boolean',
			default: false,
			description: 'QR Code Authentication',
			required: false,
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
}
