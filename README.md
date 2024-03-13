# n8n-nodes-telepilot

[![npm version](https://badge.fury.io/js/@telepilotco%2Fn8n-nodes-telepilot.svg)](https://www.npmjs.com/package/@telepilotco/n8n-nodes-telepilot)

## Beta testing

Current build does not have all Telegram actions implemented and does not work on all n8n installations.

Here is environment compatibility overview:

|     OS | architecture | supported? |
|--------|--------------|------|
| docker | x64 | YES  |
| docker | arm64 | YES   |
| linux | x64 | YES     |
| linux | arm64 | YES   |
| macos | x64 | YES     |
| macos | arm64 | YES  |
| windows | x64 | NO  |
| windows | arm64 | NO  |

If you are interested in following our updates and news, check out:

- our telegram channel https://t.me/telepilotco OR
- our website https://telepilot.co


## Overview

`@telepilotco/n8n-nodes-telepilot` is a node for the n8n automation engine that provides the ability to configure your personal Telegram assistant. 
It works alongside your main client, allowing you to interact with Telegram servers and see all the messages you can see, 
while also enabling your assistant to react to those messages.

With `@telepilotco/n8n-nodes-telepilot`, you can enhance your Telegram user experience by automating various actions and responses. 
Your personal Telegram CoPilot acts as real-time assistant, providing additional functionalities and making your Telegram usage more efficient.

At [TelePilot](https://telepilot.co), we prioritize your privacy. We do not have access to your Telegram messages because you have full control over your personal instance of TelePilot, 
which runs on your self-hosted n8n instance. The choice of hosting environment is entirely up to you. 

Whether you prefer the convenience of cloud hosting or the control of running it on your own machine, TelePilot allows you to make that decision. 

Probably the fastest way to get everything up and running would be using Railway n8n template:

 - [Railway](https://railway.app/new/template/zo8wVU)

If you are technically inclined, you can even launch it on your homelab or Raspberry Pi. 
For a hassle-free experience, take one of these templates for self-hosting:

 - [n8n on Cloudron](https://www.cloudron.io/store/io.n8n.cloudronapp.html)
 - [YunoHost](https://yunohost.org/en/app_n8n) / [YunoHost n8n app on github](https://github.com/YunoHost-Apps/n8n_ynh)
 - https://timeweb.cloud/ ?

## Features

- Interact with other users
- Respond to private messages: CoPilot can respond to private messages from other users, allowing for automated answers
- Interact with channels and groups:
	- Download messages
	- Topic Notification: Stay updated on specific topics of interest by receiving notifications when they are being discussed in Telegram. 
    Configure your [personal Telegram assistant](https://telepilot.co) to monitor and alert you whenever a particular topic is mentioned.
	- Keyword Notification: Never miss important messages by setting up keyword notifications.
    Define specific words or phrases that you are interested in, and your Telegram assistant will notify you whenever those keywords are posted in any message. 
    Stay informed and engaged with the conversations that matter to you.
	- Moderating groups
  - Schedule message posting: you can schedule messages using your Telegram CoPilot
- Get more API events: Telepilot can receive API events that normal bots don't know about, such as when a message gets deleted through the client.


## Installation

### Install as n8n community node

To use this package in your n8n project, follow these steps:

1. Go to Settings -> Community modules of your self-hosted n8n instance
2. Select "Install Community node"
3. Specify the name `@telepilotco/n8n-nodes-telepilot`, click checkbox that you understand the risks and click "Install"

![Install Telepilot as n8n Community Node](https://telepilot.co/documentation-images/install-community-node-1.png)

### Manual installation

To get started install the package in your `~/.n8n/nodes` directory:

`npm install @telepilotco/n8n-nodes-telepilot`

For Docker-based deployments, add the following line before the font installation command in your [n8n Dockerfile](https://github.com/n8n-io/n8n/blob/master/docker/images/n8n/Dockerfile):

`RUN cd ~/.n8n/ && mkdir nodes && cd nodes && npm install @telepilotco/n8n-nodes-telepilot`

## TelePilot setup

### Connect TelePilot with your Telegram Account
![Connect Telepilot with your Telegram Account](https://telepilot.co/documentation-images/telegram-api-1.png)

- Log in to your Telegram core: https://my.telegram.org with your phone number that you wish to use TelePilot with
- Go to [API development tools](https://my.telegram.org/apps) and fill out the form:
  - App title: `telepilot`
  - Short name: `telepilot`
- Receive basic addresses as well as the `api_id` and `api_hash` parameters required for user authorization.

### Create Credentials in your n8n instance

Access the credentials UI by opening the left menu and selecting **Credentials**.

![Configure TelePilot Credentials](https://telepilot.co/documentation-images/credentials-0.png)

Click on "Add Credential" button and browse for "Personal Telegram CoPilot API".

To initiate connection with Telegram servers, you need to provide following:
- `api_id`: copy-paste it from https://my.telegram.org/apps page
- `api_hash`: copy-paste it from https://my.telegram.org/apps page

![Configure TelePilot Credentials](https://telepilot.co/documentation-images/credentials-1.png)

After you have filled out all fields, click on "Save" and make sure that you see "Connection tested successfully" message.

![Configure TelePilot Credentials](https://telepilot.co/documentation-images/credentials-2.png)

## Login

Once the credentials are set up, you need to log in.
This is accomplished by authorizing Telepilot using your Telegram account via a QR code scan.

For more detailed information, please refer to our login guide: https://telepilot.co/login-howto


### Import workflows

You can import predefined workflows that we have created for you, check out [this page](https://telepilot.co/workflows)


## Troubleshooting

You can enable DEBUG logs by running n8n with env variables, here is how you do it in cli:

```shell
DEBUG=tdl,tdl:client,telepilot-cred,telepilot-node,telepilot-trigger,telepilot-cm N8N_LOG_LEVEL=debug npx n8n
```

For dockerized setup, make sure you add these env variables to your docker container or docker compose


## Usage

This package provides various nodes and actions that allow you to interact with Telegram servers and enhance the Telegram user experience. 
Please refer to the n8n Documentation for detailed information on each node and its usage.
May you have any questions, reach out to per email (contact@telepilot.co) or in our [Telegram Group](https://t.me/telepilotco_group)

## License

This project is licensed under the CC BY-NC-ND license.
