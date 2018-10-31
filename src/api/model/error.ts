

export interface APIError extends Error {

	statusCode: number;
	message: string;

}