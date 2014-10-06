(function(){
	var _ua = navigator.userAgent,
		_isMac = (_ua.indexOf('Mac')!=-1),
		_isChrome = (_ua.indexOf('Chrome')!=-1),
		_isFirefox = (_ua.indexOf('Firefox')!=-1),
		_isSafari = (_ua.indexOf('Safari')!=-1),
		_isMacSafari = (_isMac) && (_ua.indexOf('Safari')!=-1) && !(_isChrome),
		_isMacChrome = (_isMac) && (_ua.indexOf('Safari')!=-1) && (_isChrome),
		_isMacFirefox = (_isMac) && (_ua.indexOf('Firefox')!=-1),
		_isIPad = _ua.toLowerCase().indexOf("ipad") != -1,
		_isIPhone = _ua.toLowerCase().indexOf("iphone") != -1,
		_isAndroid = _ua.indexOf("Android") != -1,
		_isXP = _ua.indexOf('Windows NT 5') != -1;

	if( _isIPad ){
		$("html").addClass("ipad smartDevic");
	}else if( _isIPhone ){
		$("html").addClass("iphone smartDevic");
	}else if( _isAndroid ){
		$("html").addClass("android smartDevic");
	}else if( _isMac ){
		if( _isMacSafari || _isMacChrome ){
			$("html").addClass("macwkt");// Mac Safari Mac Chrome
		}else if( _isMacFirefox ){
			$("html").addClass("macff");// Mac FireFox
		}
	}else{
		if ( _isChrome ){
			if(_isXP){
				$("html").addClass("winxpchrm");// WinXP Chrome
			}else{
				$("html").addClass("winchrm");// Win Chrome
			}
		}else if( _isFirefox ){
			$("html").addClass("winff");// Win FireFox
		}
	}

	window.UA = {
		isIPad: _isIPad,
		isIPhone: _isIPhone,
		isAndroid: _isAndroid,
		isSafari: _isSafari,
		isMobile: ( _isIPad || _isIPhone || _isAndroid ),
		isMacwkt: ( _isMacSafari || _isMacChrome ),
		isMacFirefox: _isMacFirefox,
		isXPChrome: ( !_isMac && _isChrome && _isXP ),
		isWinChrome: ( !_isMac && _isChrome && !_isXP ),
		isFirefox: ( !_isMac  && !_isChrome && _isFirefox )
	}
})();