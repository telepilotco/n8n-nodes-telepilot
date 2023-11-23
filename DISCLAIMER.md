# Just For Your Information

 - this project is using official Telegram's "tdlib" library: https://github.com/tdlib/td
 - this project is using "bannerets-tdl" node native bindings for "tdlib": https://github.com/Bannerets/tdl
   - parts of bannerets-tdl have been simply copied to current source tree to make distribution more simple
   - the issue is that some self-hosted n8n installations are not able to run `node-gyp` because of missing tools, and 
     including library as dependency would trigger `node-gyp` build
