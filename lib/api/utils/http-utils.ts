import { JsonConvert } from "json2typescript";
import { Exception } from "../errors";
import { Controller } from "../controllers";


export namespace HTTPUtils {

  const jsonConvert = new JsonConvert();

  export function parseBody<TModel, TController extends Controller>(controller: TController, classReference: {new (): TModel}): TModel {
    try {
      const body = controller.currentRequest!.body;
      const jsonObject = typeof body === "string" ? JSON.parse(body) : body;
      return jsonConvert.deserialize(jsonObject, classReference);
    } catch (error) {
      console.log(error);
      throw new Exception.RequiredFieldNotFound("SOME_FUCKING_FIELD");
    }
  }

}