# n8n-nodes-telepilot

[![npm version](https://badge.fury.io/js/n8n-nodes-telepilot.svg)](https://badge.fury.io/js/n8n-nodes-telepilot)

## Overview

`n8n-nodes-telepilot is a module for the n8n automation engine that provides the ability to configure your personal Telegram assistant. 
It works alongside your main client, allowing you to interact with Telegram servers and see all the messages you can see, 
while also enabling your assistant to react to those messages.

With `n8n-nodes-telepilot`, you can enhance your Telegram user experience by automating various actions and responses. 
Your personal Telegram Co-Pilot acts as real-time assistant, providing additional functionalities and making your Telegram usage more efficient.

## Features

- Interact with other users
- Respond to private messages: Co-Pilot can respond to private messages from other users, allowing for automated answers
- Interact with channels and groups:
	- Download messages
	- Topic Notification: Stay updated on specific topics of interest by receiving notifications when they are being discussed in Telegram. 
    Configure your personal Telegram assistant to monitor and alert you whenever a particular topic is mentioned.
	- Keyword Notification: Never miss important messages by setting up keyword notifications.
    Define specific words or phrases that you are interested in, and your Telegram assistant will notify you whenever those keywords are posted in any message. 
    Stay informed and engaged with the conversations that matter to you.
	- Moderating groups
  - Schedule message posting: you can schedule messages using your Telegram Co-Pilot
- Get more API events: Telepilot can receive API events that normal bots don't know about, such as when a message gets deleted through the client.


## Installation

To use this package in your n8n project, follow these steps:

1. Go to Settings -> Community modules of your self-hosted n8n instance
2. Select "Install Community node"
3. specify the name `n8n-nodes-telepilot`, click checkbox that you understand the risks and click "Install"

## Configuration

### Credentials

To initiate connection with Telegram servers, you need to provide the following credentials:
- `api_id`: obtained after registering an application via Telegram core.
- `api_hash`: obtained after registering an application via Telegram core.
- `phone_number`: the number used when registering the Telegram account.
- `license_code`: if you neeed one, write us an email at contact@telepilot.co


## Usage
This package provides various nodes and actions that allow you to interact with Telegram servers and enhance the Telegram user experience. 
Please refer to the n8n Documentation for detailed information on each node and its usage.
May you have any questions, reach out to us: contact@telepilot.co

## License
This project is licensed under the CC BY-NC-ND license.
