import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TDLibApi implements ICredentialType {
	name = 'tdLibApi';
	displayName = 'Telegram API using TdLib';
	properties: INodeProperties[] = [
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
			name: 'publicKey',
			type: 'string',
			default: '',
			placeholder:
				'-----BEGIN PRIVATE KEY-----\nXIYEvQIBADANBg<...>0IhA7TMoGYPQc=\n-----END PRIVATE KEY-----\n',
			description:
				'Enter the public key located in the JSON file downloaded from Google Cloud Console',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.publicKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.sendgrid.com/v3',
			url: '/marketing/contacts',
		},
	};
}