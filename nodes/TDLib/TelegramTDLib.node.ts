import 'reflect-metadata';
import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

const debug = require('debug')('tdl-node')

// var QRCode = require('qrcode-terminal');

// import {
// 	OptionsWithUri,
// } from 'request';
import {Container} from "typedi";
import {TelegramTDLibNodeConnectionManager} from "./TelegramTDLibNodeConnectionManager";


// import {Client} from "tdl";
// const { TDLib } = require('tdl-tdlib-addon')

export class TelegramTDLib implements INodeType {
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
		credentials: [
			{
				name: 'telegramTdLibApi',
				required: true
			},
		],
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'User',
						value: 'user',
					},
					{
						name: 'Contact',
						value: 'contact',
					},
					{
						name: 'Group',
						value: 'group',
					},
					{
						name: 'Chat',
						value: 'chat',
					},
					{
						name: 'Message',
						value: 'message',
					},
					{
						name: 'File',
						value: 'file',
					},
					{
						name: 'Media',
						value: 'media',
					},
				],
				default: 'chat',
				noDataExpression: true,
				required: true,
				description: 'Get Chat History',
			},

			//Operations user
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'user',
						],
					},
				},
				options: [
					{
						name: 'Get Me',
						value: 'getMe',
						description: 'Get Me',
						action: 'Get Me',
					},
					{
						name: 'Get User',
						value: 'getUser',
						description: 'Get User',
						action: 'Get User',
					},
					{
						name: 'Get User Full Info',
						value: 'getUserFullInfo',
						description: 'Get User Full Info',
						action: 'Get User Full Info',
					},
					{
						name: 'Create Private Chat',
						value: 'createPrivateChat',
						description: 'Create Private Chat',
						action: 'Create Private Chat',
					},
					{
						name: 'Create New Secret Chat',
						value: 'createNewSecretChat',
						description: 'Create New Secret Chat',
						action: 'Create New Secret Chat',
					},
					{
						name: 'Set Name',
						value: 'setName',
						description: 'Set Name',
						action: 'Set Name',
					},
					{
						name: 'Set Bio',
						value: 'setBio',
						description: 'Set Bio',
						action: 'Set Bio',
					},
					{
						name: 'Set Username',
						value: 'setUsername',
						description: 'Set Username',
						action: 'Set Username',
					},
					{
						name: 'Search User by Phone Number',
						value: 'searchUserByPhoneNumber',
						description: 'Search User by Phone Number',
						action: 'Search User by Phone Number',
					},
				],
				default: 'getMe',
				noDataExpression: true,
			},

			//Operations contact
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
						name: 'Get Contacts',
						value: 'getContacts',
						description: 'Get all User Contacts',
						action: 'Get all User Contacts',
					},
				],
				default: 'getSupergroupMembers',
				noDataExpression: true,
			},

			//Operations group
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'group',
						],
					},
				},
				options: [
					{
						name: 'Get Supergroup Members',
						value: 'getSupergroupMembers',
						description: 'Get Supergroup Members',
						action: 'Get Supergroup Members',
					},
				],
				default: 'getSupergroupMembers',
				noDataExpression: true,
			},

			//Operations chat
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'chat',
						],
					},
				},
				options: [
					{
						name: 'Get Chats',
						value: 'getChats',
						description: 'Get Chats from main list',
						action: 'Get Chats',
					},
					{
						name: 'Get Chat',
						value: 'getChat',
						description: 'Get Chat Information',
						action: 'Get Chat',
					},
					{
						name: 'Get Chat History',
						value: 'getChatHistory',
						description: 'Get Chat History',
						action: 'Get Chat History',
					},
					{
						name: 'Search Public Chat (by username)',
						value: 'searchPublicChat',
						description: 'Get chat_id by username',
						action: 'Search Public Chats',
					},
					{
						name: 'Search Public Chats (search in username, title)',
						value: 'searchPublicChats',
						description: 'Get chat_id using query that searches in username and title',
						action: 'Search Public Chats',
					},
				],
				default: 'getChatHistory',
				noDataExpression: true,
			},

			//Operations message
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'message',
						],
					},
				},
				options: [
					{
						name: 'Send Message',
						value: 'sendMessage',
						description: 'Send Message',
						action: 'Send Message',
					},
					{
						name: 'Send Message Album',
						value: 'sendMessageAlbum',
						description: 'Send Message Album',
						action: 'Send Message Album',
					},
					{
						name: 'Delete Messages',
						value: 'deleteMessages',
						description: 'Delete Messages',
						action: 'Delete Messages',
					},
					{
						name: 'Edit Message Text',
						value: 'editMessageText',
						description: 'Edit Message Text',
						action: 'Edit Message Text',
					},
					{
						name: 'Set Message Reaction',
						value: 'setMessageReaction',
						description: 'Set Message Reaction',
						action: 'Set Message Reaction',
					},
				],
				default: 'sendMessage',
				noDataExpression: true,
			},

			//Operations file
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'file',
						],
					},
				},
				options: [
					{
						name: 'Get Remote File',
						value: 'getRemoteFile',
						description: 'Get Remote File',
						action: 'Get Remote File',
					},
					{
						name: 'Download File',
						value: 'downloadFile',
						description: 'Download File',
						action: 'Download File',
					}
				],
				default: 'downloadFile',
				noDataExpression: true,
			},

			//Variables
			//User
			{
				displayName: 'User ID',
				name: 'user_id',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'getUser',
							'getUserFullInfo',
							'createPrivateChat',
							'createNewSecretChat'
						],
						resource: [
							'user',
						],
					},
				},
				default:'',
				placeholder: '122323',
				description: 'ID of chat',
			},
			{
				displayName: 'Force',
				name: 'force',
				type: 'boolean',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'createPrivateChat'
						],
						resource: [
							'user',
						],
					},
				},
				default: false,
				placeholder: '122323',
				description: 'ID of chat',
			},
			//Chat
			{
				displayName: 'Chat ID',
				name: 'chat_id',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'getChat',
							'getChatHistory',
						],
						resource: [
							'chat',
						],
					},
				},
				default:'',
				placeholder: '122323',
				description: 'ID of chat',
			},
			{
				displayName: 'From Message Id',
				name: 'from_message_id',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'getChatHistory',
						],
						resource: [
							'chat',
						],
					},
				},
				default:'0',
				placeholder: '133222323',
				description: 'Identifier of the message starting from which history must be fetched; use 0 to get results from the last message',
			},

			{
				displayName: 'Chat Username',
				name: 'username',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'searchPublicChat',
						],
						resource: [
							'chat',
						],
					},
				},
				default:'',
				placeholder: 'Text',
				description: 'Username to use in searchPublicChat',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'searchPublicChats',
						],
						resource: [
							'chat',
						],
					},
				},
				default:'',
				placeholder: 'Text',
				description: 'Query used to search public chats by looking in their username and title',
			},

			//Variables Files
			{
				displayName: 'File ID',
				name: 'file_id',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'downloadFile',
						],
						resource: [
							'file',
						],
					},
				},
				default:'',
				placeholder: 'Text',
				description: 'Identifier of the file to download',
			},
			{
				displayName: 'File ID',
				name: 'remote_file_id',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'getRemoteFile',
						],
						resource: [
							'file',
						],
					},
				},
				default:'',
				placeholder: 'Text',
				description: 'Identifier of the Remote file to download',
			}
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
				const qrCodeAuth = credentials.use_qr_code_auth as boolean;

				let authenticated = false;

				debug('telegramTdLibConnectionTest');

				const client = await Container.get(TelegramTDLibNodeConnectionManager).getActiveTDLibClientAndLogin(
					credentials.apiId as number,
					credentials.apiHash as string,
				)
				await sleep(2000);
				debug('telegramTdLibConnectionTest:' + client)

				debug('qrCodeAuth:' + qrCodeAuth)

				if (qrCodeAuth) {

					const qrCodeAuthHandler = (update: IDataObject) => {
						if (update._ === "updateAuthorizationState") {
							debug('Got update:', JSON.stringify(update, null, 2))
							const authorization_state = update.authorization_state as IDataObject;
							if (authorization_state._ === 'authorizationStateWaitOtherDeviceConfirmation') {
								const qr_link = authorization_state.link;
								debug("qr_link:" + qr_link);
								QRCode.setErrorLevel('Q');
								debug("generating qr code");
								QRCode.generate(qr_link, function(code: any) {debug(code)});
								debug("generated qr code");
								// return {
								// 	status: 'Authenticating',
								// 	message: code,
								// };
							}
						} else if (update._ == 'authorizationStateReady') {
							debug('Got update:', JSON.stringify(update, null, 2))
							client.removeListener('on', qrCodeAuthHandler);
							authenticated = true;
							debug("removed 'on' update handler: qrCodeAuthHandler")
						}
					}

					client
						.on('update', qrCodeAuthHandler)

					let result = await client.invoke({
						_: 'requestQrCodeAuthentication'
					});

					debug(JSON.stringify(result));
					while (!authenticated) {
						await sleep(1000);
					}
					return {
						status: 'OK',
						message: 'Connection successful!',
					};
				} else {
					try {
						client.on('error', debug)

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
		const returnData = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const credentials = await this.getCredentials('telegramTdLibApi');
		debug("has?: " + Container.has(TelegramTDLibNodeConnectionManager));
		const cM = Container.get(TelegramTDLibNodeConnectionManager);
		debug(cM)
		const client = await cM.getActiveTDLibClientAndLogin(credentials.apiId as number, credentials.apiHash as string);
		debug(client)

		debug('Executing tdlib node, resource=' + resource + ', operation=' + operation);

		let result = [];
		// For each item, make an API call to create a contact
		if (resource === 'user') {
			if (operation === 'getMe') {
				const result = await client.invoke({
					_: 'getMe'
				})
				returnData.push(result);
			} else if (operation === 'getUser') {
				const user_id = this.getNodeParameter('user_id', 0) as string;
				result = await client.invoke({
					_: 'getUser',
					user_id
				})
				returnData.push(result);
			} else if (operation === 'getUserFullInfo') {
				const user_id = this.getNodeParameter('user_id', 0) as string;
				result = await client.invoke({
					_: 'getUserFullInfo',
					user_id
				})
				returnData.push(result);
			} else if (operation === 'createPrivateChat') {
				const user_id = this.getNodeParameter('user_id', 0) as string;
				const force = this.getNodeParameter('force', 0) as string;
				result = await client.invoke({
					_: 'createPrivateChat',
					user_id,
					force
				})
				returnData.push(result);
			} else if (operation === 'createNewSecretChat') {
				const user_id = this.getNodeParameter('user_id', 0) as string;
				result = await client.invoke({
					_: 'createNewSecretChat',
					user_id,
				})
				returnData.push(result);
			}
		} else if (resource === 'contact') {
			if (operation === 'getContacts') {
				result = await client.invoke({
					_: 'getContacts'
				})
				returnData.push(result);
			}
		} else if (resource === 'chat') {
			if (operation === 'getChatHistory') {
				const chat_id = this.getNodeParameter('chat_id', 0) as string;
				const from_message_id = this.getNodeParameter('from_message_id', 0) as string;
				result = await client.invoke({
					_: 'getChatHistory',
					chat_id,
					from_message_id,
					offset: 0,
					limit: 1,
					only_local: false
				})
				returnData.push(result);
			} else if (operation === 'getChats') {
				const result = await client.invoke({
					_: 'getChats',
					limit: 9999
				})
				returnData.push(result);
			} else if (operation === 'getChat') {
				const chat_id = this.getNodeParameter('chat_id', 0) as string;
				const result = await client.invoke({
					_: 'getChat',
					chat_id
				})
				returnData.push(result);
			} else if (operation === 'searchPublicChat') {
				const username = this.getNodeParameter('username', 0) as string;
				const result = await client.invoke({
					_: 'searchPublicChat',
					username
				})
				debug(username);
				debug(result);
				returnData.push(result);
			} else if (operation === 'searchPublicChats') {
				const query = this.getNodeParameter('query', 0) as string;
				const result = await client.invoke({
					_: 'searchPublicChats',
					query
				})
				debug(query);
				debug(result);
				returnData.push(result);
			}
		} else if (resource === 'file') {
			if (operation === 'getRemoteFile') {
				const remote_file_id = this.getNodeParameter('remote_file_id', 0) as string;
				const result = await client.invoke({
					_: 'getRemoteFile',
					remote_file_id,
				})
				returnData.push(result);
			} else if (operation === 'downloadFile') {
				const file_id = this.getNodeParameter('file_id', 0) as string;
				const result = await client.invoke({
					_: 'downloadFile',
					file_id,
					priority: 16,
					synchronous: true
				})
				returnData.push(result);
			}
		}
		debug('finished execution, length=' + JSON.stringify(result).length)
		// Map data to n8n data structure
		return [this.helpers.returnJsonArray(returnData)];
	}
}
