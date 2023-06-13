import {INodePropertyOptions} from "n8n-workflow/dist/Interfaces";

export const TDLibUpdateEvents: INodePropertyOptions[] = [
		// {
		// 	name: "AuthorizationState",
		// 	value: "updateAuthorizationState"
		// },
		{
			name: "NewMessage",
			value: "updateNewMessage"
		},
		{
			name: "MessageSendAcknowledged",
			value: "updateMessageSendAcknowledged"
		},
		{
			name: "MessageSendSucceeded",
			value: "updateMessageSendSucceeded"
		},
		{
			name: "MessageSendFailed",
			value: "updateMessageSendFailed"
		},
		{
			name: "MessageContent",
			value: "updateMessageContent"
		},
		{
			name: "MessageEdited",
			value: "updateMessageEdited"
		},
		{
			name: "MessageIsPinned",
			value: "updateMessageIsPinned"
		},
		{
			name: "MessageInteractionInfo",
			value: "updateMessageInteractionInfo"
		},
		{
			name: "MessageContentOpened",
			value: "updateMessageContentOpened"
		},
		{
			name: "MessageMentionRead",
			value: "updateMessageMentionRead"
		},
		{
			name: "MessageUnreadReactions",
			value: "updateMessageUnreadReactions"
		},
		{
			name: "MessageLiveLocationViewed",
			value: "updateMessageLiveLocationViewed"
		},
		{
			name: "NewChat",
			value: "updateNewChat"
		},
		{
			name: "ChatTitle Updated",
			value: "updateChatTitle"
		},
		{
			name: "ChatPhoto Updated",
			value: "updateChatPhoto"
		},
		{
			name: "ChatPermissions Updated",
			value: "updateChatPermissions"
		},
		// {
		// 	name: "ChatLastMessage",
		// 	value: "updateChatLastMessage"
		// },
		// {
		// 	name: "ChatPosition Updated",
		// 	value: "updateChatPosition"
		// },
		{
			name: "ChatReadInbox",
			value: "updateChatReadInbox"
		},
		{
			name: "ChatReadOutbox",
			value: "updateChatReadOutbox"
		},
		{
			name: "ChatActionBar",
			value: "updateChatActionBar"
		},
		{
			name: "ChatAvailableReactions",
			value: "updateChatAvailableReactions"
		},
		{
			name: "ChatDraftMessage",
			value: "updateChatDraftMessage"
		},
		{
			name: "ChatMessageSender",
			value: "updateChatMessageSender"
		},
		{
			name: "ChatMessageTtl",
			value: "updateChatMessageTtl"
		},
		{
			name: "ChatNotificationSettings",
			value: "updateChatNotificationSettings"
		},
		{
			name: "ChatPendingJoinRequests",
			value: "updateChatPendingJoinRequests"
		},
		{
			name: "ChatReplyMarkup",
			value: "updateChatReplyMarkup"
		},
		{
			name: "ChatTheme",
			value: "updateChatTheme"
		},
		// {
		// 	name: "ChatUnreadMentionCount",
		// 	value: "updateChatUnreadMentionCount"
		// },
		// {
		// 	name: "ChatUnreadReactionCount",
		// 	value: "updateChatUnreadReactionCount"
		// },
		{
			name: "ChatVideoChat",
			value: "updateChatVideoChat"
		},
		{
			name: "ChatDefaultDisableNotification",
			value: "updateChatDefaultDisableNotification"
		},
		{
			name: "ChatHasProtectedContent",
			value: "updateChatHasProtectedContent"
		},
		{
			name: "ChatHasScheduledMessages",
			value: "updateChatHasScheduledMessages"
		},
		{
			name: "ChatIsBlocked",
			value: "updateChatIsBlocked"
		},
		{
			name: "ChatIsMarkedAsUnread",
			value: "updateChatIsMarkedAsUnread"
		},
		{
			name: "ChatFilters",
			value: "updateChatFilters"
		},
		{
			name: "ChatOnlineMemberCount",
			value: "updateChatOnlineMemberCount"
		},
		// {
		// 	name: "ScopeNotificationSettings",
		// 	value: "updateScopeNotificationSettings"
		// },
		{
			name: "Notification",
			value: "updateNotification"
		},
		{
			name: "NotificationGroup",
			value: "updateNotificationGroup"
		},
		{
			name: "ActiveNotifications",
			value: "updateActiveNotifications"
		},
		{
			name: "HavePendingNotifications",
			value: "updateHavePendingNotifications"
		},
		{
			name: "DeleteMessages",
			value: "updateDeleteMessages"
		},
		{
			name: "ChatAction",
			value: "updateChatAction"
		},
		{
			name: "UserStatus",
			value: "updateUserStatus"
		},
		{
			name: "User",
			value: "updateUser"
		},
		{
			name: "BasicGroup",
			value: "updateBasicGroup"
		},
		{
			name: "Supergroup",
			value: "updateSupergroup"
		},
		{
			name: "SecretChat",
			value: "updateSecretChat"
		},
		{
			name: "UserFullInfo",
			value: "updateUserFullInfo"
		},
		{
			name: "BasicGroupFullInfo",
			value: "updateBasicGroupFullInfo"
		},
		{
			name: "SupergroupFullInfo",
			value: "updateSupergroupFullInfo"
		},
		{
			name: "ServiceNotification",
			value: "updateServiceNotification"
		},
		{
			name: "File",
			value: "updateFile"
		},
		{
			name: "FileGenerationStart",
			value: "updateFileGenerationStart"
		},
		{
			name: "FileGenerationStop",
			value: "updateFileGenerationStop"
		},
		{
			name: "FileDownloads",
			value: "updateFileDownloads"
		},
		{
			name: "FileAddedToDownloads",
			value: "updateFileAddedToDownloads"
		},
		{
			name: "FileDownload",
			value: "updateFileDownload"
		},
		{
			name: "FileRemovedFromDownloads",
			value: "updateFileRemovedFromDownloads"
		},
		{
			name: "Call",
			value: "updateCall"
		},
		{
			name: "GroupCall",
			value: "updateGroupCall"
		},
		{
			name: "GroupCallParticipant",
			value: "updateGroupCallParticipant"
		},
		{
			name: "NewCallSignalingData",
			value: "updateNewCallSignalingData"
		},
		{
			name: "UserPrivacySettingRules",
			value: "updateUserPrivacySettingRules"
		},
		{
			name: "UnreadMessageCount",
			value: "updateUnreadMessageCount"
		},
		{
			name: "UnreadChatCount",
			value: "updateUnreadChatCount"
		},
		{
			name: "Option",
			value: "updateOption"
		},
		{
			name: "StickerSet",
			value: "updateStickerSet"
		},
		{
			name: "InstalledStickerSets",
			value: "updateInstalledStickerSets"
		},
		{
			name: "TrendingStickerSets",
			value: "updateTrendingStickerSets"
		},
		{
			name: "RecentStickers",
			value: "updateRecentStickers"
		},
		{
			name: "FavoriteStickers",
			value: "updateFavoriteStickers"
		},
		{
			name: "SavedAnimations",
			value: "updateSavedAnimations"
		},
		{
			name: "SavedNotificationSounds",
			value: "updateSavedNotificationSounds"
		},
		{
			name: "SelectedBackground",
			value: "updateSelectedBackground"
		},
		{
			name: "ChatThemes",
			value: "updateChatThemes"
		},
		{
			name: "LanguagePackStrings",
			value: "updateLanguagePackStrings"
		},
		{
			name: "ConnectionState",
			value: "updateConnectionState"
		},
		{
			name: "TermsOfService",
			value: "updateTermsOfService"
		},
		{
			name: "UsersNearby",
			value: "updateUsersNearby"
		},
		{
			name: "AttachmentMenuBots",
			value: "updateAttachmentMenuBots"
		},
		{
			name: "WebAppMessageSent",
			value: "updateWebAppMessageSent"
		},
		{
			name: "Reactions",
			value: "updateReactions"
		},
		{
			name: "DiceEmojis",
			value: "updateDiceEmojis"
		},
		{
			name: "AnimatedEmojiMessageClicked",
			value: "updateAnimatedEmojiMessageClicked"
		},
		{
			name: "AnimationSearchParameters",
			value: "updateAnimationSearchParameters"
		},
		{
			name: "SuggestedActions",
			value: "updateSuggestedActions"
		},
		{
			name: "NewInlineQuery",
			value: "updateNewInlineQuery"
		},
		{
			name: "NewChosenInlineResult",
			value: "updateNewChosenInlineResult"
		},
		{
			name: "NewCallbackQuery",
			value: "updateNewCallbackQuery"
		},
		{
			name: "NewInlineCallbackQuery",
			value: "updateNewInlineCallbackQuery"
		},
		{
			name: "NewShippingQuery",
			value: "updateNewShippingQuery"
		},
		{
			name: "NewPreCheckoutQuery",
			value: "updateNewPreCheckoutQuery"
		},
		{
			name: "NewCustomEvent",
			value: "updateNewCustomEvent"
		},
		{
			name: "NewCustomQuery",
			value: "updateNewCustomQuery"
		},
		{
			name: "Poll",
			value: "updatePoll"
		},
		{
			name: "PollAnswer",
			value: "updatePollAnswer"
		},
		{
			name: "ChatMember",
			value: "updateChatMember"
		},
		{
			name: "NewChatJoinRequest",
			value: "updateNewChatJoinRequest"
		}
];

