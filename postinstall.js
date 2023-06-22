#!/usr/bin/env node

"use strict";

var path = require('path'),
	mkdirp = require('mkdirp'),
	fs = require('fs');

// Mapping from Node's `process.arch` to Golang's `$GOARCH`
var ARCH_MAPPING = {
	"ia32": "386",
	"x64": "amd64",
	"arm": "arm",
	"arm64": "arm64"
};

// Mapping between Node's `process.platform` to Golang's
var PLATFORM_MAPPING = {
	"darwin": "darwin",
	"linux": "linux",
};

function validateConfiguration(packageJson) {

	if (!packageJson.version) {
		return "'version' property must be specified";
	}

	if (!packageJson.bridgeBinary || _typeof(packageJson.bridgeBinary) !== "object") {
		return "'bridgeBinary' property must be defined and be an object";
	}

	if (!packageJson.bridgeBinary.name) {
		return "'name' property is necessary";
	}

	if (!packageJson.bridgeBinary.path) {
		return "'path' property is necessary";
	}


	if (!packageJson.libBinary || _typeof(packageJson.libBinary) !== "object") {
		return "'libBinary' property must be defined and be an object";
	}

	if (!packageJson.libBinary.name) {
		return "'name' property is necessary";
	}

	if (!packageJson.libBinary.path) {
		return "'path' property is necessary";
	}
}

function parsePackageJson() {
	if (!(process.arch in ARCH_MAPPING)) {
		console.error("Installation is not supported for this architecture: " + process.arch);
		return;
	}

	if (!(process.platform in PLATFORM_MAPPING)) {
		console.error("Installation is not supported for this platform: " + process.platform);
		return;
	}

	var packageJsonPath = path.join(".", "package.json");
	if (!fs.existsSync(packageJsonPath)) {
		console.error("Unable to find package.json. " + "Please run this script at root of the package you want to be installed");
		return;
	}

	var packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
	var error = validateConfiguration(packageJson);
	if (error && error.length > 0) {
		console.error("Invalid package.json: " + error);
		return;
	}

	// We have validated the config. It exists in all its glory
	var binName = packageJson.bridgeBinary.name;
	var binPath = packageJson.bridgeBinary.path;
	var version = packageJson.version;
	if (version[0] === 'v') version = version.substr(1); // strip the 'v' if necessary v0.0.1 => 0.0.1

	// Binary name on Windows has .exe suffix
	if (process.platform === "win32") {
		binName += ".exe";
	}


	return {
		binName: binName,
		binPath: binPath,
		version: version
	};
}


async function installDependency() {

	//telepilot-binaries-linux-x64 (glibc/musl)
	//	glibc
	//	musl
	//telepilot-binaries-linux-arm64 (glibc/musl)
	//	glibc
	//	musl

	//telepilot-binaries-macos-arm64
	//telepilot-binaries-macos-arm64
	const value = await execShellCommand("cd .. ; npm install prebuilt-tdlib");

	console.log(value);
}

/**
 * Reads the configuration from application's package.json,
 * validates properties, copied the binary from the package and stores at
 * ./bin in the package's root. NPM already has support to install binary files
 * specific locations when invoked with "npm install -g"
 *
 *  See: https://docs.npmjs.com/files/package.json#bin
 */
var INVALID_INPUT = "Invalid inputs";
async function install(callback) {

	// var opts = parsePackageJson();
	// if (!opts) return callback(INVALID_INPUT);

	await installDependency()
	//
	// mkdirp.sync(opts.binPath);
	// console.info(`Copying the relevant binary for your platform ${process.platform}`);
	// const src= `./dist/example-cli-${process.platform}-${ARCH_MAPPING[process.arch]}_${process.platform}_${ARCH_MAPPING[process.arch]}/${opts.binName}`;
	// await execShellCommand(`cp ${src} ${opts.binPath}/${opts.binName}`);
	// await verifyAndPlaceBinary(opts.binName, opts.binPath, callback);


}

async function uninstall(callback) {
	// var opts = parsePackageJson();
	// try {
	// 	const installationPath = await getInstallationPath();
	// 	fs.unlink(path.join(installationPath, opts.binName),(err)=>{
	// 		if(err){
	// 			return callback(err);
	// 		}
	// 	});
	// } catch (ex) {
	// 	// Ignore errors when deleting the file.
	// }
	// console.info("Uninstalled cli successfully");
	// return callback(null);
}

// Parse command line arguments and call the right method
var actions = {
	"install": install,
	"uninstall": uninstall
};
/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
function execShellCommand(cmd) {
	const exec = require('child_process').exec;
	return new Promise((resolve, reject) => {
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				console.warn(error);
			}
			resolve(stdout? stdout : stderr);
		});
	});
}

var argv = process.argv;
if (argv && argv.length > 2) {
	var cmd = process.argv[2];
	if (!actions[cmd]) {
		console.log("Invalid command. `install` and `uninstall` are the only supported commands");
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
