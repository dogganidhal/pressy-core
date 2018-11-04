
export class APIError {

	public name: string;
	public statusCode: number;
	public message: string;

	public static create(name: string, statusCode: number, message: string): APIError {
		return {
			name: name,
			statusCode: statusCode,
			message: message
		} as APIError;
	}

	public static INTERNAL_SERVER_ERROR: APIError = APIError.create("InternalServerError", 500, "Internal Server Error");

}