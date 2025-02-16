let modInfo = {
	name: "The Generic Tree",
	author: "yyyy7089",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "TGT Official Discord Server",
	discordLink: "https://discord.gg/R6hNx75skd",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 168,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "α1",
	name: "Test Build 1",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>vα1</h3><br>
		- Added things. yes. that's it.<br>`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if(hasUpgrade('p', 11)) gain = gain.add(new Decimal(1));
	if(hasUpgrade('p', 12)) gain = gain.add(new Decimal(1));
	if(hasUpgrade('p', 13)) gain = gain.add(new Decimal(1));
	if(hasUpgrade('p', 14)) gain = gain.add(new Decimal(1));
	if(getBuyableAmount('p', 11).gt(0)) gain = gain.add(buyableEffect('p', 11))

	if(hasUpgrade('p', 21)) gain = gain.mul(new Decimal("1.25"));
	if(hasUpgrade('p', 22)) gain = gain.mul(new Decimal("1.25"));
	if(hasUpgrade('p', 23)) gain = gain.mul(new Decimal("1.25"));
	if(hasUpgrade('p', 24)) gain = gain.mul(new Decimal("1.25"));
	if(getBuyableAmount('p', 12).gt(0)) gain = gain.mul(buyableEffect('p', 12))

	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}