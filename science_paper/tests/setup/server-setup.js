// Setup file for server tests

// Mock Chrome and Puppeteer dependencies
jest.mock('chrome-launcher', () => ({
  launch: jest.fn().mockResolvedValue({
    port: 9222,
    kill: jest.fn().mockResolvedValue(undefined),
  }),
}));

jest.mock('puppeteer', () => ({
  connect: jest.fn().mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      goto: jest.fn().mockResolvedValue(undefined),
      evaluate: jest.fn().mockResolvedValue({}),
      close: jest.fn().mockResolvedValue(undefined),
    }),
    close: jest.fn().mockResolvedValue(undefined),
  }),
}));

jest.mock('lighthouse', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
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
    report: 'HTML report',
  }),
}));

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
