import { Validation } from "../../src/common/utils/validation";


describe("Validation Test Suite", () => {

  it("Email Validation is correct", () => {

    expect(Validation.validateEmail("test@some.com")).toBeTruthy();
    expect(Validation.validateEmail("@some.com")).toBeFalsy();
    expect(Validation.validateEmail("test@some")).toBeFalsy();
    expect(Validation.validateEmail("testsome.com")).toBeFalsy();

  });

  it("Password Validation is correct", () => {

    expect(Validation.validatePassword("1gdf")).toEqual(Validation.InvalidPasswordReason.MINUMUM_LENGTH);
    expect(Validation.validatePassword("18274351824")).toEqual(Validation.InvalidPasswordReason.LETTERS);
    expect(Validation.validatePassword("aiyfiqef")).toEqual(Validation.InvalidPasswordReason.NUMERIC);
    expect(Validation.validatePassword("1gd!@13f31f")).toBeNull();

  });

});