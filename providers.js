var Account = function(iconUrl, profilePictureUrl, screenName, fullName, profileUrl) {
	this.iconUrl = iconUrl;
	this.profilePictureUrl = profilePictureUrl;
	this.screenName = screenName;
	this.fullName = fullName;
	this.profileUrl = profileUrl;
};

var OpenIdAccount = function() {
	this.icon = 'http://assets3.getsatisfaction.com/images/identity_icons/openid.png';
};

OpenIdAccount.prototype.authenticate = function() {
	alert('OpenID auth should be initiated here');
};

OpenIdAccount.prototype.lookup = function(q, callback) {
};

var FlickrAccount = function() {
	this.icon = 'flickr.png';
	this.api = 'http://www.flickr.com/services/rest/?method=flickr.people.findByUsername&username=%s&api_key=ea4568b1bfa3f53d16732684b53cb50c&format=json&jsoncallback=?';
	this.infoApi = 'http://www.flickr.com/services/rest/?method=flickr.people.getInfo&user_id=%s&api_key=ea4568b1bfa3f53d16732684b53cb50c&format=json&jsoncallback=?';
	this.profilePictureUrl = 'http://farm%farm.static.flickr.com/%server/buddyicons/%id.jpg';
	this.defaultProfilePictureUrl = 'http://l.yimg.com/g/images/buddyicon.jpg';
	this.profileUrl = 'flickr.com/%s';
	this.auth = 'https://login.yahoo.com/config/login?.src=flickrsignin&.pc=8190&.scrumb=0&.pd=c%3DJvVF95K62e6PzdPu7MBv2V8-&.intl=us&.done=https%3A%2F%2Flogin.yahoo.com%2Fconfig%2Fvalidate%3F.src%3Dflickrsignin%26.pc%3D8190%26.scrumb%3D0%26.pd%3Dc%253DJvVF95K62e6PzdPu7MBv2V8-%26.intl%3Dus%26.done%3Dhttp%253A%252F%252Fwww.flickr.com%252Fsignin%252Fyahoo%252F%253Fredir%253D%25252Fphoto_grease_postlogin.gne%25253Fd%25253Dhttp%25253A%25252F%25252Fwww.flickr.com%25252F';
};

FlickrAccount.prototype.authenticate = function() {
	var popup = window.open(this.auth, 'flickrAuthPopup', 'width=490,height=650');
	popup.moveTo(window.left + 100, window.top + 100);
};

FlickrAccount.prototype.lookup = function(q, callback) {
	var thiz = this;

	function getApiUrl() {
		return thiz.api.replace(/\%s/, q);
	}
	
	function getInfoApiUrl(uid) {
		return thiz.infoApi.replace(/\%s/, uid);
	}

	function getProfilePictureUrl(uid, farm, server) {
		return (farm === 0 || server === 0 ? thiz.defaultProfilePictureUrl : thiz.profilePictureUrl.replace('%farm', farm).replace('%server', server).replace('%id', uid));
	}

	function getProfileUrl() {
		return thiz.profileUrl.replace(/\%s/, q);
	}

	function handleResponse(data) {
		var name = data.person.realname._content;
		console.log('fr found: ' + name);
		callback(new Account(thiz.icon, getProfilePictureUrl(data.person.id, data.person.iconfarm, data.person.iconserver), q, name, getProfileUrl()), thiz);
	}

	function handleIdResponse(data) {
		if(data.user !== undefined) {
			var id = data.user.id;
			console.log(getInfoApiUrl(id));
			$.getJSON(getInfoApiUrl(id), {}, handleResponse);
		}
	}

	$.getJSON(getApiUrl(), {}, handleIdResponse);
};

var YouTubeAccount = function() {
	this.icon = 'http://youtube.com/favicon.ico';
	this.api = 'http://gdata.youtube.com/feeds/api/users/%s?alt=json&callback=?';
	this.profileUrl = 'youtube.com/%s';
	this.auth = 'https://www.google.com/accounts/ServiceLogin?uilel=3&service=youtube&passive=true&continue=http%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26nomobiletemp%3D1%26hl%3Den_US%26next%3D%252F&hl=en_US&ltmpl=popup';
};

YouTubeAccount.prototype.authenticate = function() {
	var popup = window.open(this.auth, 'youTubeAuthPopup', 'width=640,height=520');
	popup.moveTo(window.left + 100, window.top + 100);
};

