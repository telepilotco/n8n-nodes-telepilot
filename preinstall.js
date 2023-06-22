#!/usr/bin/env node

"use strict";

function execShellCommand(cmd) {
	const exec = require('child_process').exec;
	return new Promise((resolve, reject) => {
		console.log("executing " + cmd)
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				console.warn(error);
			}
			resolve(stdout? stdout : stderr);
		});
	});
}

async function run(callback) {
	console.log(process.platform)
	console.log(process.arch)
	const value = await execShellCommand("npm pkg set dependencies.prebuilt-tdlib=\"*\"");
	// sdfdsfsd
}


var actions = {
	"run": run,
};


var argv = process.argv;
if (argv && argv.length > 2) {
	var cmd = process.argv[2];
	if (!actions[cmd]) {
		console.log("Invalid command. `run` is the only supported commands");
		process.exit(1);
	}

	actions[cmd](function (err) {
		if (err) {
			console.error(err);
			process.exit(1);
		} else {
			process.exit(0);
		}
	});
}
