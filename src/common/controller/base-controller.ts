import "reflect-metadata";
import {ContextRequest, ContextResponse} from "typescript-rest";
import {Request, Response} from "express";
import {Person} from "../model/entity/users/person";

export abstract class BaseController {

	public pendingPerson: Person;

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