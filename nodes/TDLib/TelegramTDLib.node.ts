import {
	IExecuteFunctions,
} from 'n8n-core';

// @ts-ignore
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class TelegramTDLib implements INodeType {
	// @ts-ignore
	description: INodeTypeDescription = {
		// Basic node details will go here
		displayName: 'Telegram TDLib',
		name: 'telegramTdLib',
		icon: 'file:TelegramTDLib.png',
		group: ['transform'],
		version: 1,
		description: 'Consume Telegram API via TDLib',
		defaults: {
			name: 'Telegram TDLib',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'telegramTdLibApi',
				required: true,
				// testedBy: 'telegramTdLibConnectionTest',
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Contact',
						value: 'contact',
					},
				],
				default: 'contact',
				noDataExpression: true,
				required: true,
				description: 'Create a new contact',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'contact',
						],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a contact',
						// action: 'Create a contact',
					},
				],
				default: 'create',
				noDataExpression: true,
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'contact',
						],
					},
				},
				default:'',
				placeholder: 'name@email.com',
				description:'Primary email for the contact',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: [
							'contact',
						],
						operation: [
							'create',
						],
					},
				},
				options: [
					{
						displayName: 'First Name',
						name: 'firstName',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Last Name',
						name: 'lastName',
						type: 'string',
						default: '',
					},
				],
			},
		],
	};
	// The execute method will go here

	/*
	methods = {
		credentialTest: {
			async telegramTdLibConnectionTest(
				this: ICredentialTestFunctions,
				credential: ICredentialsDecrypted,
			): Promise<INodeCredentialTestResult> {
				const credentials = credential.data as IDataObject;
				try {
					// const credentialKeys = ['use_test_dc', 'api_id', 'api_hash', 'phoneNumber', 'auth_code'];

					// const client = new Client(new TDLib(), {
					// 	apiId: credentials['api_id'] as number, // Your api_id
					// 	apiHash: credentials['api_hash'] as string,
					// 	useTestDc: credentials['use_test_dc'] as boolean
					// }); //use 9996629091 as phone number and 22222 as auth_code

					const client = Container.get(TelegramTDLibNodeConnectionManager).getActiveTDLibClient(
						credentials.apiId as number,
						credentials.apiHash as string
					)

					client.on('error', console.error)

					await client.login(() => ({
						getPhoneNumber: () => {return credentials.phoneNumber},
						getAuthCode: (retry: boolean) => { return credentials.auth_code}
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
			},
		},
	};
	 */


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Handle data coming from previous nodes
		const items = this.getInputData();
		// let responseData;
		// const returnData = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// For each item, make an API call to create a contact
		for (let i = 0; i < items.length; i++) {
			if (resource === 'contact') {
				if (operation === 'create') {
					// Get email input
					// const email = this.getNodeParameter('email', i) as string;
					// // Get additional fields input
					// const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
					// const data: IDataObject = {
					// 	email,
					// };

				// 	Object.assign(data, additionalFields);
				//
				// 	// Make HTTP request according to https://sendgrid.com/docs/api-reference/
				// 	const options: OptionsWithUri = {
				// 		headers: {
				// 			'Accept': 'application/json',
				// 		},
				// 		method: 'PUT',
				// 		body: {
				// 			contacts: [
				// 				data,
				// 			],
				// 		},
				// 		uri: `https://api.sendgrid.com/v3/marketing/contacts`,
				// 		json: true,
				// 	};
				// 	responseData = await this.helpers.requestWithAuthentication.call(this, 'friendGridApi', options);
				// 	returnData.push(responseData);
				}
			}
		}
		// Map data to n8n data structure
		return [this.helpers.returnJsonArray({})];
	}
}
