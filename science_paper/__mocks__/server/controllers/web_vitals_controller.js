// Mock for web_vitals_controller.ts
module.exports = {
  webVitalsController: jest.fn().mockImplementation((req, res) => {
    res.send({
      data: {
        lhr: {
          audits: {
            'first-contentful-paint': { displayValue: '1.0 s' },
            'cumulative-layout-shift': { displayValue: '0' },
            'max-potential-fid': { displayValue: '100 ms' },
            'total-blocking-time': { displayValue: '0 ms' },
            'largest-contentful-paint': { displayValue: '1.5 s' },
            'interactive': { displayValue: '1.2 s' },
            'server-response-time': { displayValue: '0.1 s' },
          },
        },
      },
    });
  }),
};
