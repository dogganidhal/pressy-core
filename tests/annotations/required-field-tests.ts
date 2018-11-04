import {Required} from "../../src/common/annotations";
import {HTTP} from "../../src/common/utils/http";
import {Exception} from "../../src/common/errors";


describe("@Required annotation tests", () => {

	class TestClass {

		@Required
		public requiredTestProperty: string;

		public optionalTestProperty: number;

	}

	test("Object with fulfilled required field is successfully parsed", () => {

		let body = JSON.stringify({
			requiredTestProperty: "Hello World",
			optionalTestProperty: 0
		});

		let testObject = HTTP.parseJSONBody(body, TestClass);
		console.log(testObject);

		expect(testObject.requiredTestProperty).toEqual("Hello World");
		expect(testObject.optionalTestProperty).toEqual(0);

	});

	test("Throws an error when required field is undefined", () => {

		let body = JSON.stringify({
			optionalTestProperty: 0
		});

		try {
			let testObject = HTTP.parseJSONBody(body, TestClass);
			console.log(testObject);
			fail();
		} catch (error) {
			console.log(error);
			expect(error instanceof Exception.MissingFieldException).toBeTruthy();
		}

	});

});