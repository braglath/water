const request = require("supertest");
const server = require("../app");

describe("user crud tests", () => {
  it("GET /api/user/id --> user details", () => {
    return request(server)
      .get("/api/user/17")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNywiaWF0IjoxNjU4MDg0NzI1LCJleHAiOjE2NTgxMTM1MjV9.I2jIHJgdXaJA30zDbET1X5lVWwMaxvikiuci2XRlu2Q"
      )
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            status: 200,
            success: true,
            message: "success",
          })
        );
      });
  });
});
