import { EventEmitter } from 'events';
import { UAParser } from 'ua-parser-js';
import detectIt from 'detect-it';
import { CONFIG } from './_config';

interface IEnviron {
  browser: string;
  browserVersion: string;
  device: string;
  os: string;
  osVersion: string;
}

interface IOptionalEventParams {
  event_category?: string;
  event_label?: string;
  value?: string;
  event_callback?: () => void;
}

/**
 * @class SiteWide
 * @classdesc
 */
export default class SiteWide extends EventEmitter {
  public CONFIG: object;
  private _isInitialized: boolean = false;
  private _isListening: boolean = false;
  private _$$html: HTMLElement;
  private _$$gTracker: NodeList;
  private _mediaQuerys: Map<string, MediaQueryList>;

  // orientationchange イベント関係
  private _orientation: {
    isOrientationDetect: boolean; // orientation イベントをサポートしているか
    defaultOrientation?: boolean | void; // 端末の向きを表現するフラグ
    direction?: string | void; // 端末の向きを表現する文字列 portrait | landscape
  } = (() => {
    // orientation 関係の値を初期化
    const isOrientationDetect: boolean = 'orientation' in window ? true : false;

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
      defaultOrientation,
      direction,
      isOrientationDetect
    };
  })();

  // resize イベント関係
  private _resize: {
    timer: number;
    interval: number;
  } = {
    interval: 200,
    timer: -1
  };

  // scroll イベント関係
  private _scroll: {
    currentScrollTop: number;
    element: Element | HTMLElement;
    eventObject: {
      top: number;
      left: number;
    };
    interval: number;
    isEnd: boolean;
    isTicking: boolean;
    timer: number;
  } = {
    currentScrollTop: 0,
    element: (() => {
      if ('scrollingElement' in window.document) {
        return document.scrollingElement!;
      } else if (navigator.userAgent.indexOf('WebKit') !== -1) {
        return document.body;
      } else {
        return document.documentElement;
      }
    })(),
    eventObject: {
      left: 0,
      top: 0
    },
    interval: 200,
    isEnd: true,
    isTicking: false,
    timer: -1
  };

  // update イベント関係
  private _update: {
    requestID: number;
  } = {
    requestID: 0
  };

  // wheel イベント関係
  private _wheel: {
    eventName: string; // 閲覧環境のwheel イベント名
    eventObject: {
      deltaX: number;
      deltaY: number;
      minDeltaX: number;
      maxDeltaY: number;
      maxDeltaX: number;
      minDeltaY: number;
      totalDeltaX: number;
      totalDeltaY: number;
    };
    interval: number;
    timer: number;
  } = {
    eventName:
      'onwheel' in document
        ? 'wheel'
        : 'onmousewheel' in document
        ? 'mousewheel'
        : 'DOMMouseScroll',
    eventObject: {
      deltaX: 0,
      deltaY: 0,
      maxDeltaX: 0,
      maxDeltaY: 0,
      minDeltaX: 0,
      minDeltaY: 0,
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

    // requestAnimationFrame polyfill
    let lastTime: number = 0;
    const vendors: ReadonlyArray<string> = ['ms', 'moz', 'webkit', 'o'];

    for (let i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
      window.requestAnimationFrame =
        window[vendors[i] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame =
        window[vendors[i] + 'CancelAnimationFrame'] ||
        window[vendors[i] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = (callback: FrameRequestCallback) => {
        const date: Date = new Date();
        const currentTime: number = date.getTime();
        const timeToCall: number = Math.max(0, 16 - (currentTime - lastTime));
        const id: number = window.setTimeout(() => {
          callback(currentTime + timeToCall);
        }, timeToCall);
        lastTime = currentTime + timeToCall;
        return id;
      };
    }

    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = (id: number) => {
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

    const browserDetect: IEnviron = this.browserDetection();

    this._$$html = document.getElementsByTagName('html').item(0)!;
    this._$$gTracker = document.querySelectorAll('.js-gTracker');

    // html 要素のclass属性にユーザーの閲覧環境に基づく値を追加
    this._$$html.classList.add(browserDetect.os || 'os-unknown');
    this._$$html.classList.add(browserDetect.browser || 'browser-unknown');
    this._$$html.classList.add(browserDetect.device || 'device-unknown');
    this._$$html.setAttribute('data-os-version', browserDetect.osVersion);
    this._$$html.setAttribute(
      'data-browser-version',
      browserDetect.browserVersion
    );

    // matchMedia のリスト
    /* tslint:disable:prettier */
    this._mediaQuerys = new Map([
      [
        'SM_SCREEN_LESS',
        window.matchMedia(`(max-width: ${CONFIG.SMALL_SCREEN_WIDTH}px)`)
      ],
      [
        'SM_SCREEN',
        window.matchMedia(`(min-width: ${CONFIG.SMALL_SCREEN_WIDTH + 1}px)`)
      ],
      [
        'MD_SCREEN_LESS',
        window.matchMedia(`(max-width: ${CONFIG.MEDIUM_SCREEN_WIDTH}px)`)
      ],
      [
        'MD_SCREEN',
        window.matchMedia(`(min-width: ${CONFIG.SMALL_SCREEN_WIDTH + 1}px) and (max-width: ${CONFIG.MEDIUM_SCREEN_WIDTH }px)`)
      ],
      [
        'MD_SCREEN_OVER',
        window.matchMedia(`(min-width: ${CONFIG.MEDIUM_SCREEN_WIDTH + 1}px)`)],
      [
        'LG_SCREEN_LESS',
        window.matchMedia(`(max-width: ${CONFIG.LARGE_SCREEN_WIDTH}px)`)],
      [
        'LG_SCREEN',
        window.matchMedia(`(min-width: ${CONFIG.MEDIUM_SCREEN_WIDTH + 1}px) and (max-width: ${CONFIG.LARGE_SCREEN_WIDTH}px)`)
      ],
      [
        'LG_SCREEN_OVER',
        window.matchMedia(`(min-width: ${CONFIG.X_LARGE_SCREEN_WIDTH + 1}px)`)
      ],
      [
        'XLG_SCREEN_LESS',
        window.matchMedia(`(max-width: ${CONFIG.X_LARGE_SCREEN_WIDTH}px)`)
      ],
      [
        'XLG_SCREEN',
        window.matchMedia(`(min-width: ${CONFIG.LARGE_SCREEN_WIDTH}px) and (max-width: ${CONFIG.X_LARGE_SCREEN_WIDTH}px)`)
      ],
      [
        'XLG_SCREEN_OVER',
        window.matchMedia(`(min-width: ${CONFIG.X_LARGE_SCREEN_WIDTH + 1}px)`)
      ]
    ]);
    /* tslint:enable:prettier */

    this._mediaQuerys.forEach((mediaQueryList: MediaQueryList, key: string) => {
      mediaQueryList.addListener(
        (() => {
          const eventName: string = key;

          return (e: MediaQueryListEvent) => {
            const isMatch: boolean = e.matches;
            this.emit(eventName, { eventName, isMatch });
          };
        })()
      );
    });

    this._scroll.element = (() => {
      if ('scrollingElement' in window.document) {
        return document.scrollingElement!;
      } else if (navigator.userAgent.indexOf('WebKit') !== -1) {
        return document.body;
      } else {
        return document.documentElement;
      }
    })();

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
      window.addEventListener(
        'resize',
        this.resizeHandler,
        detectIt.passiveEvents ? { passive: true } : false
      );

      // スクロールの初期値を初期化する
      this._scroll.currentScrollTop = this._scroll.element.scrollTop;
      this._scroll.eventObject.top = this._scroll.element.scrollTop;
      this._scroll.eventObject.left = this._scroll.element.scrollLeft;
      // scroll 時のイベントリスナー
      window.addEventListener(
        'scroll',
        this.scrollHandler,
        detectIt.passiveEvents ? { passive: true } : false
      );

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
      window.removeEventListener(
        'orientationchange',
        this.orientationChangelHandler
      );
      window.removeEventListener('resize', this.resizeHandler);
      window.removeEventListener('scroll', this.scrollHandler);
      window.removeEventListener(this._wheel.eventName, this.wheelHandler);
      cancelAnimationFrame(this._update.requestID);
    }

    return this;
  }

  /**
   * browserDetection
   * ユ-ザーの閲覧環境情報を返す
   * @returns {Environ} result ユ-ザーの閲覧環境
   */
  public browserDetection(): IEnviron {
    console.log('[SiteWide] browserDetection');

    const uaParser = new UAParser();

    const browserName: string = uaParser.getBrowser().name!
      ? uaParser.getBrowser().name!.toLowerCase()
      : '';
    const browserVersion: string = uaParser.getBrowser().version!
      ? uaParser.getBrowser().version!
      : '';
    const deviceType: string = uaParser.getDevice().type!
      ? uaParser.getDevice().type!.toLowerCase()
      : '';
    const osName: string = uaParser.getOS().name!
      ? uaParser.getOS().name!.toLowerCase()
      : '';
    const osVersion: string = uaParser.getOS().version!
      ? uaParser.getOS().version!
      : '';

    const result: IEnviron = {
      browser: this.format(browserName),
      browserVersion: this.format(browserVersion),
      device: this.format(deviceType),
      os: this.format(osName),
      osVersion: this.format(osVersion)
    };

    return result;
  }

  /**
   * scrollDirection
   * スクロールの進行方向を表現する文字列を返す
   * @return {string} direction | 'up' or 'bottom'
   */
  public scrollDirection = () => {
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
   * format
   * 引数に渡された文字列から空白と"[", "]" を削除し、
   * 単語間を"-" で接続した文字列を返す
   * @param {string} word 整形元の文字列
   * @returns {string} result
   */
  private format(word: string): string {
    const sanitizedWords: string[] = [];
    const words: string[] = word.split(' ');
    let result: string;

    for (const w of words) {
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
   * gTrackerClickHandler
   * gTracker が click された時のイベントハンドラー
   * @param {Event} e イベントオブジェクト
   * @returns {Void} 返り値なし
   */
  private gTrackerClickHandler = (e: MouseEvent): void => {
    const $$target: HTMLElement = e.currentTarget as HTMLElement;
    const tagName: string = $$target.tagName.toUpperCase();
    const href: string = $$target.getAttribute('href')!;
    const isntBlank: boolean = $$target.getAttribute('target') !== '_blank';
    const isntHashLink: boolean = !new RegExp('^#').test(href);
    let eventCallback: () => void = () => {
      /* noop */
    };

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

    const optionalEventParams: IOptionalEventParams = {};
    const eventAction: string = $$target.dataset.eventAction!;
    const eventCategory: string = $$target.dataset.eventCategory!;
    const eventLabel: string = $$target.dataset.eventLabel!;
    const eventValue: string = $$target.dataset.eventValue!;

    // イベントトラッキングが指定されている場合の処理
    if (eventAction && eventAction.length > 0) {
      optionalEventParams.event_category =
        typeof eventCategory !== 'undefined' ? eventCategory : undefined;
      optionalEventParams.event_label =
        typeof eventLabel !== 'undefined' ? eventLabel : undefined;
      optionalEventParams.value =
        typeof eventValue !== 'undefined' ? eventValue : undefined;
      optionalEventParams.event_callback =
        typeof eventCallback !== 'undefined'
          ? eventCallback
          : () => {
              /* noop */
            };
      gtag('event', eventAction, optionalEventParams);
    } else {
      console.error(
        '[SiteWide] .js-gTracker には data 属性 event-action に1文字以上の文字列を指定する必要があります'
      );
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

      if (
        (deg && this._orientation.defaultOrientation) ||
        !(deg || this._orientation.defaultOrientation)
      ) {
        direction = 'portrait';
      } else {
        direction = 'landscape';
      }

      this.emit('orientationchange', { direction, originalevent });
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
      const timeoutId: number = window.setTimeout(() => {
        const originalevent: Event = e;
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.emit('resize', { width, height, originalevent });
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
      this.emit(
        'scroll',
        Object.assign({}, this._scroll.eventObject, { originalevent })
      );
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

      return window.setTimeout(() => {
        this._scroll.currentScrollTop = this._scroll.eventObject.top;
        this._scroll.isEnd = true;

        this.emit(
          'endScroll',
          Object.assign({}, this._scroll.eventObject, { originalevent })
        );
      }, this._scroll.interval);
    })();
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
    this.emit('update', { timestamp });
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
        this._wheel.eventObject.deltaX =
          'wheelDeltaX' in e ? (-1 / 40) * e.wheelDeltaX : 0;
        break;
      default:
        this._wheel.eventObject.deltaY = e.detail;
        break;
    }

    // 値が-0 の場合、0 に補正する
    this._wheel.eventObject.deltaX =
      Math.abs(this._wheel.eventObject.deltaX) !== 0
        ? this._wheel.eventObject.deltaX
        : 0;
    this._wheel.eventObject.deltaY =
      Math.abs(this._wheel.eventObject.deltaY) !== 0
        ? this._wheel.eventObject.deltaY
        : 0;

    // イベント時の最小値
    this._wheel.eventObject.minDeltaX = Math.min(
      this._wheel.eventObject.minDeltaX,
      this._wheel.eventObject.deltaX
    );
    this._wheel.eventObject.minDeltaY = Math.min(
      this._wheel.eventObject.minDeltaY,
      this._wheel.eventObject.deltaX
    );

    // イベント時の最大値
    this._wheel.eventObject.maxDeltaX = Math.max(
      this._wheel.eventObject.maxDeltaX,
      this._wheel.eventObject.deltaY
    );
    this._wheel.eventObject.maxDeltaY = Math.max(
      this._wheel.eventObject.maxDeltaY,
      this._wheel.eventObject.deltaY
    );

    // イベント時の合計
    this._wheel.eventObject.totalDeltaX += this._wheel.eventObject.deltaX;
    this._wheel.eventObject.totalDeltaY += this._wheel.eventObject.deltaY;

    this.emit(
      'wheel',
      Object.assign({}, this._wheel.eventObject, { originalevent: e })
    );

    this._wheel.timer = ((): number => {
      const originalevent: Event = e;

      return window.setTimeout(() => {
        this.emit(
          'endWheel',
          Object.assign({}, this._wheel.eventObject, { originalevent })
        );
        // イベントオブジェクトの値をリセット
        this._wheel.eventObject.deltaX = this._wheel.eventObject.totalDeltaX = this._wheel.eventObject.maxDeltaX = this._wheel.eventObject.minDeltaX = 0;
        this._wheel.eventObject.deltaY = this._wheel.eventObject.totalDeltaY = this._wheel.eventObject.maxDeltaY = this._wheel.eventObject.minDeltaY = 0;
      }, this._wheel.interval);
    })();
  };
}
