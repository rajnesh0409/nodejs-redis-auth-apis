const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
chai.should();
chai.use(chaiHttp);

// Pass valid token value
const token = "eyJhbGciOiJIUhwIjoxNjA6nw_lEYtIODVE6QhRxCfb-MPa3tSU3XOYFi4dm_XZsE";
// Pass invalid token value
const expiredToken = "6QhRxCfb-MPa3tSU3Xasdhfkglouytwrw6QhRxCfb-MPa3tSU3X";
// Pass valid userId
const userId = "4664163c-a39f-42b1-9ffc-7fa03a30131c";

/* Test registration API */

describe("Users", () => {
  describe("/POST registerUser", () => {
    it("it should not able to register user without name, email and password", (done) => {
      const data = {
        name: "testuser",
        description: "This is user test",
      };
      chai
        .request(server)
        .post("/registerUser")
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          done();
        });
    });
    it("it should not able to register with already registered emailId", (done) => {
      const data = {
        email: "alreadyregister@yopmail.com",
        password: "Test12345",
        name: "testuser",
        description: "This is user test"
      };
      chai
        .request(server)
        .post("/registerUser")
        .send(data)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          done();
        });
    });
    it("it should able to register a new user", (done) => {
      const data = {
        email: "validuser@yopmail.com",
        password: "Test12345",
        name: "testuser",
        description: "This is user test"
      };
      chai
        .request(server)
        .post("/registerUser")
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });

  /* Test signIn API */

  describe("/POST signIn", () => {
    it("it should not able to signIn if user does not exist", (done) => {
      const data = {
        email: "fakeuser@yopmail.com",
        password: "Test12345"
      };
      chai
        .request(server)
        .post("/signIn")
        .send(data)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          done();
        });
    });
    it("it should not able to signIn with wrong credentials", (done) => {
      const data = {
        email: "validuser@yopmail.com",
        password: "wrongpassword"
      };
      chai
        .request(server)
        .post("/signIn")
        .send(data)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          done();
        });
    });
    it("it should able to signIn with valid credentials", (done) => {
      const data = {
        email: "validuser@yopmail.com",
        password: "validpassword"
      };
      chai
        .request(server)
        .post("/signIn")
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });

  /* Test get user list API */

  describe("/GET getUsersList", () => {
    it("it should not allow to view users list without authorization token", (done) => {
      chai
        .request(server)
        .get("/getUsersList")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property("message").eql("Unauthorized!");
          done();
        });
    });
    it("it should not allow to view users list with expired authorization token", (done) => {
      chai
        .request(server)
        .get("/getUsersList")
        .set("x-access-token", expiredToken)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property("message").eql("Unauthorized!");
          done();
        });
    });
    it("it should get all user list", (done) => {
      chai
        .request(server)
        .get("/getUsersList")
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });

  /* Test get user details by userId API */

  describe("GET /getUser/:userId", () => {
    it("it should not allow to get user details for given userId without authorization token", (done) => {
      chai
        .request(server)
        .get("/getUser/" + userId)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property("message").eql("Unauthorized!");
          done();
        });
    });
    it("it should not allow to get user details for given userId with expired authorization token", (done) => {
      chai
        .request(server)
        .get("/getUser/" + userId)
        .set("x-access-token", expiredToken)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property("message").eql("Unauthorized!");
          done();
        });
    });
    it("it should get user details for given userId", (done) => {
      chai
        .request(server)
        .get("/getUser/" + userId)
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });

  /* Test update user details by userId API */

  describe("/PUT /updateUser/:userId", () => {
    it("it should not allow to update the user details for given userId without authorization token", (done) => {
      const data = {
        name: "testuser",
        description: "update the user data",
      };
      chai
        .request(server)
        .put("/updateUser/" + userId)
        .send(data)
        .end((err, res) => {
          res.body.should.be.a("object");
          res.should.have.status(401);
          res.body.should.have.property("message").eql("Unauthorized!");
          done();
        });
    });
    it("it should not allow to update the user details for given userId with expired authorization token", (done) => {
      const data = {
        name: "testuser",
        description: "update the user data",
      };
      chai
        .request(server)
        .put("/updateUser/" + userId)
        .set("x-access-token", expiredToken)
        .send(data)
        .end((err, res) => {
          res.body.should.be.a("object");
          res.should.have.status(401);
          res.body.should.have.property("message").eql("Unauthorized!");
          done();
        });
    });
    it("it should update the user details for given userId", (done) => {
      const data = {
        name: "testuser",
        description: "update the user data",
      };
      chai
        .request(server)
        .put("/updateUser/" + userId)
        .set("x-access-token", token)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("success");
          res.body.should.have
            .property("message")
            .eql("Record updated successfully");
          done();
        });
    });
  });

  /* Test delete user details by userId API */

  describe("/DELETE /removeUser/:userId", () => {
    it("it should not allow to delete a given UserId details without authorization token", (done) => {
      chai
        .request(server)
        .delete("/removeUser/" + userId)
        .end((err, res) => {
          res.body.should.be.a("object");
          res.should.have.status(401);
          res.body.should.have
            .property("message")
            .eql("Unauthorized!");
          done();
        });
    });
    it("it should not allow to delete a given UserId details with expired authorization token", (done) => {
      chai
        .request(server)
        .delete("/removeUser/" + userId)
        .set("x-access-token", expiredToken)
        .end((err, res) => {
          res.body.should.be.a("object");
          res.should.have.status(401);
          res.body.should.have
            .property("message")
            .eql("Unauthorized!");
          done();
        });
    });
    it("it should delete a given UserId details", (done) => {
      chai
        .request(server)
        .delete("/removeUser/" + userId)
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("success");
          res.body.should.have
            .property("message")
            .eql("User deleted successfully");
          done();
        });
    });
  });
});
