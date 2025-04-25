// Setup file for client tests

global.fetch = jest.fn();

// Mock browser APIs that might be used in client code
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock DOM elements and methods used in client code
global.document.getElementById = jest.fn().mockImplementation((id) => {
  return {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    style: {},
    value: '',
    innerHTML: '',
    textContent: '',
    setAttribute: jest.fn(),
    removeAttribute: jest.fn(),
    showModal: jest.fn(),
    querySelector: jest.fn().mockReturnValue({
      replaceChildren: jest.fn(),
    }),
  };
});

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
