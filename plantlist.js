Module.register("plantlist",{
	// Default module config.
	defaults: {
		text: "Hello World!",

		animationSpeed: 1000,

		updateInterval: 3000,
		initialLoadDelay: 0,

		apiBase: 'https://plm.flexngate-mi.com/api/',
		apiVersion: 'v1',
		endPoint: 'plants'
	},

	start: function()
	{
		Log.info("Starting module: " + this.name);

		this.scheduleUpdate(this.config.initialLoadDelay);
	},

	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update. If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}

		var self = this;
		setTimeout(function() {
			self.updatePlants();
		}, nextLoad);
	},

	updatePlants: function()
	{

		/*if (this.config.appid === "") {
			Log.error("CurrentWeather: APPID not set!");
			return;
		}*/

		var url = this.config.apiBase + this.config.apiVersion + "/" + this.config.endPoint;// + this.getParams();
		this.config.plantName = url;
		//var url = this.config.apiBase + this.config.apiVersion + "/" + this.config.weatherEndpoint + this.getParams();
		var self = this;
		var retry = true;

		var request = new XMLHttpRequest();
		request.open("GET", url, true);
		request.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status === 200) {
					self.processList(JSON.parse(this.response));
				} else if (this.status === 401) {
					//self.updateDom(self.config.animationSpeed);

					//Log.error(self.name + ": Incorrect APPID.");
					retry = true;
				} else {
					//Log.error(self.name + ": Could not load weather.");
				}

				if (retry) {
					//self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		};
		request.send();
	},

	processList: function(data)
	{
		if (!data) { // || !data.main || typeof data.main.temp === "undefined") {
			// Did not receive usable new data.
			// Maybe this needs a better check?
			return;
		}

		plants = data.data;

		this.show(this.config.animationSpeed, {lockString:this.identifier});
		//this.loaded = true;

		//Log.info('Plant name: ' + plants[0]['facility_name']);

		this.config.plantName = plants[0]['facility_name'] !== undefined?plants[0]['facility_name']:'No plant found.';

		this.updateDom(this.config.animationSpeed);
		//this.sendNotification("CURRENTWEATHER_DATA", {data: data});
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.innerHTML = this.config.plantName;
		return wrapper;
	}
});