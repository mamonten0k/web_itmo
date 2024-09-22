import {type Options, type LaunchedChrome} from 'chrome-launcher';
import {type Browser, type Page, type CDPSession} from 'puppeteer';
import {type Config} from 'lighthouse';

export enum ThrottleType {
    FAST_3G,
    NO_THROTTLE,
    OFFLINE,
    SLOW_3G,
};

export enum Modifiers {
    DISABLE_JS,
    ENABLE_CPU_THROTTLING,
    ENABLE_NETWORK_THROTTLING,
    ADD_LIGHTHOUSE_REPORT,
};

export type WebVitalsParams = {
    browser: Browser,
    chrOptions: Options,
    lhParams: {url: string, config: Config},
    chrome: LaunchedChrome,
    page: Page,
    session?: CDPSession,
    throttleType?: ThrottleType,
}
