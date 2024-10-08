import pkg from "pactum";
const { spec } = pkg;
import { expect } from "chai";
import { baseUrl, userId, user, password } from "../helpers/data.js";

let token;
let bookIsbn;

describe("API tests", () => {
  it("Get list of all books", async () => {
    const response = await spec().get(`${baseUrl}/BookStore/v1/Books`);
    //.inspect(); return response body
    expect(response.statusCode).to.eql(200);

    expect(response.body.books).to.have.length(8);
    expect(response.body.books[0].title).to.eql("Git Pocket Guide");
    expect(response.body.books[4].author).to.eql("Kyle Simpson");
    for (const books of response.body.books) {
      expect(books.title).to.not.empty;
    }
    bookIsbn = response.body.books[4].isbn;
  });

  it.skip("Create user account", async () => {
    const response = await spec()
      .post(`${baseUrl}/Account/v1/User`)

      .withBody({
        userName: user,
        password: password,
      });
    expect(response.statusCode).is.eql(201);
  });

  it("Generate token for user", async () => {
    const response = await spec()
      .post(`${baseUrl}/Account/v1/GenerateToken`)

      .withBody({
        userName: user,
        password: password,
      });
    token = response.body.token;
    expect(response.statusCode).is.eql(200);
  });

  it("Authorize user", async () => {
    const response = await spec()
      .post(`${baseUrl}/Account/v1/Authorized`)

      .withBody({
        userName: user,
        password: password,
      });
    expect(response.statusCode).is.eql(200);
    expect(response.body).is.true;
  });

  it("Get user informations", async () => {
    const response = await spec()
      .get(`${baseUrl}/Account/v1/User/${userId}`)
      .withBearerToken(token);
    expect(response.statusCode).is.eql(200);
    expect(response.body.books).is.eql([]);
  });

  it("Assign book to logged user", async () => {
    const response = await spec()
      .post(`${baseUrl}/BookStore/v1/Books`)
      .withBearerToken(token)

      .withBody({
        userId: userId,
        collectionOfIsbns: [
          {
            isbn: bookIsbn,
          },
        ],
      });
    expect(response.statusCode).is.eql(201);
    expect(response.body.books[0].isbn).is.eql(bookIsbn);
  });

  it("Get user books", async () => {
    const response = await spec()
      .get(`${baseUrl}/Account/v1/User/${userId}`)
      .withBearerToken(token);
    expect(response.statusCode).is.eql(200);
    expect(response.body.books[0].isbn).is.eql(bookIsbn);
  });

  it("Delete added book from user account", async () => {
    const response = await spec()
      .delete(`${baseUrl}/BookStore/v1/Book`)
      .withBearerToken(token)
      .withBody({
        isbn: bookIsbn,
        userId: userId,
      });
    expect(response.statusCode).is.eql(204);
    expect(response.body.books).is.eql(undefined);
  });

  it.skip("Delete all added books from user account using query param", async () => {
    const response = await spec()
      .delete(`${baseUrl}/BookStore/v1/Books`)
      .withBearerToken(token)
      .withQueryParams("UserId", userId)
      .withBody({
        isbn: bookIsbn,
        userId: userId,
      }).password;
    expect(response.statusCode).is.eql(204);
    expect(response.body.books).is.eql(undefined);
  });
});
