import {launch} from 'chrome-launcher';
import fetch from 'node-fetch';
import puppeteer from 'puppeteer';

import type {WebVitalsParams} from '../../common/types';


export const launchChrome = async (params: WebVitalsParams): Promise<void> => {
  params.chrome = await launch(params.chrOptions);

  const res = await fetch(`http://127.0.0.1:${params.chrome.port}/json/version`);
  const {webSocketDebuggerUrl} = await res.json() as {webSocketDebuggerUrl: string};

  params.browser = await puppeteer.connect({
    browserWSEndpoint: webSocketDebuggerUrl
  });
};