YouTubeAccount.prototype.lookup = function(q, callback) {
	var thiz = this;

	function getApiUrl() {
		return thiz.api.replace(/\%s/, q);
	}

	function getProfilePictureUrl(data) {
		return data.media$thumbnail.url;
	}

	function getFullName(data) {
		return data.yt$firstName.$t+' '+(data.yt$lastName !== undefined ? data.yt$lastName.$t : '');
	}

	function getProfileUrl() {
		return thiz.profileUrl.replace(/\%s/, q);
	}

	function handleResponse(data) {
		console.log('yt found: ' + getFullName(data.entry));
		callback(new Account(thiz.icon, getProfilePictureUrl(data.entry), q, getFullName(data.entry), getProfileUrl()), thiz);
	}

	$.getJSON(getApiUrl(), {}, handleResponse);
};

var GmailAccount = function() {
	this.icon = 'http://assets4.getsatisfaction.com/images/identity_icons/google.png';//'https://mail.google.com/favicon.ico';
	this.auth = 'https://www.google.com/accounts/ServiceLogin?service=lso&passive=1209600&continue=https://accounts.google.com/o/openid2/auth?st%3DREcjyzKV1JwNg_I0mZLu%26hl%3Den-US&followup=https://accounts.google.com/o/openid2/auth?st%3DREcjyzKV1JwNg_I0mZLu%26hl%3Den-US&ltmpl=popup&shdf=ChILEgZkb21haW4aBllhaG9vIQwSA2xzbyIU-UUByc-3xPzwVWY304M1FmqcTl4oATIUfh9VWTR0qon7YjpnoGFQRx2TO1g&hl=en-US&scc=1';
};

GmailAccount.prototype.authenticate = function() {
	var popup = window.open(this.auth, 'googleAuthPopup', 'width=440,height=480');
	popup.moveTo(window.left + 100, window.top + 100);
};

var YahooAccount = function() {
	this.icon = 'http://www.yahoo.com/favicon.ico';
	this.auth = 'https://login.yahoo.com/config/login?.intl=us&.src=openid&.partner=&.pd=c%3DmZmAFpe.2e7WuWzcHD2ZPYQ-%26ockey%3D750words.com%26op%3D1&.done=https%3A%2F%2Fopen.login.yahoo.com%2Fopenid%2Fop%2Fstart%3Fz%3DxqJ54_RH1Do_4fA7HJIORgRz2lDqt8lLZkwyVCuQbIsyiq1Oh8Zde0UJTOuiv249GB.sb_kGiNQtzaSuqbN8UUwFQSlbhEpfiDFLQhVR59hRDKaXetkOVQtArssfRxavAnXptpKz8i3qxhD6VmgXONqNcz5v0fz29ordTRbj4aUOAcK.xZfb6ddMbJCsPgF8kqRBN7kQXEKMDaN.KTayzGN8kkP4z7CQ2gday9PMV167MVUph7EP7adUeDx90.tEZvDB16q5ZJ0gvKjUPQPcqJ5E05QupnwesLk3vIi1ohw0B9GqCNEiMAMtcZYZrZBTjbh9F2DslxhZeJI2t0jd8Ej6QANhiCWbjeIQbQglsAcqAAMUE0e8kk2zNrAdCkst28qduI0y.YY-%26.scrumb%3D0';
};

YahooAccount.prototype.authenticate = function() {
	var popup = window.open(this.auth, 'yahooAuthPopup', 'width=520,height=580');
	popup.moveTo(window.left + 100, window.top + 100);
};

var TwitterAccount = function() {
	this.icon = 'twitter.png'; //si0.twimg.com/images/dev/buttons/sign-in-with-twitter-l-sm.png'; //'http://twitter.com/favicon.ico';
	this.api = 'https://api.twitter.com/1/users/show.json?screen_name=%s&callback=?';
	this.profileUrl = 'twitter.com/%s';
	this.auth = 'https://twitter.com/oauth/authenticate?oauth_token=Tt39ZdgO7MwSwLOkTOscuprfCvTTkvQaKKAnW8Xtfg';
};

TwitterAccount.prototype.authenticate = function() {
	var popup = window.open(this.auth, 'twitterAuthPopup', 'width=800,height=470');
	popup.moveTo(window.left + 100, window.top + 100);
};

