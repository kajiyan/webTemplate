/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"/shared/js/index": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["ims"] = window["ims"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./src/shared/scripts/index.ts","shared/js/vendor"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./.modernizrrc":
/*!**********************!*\
  !*** ./.modernizrrc ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

;(function(window){
var hadGlobal = 'Modernizr' in window;
var oldGlobal = window.Modernizr;
/*! modernizr 3.6.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-csscalc-setclasses !*/
!function(e,n,s){function t(e,n){return typeof e===n}function o(){var e,n,s,o,a,i,r;for(var f in l)if(l.hasOwnProperty(f)){if(e=[],n=l[f],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(s=0;s<n.options.aliases.length;s++)e.push(n.options.aliases[s].toLowerCase());for(o=t(n.fn,"function")?n.fn():n.fn,a=0;a<e.length;a++)i=e[a],r=i.split("."),1===r.length?Modernizr[r[0]]=o:(!Modernizr[r[0]]||Modernizr[r[0]]instanceof Boolean||(Modernizr[r[0]]=new Boolean(Modernizr[r[0]])),Modernizr[r[0]][r[1]]=o),c.push((o?"":"no-")+r.join("-"))}}function a(e){var n=f.className,s=Modernizr._config.classPrefix||"";if(u&&(n=n.baseVal),Modernizr._config.enableJSClass){var t=new RegExp("(^|\\s)"+s+"no-js(\\s|$)");n=n.replace(t,"$1"+s+"js$2")}Modernizr._config.enableClasses&&(n+=" "+s+e.join(" "+s),u?f.className.baseVal=n:f.className=n)}function i(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):u?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}var l=[],r={_version:"3.6.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var s=this;setTimeout(function(){n(s[e])},0)},addTest:function(e,n,s){l.push({name:e,fn:n,options:s})},addAsyncTest:function(e){l.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=r,Modernizr=new Modernizr;var c=[],f=n.documentElement,u="svg"===f.nodeName.toLowerCase(),p=r._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):["",""];r._prefixes=p,Modernizr.addTest("csscalc",function(){var e="width:",n="calc(10px);",s=i("a");return s.style.cssText=e+p.join(n+e),!!s.style.length}),o(),a(c),delete r.addTest,delete r.addAsyncTest;for(var m=0;m<Modernizr._q.length;m++)Modernizr._q[m]();e.Modernizr=Modernizr}(window,document);
module.exports = window.Modernizr;
if (hadGlobal) { window.Modernizr = oldGlobal; }
else { delete window.Modernizr; }
})(window);

/***/ }),

/***/ "./src/shared/scripts/SiteWide.ts":
/*!****************************************!*\
  !*** ./src/shared/scripts/SiteWide.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ua_parser_js_1 = __webpack_require__(/*! ua-parser-js */ "./node_modules/ua-parser-js/src/ua-parser.js");
