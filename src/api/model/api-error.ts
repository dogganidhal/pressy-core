
export class APIError {

	public statusCode: number;
	public message: string;

	public static create(statusCode: number, message: string): APIError {
		return {
			statusCode: statusCode,
			message: message
		} as APIError;
	}

	public static INTERNAL_SERVER_ERROR: APIError = APIError.create(500, "Internal Server Error");

}