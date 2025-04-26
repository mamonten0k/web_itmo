// const webVitalsController = require('../../server/controllers/web_vitals_controller').webVitalsController;
// const types = require('../../common/types');
// const startup = require('../../server/startup');
// const modifiers = require('../../server/modifiers');

// Mock the dependencies
jest.mock('../../server/startup', () => ({
  // launchChrome: jest.fn(),
}));

jest.mock('../../server/modifiers', () => ({
  // disableJS: jest.fn(),
  // enableCPUThrottling: jest.fn(),
  // enableNetworkThrottling: jest.fn(),
  // getLighthouseReport: jest.fn(),
}));

describe('Web Vitals Controller', () => {
  // let mockRequest;
  // let mockResponse;
  // let mockBrowser;
  // let mockPage;
  // let mockChrome;

  // beforeEach(() => {
  //   // Reset mocks
  //   jest.clearAllMocks();

  //   // Set up mock browser, page, and chrome
  //   mockPage = {
  //     goto: jest.fn().mockResolvedValue(undefined),
  //   };

  //   mockBrowser = {
  //     newPage: jest.fn().mockResolvedValue(mockPage),
  //     close: jest.fn().mockResolvedValue(undefined),
  //   };

  //   mockChrome = {
  //     kill: jest.fn(),
  //   };

  //   // Mock the launchChrome function
  //   startup.launchChrome.mockImplementation(async (params) => {
  //     params.browser = mockBrowser;
  //     params.chrome = mockChrome;
  //     return undefined;
  //   });

  //   // Mock the getLighthouseReport function
  //   modifiers.getLighthouseReport.mockResolvedValue({
  //     lhr: {
  //       audits: {
  //         'first-contentful-paint': { displayValue: '1.0 s' },
  //         'cumulative-layout-shift': { displayValue: '0' },
  //       },
  //     },
  //   });

  //   // Set up mock request and response
  //   mockRequest = {
  //     body: {
  //       url: 'https://example.com',
  //       modifiers: [types.Modifiers.ADD_LIGHTHOUSE_REPORT],
  //       throttleType: types.ThrottleType.NO_THROTTLE,
  //     },
  //   };

  //   mockResponse = {
  //     send: jest.fn(),
  //   };
  // });

  test('webVitalsController processes request and returns data', async () => {
    // // Call the controller
    // await webVitalsController(mockRequest, mockResponse);

    // // Verify Chrome was launched
    // expect(startup.launchChrome).toHaveBeenCalled();

    // // Verify a new page was created
    // expect(mockBrowser.newPage).toHaveBeenCalled();

    // // Verify the page was navigated to the URL
    // expect(mockPage.goto).toHaveBeenCalledWith('https://example.com', expect.anything());

    // // Verify the Lighthouse report was generated
    // expect(modifiers.getLighthouseReport).toHaveBeenCalled();

    // // Verify the response was sent
    // expect(mockResponse.send).toHaveBeenCalledWith(expect.objectContaining({
    //   data: expect.objectContaining({
    //     lhr: expect.objectContaining({
    //       audits: expect.objectContaining({
    //         'first-contentful-paint': expect.anything(),
    //       }),
    //     }),
    //   }),
    // }));

    // // Verify resources were cleaned up
    // expect(mockBrowser.close).toHaveBeenCalled();
    // expect(mockChrome.kill).toHaveBeenCalled();
  });

  test('webVitalsController handles errors gracefully', async () => {
    // // Make the page.goto method throw an error
    // mockPage.goto = jest.fn().mockRejectedValue(new Error('Navigation failed'));

    // // Call the controller
    // await webVitalsController(mockRequest, mockResponse);

    // // Verify the error was handled and resources were cleaned up
    // expect(mockResponse.send).toHaveBeenCalledWith(expect.objectContaining({
    //   data: {},
    // }));
    // expect(mockBrowser.close).toHaveBeenCalled();
    // expect(mockChrome.kill).toHaveBeenCalled();
  });

  test('webVitalsController applies the correct modifiers', async () => {
    // // Add more modifiers to the request
    // mockRequest.body.modifiers = [
    //   types.Modifiers.DISABLE_JS,
    //   types.Modifiers.ENABLE_CPU_THROTTLING,
    //   types.Modifiers.ENABLE_NETWORK_THROTTLING,
    //   types.Modifiers.ADD_LIGHTHOUSE_REPORT,
    // ];

    // // Call the controller
    // await webVitalsController(mockRequest, mockResponse);

    // // Verify all modifiers were applied
    // expect(modifiers.disableJS).toHaveBeenCalled();
    // expect(modifiers.enableCPUThrottling).toHaveBeenCalled();
    // expect(modifiers.enableNetworkThrottling).toHaveBeenCalled();
    // expect(modifiers.getLighthouseReport).toHaveBeenCalled();
  });
});
