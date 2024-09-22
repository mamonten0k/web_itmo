import lighthouse, {generateReport } from 'lighthouse';

import {WebVitalsParams, ThrottleType} from '../../common/types';


// Represented in bytes per second.
const loadMultiplier = 1024 / 8 * .8;

const slow3G = {
    'offline': false,
    // Represented in bytes per second.
    'downloadThroughput': 500 * loadMultiplier,
    // Represented in bytes per second.
    'uploadThroughput': 500 * loadMultiplier,
    // Represented in milliseconds.
    'latency': 400 * 5,
};

const fast3G = {
    'offline': false,
    // Represented in bytes per second.
    'downloadThroughput': 1500 * loadMultiplier,
    // Represented in bytes per second.
    'uploadThroughput': 1500 * loadMultiplier,
    // Represented in milliseconds.
    'latency': 150 * 5,
};

const offline = {
    'offline': true,
    // Represented in bytes per second.
    'downloadThroughput': 0,
    // Represented in bytes per second.
    'uploadThroughput': 0,
    // Represented in milliseconds.
    'latency': 0,
};

export const enableNetworkThrottling = async (params: WebVitalsParams): Promise<void> => {
    const session = await params.page.createCDPSession();
    await session.send('Network.enable');
    params.session = session;

    // Simulate network throttling.
    switch (params.throttleType) {
        case ThrottleType.FAST_3G:
            await session.send(
                'Network.emulateNetworkConditions', fast3G);
            break;
        case ThrottleType.SLOW_3G:
            await session.send(
                'Network.emulateNetworkConditions', slow3G);
            break;
        case ThrottleType.OFFLINE:
            await session.send(
                'Network.emulateNetworkConditions', offline);
            break;
        case ThrottleType.NO_THROTTLE:
        default:
            break;
    }
};

export const enableCPUThrottling = async (params: WebVitalsParams): Promise<void> => {
    if (params.session) {
        await params.session.send('Emulation.setCPUThrottlingRate', {rate: 4});
    }
};

export const disableJS = async (params: WebVitalsParams): Promise<void> => {
    params.page.on('request', request => {
        if (request.resourceType() === 'script') {
            request.abort();
        } else {
            request.continue();
        }
    });
};

export const getLighthouseReport = async (params: WebVitalsParams): Promise<object> => {
    try {
        const config = {
            extends: 'lighthouse:default',
            screenEmulation: {
              disabled: true,
            },
            settings: {
                onlyAudits: [
                    'first-contentful-paint',
                    'first-meaningful-paint',
                    'largest-contentful-paint',
                    'largest-contentful-paint-element',
                    'layout-shifts',
                    'metrics',
                    'render-blocking-resources',
                    'interactive',
                    'total-blocking-time',
                ],
                onlyCategories: [
                    'performance',
                ],
            }
        }

        const results = await lighthouse(
            params.lhParams.url,
            undefined,
            undefined,
            params.page,
        );

        return {lhr: results ? JSON.parse(generateReport(results.lhr, 'json')) : {}};
    } catch (e) {
        // Do nothing.
        return {lhr: {}};
    }
};