var _setup_1 = __webpack_require__(/*! ./_setup */ "./src/shared/scripts/_setup.ts");
var events_1 = __webpack_require__(/*! events */ "./node_modules/events/events.js");
var detect_it_1 = __webpack_require__(/*! detect-it */ "./node_modules/detect-it/lib/index.js");
var SiteWide = (function (_super) {
    __extends(SiteWide, _super);
    function SiteWide() {
        var _this = _super.call(this) || this;
        _this._isInitialized = false;
        _this._isListening = false;
        _this._orientation = (function () {
            var isOrientationDetect = 'orientation' in window ? true : false;
            var interval = 200;
            var timer = -1;
            var defaultOrientation = (function () {
                if (isOrientationDetect) {
                    var aspect = window.innerWidth < window.innerHeight;
                    var deg = window.orientation % 180 === 0;
                    return (aspect && deg) || !(aspect || deg);
                }
                else {
                    return void 0;
                }
            })();
            var direction = (function () {
                if (isOrientationDetect) {
                    var deg = window.orientation % 180 === 0;
                    if ((deg && defaultOrientation) || !(deg || defaultOrientation)) {
                        return 'portrait';
                    }
                    else {
                        return 'landscape';
                    }
                }
                else {
                    return void 0;
                }
            })();
            return {
                isOrientationDetect: isOrientationDetect,
                defaultOrientation: defaultOrientation,
                direction: direction
            };
        })();
        _this._resize = {
            timer: -1,
            interval: 200
        };
        _this._scroll = {
            element: (function () {
                if ('scrollingElement' in window.document) {
                    return document.scrollingElement;
                }
                else if (navigator.userAgent.indexOf('WebKit') != -1) {
                    return document.body;
                }
                else {
                    return document.documentElement;
                }
            })(),
            eventObject: {
                top: 0,
                left: 0
            },
            isTicking: false,
            interval: 200,
            timer: -1
        };
        _this._update = {};
        _this._wheel = {
            eventName: 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll',
            eventObject: {
                deltaX: 0,
                deltaY: 0,
                minDeltaX: 0,
                maxDeltaX: 0,
                minDeltaY: 0,
                maxDeltaY: 0,
                totalDeltaX: 0,
                totalDeltaY: 0
            },
            interval: 200,
            timer: -1
        };
        _this.orientationChangelHandler = function (e) {
            var originalevent = e;
            if (_this._orientation.isOrientationDetect) {
                var direction = void 0;
                var deg = window.orientation % 180 === 0;
                if ((deg && _this._orientation.defaultOrientation) || !(deg || _this._orientation.defaultOrientation)) {
                    direction = 'portrait';
                }
                else {
                    direction = 'landscape';
                }
                _this.eventEmitter.emit('orientationchange', { direction: direction, originalevent: originalevent });
            }
        };
        _this.resizeHandler = function (e) {
            clearTimeout(_this._resize.timer);
            _this._resize.timer = (function () {
                return setTimeout(function () {
                    var originalevent = e;
                    var width = window.innerWidth;
                    var height = window.innerHeight;
                    _this.eventEmitter.emit('resize', { width: width, height: height, originalevent: originalevent });
                }, _this._resize.interval);
            })();
        };
        _this.scrollEventEmit = function (e) {
            return function () {
                var originalevent = e;
                _this.eventEmitter.emit('scroll', Object.assign({}, _this._scroll.eventObject, { originalevent: originalevent }));
                _this._scroll.isTicking = false;
            };
        };
        _this.scrollHandler = function (e) {
            clearTimeout(_this._scroll.timer);
            _this._scroll.eventObject.top = _this._scroll.element.scrollTop;
            _this._scroll.eventObject.left = _this._scroll.element.scrollLeft;
            if (!_this._scroll.isTicking) {
                window.requestAnimationFrame(_this.scrollEventEmit(e));
                _this._scroll.isTicking = true;
            }
            _this._scroll.timer = (function () {
                var originalevent = e;
                return setTimeout(function () {
                    _this.eventEmitter.emit('endScroll', Object.assign({}, _this._scroll.eventObject, { originalevent: originalevent }));
                }, _this._scroll.interval);
            })();
        };
        _this.updateHandler = function (timestamp) {
            _this._update.requestID = requestAnimationFrame(_this.updateHandler);
            _this.eventEmitter.emit('update', { timestamp: timestamp });
        };
        _this.wheelHandler = function (e) {
            clearTimeout(_this._wheel.timer);
            switch (_this._wheel.eventName) {
                case 'wheel':
                    _this._wheel.eventObject.deltaX = e.deltaX;
                    _this._wheel.eventObject.deltaY = e.deltaY;
                    break;
                case 'mousewheel':
                    _this._wheel.eventObject.deltaY = (-1 / 40) * e.wheelDelta;
                    e.wheelDeltaX && (_this._wheel.eventObject.deltaX = (-1 / 40) * e.wheelDeltaX);
                    break;
                default:
                    _this._wheel.eventObject.deltaY = e.detail;
                    break;
            }
            _this._wheel.eventObject.deltaX =
                Math.abs(_this._wheel.eventObject.deltaX) !== 0 ? _this._wheel.eventObject.deltaX : 0;
            _this._wheel.eventObject.deltaY =
                Math.abs(_this._wheel.eventObject.deltaY) !== 0 ? _this._wheel.eventObject.deltaY : 0;
            _this._wheel.eventObject.minDeltaX = Math.min(_this._wheel.eventObject.minDeltaX, _this._wheel.eventObject.deltaX);
            _this._wheel.eventObject.minDeltaY = Math.min(_this._wheel.eventObject.minDeltaY, _this._wheel.eventObject.deltaX);
            _this._wheel.eventObject.maxDeltaX = Math.max(_this._wheel.eventObject.maxDeltaX, _this._wheel.eventObject.deltaY);
            _this._wheel.eventObject.maxDeltaY = Math.max(_this._wheel.eventObject.maxDeltaY, _this._wheel.eventObject.deltaY);
            _this._wheel.eventObject.totalDeltaX += _this._wheel.eventObject.deltaX;
            _this._wheel.eventObject.totalDeltaY += _this._wheel.eventObject.deltaY;
            _this.eventEmitter.emit('wheel', Object.assign({}, _this._wheel.eventObject, { originalevent: e }));
            _this._wheel.timer = (function () {
                var originalevent = e;
                return setTimeout(function () {
                    _this.eventEmitter.emit('endWheel', Object.assign({}, _this._wheel.eventObject, { originalevent: originalevent }));
                    _this._wheel.eventObject.deltaX = _this._wheel.eventObject.totalDeltaX = _this._wheel.eventObject.maxDeltaX = _this._wheel.eventObject.minDeltaX = 0;
                    _this._wheel.eventObject.deltaY = _this._wheel.eventObject.totalDeltaY = _this._wheel.eventObject.maxDeltaY = _this._wheel.eventObject.minDeltaY = 0;
                }, _this._wheel.interval);
            })();
        };
        _this.SETUP = _setup_1.SETUP;
        _this.eventEmitter = new events_1.EventEmitter();
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
            window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame =
                window[vendors[i] + 'CancelAnimationFrame'] || window[vendors[i] + 'CancelRequestAnimationFrame'];
        }
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function (callback) {
                var date = new Date();
                var currentTime = date.getTime();
                var timeToCall = Math.max(0, 16 - (currentTime - lastTime));
                var id = window.setTimeout(function () {
                    callback(currentTime + timeToCall);
                }, timeToCall);
                lastTime = currentTime + timeToCall;
                return id;
            };
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
        }
        return _this;
    }
    Object.defineProperty(SiteWide.prototype, "isInitialized", {
        get: function () {
            return this._isInitialized;
        },
        enumerable: true,
        configurable: true
    });
    SiteWide.prototype.initialize = function () {
        var _this = this;
        console.log('[SiteWide] initialize');
        var browserDetect = this.browserDetection();
        this.$$html = document.getElementsByTagName('html').item(0);
        this.$$html.classList.add(browserDetect.os || 'os-unknown', browserDetect.browser || 'browser-unknown', browserDetect.device || 'device-unknown');
        this.$$html.setAttribute('data-os-version', browserDetect.osVersion);
        this.$$html.setAttribute('data-browser-version', browserDetect.browserVersion);
        this.mediaQuerys = new Map([
            ['SM_SCREEN_LESS', window.matchMedia('(max-width: 480px)')],
            ['MD_SCREEN_LESS', window.matchMedia('(max-width: 768px)')],
            ['MD_SCREEN', window.matchMedia('(min-width: 481px) and (max-width: 768px)')],
            ['MD_SCREEN_OVER', window.matchMedia('(min-width: 769px)')],
            ['LG_SCREEN_LESS', window.matchMedia('(max-width: 980px)')],
            ['LG_SCREEN', window.matchMedia('(min-width: 769px) and (max-width: 980px)')],
            ['LG_SCREEN_OVER', window.matchMedia('(min-width: 981px)')],
            ['XLG_SCREEN_LESS', window.matchMedia('(max-width: 1280px)')],
            ['XLG_SCREEN', window.matchMedia('(min-width: 981px) and (max-width: 1280px)')],
            ['XLG_SCREEN_OVER', window.matchMedia('(min-width: 1281px)')]
        ]);
        this.mediaQuerys.forEach(function (mediaQueryList, key) {
            mediaQueryList.addListener((function () {
                var eventName = key;
                return function (e) {
                    var isMatch = e.matches;
                    _this.eventEmitter.emit(eventName, { eventName: eventName, isMatch: isMatch });
                };
            })());
        });
        this._isInitialized = true;
        return this;
    };
    SiteWide.prototype.listen = function () {
        console.log('[SiteWide] listen');
        if (this._isInitialized && !this._isListening) {
            this._isListening = true;
            window.addEventListener('orientationchange', this.orientationChangelHandler, detect_it_1.default.passiveEvents ? { passive: true } : false);
            window.addEventListener('resize', this.resizeHandler, detect_it_1.default.passiveEvents ? { passive: true } : false);
            this._scroll.eventObject.top = this._scroll.element.scrollTop;
            this._scroll.eventObject.left = this._scroll.element.scrollLeft;
            window.addEventListener('scroll', this.scrollHandler, detect_it_1.default.passiveEvents ? { passive: true } : false);
            window.addEventListener(this._wheel.eventName, this.wheelHandler, detect_it_1.default.passiveEvents ? { passive: true } : false);
            this._update.requestID = requestAnimationFrame(this.updateHandler);
        }
        return this;
    };
    SiteWide.prototype.stopListening = function () {
        if (this._isInitialized && this._isListening) {
            this._isListening = false;
            window.removeEventListener('orientationchange', this.orientationChangelHandler);
            window.removeEventListener('resize', this.resizeHandler);
            window.removeEventListener('scroll', this.scrollHandler);
            window.removeEventListener(this._wheel.eventName, this.wheelHandler);
            cancelAnimationFrame(this._update.requestID);
        }
        return this;
    };
    SiteWide.prototype.format = function (word) {
        var result;
        var sanitizedWords = [];
        var words = word.split(' ');
        for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
            var w = words_1[_i];
            var sanitizedWord = w
                .replace(/\[|\]/g, '')
                .replace(/\//g, '-')
                .toLowerCase();
            if (sanitizedWord.length > 0) {
                sanitizedWords.push(sanitizedWord);
            }
        }
        result = sanitizedWords.join('-');
        return result;
    };
    SiteWide.prototype.browserDetection = function () {
        console.log('[SiteWide] browserDetection');
        var result;
        var uaParser = new ua_parser_js_1.UAParser();
        var browserName = uaParser.getBrowser().name ? uaParser.getBrowser().name.toLowerCase() : '';
        var browserVersion = uaParser.getBrowser().version ? uaParser.getBrowser().version : '';
        var deviceType = uaParser.getDevice().type ? uaParser.getDevice().type.toLowerCase() : '';
        var osName = uaParser.getOS().name ? uaParser.getOS().name.toLowerCase() : '';
        var osVersion = uaParser.getOS().version ? uaParser.getOS().version : '';
        result = {
            os: this.format(osName),
            osVersion: this.format(osVersion),
            browser: this.format(browserName),
            browserVersion: this.format(browserVersion),
            device: this.format(deviceType)
        };
        return result;
    };
    return SiteWide;
}(events_1.EventEmitter));
exports.SiteWide = SiteWide;


