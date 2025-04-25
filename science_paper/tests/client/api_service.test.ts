const apiService = require('../../client/services/api_service');
const types = require('../../common/types');

describe('API Service', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = jest.fn();
  });

  test('getWebVitals makes correct fetch request', async () => {
    // Mock successful fetch response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { mockData: true } }),
    });

    // Test parameters
    const params = {
      url: 'https://example.com',
      modifiers: [types.Modifiers.ADD_LIGHTHOUSE_REPORT],
      throttleType: types.ThrottleType.NO_THROTTLE,
    };

    // Call the API service
    const result = await apiService.getWebVitals(params);

    // Verify the fetch call
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('/api/web-vitals', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(params),
    }));

    // Verify the result
    expect(result).toEqual({ data: { mockData: true } });
  });

  test('getWebVitals handles fetch errors', async () => {
    // Mock failed fetch response
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    // Test parameters
    const params = {
      url: 'https://example.com',
      modifiers: [types.Modifiers.ADD_LIGHTHOUSE_REPORT],
      throttleType: types.ThrottleType.NO_THROTTLE,
    };

    // Expect the API call to throw an error
    await expect(apiService.getWebVitals(params)).rejects.toThrow('Network error');
  });

  test('getWebVitals handles non-OK responses', async () => {
    // Mock non-OK fetch response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    // Test parameters
    const params = {
      url: 'https://example.com',
      modifiers: [types.Modifiers.ADD_LIGHTHOUSE_REPORT],
      throttleType: types.ThrottleType.NO_THROTTLE,
    };

    // Expect the API call to throw an error
    await expect(apiService.getWebVitals(params)).rejects.toThrow('HTTP error! Status: 500');
  });
});
