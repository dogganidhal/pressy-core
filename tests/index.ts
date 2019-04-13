import {Expect, TestCase, TestFixture} from "alsatian";


@TestFixture("Example test")
export class TestExample {

	@TestCase(1, 2)
	@TestCase(4, 5)
	public exampleTest(preIteratedValue: number, expected: number) {
		Expect(++preIteratedValue).toBe(expected);
	}

}