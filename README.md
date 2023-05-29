# n8n-nodes-telepilot

[![npm version](https://badge.fury.io/js/n8n-nodes-telepilot.svg)](https://badge.fury.io/js/n8n-nodes-telepilot)

## Overview

`n8n-nodes-telepilot` is a module for the n8n automation engine that utilizes the provides full ability to interact with Telegram servers with your User. 
It allows creating Userbots within n8n and provides all the possibilities of a normal client along with n8n automation.

## Features

- Interact with channels and groups:
	- Interact with other users
	- Scrape data
	- Moderating groups
- Respond to private messages: Userbots can respond to private messages from other users, allowing for automated answers.
- Schedule messages: Userbots can schedule messages using the Telegram native feature.
- Get more API events: Userbots can receive API events that normal bots don't know about, such as when a message gets deleted through the client.


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
