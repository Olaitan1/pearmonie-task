
(async () =>
{
  const chai = await import("chai");
  const sinon = await import("sinon");
  const supertest = await import("supertest");
  const { app } = await import("../../app");
  const redisClient = await import("../../src/config");
  const { Product } = await import("../../src/model/product-model");
  const { expect } = chai;

  describe("GET /products", () =>
  {
    let redisStub;

    beforeEach(() =>
    {
      redisStub = sinon.stub(redisClient, "get");
    });

    afterEach(() =>
    {
      sinon.restore();
    });

    it("should return products from cache if available", async () =>
    {
      const cachedProducts = {
        products: [{ id: 1, name: "Cached Product", price: 10 }],
        totalPages: 1,
      };
      redisStub.resolves(JSON.stringify(cachedProducts));

      const res = await supertest(app).get("/products?page=1&limit=6");

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal(
        "Products retrieved successfully (from cache)"
      );
      expect(res.body.data).to.be.an("array").that.has.lengthOf(1);
      expect(res.body.data[0].name).to.equal("Cached Product");
    });

    it("should return products from the database and cache them", async () =>
    {
      redisStub.resolves(null);

      const mockProducts = [
        { id: 2, name: "Test Product", price: 20 },
        { id: 3, name: "Another Product", price: 30 },
      ];

      const findAndCountAllStub = sinon
        .stub(Product, "findAndCountAll")
        .resolves({
          count: 2,
          rows: mockProducts,
        });

      const setExStub = sinon.stub(redisClient, "setEx").resolves();

      const res = await supertest(app).get("/products?page=1&limit=6");

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Products retrieved successfully");
      expect(res.body.data).to.be.an("array").that.has.lengthOf(2);
      expect(res.body.data[0].name).to.equal("Test Product");

      sinon.assert.calledOnce(setExStub);
      sinon.assert.calledWith(
        setExStub,
        sinon.match.string,
        3600,
        sinon.match.string
      );

      findAndCountAllStub.restore();
      setExStub.restore();
    });

    it("should return a 500 error when an internal error occurs", async () =>
    {
      const findAndCountAllStub = sinon
        .stub(Product, "findAndCountAll")
        .throws(new Error("Database error"));

      const res = await supertest(app).get("/products?page=1&limit=6");

      expect(res.status).to.equal(500);
      expect(res.body.message).to.equal("Internal server error");

      findAndCountAllStub.restore();
    });
  })
})();
