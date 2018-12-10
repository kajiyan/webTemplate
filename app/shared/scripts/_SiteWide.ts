import { UAParser } from 'ua-parser-js';
import { CONFIG } from './_config';
import { EventEmitter } from 'events';
import detectIt from 'detect-it';

import * as inView from 'in-view';

interface Environ {
  os: string;
  osVersion: string;
  browser: string;
  browserVersion: string;
  device: string;
}

interface OptionalEventParams {
  event_category?: string;
  event_label?: string;
  value?: string;
  event_callback?: () => void;
}

declare global {
  interface Window {
    requestAnimationFrame: (callback: FrameRequestCallback) => number;
    cancelAnimationFrame: (handle: number) => void;
  }
}

declare var gtag: any; // eslint-disable-line typescript/no-explicit-any

/**
 * @class SiteWide
 * @classdesc
 */
export class SiteWide extends EventEmitter {
  private _isInitialized: boolean = false;
  private _isListening: boolean = false;
  private $$html: HTMLElement;
  private _$$gTracker: NodeList;
  private mediaQuerys: Map<string, MediaQueryList>;

  public CONFIG: object;
  public eventEmitter: EventEmitter;

  // orientationchange イベント関係
  private _orientation: {
    isOrientationDetect: boolean; // orientation イベントをサポートしているか
    defaultOrientation?: boolean | void; // 端末の向きを表現するフラグ
    direction?: string | void; // 端末の向きを表現する文字列 portrait | landscape
  } = (() => {
    // orientation 関係の値を初期化
    const isOrientationDetect: boolean = 'orientation' in window ? true : false;
    const interval: number = 200;
    const timer: number = -1;

    const defaultOrientation: boolean | void = (() => {
      if (isOrientationDetect) {
        const aspect: boolean = window.innerWidth < window.innerHeight;
        const deg: boolean = (window.orientation as number) % 180 === 0;
        return (aspect && deg) || !(aspect || deg);
      } else {
        return void 0;
      }
    })();

    const direction: string | void = (() => {
      if (isOrientationDetect) {
        const deg: boolean = (window.orientation as number) % 180 === 0;

        if ((deg && defaultOrientation) || !(deg || defaultOrientation)) {
          return 'portrait';
        } else {
          return 'landscape';
        }
      } else {
        return void 0;
      }
    })();

    return {
      isOrientationDetect,
      defaultOrientation,
      direction
    };
  })();

  // resize イベント関係
  private _resize: {
    interval: number;
    timer: number;
  } = {
    timer: -1,
    interval: 200
  };

  // scroll イベント関係
  private _scroll: {
    element: Element | HTMLElement;
    currentScrollTop: number;
    eventObject: {
      top: number;
      left: number;
    };
    isTicking: boolean;
    isEnd: boolean;
    interval: number;
    timer: number;
  } = {
    element: (() => {
      if ('scrollingElement' in window.document) {
        return document.scrollingElement;
      } else if (navigator.userAgent.indexOf('WebKit') != -1) {
        return document.body;
      } else {
        return document.documentElement;
      }
    })(),
    currentScrollTop: 0,
    eventObject: {
      top: 0,
      left: 0
    },
    isTicking: false,
    isEnd: true,
    interval: 200,
    timer: -1
  };

  // update イベント関係
  private _update: {
    requestID?: number;
  } = {};

  // wheel イベント関係
  private _wheel: {
    eventName: string; // 閲覧環境のwheel イベント名
    eventObject: {
      deltaX: number;
      deltaY: number;
      minDeltaX: number;
      maxDeltaX: number;
      minDeltaY: number;
      maxDeltaY: number;
      totalDeltaX: number;
      totalDeltaY: number;
    };
    interval: number;
    timer: number;
  } = {
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

  // set initialized(nextInitialized: boolean) {
  //   this._isInitialized = nextInitialized;
  // }

  /**
   * @constructs
   */
  public constructor() {
    super();

    this.CONFIG = CONFIG;
    this.eventEmitter = new EventEmitter();

    // requestAnimationFrame polyfill
    let lastTime: number = 0;
    const vendors: ReadonlyArray<string> = ['ms', 'moz', 'webkit', 'o'];

    for (let i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
      window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame =
        window[vendors[i] + 'CancelAnimationFrame'] || window[vendors[i] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback: FrameRequestCallback) {
        const date: Date = new Date();
        const currentTime: number = date.getTime();
        const timeToCall: number = Math.max(0, 16 - (currentTime - lastTime));
        const id: number = window.setTimeout(function() {
          callback(currentTime + timeToCall);
        }, timeToCall);
        lastTime = currentTime + timeToCall;
        return id;
      };
    }

    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function(id: number) {
        clearTimeout(id);
      };
    }
    // End. requestAnimationFrame polyfill
  }

