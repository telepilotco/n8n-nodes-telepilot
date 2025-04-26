import 'reflect-metadata';

import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	IDataObject
} from 'n8n-workflow';
import {Container} from 'typedi';
import {sleep, TelePilotNodeConnectionManager, TelepilotAuthState} from './TelePilotNodeConnectionManager';

import {
	operationChat,
	operationContact,
	operationFile,
	operationGroup,
	operationLogin,
	operationMessage,
	operationUser,
	operationCustom,
	optionResources,
	variable_chat_action,
	variable_chat_id,
	variable_description,
	variable_file_id,
	variable_force,
	variable_from_chat_id,
	variable_from_message_id,
	variable_limit,
	variable_is_channel,
	variable_is_marked_as_unread,
	variable_message_id,
	variable_message_ids,
	variable_messageText,
	variable_query,
	variable_remote_file_id,
	variable_reply_to_msg_id,
	variable_message_thread_id,
	variable_revoke,
	variable_supergroup_id,
	variable_title,
	variable_user_id,
	variable_user_ids,
	variable_username,
	variable_local_photo_path,
	variable_photo_caption,
	variable_audio_path,
	variable_video_photo_path,
	variable_audio_file_path,
	variable_audio_caption,
	variable_file_path,
	variable_file_caption,
	variable_audio_binary_property_name,
	variable_send_as_voice,
	variable_json
} from './common.descriptions'

