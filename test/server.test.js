const app = require("../src/app"), supertest = require("supertest"), request = supertest(app);

describe("Servidor", ()=>{
  it("Deve rodar a aplicação na porta 8181", ()=>{
    return request.get("/").then(res =>{
      let status = res.statusCode;

      expect(status).toEqual(200)
    }).catch(error => fail(error))
  })
});