import "reflect-metadata";
import {Member} from "../../common/model/entity/users/member";
import {ContextRequest, ContextResponse, HttpError} from "typescript-rest";
import {Request, Response} from "express";
import {APIError} from "../model/api-error";
import {JSONResponse} from "../annotations/json-response";

export abstract class BaseController {

	public pendingMember?: Member;

	@ContextRequest
	private pendingRequest?: Request;

	@ContextResponse
	private pendingResponse?: Response;

	@JSONResponse
	public throw<TError extends HttpError>(error: TError) {

		this.pendingResponse!.setHeader('Content-Type', 'application/json');
		this.pendingResponse!.status(error.statusCode)
			.send({
				statusCode: error.statusCode || 400,
				message: error.message
			} as APIError);

	}

	public getPendingRequest(): Request {
		return this.pendingRequest!;
	}

	public getPendingResponse(): Response {
		return this.pendingResponse!;
	}

}