import * as modernizr from 'modernizr';
import { SiteWide } from './SiteWide';

declare global {
  interface Window {
    modernizr: ModernizrStatic;
    SW: SiteWide;
  }
}

(() => {
  window.modernizr = modernizr;
  window.SW = new SiteWide();
  window.SW.initialize();
  window.SW.listen();
})();
