import { JsonConvert, ValueCheckingMode } from "json2typescript";
import { Exception } from "../errors";
import { Controller } from "../base-controller";


export namespace HTTPUtils {

  const jsonConvert = new JsonConvert();

  jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;

  export function parseBodyOfContoller<TModel, TController extends Controller>(controller: TController, classReference: {new (): TModel}): TModel {
    try {
      const body = controller.currentRequest!.body;
      const jsonObject = typeof body === "string" ? JSON.parse(body) : body;
      return jsonConvert.deserialize(jsonObject, classReference);
    } catch (error) {
      throw new Exception.RequiredFieldNotFound;
    }
  }

  export function parseBody<TModel>(body: object | string, classReference: {new (): TModel}): TModel {
    try {
      const jsonObject = typeof body === "string" ? JSON.parse(body) : body;
      return jsonConvert.deserialize(jsonObject, classReference);
    } catch (error) {
      console.log(error);
      throw new Exception.RequiredFieldNotFound;
    }
  }

}