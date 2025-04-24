import {ThrottleType, Modifiers} from '../common/types';

import {getWebVitals} from './services/api_service';
import {selectNetworkThrottlingType} from './selectors';


const dialog = document.getElementById('dialog') as HTMLDialogElement;
const input = document.getElementById('url') as HTMLInputElement;
const dialogButton = document.getElementById('show_dialog');
const webVitalsButton = document.getElementById('check_web_vitals');
const loadingElement = document.getElementById('loading');
const resultsElement = document.getElementById('results');
const errorElement = document.getElementById('error');

const enum Metrics {
    CLS = 'cumulative-layout-shift',
    FCP = 'first-contentful-paint',
    LCP = 'largest-contentful-paint',
    FID = 'max-potential-fid',
    TTFB = 'server-response-time',
    TBT = 'total-blocking-time',
    TTI = 'interactive',
}

const metricDescriptions = {
    [Metrics.FCP]: 'Time until the browser renders the first bit of content from the DOM.',
    [Metrics.CLS]: 'Measures visual stability by quantifying unexpected layout shifts.',
    [Metrics.FID]: 'An estimate of how long your page will take to respond to user input.',
    [Metrics.TBT]: 'Sum of all time periods between FCP and TTI when the main thread was blocked.',
    [Metrics.LCP]: 'Time when the largest content element in the viewport becomes visible.',
    [Metrics.TTI]: 'Time when the page becomes fully interactive.',
    [Metrics.TTFB]: 'Time taken for the server to respond with the first byte of the page content.'
};

const thresholds = {
    [Metrics.FCP]: {good: 1.8, poor: 3.0},
    [Metrics.CLS]: {good: 0.1, poor: 0.25},
    [Metrics.FID]: {good: 100, poor: 300},
    [Metrics.TBT]: {good: 200, poor: 600},
    [Metrics.LCP]: {good: 2.5, poor: 4.0},
    [Metrics.TTI]: {good: 3.8, poor: 7.3},
    [Metrics.TTFB]: {good: 0.1, poor: 0.6},
};

dialogButton?.addEventListener('click', onOpenDialog);

function onOpenDialog() {
    hideError();
    hideLoading();
    clearResults();

    dialog.showModal();

    webVitalsButton?.addEventListener('click', onGetWebVitals);
    dialog.addEventListener("close", () => {
        webVitalsButton?.removeEventListener('click', onGetWebVitals);
    });
}

function showLoading() {
    if (loadingElement) {
        loadingElement.style.display = 'flex';
    }
}

function hideLoading() {
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

function showError(message: string) {
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function hideError() {
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function clearResults() {
    if (resultsElement) {
        resultsElement.innerHTML = '';
    }
}

function getPerformanceClass(metricName: string | undefined, value: string): string {
    if (!value || !metricName) {
        return '';
    }
    
    const numericValue = parseFloat(value);
    const threshold = thresholds[metricName as keyof typeof thresholds];
    
    if (!threshold) {
        return '';
    }
    
    if (numericValue <= threshold.good) {
        return 'good';
    }
    if (numericValue >= threshold.poor) {
        return 'poor';
    }
    return 'average';
}

// Format metric name for display
function formatMetricName(name: string | undefined): string {
    if (!name) {
        return 'Unknown Metric';
    }
    
    switch(name) {
        case Metrics.FCP:
            return 'FCP (First Contentful Paint)';
        case Metrics.CLS:
            return 'CLS (Cumulative Layout Shift)';
        case Metrics.FID:
            return 'FID (First Input Delay)';
        case Metrics.TBT:
            return 'TBT (Total Blocking Time)';
        case Metrics.LCP:
            return 'LCP (Largest Contentful Paint)';
        case Metrics.TTI:
            return 'TTI (Time To Interactive)';
        case Metrics.TTFB:
            return 'TTFB (Time To First Byte)';
        default:
            return name;
    }
}

// Main function to get web vitals
async function onGetWebVitals() {
    const value = input?.value;
    // Convert string value to ThrottleType enum
    const throttleTypeValue = selectNetworkThrottlingType();
    const throttleType = throttleTypeValue !== undefined 
        ? parseInt(throttleTypeValue, 10) as ThrottleType 
        : ThrottleType.NO_THROTTLE;

    if (!value || !webVitalsButton) {
        showError('Please enter a valid URL');
        return;
    }

    try {
        hideError();
        clearResults();
        showLoading();
        webVitalsButton.setAttribute('disabled', 'true');

        // Use the user's input URL for the API request
        const {data} = await getWebVitals({
            url: value,
            modifiers: [
                Modifiers.ADD_LIGHTHOUSE_REPORT,
                Modifiers.ENABLE_NETWORK_THROTTLING
            ],
            throttleType,
        });

        hideLoading();

        if (!data || !data.lhr || !data.lhr.audits) {
            showError('No performance data available for this URL');
            return;
        }

        const container = dialog.querySelector('#results');
        if (container) {
            const audits = data.lhr.audits;
            
            // Define metric type
            type Metric = {
                name: string;
                value: string;
            };
            
            // Create metrics data using the enum values for consistency
            const metrics: Metric[] = [
                {name: Metrics.FCP, value: audits['first-contentful-paint']?.displayValue || ''},
                {name: Metrics.CLS, value: audits['cumulative-layout-shift']?.displayValue || ''},
                {name: Metrics.FID, value: audits['max-potential-fid']?.displayValue || ''},
                {name: Metrics.TBT, value: audits['total-blocking-time']?.displayValue || ''},
                {name: Metrics.LCP, value: audits['largest-contentful-paint']?.displayValue || ''},
                {name: Metrics.TTI, value: audits['interactive']?.displayValue || ''},
                {name: Metrics.TTFB, value: audits['server-response-time']?.displayValue || ''}
            ].filter(metric => metric.value);

            const resultsContainer = document.createElement('div');
            
            const header = document.createElement('div');
            header.className = 'results-header';
            header.innerHTML = `
                <h2 class="results-title">Performance Results</h2>
                <div class="results-url">URL: ${value}</div>
            `;
            resultsContainer.appendChild(header);
            
            const metricsGrid = document.createElement('div');
            metricsGrid.className = 'metrics-grid';
            
            metrics.forEach(metric => {
                const performanceClass = getPerformanceClass(metric.name, metric.value);
                const metricCard = document.createElement('div');
                metricCard.className = 'metric-card';
                metricCard.innerHTML = `
                    <div class="metric-card-header">
                        <h3 class="metric-card-title">${metric.name ? formatMetricName(metric.name) : 'Unknown Metric'}</h3>
                    </div>
                    <div class="metric-card-value ${performanceClass}">${metric.value}</div>
                    <div class="metric-card-description">
                        ${metric.name && metricDescriptions[metric.name as keyof typeof metricDescriptions] 
                            ? metricDescriptions[metric.name as keyof typeof metricDescriptions] 
                            : ''}
                    </div>
                `;
                metricsGrid.appendChild(metricCard);
            });
            
            resultsContainer.appendChild(metricsGrid);
            container.replaceChildren(resultsContainer);
        }
    } catch(e) {
        hideLoading();
        showError('An error occurred while fetching performance data. Please try again.');
        console.error('Error fetching web vitals:', e);
    } finally {
        webVitalsButton.removeAttribute('disabled');
    }
}
