import { HttpError } from 'typescript-rest';
import { LoginResponseDTO } from '../../lib/common/model/dto/index';
import API from "../../lib/api";
import request from "supertest";
import { JSONSerialization } from '../../lib/common/utils/json-serialization';

describe("Testing Authentication Endpoints", () => {

  const api: API = new API;

  it("Returns access credentials when correct user and password were introduced", async (done) => {

    request(api.getApp())
    .post("/api/v1/auth/login")
    .set("Content-Type", "application/json")
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

  it("Returns an error when a non-existing email was introduced", async (done) => {

    request(api.getApp())
    .post("/api/v1/auth/login")
    .send({email: "not.found@email.com", password: ""})
    .expect(404, (_, response) => {

      expect(response.body).not.toBeNull();
      expect(response.status).toEqual(404);
      
      const error = response.body as HttpError;

      expect(error.statusCode).toEqual(404);
      expect(error.message).not.toBeNull();
      
      done();

    });

  });

});