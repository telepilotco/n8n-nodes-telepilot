# Project information
## Purpose
`n8n-nodes-tdlib` is module for n8n automation engine that utilizes the TDLib library 
and provider full ability to interact with Telegram servers with your User.
It allows creating Userbots within N8N and get all the possibilities of a normal client + N8N automation: 
with the current Telegram node only bots can be created, with several limitations.

## Use-cases
1. Interact with channels and groups: a Userbot can join/read channels and groups and 
    * interact with other users: TBD actions??
    * scrape data: TBD download file or media
    * moderating groups: TBD actions??
    * ...
2. Respond to private messages: Unlike normal bots, Userbots can respond to private messages from other users. This can be useful for creating automated answers.
3. Schedule messages: Userbots can schedule messages using the Telegram native feature.
4. Get more API events: for example bots don’t know when 
    * message gets deleted through the client

## Actions:
 * +listen for updates
 * send message
    * reply to message
 * download file or media
 * react to message


# Auth concept
To initiate MTProto connection with Telegam servers, user will need to provide following things:
 - `api_id` - obtained after registering application via Telegram core
 - `api_hash` - obtained after registering application via Telegram core
 - `phone_number` - number that was used when registering Telegram account
 - `auth_code` - Telegram will authorize the user via 2FA and will send authorization code either to Chat, SMS, or via Email

