import {
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TelePilotApi implements ICredentialType {
	name = 'telePilotApi';
	displayName = 'Personal Telegram CoPilot API';
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
			displayName: 'Phone Number',
			name: 'phoneNumber',
			type: 'string',
			default: '00123456789',
			description: 'Telegram Account Phone Number, used as Login',
			required: true,
		},
	];

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'http://ls.telepilot.co:4413',
			url: '?key=empty',
			method: 'POST',
		},
	};
}
