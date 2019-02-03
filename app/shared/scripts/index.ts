// import FontFaceObserver from 'fontfaceobserver';
import * as modernizr from 'modernizr';
import SiteWide from './_SiteWide';

declare global {
  // tslint:disable-next-line interface-name
  interface Window {
    modernizr: ModernizrStatic;
    lazySizesConfig: {
      lazyClass: string;
      loadedClass: string;
    };
    SW: SiteWide;
  }
}

(() => {
  // リダイレクト処理
  window.modernizr = modernizr;

  // サイト全体で使うユーティリティ機能
  window.SW = new SiteWide();

  // Web Font のローディング処理
  /*
  (() => {
    const $$html: HTMLElement = document.getElementsByTagName('html').item(0);

    const fontData = {
      'Barlow Condensed': {}
    };

    let observers = [];

    Object.keys(fontData).forEach(family => {
      const data = observers[family];
      const observer = new FontFaceObserver(family, data);
      observers.push(observer.load());
    });

    $$html.classList.add('sw-WebFont-loading');
    window.SW.eventEmitter.emit('webFontLoading');

    Promise.all(observers)
      .then(fonts => {
        $$html.classList.remove('sw-WebFont-loading');
        $$html.classList.add('sw-WebFont-active');
        window.SW.eventEmitter.emit('webFontActive');
      })
      .catch(err => {
        $$html.classList.remove('sw-WebFont-loading');
        $$html.classList.add('sw-WebFont-inactive');
        window.SW.eventEmitter.emit('webFontInactive');
      });
  })();
  */

  const onDOMContentLoaded = () => {
    window.SW.initialize();
    window.SW.listen();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
  } else {
    onDOMContentLoaded();
  }
})();
