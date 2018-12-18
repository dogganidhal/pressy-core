import "reflect-metadata";
import {ContextRequest, ContextResponse} from "typescript-rest";
import {Request, Response} from "express";
import {User} from "../model/entity/users";

export abstract class BaseController {

	public pendingUser: User;

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