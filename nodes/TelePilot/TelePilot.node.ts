import 'reflect-metadata';
import { IExecuteFunctions } from 'n8n-core';

import { INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';

const debug = require('debug')('telepilot-node');

import { Container } from 'typedi';
import { TelePilotNodeConnectionManager } from './TelePilotNodeConnectionManager';

export class TelePilot implements INodeType {
	description: INodeTypeDescription = {
		// Basic node details will go here
		displayName: 'Telegram CoPilot',
		name: 'telePilot',
		icon: 'file:TelePilot.svg',
		group: ['transform'],
		version: 1,
		description: 'Your Personal Telegram CoPilot',
		defaults: {
			name: 'Telegram CoPilot',
		},
		credentials: [
			{
				name: 'telePilotApi',
				required: true,
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
						name: 'Chat',
						value: 'chat',
					},
					{
						name: 'Contact',
						value: 'contact',
					},
					{
						name: 'File',
						value: 'file',
					},
					{
						name: 'Group',
						value: 'group',
					},
					{
						name: 'Login',
						value: 'login',
					},
					{
						name: 'Media',
						value: 'media',
					},
					{
						name: 'Message',
						value: 'message',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'chat',
				noDataExpression: true,
				required: true,
				description: 'Get Chat History',
			},

			//Operations login
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['login'],
					},
				},
				options: [
					{
						name: 'Login with QR Code',
						value: 'login',
						action: 'Login with qr code',
					},
					// {
					// 	name: 'Logout',
					// 	value: 'logout',
					// 	description: 'Logout',
					// 	action: 'Logout',
					// },
					{
						name: 'Close Session',
						value: 'closeSession',
						action: 'Close session',
					},
					{
						name: 'Remove Td_database',
						value: 'removeTdDatabase',
						action: 'Remove td database',
					},
				],
				default: 'login',
				noDataExpression: true,
			},

			//Operations user
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				options: [
					{
						name: 'Create New Secret Chat',
						value: 'createNewSecretChat',
						action: 'Create new secret chat',
					},
					{
						name: 'Create Private Chat',
						value: 'createPrivateChat',
						action: 'Create private chat',
					},
					{
						name: 'Get Me',
						value: 'getMe',
						action: 'Get me',
					},
					{
						name: 'Get User',
						value: 'getUser',
						action: 'Get user',
					},
					{
						name: 'Get User Full Info',
						value: 'getUserFullInfo',
						action: 'Get user full info',
					},
					// {
					// 	name: 'Search User by Phone Number',
					// 	value: 'searchUserByPhoneNumber',
					// 	action: 'Search user by phone number',
					// },
					// {
					// 	name: 'Set Bio',
					// 	value: 'setBio',
					// 	action: 'Set bio',
					// },
					// {
					// 	name: 'Set Name',
					// 	value: 'setName',
					// 	action: 'Set name',
					// },
					// {
					// 	name: 'Set Username',
					// 	value: 'setUsername',
					// 	action: 'Set username',
					// },
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
						resource: ['contact'],
					},
				},
				options: [
					{
						name: 'Get Contacts',
						value: 'getContacts',
						action: 'Get all user contacts',
					},
				],
				default: 'getContacts',
				noDataExpression: true,
			},

			//Operations group
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['group'],
					},
				},
				options: [
					{
						name: 'Get Supergroup Members',
						value: 'getSupergroupMembers',
						action: 'Get supergroup members',
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
						resource: ['chat'],
					},
				},
				options: [
					{
						name: 'Get Chat',
						value: 'getChat',
						action: 'Get chat',
					},
					{
						name: 'Get Chat History',
						value: 'getChatHistory',
						action: 'Get chat history',
					},
					{
						name: 'Get Chats',
						value: 'getChats',
						action: 'Get chats',
					},
					{
						name: 'Mark Chat as Unread',
						value: 'toggleChatIsMarkedAsUnread',
						action: 'Mark chat as unread',
					},
					{
						name: 'Search Public Chat (by Username)',
						value: 'searchPublicChat',
						action: 'Search public chat by username',
					},
					{
						name: 'Search Public Chats (Search in Username, Title)',
						value: 'searchPublicChats',
						action: 'Search public chats',
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
						resource: ['message'],
					},
				},
				options: [
					{
						name: 'Delete Messages',
						value: 'deleteMessages',
						action: 'Delete messages',
					},
					{
						name: 'Edit Message Text',
						value: 'editMessageText',
						action: 'Edit message text',
					},
					{
						name: 'Forward Messages',
						value: 'forwardMessages',
						action: 'Forward messages',
					},
					{
						name: 'Get Messages',
						value: 'getMessage',
						action: 'Get message',
					},
					{
						name: 'Send Message',
						value: 'sendMessage',
						action: 'Send message',
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
						resource: ['file'],
					},
				},
				options: [
					{
						name: 'Get Remote File',
						value: 'getRemoteFile',
						action: 'Get remote file',
					},
					{
						name: 'Download File',
						value: 'downloadFile',
						action: 'Download file',
					},
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
						operation: ['getUser', 'getUserFullInfo', 'createPrivateChat', 'createNewSecretChat'],
						resource: ['user'],
					},
				},
				default: '',
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
						operation: ['createPrivateChat'],
						resource: ['user'],
					},
				},
				default: false,
				placeholder: '122323',
				description: 'Whether creation of private chat should be forced',
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
							'sendMessage',
							'deleteMessages',
							'forwardMessages',
							'toggleChatIsMarkedAsUnread',
							'getMessage',
							'editMessageText',
						],
						resource: ['chat', 'message'],
					},
				},
				default: '',
				placeholder: '122323',
				description: 'ID of chat',
			},
			{
				displayName: 'From Chat ID',
				name: 'from_chat_id',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['forwardMessages'],
						resource: ['message'],
					},
				},
				default: '',
				placeholder: '122323',
				description: 'ID of chat from which to forward messages',
			},
			//Chat
			{
				displayName: 'Mark as Unread?',
				name: 'is_marked_as_unread',
				type: 'boolean',
				required: true,
				displayOptions: {
					show: {
						operation: ['toggleChatIsMarkedAsUnread'],
						resource: ['chat'],
					},
				},
				default: true,
				placeholder: 'true',
				description: 'Whether Chat should be marked as Unread',
			},
			{
				displayName: 'From Message ID',
				name: 'from_message_id',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['getChatHistory'],
						resource: ['chat'],
					},
				},
				default: '0',
				placeholder: '133222323',
				description:
					'Identifier of the message starting from which history must be fetched; use 0 to get results from the last message',
			},
			{
				displayName: 'Message IDs',
				name: 'message_ids',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['deleteMessages', 'forwardMessages'],
						resource: ['message'],
					},
				},
				default: '',
				placeholder: '123,234,345',
				description: 'Comma-separated identifiers of the messages to be deleted or forwarded',
			},
			{
				displayName: 'Message ID',
				name: 'message_id',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['getMessage', 'editMessageText'],
						resource: ['message'],
					},
				},
				default: '',
				placeholder: '12345678',
				description: 'Identifier of the messages',
			},
			{
				displayName: 'Message Text',
				name: 'messageText',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['editMessageText'],
						resource: ['message'],
					},
				},
				default: '',
				placeholder: 'Sample message text',
				description: 'Text of the messages',
			},
			{
				displayName: 'Delete for All Users?',
				name: 'revoke',
				type: 'boolean',
				required: true,
				displayOptions: {
					show: {
						operation: ['deleteMessages'],
						resource: ['message'],
					},
				},
				default: true,
				description: 'Whether given messages should be deleted for all users',
			},
			{
				displayName: 'Chat Username',
				name: 'username',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['searchPublicChat'],
						resource: ['chat'],
					},
				},
				default: '',
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
						operation: ['searchPublicChats'],
						resource: ['chat'],
					},
				},
				default: '',
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
						operation: ['downloadFile'],
						resource: ['file'],
					},
				},
				default: '',
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
						operation: ['getRemoteFile'],
						resource: ['file'],
					},
				},
				default: '',
				placeholder: 'Text',
				description: 'Identifier of the Remote file to download',
			},
			{
				displayName: 'Message Text',
				name: 'messageText',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['sendMessage'],
						resource: ['message'],
					},
				},
				default: '',
				placeholder: 'Text',
				description: 'Text of message to be send to Telegram user or chat',
			},
		],
	};
	// The execute method will go here

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const returnData = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const credentials = await this.getCredentials('telePilotApi');
		const cM = Container.get(TelePilotNodeConnectionManager);
		// debug(cM)
		// debug(client)

		debug('Executing telePilot node, resource=' + resource + ', operation=' + operation);

		let result;
		let client;
		if (resource === 'login') {
			if (operation === 'login') {
				result = await cM.clientLoginWithQRCode(
					credentials?.apiId as number,
					credentials?.apiHash as string,
				);
				result.split('\n').forEach((s) => {
					returnData.push(s);
				});
				// } else if (operation === 'logout') {
				// 	client = await cM.getActiveClient(credentials.apiId as number, credentials.apiHash as string);
				// 	result = await client.invoke({
				// 		_: 'logOut'
				// 	});
				// 	returnData.push(result);
			} else if (operation === 'closeSession') {
				try {
					result = await cM.closeLocalSession(credentials?.apiId as number);
				} catch (e) {
					throw e;
				}
				returnData.push(result);
			} else if (operation === 'removeTdDatabase') {
				result = await cM.deleteLocalInstance(credentials?.apiId as number);
				returnData.push(result);
			}
		} else {
			client = await cM.getActiveClient(
				credentials?.apiId as number,
				credentials?.apiHash as string,
			);
		}

		// For each item, make an API call to create a contact
		if (resource === 'user') {
			if (operation === 'getMe') {
				const result = await client.invoke({
					_: 'getMe',
				});
				returnData.push(result);
			} else if (operation === 'getUser') {
				const user_id = this.getNodeParameter('user_id', 0) as string;
				result = await client.invoke({
					_: 'getUser',
					user_id,
				});
				returnData.push(result);
			} else if (operation === 'getUserFullInfo') {
				const user_id = this.getNodeParameter('user_id', 0) as string;
				result = await client.invoke({
					_: 'getUserFullInfo',
					user_id,
				});
				returnData.push(result);
			} else if (operation === 'createPrivateChat') {
				const user_id = this.getNodeParameter('user_id', 0) as string;
				const force = this.getNodeParameter('force', 0) as string;
				result = await client.invoke({
					_: 'createPrivateChat',
					user_id,
					force,
				});
				returnData.push(result);
			} else if (operation === 'createNewSecretChat') {
				const user_id = this.getNodeParameter('user_id', 0) as string;
				result = await client.invoke({
					_: 'createNewSecretChat',
					user_id,
				});
				returnData.push(result);
			}
		} else if (resource === 'contact') {
			if (operation === 'getContacts') {
				result = await client.invoke({
					_: 'getContacts',
				});
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
					only_local: false,
				});
				returnData.push(result);
			} else if (operation === 'getChats') {
				const result = await client.invoke({
					_: 'getChats',
					limit: 9999,
				});
				returnData.push(result);
			} else if (operation === 'getChat') {
				const chat_id = this.getNodeParameter('chat_id', 0) as string;
				const result = await client.invoke({
					_: 'getChat',
					chat_id,
				});
				returnData.push(result);
			} else if (operation === 'searchPublicChat') {
				const username = this.getNodeParameter('username', 0) as string;
				const result = await client.invoke({
					_: 'searchPublicChat',
					username,
				});
				debug(username);
				debug(result);
				returnData.push(result);
			} else if (operation === 'searchPublicChats') {
				const query = this.getNodeParameter('query', 0) as string;
				const result = await client.invoke({
					_: 'searchPublicChats',
					query,
				});
				debug(query);
				debug(result);
				returnData.push(result);
			} else if (operation === 'toggleChatIsMarkedAsUnread') {
				const chat_id = this.getNodeParameter('chat_id', 0) as string;
				const is_marked_as_unread = this.getNodeParameter('is_marked_as_unread', 0) as boolean;
				const result = await client.invoke({
					_: 'toggleChatIsMarkedAsUnread',
					chat_id,
					is_marked_as_unread,
				});
				returnData.push(result);
			}
		} else if (resource === 'file') {
			if (operation === 'getRemoteFile') {
				const remote_file_id = this.getNodeParameter('remote_file_id', 0) as string;
				const result = await client.invoke({
					_: 'getRemoteFile',
					remote_file_id,
				});
				returnData.push(result);
			} else if (operation === 'downloadFile') {
				const file_id = this.getNodeParameter('file_id', 0) as string;
				const result = await client.invoke({
					_: 'downloadFile',
					file_id,
					priority: 16,
					synchronous: true,
				});
				returnData.push(result);
			}
		} else if (resource === 'message') {
			if (operation === 'getMessage') {
				const chat_id = this.getNodeParameter('chat_id', 0) as string;
				const message_id = this.getNodeParameter('message_id', 0) as string;
				const result = await client.invoke({
					_: 'getMessage',
					chat_id,
					message_id,
				});
				returnData.push(result);
			} else if (operation === 'sendMessage') {
				const chat_id = this.getNodeParameter('chat_id', 0) as string;
				const messageText = this.getNodeParameter('messageText', 0) as string;
				const result = await client.invoke({
					_: 'sendMessage',
					chat_id,
					input_message_content: {
						_: 'inputMessageText',
						text: {
							_: 'formattedText',
							text: messageText,
						},
					},
				});
				returnData.push(result);
			} else if (operation === 'editMessageText') {
				const chat_id = this.getNodeParameter('chat_id', 0) as string;
				const message_id = this.getNodeParameter('message_id', 0) as string;
				const messageText = this.getNodeParameter('messageText', 0) as string;
				const result = await client.invoke({
					_: 'editMessageText',
					chat_id,
					message_id,
					input_message_content: {
						_: 'inputMessageText',
						text: {
							_: 'formattedText',
							text: messageText,
						},
					},
				});
				returnData.push(result);
			} else if (operation === 'deleteMessages') {
				const chat_id = this.getNodeParameter('chat_id', 0) as string;
				const message_ids = this.getNodeParameter('message_ids', 0) as string;
				const revoke = this.getNodeParameter('revoke', 0) as boolean;

				const idsArray = message_ids
					.toString()
					.split(',')
					.map((s) => s.toString().trim());
				const result = await client.invoke({
					_: 'deleteMessages',
					chat_id,
					message_ids: idsArray,
					revoke,
				});
				returnData.push(result);
			} else if (operation === 'forwardMessages') {
				const chat_id = this.getNodeParameter('chat_id', 0) as string;
				const from_chat_id = this.getNodeParameter('from_chat_id', 0) as string;

				const message_ids: string = this.getNodeParameter('message_ids', 0) as string;
				debug(message_ids);
				const idsArray = message_ids
					.toString()
					.split(',')
					.map((s) => s.toString().trim())
					.filter((s) => s.length > 0);
				debug(idsArray);

				const result = await client.invoke({
					_: 'forwardMessages',
					chat_id,
					from_chat_id,
					message_ids: idsArray,
				});
				returnData.push(result);
			}
		}
		// debug('finished execution, length=' + JSON.stringify(result).length)
		// Map data to n8n data structure
		return [this.helpers.returnJsonArray(returnData)];
	}
}