const request = require("supertest");
const server = require("../app");

describe("user login tests", () => {
  it("POST /api/login --> password case", () => {
    return request(server)
      .post("/api/login")
      .send({
        phonenumber: "+918939243462",
        device_token: "this will be my device token",
      })
      .expect("Content-Type", /json/)
      .expect(400)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            status: 400,
            success: false,
            message: "password required",
          })
        );
      });
  });
  it("POST /api/login --> successful login", () => {
    return request(server)
      .post("/api/login")
      .send({
        phonenumber: "+918939243462",
        device_token: "hello world",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            status: 200,
            success: true,
            message: "success",
            data: expect.objectContaining({}),
          })
        );
      });
  });
});
