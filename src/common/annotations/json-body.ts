
export interface IJSONBodyParameterMetadata {
  functionName: string;
  parameterIndex: number;
  classRef: { new(): any};
}


export function JSONBody(classRef: { new(): any }) {

  return function (target: any, propertyKey: string, parameterIndex: number) {

    let jsonBodyParameters: [IJSONBodyParameterMetadata] = Reflect.getMetadata("__JSON_BODY_PARAMETERS__", target) || [];
    jsonBodyParameters.push({
      functionName: propertyKey,
      parameterIndex: parameterIndex,
      classRef: classRef
    });
    Reflect.defineMetadata("__JSON_BODY_PARAMETERS__", jsonBodyParameters, target);

  }
  
}