  /**
   * initialize
   * @returns {SiteWide} this
   */
  public initialize(): SiteWide {
    console.log('[SiteWide] initialize');

    const browserDetect: Environ = this.browserDetection();

    this.$$html = document.getElementsByTagName('html').item(0);
    this._$$gTracker = document.querySelectorAll('.js-gTracker');

    // html 要素のclass属性にユーザーの閲覧環境に基づく値を追加
    this.$$html.classList.add(browserDetect.os || 'os-unknown');
    this.$$html.classList.add(browserDetect.browser || 'browser-unknown');
    this.$$html.classList.add(browserDetect.device || 'device-unknown');
    this.$$html.setAttribute('data-os-version', browserDetect.osVersion);
    this.$$html.setAttribute('data-browser-version', browserDetect.browserVersion);

    // matchMedia のリスト
    this.mediaQuerys = new Map([
      ['SM_SCREEN_LESS', window.matchMedia('(max-width: 480px)')],
      ['MD_SCREEN_LESS', window.matchMedia('(max-width: 767px)')],
      ['MD_SCREEN', window.matchMedia('(min-width: 481px) and (max-width: 767px)')],
      ['MD_SCREEN_OVER', window.matchMedia('(min-width: 768px)')],
      ['LG_SCREEN_LESS', window.matchMedia('(max-width: 980px)')],
      ['LG_SCREEN', window.matchMedia('(min-width: 769px) and (max-width: 980px)')],
      ['LG_SCREEN_OVER', window.matchMedia('(min-width: 981px)')],
      ['XLG_SCREEN_LESS', window.matchMedia('(max-width: 1280px)')],
      ['XLG_SCREEN', window.matchMedia('(min-width: 981px) and (max-width: 1280px)')],
      ['XLG_SCREEN_OVER', window.matchMedia('(min-width: 1281px)')]
    ]);

    this.mediaQuerys.forEach((mediaQueryList: MediaQueryList, key: string) => {
      mediaQueryList.addListener(
        (() => {
          let eventName: string = key;

          return e => {
            let isMatch: boolean = e.matches;
            this.eventEmitter.emit(eventName, { eventName, isMatch });
          };
        })()
      );
    });

    this._scroll.element = (() => {
      if ('scrollingElement' in window.document) {
        return document.scrollingElement;
      } else if (navigator.userAgent.indexOf('WebKit') != -1) {
        return document.body;
      } else {
        return document.documentElement;
      }
    })();

    inView('.sw-View_Enter')
      .on('enter', this._onViewEnter)
      .check();

    this._isInitialized = true;

    return this;
  }

  /*
   * @readonly
   */
  public get isInitialized(): boolean {
    return this._isInitialized;
  }

  /**
   * listen
   * イベントリスナーを登録する
   * @returns {SiteWide} this
   */
  public listen(): SiteWide {
    console.log('[SiteWide] listen');

    if (this._isInitialized && !this._isListening) {
      this._isListening = true;

      for (let i = 0, len = this._$$gTracker.length; i < len; i++) {
        const $$gTracker = this._$$gTracker[i];
        $$gTracker.addEventListener('click', this.gTrackerClickHandler);
      }

      // orientationchange 時のイベントリスナー
      window.addEventListener(
        'orientationchange',
        this.orientationChangelHandler,
        detectIt.passiveEvents ? { passive: true } : false
      );

      // resize 時のイベントリスナー
      window.addEventListener('resize', this.resizeHandler, detectIt.passiveEvents ? { passive: true } : false);

      // スクロールの初期値を初期化する
      this._scroll.currentScrollTop = this._scroll.element.scrollTop;
      this._scroll.eventObject.top = this._scroll.element.scrollTop;
      this._scroll.eventObject.left = this._scroll.element.scrollLeft;
      // scroll 時のイベントリスナー
      window.addEventListener('scroll', this.scrollHandler, detectIt.passiveEvents ? { passive: true } : false);

      // wheel 時のイベントリスナー
      window.addEventListener(
        this._wheel.eventName,
        this.wheelHandler,
        detectIt.passiveEvents ? { passive: true } : false
      );

      this._update.requestID = requestAnimationFrame(this.updateHandler);
    }

    return this;
  }

