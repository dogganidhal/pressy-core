import { validation } from "../../src/common/utils";


describe("validation Test Suite", () => {

  it("Email validation is correct", () => {

    expect(validation.validateEmail("test@some.com")).toBeTruthy();
    expect(validation.validateEmail("@some.com")).toBeFalsy();
    expect(validation.validateEmail("test@some")).toBeFalsy();
    expect(validation.validateEmail("testsome.com")).toBeFalsy();

  });

  it("Password validation is correct", () => {

    expect(validation.validatePassword("1gdf")).toEqual(validation.InvalidPasswordReason.MINUMUM_LENGTH);
    expect(validation.validatePassword("18274351824")).toEqual(validation.InvalidPasswordReason.LETTERS);
    expect(validation.validatePassword("aiyfiqef")).toEqual(validation.InvalidPasswordReason.NUMERIC);
    expect(validation.validatePassword("1gd!@13f31f")).toBeNull();

  });

});