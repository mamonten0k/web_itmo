import {Request, Response} from 'express';

import {WebVitalsParams, Modifiers, ThrottleType} from '../../common/types';
import {launchChrome} from '../startup';
import {disableJS, enableCPUThrottling, enableNetworkThrottling, getLighthouseReport} from '../modifiers';


const RUN_MODIFIERS: ReadonlyArray<[Function, Modifiers]> = [
    [disableJS, Modifiers.DISABLE_JS],
    [enableCPUThrottling, Modifiers.ENABLE_CPU_THROTTLING],
    [enableNetworkThrottling, Modifiers.ENABLE_NETWORK_THROTTLING],
];

const REPORT_MODIFIERS: ReadonlyArray<[Function, Modifiers]> = [
    [getLighthouseReport, Modifiers.ADD_LIGHTHOUSE_REPORT],
];

export const webVitalsController = async (req: Request, res: Response): Promise<void> => {
    const url = req.body.url;
    const params: WebVitalsParams = {
        chrOptions: {
            logLevel: 'info',
            chromeFlags: [ '--headless', ],
        },
        lhParams: {url, config: null},
        throttleType: req.body.throttleType ??
            ThrottleType.NO_THROTTLE,
        ...req.body.options
    };

    let data: object = {};

    try {
        await launchChrome(params);
        params.page = await params.browser.newPage();

        const runMods = RUN_MODIFIERS.filter(
            ([_, modifier]) => req.body.modifiers?.includes(modifier));
        for (const [modifier] of runMods) {
            await modifier(params);
        };

        await params.page.goto(url, {
            waitUntil: [
                'load',
                'domcontentloaded',
                'networkidle0',
                'networkidle2',
            ],
            timeout: 0,
        });

        const reportMods = REPORT_MODIFIERS.filter(
            ([_, modifier]) => req.body.modifiers?.includes(modifier));
        for (const [modifier] of reportMods) {
            const res = await modifier(params);
            data = {...data, ...res};
        };
    } catch (e) {
        console.log(e);
        // Indicate bad request.
    } finally {
        // Cleanup server resoucres.
        await params.browser?.close();
        params.chrome?.kill();
    }

    res.send({data});
};
