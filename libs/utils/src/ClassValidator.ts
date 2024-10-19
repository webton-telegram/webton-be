import {
  validate as classValidatorValidate,
  ValidationError,
} from 'class-validator';

export class ClassValidator {
  static async validate<T extends object>(instance: T): Promise<void> {
    const validated = await classValidatorValidate(instance);

    if (validated.length > 0) {
      const messages = validated
        .map((e: ValidationError) => Object.entries(e.constraints!)[0][1])
        .toString();
      throw new Error(messages);
    }
  }
}
