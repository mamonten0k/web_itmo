import {ThrottleType, Modifiers} from '../common/types';


const dialog = document.getElementById('dialog') as HTMLDialogElement;

const input = document.getElementById('url') as HTMLInputElement;

const dialogButton = document.getElementById('show_dialog');
const webVitalsButton = document.getElementById('check_web_vitals');

dialogButton?.addEventListener('click', openDialog);

async function openDialog() {
    dialog.showModal();

    webVitalsButton?.addEventListener('click', getWebVitals);
    addEventListener("close", () => {
        webVitalsButton?.removeEventListener('click', getWebVitals);
    });
}

function getSelectedNetworkThrottlingType() {
    const radioBtns = dialog.querySelectorAll('[name="network"]') as NodeListOf<HTMLInputElement>;
    return Array.from(radioBtns)?.filter(btn => btn.checked)[0].value;
}

async function getWebVitals() {
    const value = input?.value;
    const throttleType = getSelectedNetworkThrottlingType() ?? ThrottleType.NO_THROTTLE;

    if (!value || !webVitalsButton) {
        return;
    }

    try {
        webVitalsButton.setAttribute('disabled', 'true');

        const res = await fetch('/api/web-vitals', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({
                url: 'http://xmlns.com/foaf/spec/#term_Person',
                modifiers: [
                    Modifiers.ADD_LIGHTHOUSE_REPORT,
                    Modifiers.ENABLE_NETWORK_THROTTLING
                ],
                throttleType,
            }),
        });

        const container = dialog.querySelector('#results');
        if (container) {
            const {data} = await res.json();
            const audits = data.lhr?.audits;
    
            const first_contentful_paint = audits['first-contentful-paint']?.displayValue;
            const cumulative_layout_shift = audits['cumulative-layout-shift']?.displayValue;
            const first_input_delay = audits['max-potential-fid']?.displayValue;
            const total_blocking_time = audits['total-blocking-time']?.displayValue;
            const largest_contentful_paint = audits['largest-contentful-paint']?.displayValue;
            const time_to_interactive = audits['interactive']?.displayValue;
            const time_to_first_byte = audits['server-response-time']?.displayValue;

            const element = document.createElement('div');
            element.innerHTML = `
                <hr/>
                <h2>WEB-VITALS</h2>
                <p><strong>FCP (First Contentful Paint):</strong> ${first_contentful_paint}</p>
                <p><strong>CMS (Cumulative Layout Shift):</strong> ${cumulative_layout_shift}</p>
                <p><strong>FID (First Input Delay):</strong> ${first_input_delay}</p>
                <p><strong>TBT (Total Blocking Time):</strong> ${total_blocking_time}</p>
                <p><strong>LCP (Largest Contentful Paint):</strong> ${largest_contentful_paint}</p>
                <p><strong>TTFB (Time To First Byte):</strong> ${time_to_first_byte}</p>
                <p><strong>TTI (Time To Interactive):</strong> ${time_to_interactive}</p>
            `;
            container.replaceChildren(element); 
        }
    } catch(e) {
        // Do nothing.
    } finally {
        webVitalsButton.removeAttribute('disabled');
    }
}