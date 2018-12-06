import {Required} from "../../src/common/annotations";
import {http} from "../../src/common/utils/http";
import {exception} from "../../src/common/errors";


describe("@Required annotation tests", () => {

	class TestClass {

		@Required()
		public requiredTestProperty: string;

		public optionalTestProperty: number;

	}

	class TestNestedClass {

		@Required(TestClass)
		public requiredNestedObject: TestClass;

		public optionalProperty: number;

	}

	test("Object with fulfilled required field is successfully parsed", () => {

		let body = JSON.stringify({
			requiredTestProperty: "Hello World",
			optionalTestProperty: 0
		});

		let testObject = http.parseJSONBody(body, TestClass);

		expect(testObject.requiredTestProperty).toEqual("Hello World");
		expect(testObject.optionalTestProperty).toEqual(0);

	});

	test("Throws an error when required field is undefined", () => {

		let body = JSON.stringify({
			optionalTestProperty: 0
		});

		try {
			let testObject = http.parseJSONBody(body, TestClass);
			fail();
		} catch (error) {
			expect(error instanceof exception.MissingFieldsException).toBeTruthy();
		}

	});

  test("Throws an error when required field in a nested object is missing", () => {

    let body = JSON.stringify({
      requiredNestedObject: {
				optionalTestProperty: 10
			},
			optionalProperty: undefined
    });

    try {
      let testObject = http.parseJSONBody(body, TestNestedClass);
      fail();
    } catch (error) {
      expect(error instanceof exception.MissingFieldsException).toBeTruthy();
    }

  });

});