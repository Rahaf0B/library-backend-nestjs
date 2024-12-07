import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidDate implements ValidatorConstraintInterface {
  validate(valueToCheck: any, args: ValidationArguments) {

    if (!valueToCheck) return true; // if the value is null then skip validation

    // Check for valid formats: YYYY, YYYY-MM, or YYYY-MM-DD by using regex
    const dateRegex = /^(?:\d{4}|\d{4}-\d{2}|\d{4}-\d{2}-\d{2})$/;
    if(dateRegex.test(valueToCheck)){
        // Check if the date is in the future
        if( Date.parse(valueToCheck) < Date.now()){
            return dateRegex.test(valueToCheck);
        }
    }
    
  }

  defaultMessage(args: ValidationArguments) {
    // Define the error message
    return 'Date must be in the format YYYY, YYYY-MM, or YYYY-MM-DD. And not in the future';
  }
}