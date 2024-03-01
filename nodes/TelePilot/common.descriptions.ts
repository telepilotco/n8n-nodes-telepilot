/* eslint-disable n8n-nodes-base/node-filename-against-convention */
import type { INodeProperties } from 'n8n-workflow';

//Resources
export const optionResources: INodeProperties = {
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
};

//Operations login
export const operationLogin: INodeProperties = {
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
};

//Operations user
export const operationUser: INodeProperties = {
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
};

//Operations contact
export const operationContact: INodeProperties = {
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
};

//Operations group
export const operationGroup: INodeProperties = {
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
};

//Operations chat
export const operationChat: INodeProperties = {
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
			name: 'Close Chat',
			value: 'closeChat',
			action: 'Close chat',
		},
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
			name: 'Join Chat',
			value: 'joinChat',
			action: 'Join chat',
		},
		{
			name: 'Mark Chat as Unread',
			value: 'toggleChatIsMarkedAsUnread',
			action: 'Mark chat as unread',
		},
		{
			name: 'Open Chat',
			value: 'openChat',
			action: 'Open chat',
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
};

//Operations message
export const operationMessage: INodeProperties = {
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
};

//Operations file
export const operationFile: INodeProperties = {
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
};


//Variables
//User
export const variable_user_id: INodeProperties = {
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
};
export const variable_force: INodeProperties = {
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
};
//Chat
export const variable_chat_id: INodeProperties = {
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
			'joinChat',
			'openChat',
			'closeChat'
		],
			resource: ['chat', 'message'],
	},
},
default: '',
	placeholder: '122323',
	description: 'ID of chat',
};
export const variable_from_chat_id: INodeProperties = {

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
};
export const variable_is_marked_as_unread: INodeProperties = {
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
};
export const variable_from_message_id: INodeProperties = {
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
};
export const variable_message_ids: INodeProperties = {
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
};
export const variable_message_id: INodeProperties = {
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
};
export const variable_messageText: INodeProperties = {
	displayName: 'Message Text',
		name: 'messageText',
	type: 'string',
	required: true,
	displayOptions: {
	show: {
		operation: ['sendMessage', 'editMessageText'],
			resource: ['message'],
	},
},
default: '',
	placeholder: 'Sample message text',
	description: 'Text of the messages',
};
export const variable_revoke: INodeProperties = {
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
};
export const variable_username: INodeProperties = {
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
};
export const variable_query: INodeProperties = {
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
};

//Variables Files
export const variable_file_id: INodeProperties = {
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
};
export const variable_remote_file_id: INodeProperties = {
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
};

export const variable_reply_to_msg_id: INodeProperties = {
	displayName: 'Reply to messageId',
	name: 'reply_to_msg_id',
	type: 'string',
	displayOptions: {
		show: {
			operation: ['sendMessage'],
			resource: ['message'],
		},
	},
	default: '',
	placeholder: 'Text',
	description: 'Identifier of the Remote file to download',
};

