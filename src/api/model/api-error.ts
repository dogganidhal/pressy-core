
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

	public static InteralServerError(message?: string): APIError {
		return APIError.create("InternalServerError", 500, message || "Internal Server Error");
	}

}