const app = require("../src/app"), supertest = require("supertest"), request = supertest(app);

const mainUser = {nome: "Wesley Santos", email: "wesley@wesley.com.br", password: "jakdhfshkfahskfhskh"};

beforeAll(()=>{
  return request.post("/user")
  .send(mainUser)
  .then(res =>{})
  .catch(err => fail(err))
});

afterAll(()=>{
  return request.delete(`/user/${mainUser.email}`)
  .then(res => {})
  .catch(err => fail(err))
});

describe("Cadastro de usuário", ()=>{

  it("Deve retorna um usuário válido", ()=>{

    const date = Date.now(), email = `${date}@gmail.com`, user = {nome: "Wesley", email, password: "jkhadjkhskaflh"};

    // .send(dados) - usado para enviar dados no tipo "post" de requisição com o superit
    return request.post("/user")
    .send(user)
    .then( res =>{
      expect(res.statusCode).toEqual(200);
      expect(res.body.email).toEqual(email);
    }).catch(error => fail(error))
  });

  it("Deve impedir o cadastro de usuários com campos vazios", ()=>{
    const email = "", user = {nome: "", email, password: ""};

    return request.post("/user")
    .send(user)
    .then( res =>{
      expect(res.statusCode).toEqual(400) // 400 = Bad Request
    }).catch(error => fail(error))
  });

  it("Deve impedir que o usuário se cadastre com um email repetido", ()=>{

    const date = Date.now(), email = `${date}@gmail.com`, user = {nome: "Wesley", email, password: "jkhadjkhskaflh"};

    return request.post("/user")
    .send(user)
    .then((res) =>{
      expect(res.statusCode).toEqual(200);
      expect(res.body.email).toEqual(email);

      // Para impedir que o email seja cadastrado duplicado
      // É possível inserir um teste dentro de outro teste, basta fazer como abaixo.
      return request.post("/user")
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual("E-mail já cadastrado.")
      })
      .catch(error => fail(error))
    })
    .catch(error => fail(error))
  });
});

describe("Autenticação", ()=>{
  it("Deve retornar um token ao logar", ()=>{
    return request.post("/auth")
    .send({nome: mainUser.nome, email: mainUser.email, password: mainUser.password})
    .then(res =>{
      expect(res.statusCode).toEqual(200);
      // toBeDefined() - usado quando quero que o resultado NÃO SEJA undefined.
      expect(res.body.token).toBeDefined();
    })
    .catch(err => fail(err));
  });

  it("Deve impedir que o usuário se logue com um email não cadastrado.", ()=>{
    return request.post("/auth")
    .send({email: "emailqualquer@email.com", password: "2134564321"})
    .then(res =>{
      expect(res.statusCode).toEqual(403);
      expect(res.body.errors.email).toEqual("E-mail não cadastrado.");
    })
    .catch(err => fail(err));
  });

  it("Deve impedir que o usuário se logue com uma senha errada.", ()=>{
    return request.post("/auth")
    .send({email: mainUser.email, password: "2134564321"})
    .then(res =>{
      expect(res.statusCode).toEqual(403);
      expect(res.body.errors.password).toEqual("Senha incorreta.");
    })
    .catch(err => fail(err));
  });
});