  /**
   * stopListening
   * イベントリスナーを削除する
   * @returns {SiteWide} this
   */
  public stopListening(): SiteWide {
    if (this._isInitialized && this._isListening) {
      this._isListening = false;
      window.removeEventListener('orientationchange', this.orientationChangelHandler);
      window.removeEventListener('resize', this.resizeHandler);
      window.removeEventListener('scroll', this.scrollHandler);
      window.removeEventListener(this._wheel.eventName, this.wheelHandler);
      cancelAnimationFrame(this._update.requestID);
    }

    return this;
  }

  /**
   * format
   * 引数に渡された文字列から空白と"[", "]" を削除し、
   * 単語間を"-" で接続した文字列を返す
   * @param {string} word 整形元の文字列
   * @returns {string} result
   */
  private format(word: string): string {
    let result: string;
    let sanitizedWords: string[] = [];
    const words: string[] = word.split(' ');

    for (let w of words) {
      const sanitizedWord: string = w
        .replace(/\[|\]/g, '')
        .replace(/\//g, '-')
        .toLowerCase();

      if (sanitizedWord.length > 0) {
        sanitizedWords.push(sanitizedWord);
      }
    }

    result = sanitizedWords.join('-');

    return result;
  }

  /**
   * browserDetection
   * ユ-ザーの閲覧環境情報を返す
   * @returns {Environ} result ユ-ザーの閲覧環境
   */
  public browserDetection(): Environ {
    console.log('[SiteWide] browserDetection');

    let result: Environ;
    let uaParser = new UAParser();

    const browserName: string = uaParser.getBrowser().name ? uaParser.getBrowser().name.toLowerCase() : '';
    const browserVersion: string = uaParser.getBrowser().version ? uaParser.getBrowser().version : '';
    const deviceType: string = uaParser.getDevice().type ? uaParser.getDevice().type.toLowerCase() : '';
    const osName: string = uaParser.getOS().name ? uaParser.getOS().name.toLowerCase() : '';
    const osVersion: string = uaParser.getOS().version ? uaParser.getOS().version : '';

    result = {
      os: this.format(osName),
      osVersion: this.format(osVersion),
      browser: this.format(browserName),
      browserVersion: this.format(browserVersion),
      device: this.format(deviceType)
    };

    return result;
  }

  /**
   * _onViewEnter
   * @param {HTMLElement} el イベントオブジェクト
   * @returns {Void} 返り値なし
   */
  private _onViewEnter = (): ((el: HTMLElement) => void) => {
    const handler = (el: HTMLElement): void => {
      if (!el.classList.contains('sw-View_Enter-animated')) {
        el.classList.add('sw-View_Enter-animated');
      }
    };

    return handler;
  };

  /**
   * gTrackerClickHandler
   * gTracker が click された時のイベントハンドラー
   * @param {Event} e イベントオブジェクト
   * @returns {Void} 返り値なし
   */
  private gTrackerClickHandler = (e: MouseEvent): void => {
    const $$target: HTMLElement = e.currentTarget as HTMLElement;
    const tagName: string = $$target.tagName.toUpperCase();
    const href: string = $$target.getAttribute('href');
    const isntBlank: boolean = $$target.getAttribute('target') !== '_blank';
    const isntHashLink: boolean = !new RegExp('^#').test(href);
    let eventCallback: () => void;

    // a タグかつページ内リンク以外を同一タブで開く場合はデフォルトの挙動を中止
    if (tagName === 'A' && isntHashLink && isntBlank) {
      e.preventDefault();
      eventCallback = (() => {
        const _href: string = href;
        return () => {
          location.href = _href;
        };
      })();
    }

    const optionalEventParams: OptionalEventParams = {};
    const eventAction: string = $$target.dataset.eventAction;
    const eventCategory: string = $$target.dataset.eventCategory;
    const eventLabel: string = $$target.dataset.eventLabel;
    const eventValue: string = $$target.dataset.eventValue;

    if (eventAction && eventAction.length > 0) {
      if (typeof eventCategory !== 'undefined') optionalEventParams.event_category = eventCategory;
      if (typeof eventLabel !== 'undefined') optionalEventParams.event_label = eventLabel;
      if (typeof eventValue !== 'undefined') optionalEventParams.value = eventValue;
      if (typeof eventCallback !== 'undefined') optionalEventParams.event_callback = eventCallback;

      gtag('event', eventAction, optionalEventParams);
    } else {
      console.log('[SiteWide] .js-gTracker には data 属性 event-action に1文字以上の文字列を指定する必要があります');
    }
  };

  /**
   * orientationChangelHandler
   * 'orientationchange' イベントハンドラー
   * カスタムされたイベントオブジェクトを持つ'orientationchange' イベントをemit する
   * @param {Event} e イベントオブジェクト
   * @returns {Void} 返り値なし
   */
  private orientationChangelHandler = (e: Event): void => {
    const originalevent: Event = e;

    if (this._orientation.isOrientationDetect) {
      let direction: OrientationLockType;
      const deg: boolean = (window.orientation as number) % 180 === 0;

      if ((deg && this._orientation.defaultOrientation) || !(deg || this._orientation.defaultOrientation)) {
        direction = 'portrait';
      } else {
        direction = 'landscape';
      }

      this.eventEmitter.emit('orientationchange', { direction, originalevent });
    }
  };

  /**
   * resizeHandler
   * 'resize' イベントハンドラー
   * カスタムされたイベントオブジェクトを持つ'resize' イベントをemit する
   * @param {Event} e イベントオブジェクト
   * @returns {Void} 返り値なし
   */
  private resizeHandler = (e: Event): void => {
    clearTimeout(this._resize.timer);

    this._resize.timer = ((): number => {
      const timeoutId: number = setTimeout(() => {
        const originalevent: Event = e;
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.eventEmitter.emit('resize', { width, height, originalevent });
      }, this._resize.interval);

      return timeoutId;
    })();
  };

  /**
   * scrollEventEmit
   * scrollHandler の中で呼ばれる処理
   * カスタムされたイベントオブジェクトを持つ'scroll' イベントをemit する
   * @param {Event} e イベントオブジェクト
   * @returns {Void} 返り値なし
   */
  private scrollEventEmit = (e: Event): (() => void) => {
    const handler = (): void => {
      const originalevent: Event = e;
      this.eventEmitter.emit('scroll', Object.assign({}, this._scroll.eventObject, { originalevent }));
      this._scroll.isTicking = false;
    };

    return handler;
  };

  /**
   * scrollHandler
   * 'scroll' イベントハンドラー
   * scrollEventEmit メソッドでカスタムされたイベントオブジェクトを持つ'scroll' イベントをemit する
   * @param {Event} e イベントオブジェクト
   * @returns {Void} 返り値なし
   */
  private scrollHandler = (e: Event): void => {
    clearTimeout(this._scroll.timer);

    this._scroll.eventObject.top = this._scroll.element.scrollTop;
    this._scroll.eventObject.left = this._scroll.element.scrollLeft;

    if (this._scroll.isEnd) {
      this._scroll.currentScrollTop = this._scroll.eventObject.top;
      this._scroll.isEnd = false;
    }

    if (!this._scroll.isTicking) {
      window.requestAnimationFrame(this.scrollEventEmit(e));
      this._scroll.isTicking = true;
    }

    this._scroll.timer = ((): number => {
      const originalevent: Event = e;

      return setTimeout(() => {
        this._scroll.currentScrollTop = this._scroll.eventObject.top;
        this._scroll.isEnd = true;

        this.eventEmitter.emit('endScroll', Object.assign({}, this._scroll.eventObject, { originalevent }));
      }, this._scroll.interval);
    })();
  };

  /**
   * scrollDirection
   * スクロールの進行方向を表現する文字列を返す
   * @return {string} direction | 'up' or 'bottom'
   */
  public scrollDirection = () => {
    // in-view のイベントが呼ばれた時点でのY軸のスクロール量
    const top: number = this._scroll.element.scrollTop;
    let direction: string;

    if (top > this._scroll.currentScrollTop) {
      direction = 'down';
    } else {
      direction = 'up';
    }

    // スクロール位置を更新
    this._scroll.currentScrollTop = top;

    return direction;
  };

  /**
   * updateHandler
   * requestAnimationFrame が発生すると呼び出される
   * カスタムされたイベントオブジェクトを持つ'wheel', 'wheelEnd' イベントをemit する
   * @param {number} timestamp 呼び出しを開始した現在時刻
   * @returns {Void} 返り値なし
   */
  private updateHandler = (timestamp: number): void => {
    this._update.requestID = requestAnimationFrame(this.updateHandler);
    this.eventEmitter.emit('update', { timestamp });
  };

  /**
   * wheelHandler
   * 'wheel' イベントハンドラー
   * カスタムされたイベントオブジェクトを持つ'wheel', 'wheelEnd' イベントをemit する
   * @param {WheelEvent} e イベントオブジェクト
   * @returns {Void} 返り値なし
   */
  private wheelHandler = (e: WheelEvent): void => {
    clearTimeout(this._wheel.timer);

    switch (this._wheel.eventName) {
      case 'wheel':
        this._wheel.eventObject.deltaX = e.deltaX;
        this._wheel.eventObject.deltaY = e.deltaY;
        break;
      case 'mousewheel':
        this._wheel.eventObject.deltaY = (-1 / 40) * e.wheelDelta;
        e.wheelDeltaX && (this._wheel.eventObject.deltaX = (-1 / 40) * e.wheelDeltaX);
        break;
      default:
        this._wheel.eventObject.deltaY = e.detail;
        break;
    }

    // 値が-0 の場合、0 に補正する
    this._wheel.eventObject.deltaX =
      Math.abs(this._wheel.eventObject.deltaX) !== 0 ? this._wheel.eventObject.deltaX : 0;
    this._wheel.eventObject.deltaY =
      Math.abs(this._wheel.eventObject.deltaY) !== 0 ? this._wheel.eventObject.deltaY : 0;

    // イベント時の最小値
    this._wheel.eventObject.minDeltaX = Math.min(this._wheel.eventObject.minDeltaX, this._wheel.eventObject.deltaX);
    this._wheel.eventObject.minDeltaY = Math.min(this._wheel.eventObject.minDeltaY, this._wheel.eventObject.deltaX);

    // イベント時の最大値
    this._wheel.eventObject.maxDeltaX = Math.max(this._wheel.eventObject.maxDeltaX, this._wheel.eventObject.deltaY);
    this._wheel.eventObject.maxDeltaY = Math.max(this._wheel.eventObject.maxDeltaY, this._wheel.eventObject.deltaY);

    // イベント時の合計
    this._wheel.eventObject.totalDeltaX += this._wheel.eventObject.deltaX;
    this._wheel.eventObject.totalDeltaY += this._wheel.eventObject.deltaY;

    this.eventEmitter.emit('wheel', Object.assign({}, this._wheel.eventObject, { originalevent: e }));

    this._wheel.timer = ((): number => {
      const originalevent: Event = e;

      return setTimeout(() => {
        this.eventEmitter.emit('endWheel', Object.assign({}, this._wheel.eventObject, { originalevent }));
        // イベントオブジェクトの値をリセット
        this._wheel.eventObject.deltaX = this._wheel.eventObject.totalDeltaX = this._wheel.eventObject.maxDeltaX = this._wheel.eventObject.minDeltaX = 0;
        this._wheel.eventObject.deltaY = this._wheel.eventObject.totalDeltaY = this._wheel.eventObject.maxDeltaY = this._wheel.eventObject.minDeltaY = 0;
      }, this._wheel.interval);
    })();
  };
}
