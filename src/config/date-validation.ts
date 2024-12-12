import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidDate implements ValidatorConstraintInterface {
  private _errorMessage: string;
  validate(valueToCheck: any, args: ValidationArguments) {

    // if the value is null then skip validation
    if (!valueToCheck) return true; 

    // Check for valid formats: YYYY, YYYY-MM, or YYYY-MM-DD by using regex
    const dateRegex = /^(?:\d{4}|\d{4}-\d{2}|\d{4}-\d{2}-\d{2})$/;
    if (dateRegex.test(valueToCheck)) {
      // Check if the date is in the future
      if (Date.parse(valueToCheck) < Date.now()) {
        return dateRegex.test(valueToCheck);
      } else {
        this._errorMessage = 'Date must not be in the future.';
      }
    } else {
      this._errorMessage =
        'Date must be in the format YYYY, YYYY-MM, or YYYY-MM-DD.';
    }
  }

  defaultMessage(args: ValidationArguments) {
    // Return the error message
    return this._errorMessage;
  }
}
