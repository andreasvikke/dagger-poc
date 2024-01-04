import { hello, server } from "../src/app";

describe("Math functions", () => {
  it("should return 'Hello World!'", () => {
    const result = hello();
    expect(result).toEqual('Hello World!');
  });
});

afterAll(done => {
  server.close();
  done();
});