import {JsonObject, JsonProperty} from "json2typescript";


@JsonObject
export class APIError {

	@JsonProperty("statusCode", Number)
	public statusCode: number;

	@JsonProperty("message", String)
	public message: string;

	public static create(statusCode: number, message: string): APIError {
		return {
			statusCode: statusCode,
			message: message
		} as APIError;
	}

}