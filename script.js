const fs = require("fs");

const accounts = fs.readFileSync("config/accounts.txt").toString().split("\r\n");
const config = JSON.parse(fs.readFileSync("config/config.json"));
const params = fs.readFileSync("config/launch-options.txt").toString();

let accsLim;

if(config.accountWidthLimit <= 0){
	accsLim = Math.floor(config.screenWidth / (config.windowWidth + 5));
}
else{
	accsLim = config.accountWidthLimit;
}

var batLines = ["@echo off"];
var currentWidth = 0;
var currentHeight = 0;
var accsCounter = 1;

for (let i = 0; i < accounts.length; i++){

	if (accsCounter <= accsLim){
		let accData = accounts[i].split(":");
		batLines[i + 1] = `start "" "${config.steamPath}" -noreactlogin -login ${accData[0]} ${accData[1]} -no-browser -applaunch 730 ${params} +exec boost.cfg -x ${currentWidth} -y ${currentHeight}`;
		currentWidth += (config.windowWidth + config.windowsGap);
		accsCounter++;
	}else{
		accsCounter = 1;
		currentHeight += (config.windowHeight + config.windowsGap);
		currentWidth = 0;
		i--;
	}
}

let bat = batLines.join("\n");

let boostCfg = `fps_max 1 \nm_rawinput 0 \n+left;+right \nmat_setvideomode ${config.windowWidth} ${config.windowHeight} 0\nbind "f3" "disconnect"`

fs.writeFileSync("output/batch.bat", bat);
fs.writeFileSync("output/boost.cfg", boostCfg);

console.log("success");