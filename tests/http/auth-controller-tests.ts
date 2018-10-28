import { MemberRegistrationDTO } from './../../src/common/model/dto/member';
import { LoginResponseDTO } from '../../src/common/model/dto/member';
import API from "../../src/api";
import request from "supertest";
import { JSONSerialization } from '../../src/common/utils/json-serialization';
import { MemberRepository } from '../../src/common/repositories';

describe("Testing Authentication Endpoints", () => {

  const memberRepository = new MemberRepository;
  const api: API = new API;

  beforeAll(async (done) => {
    const memberDTO: MemberRegistrationDTO = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@gmail.com",
      password: "test",
      phone: "0192837465",
    }
    await memberRepository.createMember(memberDTO);
    done();
  }, 60000);

  it("Returns access credentials when correct user and password were introduced", async (done) => {

    request(api.getApp())
    .post("/api/v1/auth/login")
    .set("Content-Type", "application/json")
    .send({email: "john.doe@gmail.com", password: "test"})
    .expect(200, (error, response) => {

      expect(error).toBeNull();
      
      const token: LoginResponseDTO = JSONSerialization.deserializeObject(response.body, LoginResponseDTO);

      expect(token.accessToken).not.toBeNull();
      expect(token.refreshToken).not.toBeNull();
      expect(token.expiresIn).toEqual(3600);
      expect(token.type).toEqual("Bearer");

      done();

    });

  }, 60000);

  afterAll(async (done) => {
    await memberRepository.deleteMemberByEmail("john.doe@gmail.com")
  }, 60000);

});