const debug = require('debug')('telepilot-node');

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
			operationCustom,

			//Variables
			//User
			variable_user_id,
			variable_force,

			//Chat
			variable_chat_id,
			variable_from_chat_id,
			//Message
			variable_is_marked_as_unread,
			variable_from_message_id,
			variable_limit,
			variable_message_ids,
			variable_message_id,
			variable_messageText,
			variable_local_photo_path,
			variable_photo_caption,
			variable_audio_path,
			variable_audio_file_path,
			variable_audio_caption,
			variable_video_photo_path,
			variable_file_path,
			variable_file_caption,
			variable_audio_binary_property_name,
			variable_send_as_voice,
			variable_revoke,
			variable_username,
			variable_query,
			variable_title,
			variable_message_thread_id,
			variable_description,
			variable_is_channel,
			variable_user_ids,
			variable_chat_action,

			//Variable Custom Request
			variable_json,

			//Variables Files
			variable_file_id,
			variable_remote_file_id,
			variable_reply_to_msg_id,

			//Variables Group
			variable_supergroup_id,
			variable_audio_binary_property_name,
			variable_send_as_voice
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

				const loginWithPhoneNumberHelpCommand = () => {
					return {
						text: "Following commands are supported:\n\n" +
						"/start - start login via Phone Number and code (MFA is also supported if set)\n" +
						"/stop - terminates current ClientSession for this Credential\n" +
						"/clear - deletes local tdlib database, new login is required\n" +
						"/cred - shows which Telegram Credential is used in this ChatTrigger (name + apiId, apiHash, phoneNumber)\n" +
						"/stat - print all open Telegram sessions"
					}
				}
				debug('loginWithPhoneNumber')
				const items = this.getInputData();
				const message = items[0].json['chatInput'] as string;
				debug("message received: " + message)
				if (message === undefined) {
					returnData.push({
						compatibility: "QR-Code login is disabled starting from version 0.3.0",
						doc: "Please connect ChatTrigger to this node and read instructions:",
						url: "https://telepilot.co/login-howto"
					});

				} else if (message.startsWith("/")) {
					switch(message) {
						case "/start":
							let authState = cM.getAuthStateForCredential(credentials?.apiId as number)
							debug("loginWithPhoneNumber./start.authState: " + authState)
							if (authState == TelepilotAuthState.NO_CONNECTION) {
								await cM.createClientSetAuthHandlerForPhoneNumberLogin(
									credentials?.apiId as number,
									credentials?.apiHash as string,
									credentials?.phoneNumber as string,
								)
								authState = cM.getAuthStateForCredential(credentials?.apiId as number)
								debug("loginWithPhoneNumber./start2.authState: " + authState)

								if (authState == TelepilotAuthState.WAIT_CODE) {
									returnData.push("Please provide AuthCode:");
								} else if (authState == TelepilotAuthState.WAIT_PASSWORD) {
									returnData.push("MFA Password:");
								}
							}
							switch (authState) {
								case TelepilotAuthState.WAIT_PHONE_NUMBER:
									await cM.clientLoginWithPhoneNumber(
										credentials?.apiId as number,
										credentials?.apiHash as string,
										credentials?.phoneNumber as string
									)
									await sleep(1000);
									authState = cM.getAuthStateForCredential(credentials?.apiId as number)
									if (authState == TelepilotAuthState.WAIT_CODE) {
										returnData.push("Please provide AuthCode:");
									} else if (authState == TelepilotAuthState.WAIT_READY) {
										returnData.push("You have succesfully logged in. You can close this chat and start using Telepilot.");
									} else {
										returnData.push("Unexpected authState: " + authState);
									}
									break;
								case TelepilotAuthState.WAIT_READY:
									returnData.push("You are logged in with phoneNumber " + credentials?.phoneNumber);
									break;
								default:
									debug("unexpected authState=" + authState)
									returnData.push("unexpected authState=" + authState);
									break;
							}
							break;
						case "/stop":
							cM.closeLocalSession(credentials?.apiId as number)
							returnData.push("Telegram Account " + credentials?.phoneNumber + " disconnected.");
							break;
						case "/clear":
							cM.deleteLocalInstance(credentials?.apiId as number)
							returnData.push({
								text: "Telegram Account disconnected, local session has been cleared. Please login again. " +
											"Please check our guide at https://telepilot.co/login-howto"
							});
							break;
						case "/cred":
							let credResult = credentials;
							credResult.apiHash = "[DELETED]"
							returnData.push(credResult)
							break;
						case "/help":
							returnData.push(loginWithPhoneNumberHelpCommand());
							break;
						case "/stat":
							returnData.push(cM.getAllClientSessions());
							break;
						default:
							returnData.push("Command not supported." + loginWithPhoneNumberHelpCommand());
							break;
					}
				} else {
					let authState = cM.getAuthStateForCredential(credentials?.apiId as number)
					debug("loginWithPhoneNumber.authState: " + authState)
					switch (authState) {
						case TelepilotAuthState.NO_CONNECTION:
							returnData.push({
								text: "Unexpected command. Please refer to https://telepilot.co/login-howto or try /help command\n"
							});
							break;
						case TelepilotAuthState.WAIT_CODE:
							const code = message;
							await cM.clientLoginSendAuthenticationCode(
								credentials?.apiId as number,
								code
							)
							await sleep(1000);
							authState = cM.getAuthStateForCredential(credentials?.apiId as number)
							if (authState == TelepilotAuthState.WAIT_PASSWORD) {
								returnData.push("MFA Password:");
							} else if (authState == TelepilotAuthState.WAIT_READY) {
								returnData.push("You have succesfully logged in. You can close this chat and start using Telepilot.");
							} else {
								returnData.push("Unexpected authState: " + authState);
							}
							break;
						case TelepilotAuthState.WAIT_PASSWORD:
							const password = message;
							await cM.clientLoginSendAuthenticationPassword(
								credentials?.apiId as number,
								password
							)
							await sleep(1000);
							returnData.push("authState:" + cM.getAuthStateForCredential(credentials?.apiId as number));
							break;
						case TelepilotAuthState.WAIT_READY:
							returnData.push("You are logged in with phoneNumber " + credentials?.phoneNumber);
							break;
						default:
							debug("unexpected authState=" + authState)
							returnData.push("unexpected authState=" + authState);
							break;
					}
				}
			} else if (operation === 'closeSession') {
				try {
					cM.closeLocalSession(credentials?.apiId as number)
				} catch (e) {
					throw e;
				}
				returnData.push("Telegram Account " + credentials?.phoneNumber + " disconnected.");
			} else if (operation === 'removeTdDatabase') {
				result = await cM.deleteLocalInstance(credentials?.apiId as number);
				returnData.push({
					text: "Telegram Account disconnected, local session has been cleared.\nPlease login again. Please check our guide at https://telepilot.co/login-howto\n" +
						"Or use /help"
				});
			}
		} else {
			const clientSession = await cM.createClientSetAuthHandlerForPhoneNumberLogin(
				credentials?.apiId as number,
				credentials?.apiHash as string,
				credentials?.phoneNumber as string,
			);
			debug("clientSession.authState=" + clientSession.authState)
			if (clientSession.authState != TelepilotAuthState.WAIT_READY) {
				await cM.closeLocalSession(credentials?.apiId as number)
				if (this.continueOnFail())
				{
					returnData.push({ json: {
						message: "Telegram account not logged in. " +
							"Please use ChatTrigger node together with loginWithPhoneNumber action. " +
							"Please check our guide at https://telepilot.co/login-howto or use /help command in Chat Trigger Node",
							error: {
								_: "error",
								code: -1,
								message: "Please login"
							}
					}});
					return [this.helpers.returnJsonArray(returnData)];
				} else {
					throw new Error("Please login: https://telepilot.co/login-howto") as NodeOperationError
				}
			} else {
				client = clientSession.client;
			}
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
					const limit = this.getNodeParameter('limit', 0) as number;
					result = await client.invoke({
						_: 'getChatHistory',
						chat_id,
						from_message_id,
						offset: 0,
						limit,
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
				} else if (operation === 'createNewSupergroupChat') {
					const title = this.getNodeParameter('title', 0) as string;
					const is_channel = this.getNodeParameter('is_channel', 0) as boolean;
					const description = this.getNodeParameter('description', 0) as string;
					const result = await client.invoke({
						_: 'createNewSupergroupChat',
						title,
						is_channel,
						description,
						location: null,
						for_import: false,
					});
					returnData.push(result);
				} else if (operation === 'deleteChat') {
					const chat_id = this.getNodeParameter('chat_id', 0) as string;
					const result = await client.invoke({
						_: 'deleteChat',
						chat_id,
					});
					returnData.push(result);
				} else if (operation === 'addChatMembers') {
					const chat_id = this.getNodeParameter('chat_id', 0) as string;
					const user_ids = this.getNodeParameter('user_ids', 0) as string;

					const idsArray = user_ids
						.toString()
						.split(',')
						.map((s) => s.toString().trim());
					const result = await client.invoke({
						_: 'addChatMembers',
						chat_id,
						user_ids: idsArray,
					});
					returnData.push(result);
				} else if (operation === 'sendChatAction') {
					const chat_id = this.getNodeParameter('chat_id', 0) as string;
					const action = { //constructing ChatAction object
						_: this.getNodeParameter('action', 0) as string
					};

					const result = await client.invoke({
						_: 'sendChatAction',
						chat_id,
						action,
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
				} else if (operation === 'getMessageLink') {
					const chat_id = this.getNodeParameter('chat_id', 0) as string;
					const message_id = this.getNodeParameter('message_id', 0) as string;
					const result = await client.invoke({
						_: 'getMessageLink',
						chat_id,
						message_id,
					});
					returnData.push(result);
				} else if (operation === 'sendMessage') {
					const chat_id = this.getNodeParameter('chat_id', 0) as string;
					const messageText = this.getNodeParameter('messageText', 0) as string;
					const reply_to_msg_id = this.getNodeParameter('reply_to_msg_id', 0) as string;
					const message_thread_id = this.getNodeParameter('message_thread_id', 0) as number;
					const result = await client.invoke({
						_: 'sendMessage',
						chat_id,
						reply_to_msg_id,
						message_thread_id,
						input_message_content: {
							_: 'inputMessageText',
							text: {
								_: 'formattedText',
								text: messageText,
							},
						},
					});
					returnData.push(result);
				} else if (operation === 'sendMessageVideo') {
					const chat_id = this.getNodeParameter('chat_id', 0) as string;
					const videoFilePath = this.getNodeParameter('videoFilePath', 0) as string;
					let videoCaption: string | null = this.getNodeParameter('fileCaption', 0) as string;
					const reply_to_msg_id = this.getNodeParameter('reply_to_msg_id', 0) as string;
					const message_thread_id = this.getNodeParameter('message_thread_id', 0) as number;

					if (videoCaption === '' && videoCaption.length == 0) {
						videoCaption = null;
					}

					const result = await client.invoke({
						_: 'sendMessage',
						chat_id,
						reply_to_msg_id,
						message_thread_id,
						input_message_content: {
							_: 'inputMessageVideo',
							video: {
								_: 'inputFileLocal',
								path: videoFilePath,
							},
							caption: {
								_: 'formattedText',
								text: videoCaption,
							},
						},
					});
					returnData.push(result);
				} else if (operation === 'sendMessageAudio') {
					// Creating a specific output object that will always be returned
					const outputItem: IDataObject = {
						operation: 'sendMessageAudio',
						success: false,
						error: null,
						result: null,
					};

					try {
						// Extract parameters
						const chat_id = this.getNodeParameter('chat_id', 0) as string;
						outputItem.chat_id = chat_id;

						// Get audio path based on source
						const audioSource = this.getNodeParameter('audioSource', 0) as string;
						outputItem.audioSource = audioSource;

						// Check if sending as voice message
						const sendAsVoice = this.getNodeParameter('sendAsVoice', 0, false) as boolean;
						outputItem.sendAsVoice = sendAsVoice;

						let audioFilePath = '';
						let processError = false;

						// Handle binary data source
						if (audioSource === 'binaryData') {
							try {
								const binaryPropertyName = this.getNodeParameter('audioBinaryPropertyName', 0) as string;
								outputItem.binaryPropertyName = binaryPropertyName;

								// Get binary data with better error messages
								const inputData = this.getInputData();
								if (!inputData || !inputData[0]) {
									outputItem.error = 'No input data available';
									processError = true;
								} else {
									const binaryData = inputData[0].binary;
									if (!binaryData) {
										outputItem.error = 'No binary data exists on input item';
										processError = true;
									} else {
										const binaryProperty = binaryData[binaryPropertyName];
										if (!binaryProperty) {
											outputItem.error = `Binary property "${binaryPropertyName}" not found`;
											processError = true;
										} else if (!binaryProperty.filepath) {
											outputItem.error = `Binary property "${binaryPropertyName}" does not contain a filepath`;
											processError = true;
										} else {
											audioFilePath = binaryProperty.filepath as string;
											outputItem.audioFilePath = audioFilePath;
										}
									}
								}
							} catch (binaryError) {
								outputItem.error = `Binary data error: ${binaryError.message}`;
								processError = true;
							}
						} else if (audioSource === 'filePath') {
							try {
								audioFilePath = this.getNodeParameter('audioFilePath', 0) as string;
								if (!audioFilePath) {
									outputItem.error = 'File path is empty';
									processError = true;
								} else {
									outputItem.audioFilePath = audioFilePath;
								}
							} catch (pathError) {
								outputItem.error = `File path error: ${pathError.message}`;
								processError = true;
							}
						} else {
							outputItem.error = `Invalid audio source: ${audioSource}`;
							processError = true;
						}

						// Parse additional parameters if no errors so far
						if (!processError) {
							let audioCaption = null;
							try {
								const captionValue = this.getNodeParameter('audioCaption', 0, '') as string;
								audioCaption = captionValue && captionValue.length > 0 ? captionValue : null;
								outputItem.audioCaption = audioCaption;
							} catch (error) {
								// Caption is optional, ignore errors
							}

							let reply_to_msg_id = '';
							try {
								reply_to_msg_id = this.getNodeParameter('reply_to_msg_id', 0, '') as string;
								outputItem.reply_to_msg_id = reply_to_msg_id;
							} catch (error) {
								// Reply ID is optional, ignore errors
							}

							// Check file existence
							try {
								const fs = require('fs');
								if (!fs.existsSync(audioFilePath)) {
									outputItem.error = `Audio file not found at path: ${audioFilePath}`;
									processError = true;
								} else {
									// Get file size and stats for debugging
									const stats = fs.statSync(audioFilePath);
									outputItem.fileSize = stats.size;
									outputItem.fileExists = true;

									// Check file format for voice messages
									if (sendAsVoice) {
										const fileExtension = audioFilePath.split('.').pop()?.toLowerCase();
										outputItem.fileExtension = fileExtension;

										// Telegram voice messages typically work best with .ogg format
										if (fileExtension !== 'ogg') {
											outputItem.warning = 'Voice messages work best with .ogg format. Your file is in .' + fileExtension + ' format. Consider converting to .ogg for better compatibility.';
											debug('Warning: Voice message format may not be optimal:', fileExtension);
										}

										// Check file size (Telegram has limits)
										const maxSize = 20 * 1024 * 1024; // 20MB limit
										if (stats.size > maxSize) {
											outputItem.error = `File size (${Math.round(stats.size / 1024 / 1024)}MB) exceeds Telegram's limit of 20MB for voice messages`;
											processError = true;
										}
									}
								}
							} catch (fsError) {
								outputItem.error = `File system error: ${fsError.message}`;
								processError = true;
							}
						}

						// Send the message if no errors occurred
						if (!processError) {
							try {
								// Construct the appropriate input message content based on type
								let inputMessageContent;

								if (sendAsVoice) {
									// Send as voice message with waveform
									inputMessageContent = {
										_: 'inputMessageVoiceNote',
										voice_note: {
											_: 'inputFileLocal',
											path: audioFilePath,
										},
										caption: {
											_: 'formattedText',
											text: outputItem.audioCaption,
										},
									};
								} else {
									// Send as regular audio file (music)
									inputMessageContent = {
										_: 'inputMessageAudio',
										audio: {
											_: 'inputFileLocal',
											path: audioFilePath,
										},
										caption: {
											_: 'formattedText',
											text: outputItem.audioCaption,
										},
									};
								}

								const result = await client.invoke({
									_: 'sendMessage',
									chat_id,
									reply_to_msg_id: outputItem.reply_to_msg_id,
									input_message_content: inputMessageContent,
								});

								// Update output with success
								outputItem.success = true;
								outputItem.result = result;
							} catch (apiError) {
								// Enhanced error handling with more details
								outputItem.errorDetails = {
									message: apiError.message,
									code: apiError.code,
									stack: apiError.stack,
									chat_id: chat_id,
									sendAsVoice: sendAsVoice,
									filePath: audioFilePath,
									fileSize: outputItem.fileSize
								};

								// Log detailed error information
								debug('Telegram API error details:', JSON.stringify(outputItem.errorDetails, null, 2));

								if (apiError.message.includes('User restricted receiving of video messages')) {
									outputItem.error = 'The recipient has restricted receiving of voice messages. Please try sending as a regular audio file instead.';
									outputItem.errorType = 'USER_RESTRICTION';
								} else if (apiError.message.includes('FILE_REFERENCE_EXPIRED')) {
									outputItem.error = 'File reference has expired. Please try again.';
									outputItem.errorType = 'FILE_REFERENCE_EXPIRED';
								} else if (apiError.message.includes('FILE_ID_INVALID')) {
									outputItem.error = 'Invalid file ID. Please check the file and try again.';
									outputItem.errorType = 'FILE_ID_INVALID';
								} else if (apiError.message.includes('CHAT_WRITE_FORBIDDEN')) {
									outputItem.error = 'Cannot send messages to this chat. You may not have permission.';
									outputItem.errorType = 'CHAT_WRITE_FORBIDDEN';
								} else {
									outputItem.error = `Telegram API error: ${apiError.message}`;
									outputItem.errorType = 'UNKNOWN_ERROR';
								}
							}
						}
					} catch (generalError) {
						// Catch any other unexpected errors
						outputItem.error = `General error: ${generalError.message}`;
					}

					// Always add the output item to returnData
					returnData.push(outputItem);
				} else if (operation === 'sendMessageFile') {
					const chat_id = this.getNodeParameter('chat_id', 0) as string;
					const filePath = this.getNodeParameter('filePath', 0) as string;
					let fileCaption: string | null = this.getNodeParameter('fileCaption', 0) as string;
					const reply_to_msg_id = this.getNodeParameter('reply_to_msg_id', 0) as string;
					const message_thread_id = this.getNodeParameter('message_thread_id', 0) as number;

					if (fileCaption === '' && fileCaption.length == 0) {
						fileCaption = null;
					}
					const result = await client.invoke({
						_: 'sendMessage',
						chat_id,
						reply_to_msg_id,
						message_thread_id,
						input_message_content: {
							_: 'inputMessageDocument',
							document: {
								_: 'inputFileLocal',
								path: filePath,
							},
							caption: {
								_: 'formattedText',
								text: fileCaption,
							},
						},
					});
					returnData.push(result);
				} else if (operation === 'sendMessagePhoto') {
					const chat_id = this.getNodeParameter('chat_id', 0) as string;
					const localFilePath = this.getNodeParameter('localFilePath', 0) as string;
					let photoCaption: string | null = this.getNodeParameter('photoCaption', 0) as string;
					const reply_to_msg_id = this.getNodeParameter('reply_to_msg_id', 0) as string;
					const message_thread_id = this.getNodeParameter('message_thread_id', 0) as number;

					if (photoCaption === '' && photoCaption.length == 0) {
						photoCaption = null;
					}
					const result = await client.invoke({
						_: 'sendMessage',
						chat_id,
						reply_to_msg_id,
						message_thread_id,
						input_message_content: {
							_: 'inputMessagePhoto',
							photo: {
								_: 'inputFileLocal',
								path: localFilePath,
							},
							caption: {
								_: 'formattedText',
								text: photoCaption,
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
					const message_thread_id = this.getNodeParameter('message_thread_id', 0) as number;

					const idsArray = message_ids
						.toString()
						.split(',')
						.map((s) => s.toString().trim())
						.filter((s) => s.length > 0);


					const result = await client.invoke({
						_: 'forwardMessages',
						chat_id,
						from_chat_id,
						message_ids: idsArray,
						message_thread_id,
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
			} else if(resource === 'request') {
				if (operation === 'customRequest') {
					const jsonString = this.getNodeParameter('request_json', 0)  as string;
					const obj = JSON.parse(jsonString)
					debug(`Request JSON is : ${jsonString}`);
					result = await client.invoke(obj);
					returnData.push(result);
				}
			}
		} catch (e) {
			if (e.message === "A closed client cannot be reused, create a new Client") {
				cM.markClientAsClosed(credentials?.apiId as number);
				if (this.continueOnFail())
				{
					returnData.push({ json: { message: e.message, error: e } });
				} else {
					throw new Error("Session was closed or terminated. Please login again: https://telepilot.co/login-howto") as NodeOperationError
				}
			} else 	if (e.message === "Unauthorized") {
				cM.markClientAsClosed(credentials?.apiId as number);
				if (this.continueOnFail())
				{
					returnData.push({ json: { message: e.message, error: e } });
				} else {
					throw new Error("Please login: https://telepilot.co/login-howto") as NodeOperationError
				}
			} else {
				if (this.continueOnFail())
				{
					returnData.push({ json: { message: e.message, error: e } });
				} else {
					throw(e as NodeOperationError);
				}
			}
		}
		// debug('finished execution, length=' + JSON.stringify(result).length)
		// Map data to n8n data structure
		return [this.helpers.returnJsonArray(returnData)];
	}
}
