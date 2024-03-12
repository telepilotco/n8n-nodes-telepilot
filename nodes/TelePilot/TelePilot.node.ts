import 'reflect-metadata';

import {IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeOperationError} from 'n8n-workflow';

const debug = require('debug')('telepilot-node');

import { Container } from 'typedi';
import { TelePilotNodeConnectionManager } from './TelePilotNodeConnectionManager';

import {
	operationChat,
	operationContact,
	operationFile,
	operationGroup,
	operationLogin,
	operationMessage,
	operationUser,
	optionResources,
	variable_chat_id,
	variable_file_id,
	variable_force,
	variable_from_chat_id,
	variable_from_message_id,
	variable_is_marked_as_unread,
	variable_message_id,
	variable_message_ids,
	variable_messageText,
	variable_query,
	variable_remote_file_id,
	variable_reply_to_msg_id,
	variable_revoke,
	variable_user_id,
	variable_username,
	variable_supergroup_id
} from './common.descriptions'

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
			optionResources,
			operationLogin,
			operationUser,
			operationContact,
			operationGroup,
			operationChat,
			operationMessage,
			operationFile,

			//Variables
			//User
			variable_user_id,
			variable_force,

			//Chat
			variable_chat_id,
			variable_from_chat_id,
			//Chat
			variable_is_marked_as_unread,
			variable_from_message_id,
			variable_message_ids,
			variable_message_id,
			variable_messageText,
			variable_revoke,
			variable_username,
			variable_query,

			//Variables Files
			variable_file_id,
			variable_remote_file_id,
			variable_reply_to_msg_id,

			//Variables Group
			variable_supergroup_id
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
		try {
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
				} else if (operation === 'joinChat') {
					const chat_id = this.getNodeParameter('chat_id', 0) as string;
					const result = await client.invoke({
						_: 'joinChat',
						chat_id,
					});
					debug(chat_id);
					debug(result);
					returnData.push(result);
				} else if (operation === 'openChat') {
					const chat_id = this.getNodeParameter('chat_id', 0) as string;
					const result = await client.invoke({
						_: 'openChat',
						chat_id,
					});
					debug(chat_id);
					debug(result);
					returnData.push(result);
				} else if (operation === 'closeChat') {
					const chat_id = this.getNodeParameter('chat_id', 0) as string;
					const result = await client.invoke({
						_: 'closeChat',
						chat_id,
					});
					debug(chat_id);
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
					const reply_to_msg_id = this.getNodeParameter('reply_to_msg_id', 0) as string;
					const result = await client.invoke({
						_: 'sendMessage',
						chat_id,
						reply_to_msg_id,
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
			} else if (resource === 'group') {
				if (operation === 'getSupergroup') {
					const supergroup_id = this.getNodeParameter('supergroup_id', 0);
					result = await client.invoke({
						_: 'getSupergroup',
						supergroup_id,
					});
					returnData.push(result);
				} else if (operation === 'getSupergroupFullInfo') {
					const supergroup_id = this.getNodeParameter('supergroup_id', 0);
					result = await client.invoke({
						_: 'getSupergroupFullInfo',
						supergroup_id,
					});
					returnData.push(result);
				}
			}
		} catch (e) {
			if (e.message === "A closed client cannot be reused, create a new Client") {
				cM.markClientAsClosed(credentials?.apiId as number);
				throw new Error("Session was closed or terminated. Please login again: https://telepilot.co/documentation/logging-in-telegram-with-telepilot/") as NodeOperationError
			} else 	if (e.message === "Unauthorized") {
				cM.markClientAsClosed(credentials?.apiId as number);
				throw new Error("Please login: https://telepilot.co/documentation/logging-in-telegram-with-telepilot/") as NodeOperationError
			} else {
				throw(e as NodeOperationError);
			}
		}
		// debug('finished execution, length=' + JSON.stringify(result).length)
		// Map data to n8n data structure
		return [this.helpers.returnJsonArray(returnData)];
	}
}