TwitterAccount.prototype.lookup = function(q, callback) {
	var thiz = this;

	function getApiUrl() {
		return thiz.api.replace(/\%s/, q);
	}

	function getProfilePictureUrl(data) {
		return data.profile_image_url; //.replace('normal', 'mini');
	}

	function getProfileUrl() {
		return thiz.profileUrl.replace(/\%s/, q);
	}

	function handleResponse(data) {
		console.log('tw found: ' + data.name);
		callback(new Account(thiz.icon, getProfilePictureUrl(data), q, data.name, getProfileUrl()), thiz);
	}

	$.getJSON(getApiUrl(), {}, handleResponse);
};

var FacebookAccount = function() {
	this.icon = 'http://facebook.com/favicon.ico';
	this.api = 'https://graph.facebook.com/%s&callback=?';
	this.auth = 'https://www.facebook.com/login.php?api_key=60fd1ed0339607609f9c15bdffd47c57&next=https%3A%2F%2Flogin.getsatisfaction.com%2Ffacebook%2Fcallback&popup=1&req_perms=&return_session=1&v=1.0';
	this.profilePictureUrl = 'https://graph.facebook.com/%s/picture?type=small';
	this.profileUrl = 'facebook.com/%s';
};

FacebookAccount.prototype.authenticate = function() {
	var popup = window.open(this.auth, 'facebookAuthPopup', 'width=520,height=340');
	popup.moveTo(window.left + 100, window.top + 100);
};

FacebookAccount.prototype.lookup = function(q, callback) {
	var thiz = this;

	function getApiUrl() {
		return thiz.api.replace(/\%s/, q);
	}

	function getProfilePictureUrl() {
		return thiz.profilePictureUrl.replace(/\%s/, q);
	}

	function getProfileUrl() {
		return thiz.profileUrl.replace(/\%s/, q);
	}

	function handleResponse(data) {
		if(data.error === undefined) { 
			console.log('fb found: ' + data.name);
			callback(new Account(thiz.icon, getProfilePictureUrl(), q, data.name, getProfileUrl()), thiz);
		}
	}

	$.getJSON(getApiUrl(), {}, handleResponse);
};

var providerPatterns = [
	// regexes are too simple, need to be improved but I just want to prove the concept
	{ r: /^((http:\/\/)?(www\.)?twitter\.com\/|@).+$/, impl: TwitterAccount },
	{ r: /^(http:\/\/)?(www\.)?facebook\.com\/.+$/, impl: FacebookAccount },
	{ r: /^(http:\/\/)?(www\.)?youtube\.com\/.+$/, impl: YouTubeAccount },
	{ r: /^(http:\/\/)?(www\.)?flickr\.com\/.+$/, impl: FlickrAccount },
	{ r: /^([^@:\/]{3,}@)?gmail\.com$/, impl: GmailAccount },
	{ r: /^([^@:\/]+@)?yahoo\.com$/, impl: YahooAccount },
	{ r: /^(http:\/\/)?([^\/]+\.){2,}.+$/, impl: OpenIdAccount }
];

var providers = [
	TwitterAccount,
	FacebookAccount,
	YouTubeAccount,
	FlickrAccount,
	OpenIdAccount
];

Array.prototype.each = function(fn) {
	for(var i = 0; i < this.length; i++) {
		if(fn(this[i])) { break; }
	}
};

Array.prototype.first = function(fn) {
	for(var i = 0; i < this.length; i++) {
		if(fn(this[i])) {
			return this[i];
		}
	}
	return null;
};

function matchProvider(q) {
	var provider = providerPatterns.first(function(p) { return q.match(p.r); });
	if(provider !== null) { console.log(new provider.impl()); }
	return provider;
}

function searchProviders(q, callback) {
	var provider = providerPatterns.first(function(p) { return q.match(p.r); });
	if(provider !== null) {
		new provider.impl().authenticate();
		return;
	}

	providers.each(function(provider) {
		new provider().lookup(q, callback);
	});
}

function renderAccount(iconUrl, profilePictureUrl, screenName, fullName) {
	return $('<a class="account" href="#"><img class="icon" src="'+iconUrl+'"><img class="profile-picture" src="'+profilePictureUrl+'">'+fullName+'</a>');
}
