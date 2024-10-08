import pkg from "pactum";
const { spec } = pkg;
import { expect } from "chai";

describe("API tests", () => {
  it("first test", async () => {
    const response = await spec().get("https://demoqa.com/BookStore/v1/Books");
    expect(response.statusCode).to.eql(200);
    //expect(response.books.length).to.eql(5);
  });
});