## Onboarding new user
To use MTProto via tdlib, user will need to create an application. To get this, she will need to:
 - Log in to your Telegram core: https://my.telegram.org.
 - Go to [API development tools](https://my.telegram.org/apps) and fill out the form.
 - Receive basic addresses as well as the `api_id` and `api_hash` parameters required for user authorization.

Note: For the moment each number can only have one `api_id` connected to it.

## Testing
Each phone number is limited to only a certain amount of logins per day (e.g. 5, but this is subject to change) after which the API will return a FLOOD error until the next day. This might not be enough for testing the implementation of User Authorization flows in client applications.
In order to emulate an application of a user associated with DC number X, it is sufficient to specify the phone number as `99966XYYYY`, where YYYY are random numbers, when registering the user. A user like this would always get XXXXX as the login confirmation code (the DC number, repeated five times). The value of X must be in the range of 1-3 because there are only 3 Test DCs. When the flood limit is reached for any particular test number, just choose another number (changing the YYYY random part).

To activate this, `tdlib`'s `Client` should be initialized with `ClientOptions.useTestDc: true`.

# Programming project - working journal
## 2023-03-21

* Generated project based on template
* created simple sceleton files under `nodes/TDLib` and `credentials/TDLib`
* Generated icon using MidJourney using following query (https://www.midjourney.com/app/jobs/af9f01e5-036c-4bc5-b0e3-f13a34d132cd/):
```
    /imagine icon for Telegram tdlib node for n8n size 60x60 
```
* added UI resources
* updated package.json (nodes, credentials and git url)

* updated `TDLib.credentials.ts`: added api_hash, api_id and publicKey
* searching which nodejs tdlib binding library to use
* trying https://github.com/airgram/airgram
    * building tdlib locally by following guide https://tdlib.github.io/td/build.html?language=JavaScript
    * configuring "airgram" dependency in package.json //TBD: check dependency VS devDependency
    * added install.sh script
    * installed node-gyp
    * installing XCode 14.2 from AppStore - CANCELLED TBD
    * followed this guide: https://github.com/nodejs/node-gyp/blob/main/macOS_Catalina.md#i-did-all-that-and-the-acid-test-still-does-not-pass--
        * waiting for developer tools to install
        * this might be the bug: https://github.com/node-ffi-napi/node-ffi-napi/issues/118
        * I updated ffi-napi to 4.0.1 in airgram/packages/airgram/package.json
        * cannot publish airgram locally with new ffi-napi=4.0.1 dependency, giving up
* trying https://github.com/Bannerets/tdl
    * run this: npm install tdl tdl-tdlib-addon
    * run this: npm install -D tdlib-types@td-1.8.5
    * copied *.dylib from tdlib/td/build into examples/ (copied `libtdjson.dylib` and `libtdjson.1.8.12.dylib`)
    * was able to run examples/get-chats.js locally
    * it asked for phone number and confirmation code (TBD: auth needs to be implemented)

## 2023-03-22
* looking into how to implement credentials test for Telegram in n8n
* looks like this is not possible without modifying n8n core, because `ICredentialType.test` object is having type `ICredentialTestRequest`, which holds variable `request` which is of type `DeclarativeRestApiSettings.HttpRequestOptions`, see [link](https://github.com/n8n-io/n8n/blob/5dda3f2c61b107ec24557c4bf7de284234e406ab/packages/workflow/src/Interfaces.ts#L311)
    * n8n seems to be supporting only Http requests and is tailored to work with REST aPIs
* I'm checking whether n8n is able to work with some streaming protocols like Websocker or other tcp/ip-based persistence protocols

## 2023-03-23
* renamed classes to avoid naming collision with bannerets-tdl lib
* added `methods.credentialTest` to `TelegramTDLib:INodeType`, but getting `No testing function found for this credential.` message in UI then saving credentials
    * looking into n8n source code to find out why test function is not being recognized
    * it looks that credentials and nodes information is being loaded from `dist/types` folder of n8n project [link]()
    * most probably entry in theses files is missing:  (TBD open bug ticket)
        - `/opt/homebrew/lib/node_modules/n8n/node_modules/n8n-nodes-base/dist/known/credentials.json`
        - `/opt/homebrew/lib/node_modules/n8n/node_modules/n8n-nodes-base/dist/types/nodes.json`
    * .. somtehing else is missing - it still does not work
    * I wil move my Node and Credentials into n8n project to simplify things
    * trying to run n8n from local git setup - it works using `npm start`
    * copied nodes, credentials files to `nodes-base` package and updated `nodes-base/package.json`
    * problems intializing `TDLib` from `tdl-tdlib-addon` TBD
    * able to initialize `Client` with workarounds (hardcoding `libraryFile` and `addonPath`)

## 2023-03-24
 * looking into how to work with Telegram maintaining only one connection
 * Spent lots of time until discowered that by default, `own` mode is used and
    each workflow is executed in newly spawned `node` process which makes object sharing impossible

## 2023-03-27
 * run n8n in `EXECUTIONS_PROCESS=main` mode
 * checking if singleton/typedi issues are solved

## 2023-03-29
    * read Feature Request about Docuware/Square9 content management integration: https://community.n8n.io/t/is-there-any-body-working-on-a-docuware-integration/24563/1
    * telegram limits: https://limits.tginfo.me/en

## 2023-03-30
    * Added getChat, getChatHistory, getSupergroupFullInfo to Telegram TDLibNode
    * scraped information about all channels/chats
    * scrapping chat messages via getChatHistory Node

## 2023-04-12
    * recreating Telegram TDLib node that was accidentally deleted

        cd packages/nodes-base
        pnpm install tdl tdl-tdlib-addon tdlib-types

## 2023-04-14
    * playing with binary files: adjusted run.sh to build td.node dynamically so it can be fetched from default path `../build/Release/bridge.node`
    * investigating how to pre-build arm64 tdlib in github
    * working on `prebuilt-tdlib-m1` (form of `tdl/packages/prebuilt-tdlib`)
    * `prebuilt-tdlib-m1` is being built locally and used in `n8n-tdlib-node`, all good
    


## 2023-05-15
	* using QR code for auth
	* extracting TDLib node from n8n into installable community node

## 2023-05-16
	* logging in, closing session and deleting database is working in community node
	* TODO: handle connection correctly, when session was already initiated and user is already logged in

## 2023-05-19
	* project is built and published in npm-registry
	* using Verdaccio private npm registry:
```
		docker pull verdaccio/verdaccio
		docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio

		npm config set registry http://0.0.0.0:4873/	
		npm adduser
		npm login
```
	* TODO: fix built on linux-x64:
```
	npm install prebuilt-tdlib
	cp node_modules/prebuilt-tdlib/prebuilds/tdlib-linux-x64/libtdjson.so prebuilds/tdlib/`uname -s | tr '[:upper:]' '[:lower:]'`-`uname -m`.dylib

	echo "registry=http://0.0.0.0:4873/" > ~/.npmrc
	echo "//0.0.0.0:4873/:_authToken=\"2Whgztawlk4WMZB7VdqGVA==\"" >> ~/.npmrc

```
	* TODO: test on x64 running without docker, with npm-globally install n8n


## 2023-05-22
	* adding x64 libs
	* community node is working on x64 linux!

## 2023-05-25
	* having issues recompiling td.node after adding HttpRequest to it

## 2023-05-26
	* issues solved, I am able to recompile td.node and td (prebuild folders need to be deleted)
	* added license check to td.node - HTTP call to ls.telepilot.co:4413
	* check is done every minute, if it fails - Telegram Client is disconnected, after 20 minutes Telegram is disconneceted
	* updated Credentials and added CredentialTest request
	* changed td and td.node to make them ABI-incompatible with open-source versions: added small check to `td_json_client_create`
	* fixing build on linux-x64