const request = require("supertest");
const http = require("http");
const requestHandlers = require(".");

const server = http.createServer((req, res) => {
  requestHandlers(req, res);
});

describe("Handlers", () => {
  const newUser = {
    username: "theericfrost",
    age: "10",
    hobbies: "['test']",
  };

  const createUser = async () => {
    const response = await request(server)
      .post("/api/users")
      .send(newUser)
      .expect("Content-Type", /json/)
      .expect(201);
    return response._body;
  };

  it("should return from Database array empty", async () => {
    request(server)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response._body).toStrictEqual([]);
      });
  });

  it("should create a new user", async () => {
    const createdUser = await createUser();
    expect(createdUser.username).toBe(newUser.username);
    expect(createdUser.age).toBe(newUser.age);
    expect(createdUser.hobbies).toStrictEqual(newUser.hobbies);
    expect(createdUser.id).toBeDefined();
  });

  it("should get a new user", async () => {
    const createdUser = await createUser();

    request(server)
      .get(`/api/users/${createdUser.id}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        const userFromGetRequest = response._body;
        expect(createdUser.username).toBe(userFromGetRequest.username);
        expect(createdUser.age).toBe(userFromGetRequest.age);
        expect(createdUser.hobbies).toStrictEqual(userFromGetRequest.hobbies);
      });
  });

  it("should update user", async () => {
    const updatedUser = { ...newUser, username: "test" };
    const createdUser = await createUser();

    request(server)
      .put(`/api/users/${createdUser.id}`)
      .send(updatedUser)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        const userFromPutRequest = response._body;
        expect(updatedUser.username).toBe(userFromPutRequest.username);
        expect(updatedUser.age).toBe(userFromPutRequest.age);
        expect(updatedUser.hobbies).toStrictEqual(userFromPutRequest.hobbies);
      });
  });

  it("should delete user", async () => {
    const createdUser = await createUser();

    request(server)
      .delete(`/api/users/${createdUser.id}`)
      .expect("Content-Type", /json/)
      .expect(204);
  });

  it("should delete user", async () => {
    const createdUser = await createUser();

    request(server)
      .delete(`/api/users/${createdUser.id}`)
      .expect("Content-Type", /json/)
      .expect(204);

    request(server)
      .get(`/api/users/${createdUser.id}`)
      .expect("Content-Type", /json/)
      .expect(404);
  });
});
