function upm(_url) {
	this.url = _url;
	this.host = _url.split("?")[0];
	this.args = {};

	let query = _url.split("?")[1];
	for (let i = 0, queries = query.split("&"); i < queries.length; i++) {
		let q = queries[i];
		if (q != "") {
			let keyVal = q.split("=");
			if (!(keyVal[0] in this.args)) {
				this.args[keyVal[0]] = q.split(keyVal[0] + "=")[1];
			}
		}
	}
}

upm.prototype.getArgs = function() {
	return this.args;
}

upm.prototype.addArg = function(arg, value) {
    this.args[arg] = value;
}

upm.prototype.removeArg = function(arg) {
	let aKeys = Object.keys(this.args);
	if (aKeys.indexOf(arg) > -1) {
		aKeys.splice(aKeys.indexOf(arg), 1);

		let newArgs = {};
		for (let i = 0; i < aKeys.length; i++) {
			newArgs[aKeys[i]] = this.args[aKeys[i]];
		}
		this.args = newArgs;
	} else {
		return this.args;
	}
}

upm.prototype.getParams = function() {
	let params = "?";
	for (let i = 0, keys = Object.keys(this.args); i < keys.length; i++) {
		params += keys[i] + "=" + this.args[keys[i]] + (i != keys.length - 1 ? "&" : "");
	}
	return params;
}

upm.prototype.getUrl = function() {
	return this.host + this.getParams();
}

module.exports = upm;