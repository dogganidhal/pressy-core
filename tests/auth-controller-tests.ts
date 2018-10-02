import { LoginResponseDTO } from './../lib/api/model/dto/index';
import API from "../lib/api";
import request from "supertest";
import { JSONSerialization } from '../lib/api/utils/json-serialization';

describe("Testing Authentication Endpoints", () => {

  var api: API;

  beforeAll(() => {
    api = new API;
  });

  test("Returns access credentials when correct user and password were introduced", (done) => {

    request(api.getApp())
    .post("/api/v1/auth/login")
    .send({email: "dogga.nidhal@gmail.com", password: "test"})
    .expect(200, (error, response) => {

      expect(error).toBeNull();
      
      const token: LoginResponseDTO = JSONSerialization.deserializeObject(response.body, LoginResponseDTO);

      expect(token.accessToken).not.toBeNull();
      expect(token.refreshToken).not.toBeNull();
      expect(token.expiresIn).toEqual(3600);
      expect(token.type).toEqual("Bearer");

      done();

    });

  });

  test("Returns an error when a non-existing email was introduced", (done) => {

    request(api.getApp())
    .post("/api/v1/auth/login")
    .send({email: "not.found@email.com", password: ""})
    .expect(404, (error, response) => {

      console.log(response.body);

      expect(error).not.toBeNull();
      expect(response.status).toEqual(404);

      done();

    });

  });

});