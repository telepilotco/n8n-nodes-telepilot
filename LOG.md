# Auth concept
TBD

# Working log
## 2023-03-21

* Generated project based on template
* created simple sceleton files under nodes/TDLib and credentials/TDLib
* Generated icon using MidJourney using following query (https://www.midjourney.com/app/jobs/af9f01e5-036c-4bc5-b0e3-f13a34d132cd/):
```
    /imagine icon for Telegram tdlib node for n8n size 60x60 
```
* added UI resources
* updated package.json (nodes, credentials and git url)

* updated TDLib.credentials.ts: added api_hash, api_id and publicKey
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