/***/ }),

/***/ "./src/shared/scripts/_setup.ts":
/*!**************************************!*\
  !*** ./src/shared/scripts/_setup.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _SETUP = {"MODE":"DEBUG_LOCAL","SHARED":"shared","IMAGES":"images","CSS":"css","JS":"js","FONTS":"fonts","AUDIO":"audio","VIDEO":"video","HOST":"localhost","PORT":8080,"PROTOCOL":"http","BASE_URL":"//localhost:8080","BASE_PATH":"","APPLICATION_PREFIX":"ims","SYSTEM":"system","SYSTEM_CORE":"","APPLICATION":{"PRODUCTION":"production-htdocs","DEBUG":"development-htdocs","DEBUG_LOCAL":"htdocs"},"SRC_FOLDER_NAME":"src","SHARED_SRC_FOLDER_NAME":"shared","CONFIG_FILE_NAME":"config.json","DOCS":"docs","ROOT":"../","CORE":"/","APPLICATION_DIST":"../htdocs/","DOCS_DIST":"../docs/","COMMANDS":"commands","BUILDER":null,"TEMPLATE_ENGINE_IGNORE_PREFIX":["_","ignore"],"TEMPLATE_ENGINE_FOLDER_NAME":"templates","TEMPLATE_ENGINE_ATTRIBUTE":".e.html","STYLE_IGNORE_PREFIX":["_","ignore"],"STYLE_FOLDER_NAME":"styles","STYLE_ATTRIBUTE":".pcss","ALT_JS_IGNORE_PREFIX":["_","ignore"],"ALT_JS_FOLDER_NAME":"scripts","ALT_JS_ATTRIBUTE":".ts","APP_COMPONENTS":"app_components","NODE_MODULES":"node_modules","SHARED_IMAGES":"/shared/images","SHARED_CSS":"/shared/css","SHARED_JS":"/shared/js","SHARED_FONTS":"/shared/fonts","SHARED_AUDIO":"/shared/audio","SHARED_VIDEO":"/shared/video","CONFIG":{}};
exports.SETUP = _SETUP;


/***/ }),

/***/ "./src/shared/scripts/index.ts":
/*!*************************************!*\
  !*** ./src/shared/scripts/index.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var modernizr = __webpack_require__(/*! modernizr */ "./.modernizrrc");
var SiteWide_1 = __webpack_require__(/*! ./SiteWide */ "./src/shared/scripts/SiteWide.ts");
(function () {
    window.modernizr = modernizr;
    window.SW = new SiteWide_1.SiteWide();
    window.SW.initialize();
    window.SW.listen();
})();


/***/ })

/******/ });
//# sourceMappingURL=index.map