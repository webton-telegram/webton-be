import { ValidationError } from 'class-validator';

export const formatError = (error: ValidationError): string => {
  const output: string[] = [];

  const property = error.property;

  if (error.constraints) {
    const constraints = Object.values(error.constraints).join(', ');
    output.push(`${property}: ${constraints}`);
  }

  if (error.children) {
    for (const childError of error.children) {
      output.push(formatError(childError));
    }
  }

  return output.join(' / ');
};
