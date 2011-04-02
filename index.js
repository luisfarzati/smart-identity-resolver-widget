$().ready(function() {
	var examples = [
		'myflickrusername',
		'myfacebookusername',
		'mytwitterusername',
		'myyoutubeusername',
		'facebook.com/myusername',
		'twitter.com/myusername',
		'@mytwitterusername',
		'youtube.com/myusername',
		'flickr.com/myusername',
		'myusername@gmail.com',
		'myusername@yahoo.com',
		'myblog.wordpress.com'
	];

	$('#username').attr('placeholder', 'e.g. ' + examples[Math.floor(Math.random()*examples.length)]);

	function render(l, n, p, u) {
		$('#selectorcaption').show();
		var t = $('.account_template').clone();
		t.removeClass('account_template');
		t.addClass('account');
		t.find('div:first').attr('title', t.find('div:first').attr('title') + n);
		t.find('.profile-pic').attr('src', 'wait.gif');
		t.find('.preloader').attr('src', p).load(function() { t.find('.profile-pic').attr('src', t.find('.preloader').attr('src')); });
		t.find('.icon').attr('src', l);
		console.log($('#accounts').find('.account_template').size());
		t.css('margin-left', ($('#accounts').children().size() *  58) + 'px');
		t.css('display', 'block');
		t.click(function() { 
				$('#username').val(u); 
//				$('.account').remove(); 
//				$('#selectorcaption').hide(); 
//				$('#accounts').css('height', ''); 
				refreshIcon(); 
		});
		t.appendTo('#accounts');
		$('#accounts').css('height', '64px');
	}

	function callback(account, provider) {
		if(account !== null) {
			console.log(account);
			render(account.iconUrl, account.fullName, account.profilePictureUrl, account.profileUrl);
		}
	}

	$('#widget').submit(function() {
		$('#accounts').empty();
		$('#selectorcaption').hide();
		$('#accounts').css('height', '');
		var username = $('#username').val().replace(' ', '');
		if(username !== '') {
			searchProviders(username, callback);
		}
		return false;
	});

	function refreshIcon() {
		var s = $('#username').val();

		var provider = matchProvider(s);
		if(provider !== null) {
			$('#username').css('background', '#fff url('+new provider.impl().icon+') no-repeat 2px center');
			return;
		}

		$('#username').css('background', '#fff url(user.png) no-repeat 2px center');
	}

	$('#username').keyup(refreshIcon);

	$('#readmore').click(function() { $('#moresection').toggle(); });
});

