

export function JSONBody(target: any, propertyKey: string | symbol, parameterIndex: number) {
  console.log({
    target: target,
    propertyKey: propertyKey,
    parameterIndex: parameterIndex
  });

  target[propertyKey] = function (...args: any[]) {
    
  }
  
}