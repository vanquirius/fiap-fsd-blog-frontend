// jest.setup.js (CommonJS)

require("@testing-library/jest-dom");
require("cross-fetch/polyfill");

// Polyfill TextEncoder/TextDecoder (needed by MSW)
const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill Web Streams API (needed by MSW)
// Polyfill Web Streams API (needed by MSW)
const streams = require("web-streams-polyfill/dist/ponyfill");

global.ReadableStream = streams.ReadableStream;
global.WritableStream = streams.WritableStream;
global.TransformStream = streams.TransformStream;

// Safety fallback
if (!globalThis.Response || !globalThis.Request || !globalThis.Headers) {
    const poly = require("cross-fetch");
    globalThis.fetch = globalThis.fetch || poly;
}

const { server } = require("./tests/mocks/server");

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());