(async () =>
{
  const chai = await import("chai");
  const sinon = await import("sinon");
  const chaiHttp = await import("chai-http");
  const bcrypt = await import("bcrypt");
  const { User } = await import("../../src/model/index.js");
  const { AdminRegister } = await import("../../src/controller/controller.js");

  chai.use(chaiHttp);
  const { expect } = chai;

  describe("Admin Registration", () =>
  {
    let req,
      res,
      userFindOneStub,
      userCreateStub,
      generateSaltStub,
      generatePasswordStub;

    beforeEach(() =>
    {
      req = {
        body: {
          email: "admin@example.com",
          username: "admin",
          password: "password123",
        },
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      userFindOneStub = sinon.stub(User, "findOne");
      userCreateStub = sinon.stub(User, "create");
      generateSaltStub = sinon.stub(bcrypt, "genSalt");
      generatePasswordStub = sinon.stub(bcrypt, "hash");
    });

    afterEach(() =>
    {
      sinon.restore();
    });

    it("should register a new admin successfully", async () =>
    {
      // Mocking the expected outcomes
      userFindOneStub.resolves(null);
      generateSaltStub.resolves("mockSalt");
      generatePasswordStub.resolves("mockHashedPassword");
      userCreateStub.resolves({
        id: "adminId",
        username: "admin",
        email: "admin@example.com",
        role: "admin",
      });

      // Call the function
      await AdminRegister(req, res);

      // Assertions
      expect(res.status.calledWith(201)).to.be.true;
      expect(
        res.json.calledWith(sinon.match({ message: "User created successfully" }))
      ).to.be.true;
      expect(userCreateStub.calledOnce).to.be.true;
    });

    it("should return an error if the admin already exists", async () =>
    {
      userFindOneStub.resolves({
        id: "existingAdminId",
        username: "admin",
        email: "admin@example.com",
      });

      await AdminRegister(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(
        res.json.calledWith(sinon.match({ Error: "Admin email already exists" }))
      ).to.be.true;
    });
  });
})();
