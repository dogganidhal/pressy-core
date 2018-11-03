import "reflect-metadata";
import {Member} from "../../common/model/entity/users/member";
import {ContextRequest, ContextResponse} from "typescript-rest";
import {Request, Response} from "express";

export abstract class BaseController {

	public pendingMember?: Member;

	@ContextRequest
	private pendingRequest?: Request;

	@ContextResponse
	private pendingResponse?: Response;

	public getPendingRequest(): Request {
		return this.pendingRequest!;
	}

	public getPendingResponse(): Response {
		return this.pendingResponse!;
	}

}