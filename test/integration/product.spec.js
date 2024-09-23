(async () =>
{
  const chai = await import("chai");
  const chaiHttp = await import("chai-http");
  const sinon = await import("sinon");
  const { User } = await import("../../src/model/index.js");
  const { Product } = await import("../../src/model/product-model.js");
  const app = await import("../../src/app.js");

  chai.use(chaiHttp);
  const { expect } = chai;

  describe("Auth Integration Tests", () =>
  {
    describe("POST /login", () =>
    {
      it("should return a token for valid credentials", async () =>
      {
        const loginData = {
          email: "user@example.com",
          password: "password123",
        };

        // Mocking database call for user lookup
        sinon.stub(User, "findOne").resolves({
          id: "userId",
          email: "user@example.com",
          password: "$2b$10$saltyHashedPassword",
        });

        const res = await chai.request(app).post("/auth/login").send(loginData);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("token");
        expect(res.body).to.have.property("user");

        User.findOne.restore();
      });

      it("should return an error for invalid credentials", async () =>
      {
        const loginData = {
          email: "user@example.com",
          password: "wrongpassword",
        };

        sinon.stub(User, "findOne").resolves({
          id: "userId",
          email: "user@example.com",
          password: "$2b$10$saltyHashedPassword", // bcrypt hash of 'password123'
        });

        const res = await chai.request(app).post("/auth/login").send(loginData);

        expect(res).to.have.status(401);
        expect(res.body).to.have.property("error", "Invalid Credentials");

        User.findOne.restore();
      });
    });
  });

  describe("Product Tests", () =>
  {
    describe("GET /products", () =>
    {
      it("should return all products", async () =>
      {
        sinon.stub(Product, "findAll").resolves([
          {
            id: 1,
            name: "Product 1",
            description: "Description 1",
            price: 100,
          },
          {
            id: 2,
            name: "Product 2",
            description: "Description 2",
            price: 200,
          },
        ]);

        const res = await chai.request(app).get("/products");

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        expect(res.body.length).to.equal(2);

        Product.findAll.restore();
      });
    });
  })
})();
