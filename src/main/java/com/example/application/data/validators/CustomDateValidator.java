package com.example.application.data.validators;

import java.time.DayOfWeek;
import java.time.LocalDate;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class CustomDateValidator implements 
  ConstraintValidator<CustomDateConstraint, LocalDate> {

    @Override
    public void initialize(CustomDateConstraint contactNumber) {
    }

    @Override
    public boolean isValid(LocalDate contactField,
            ConstraintValidatorContext cxt) {
        // This custom validation performs the same checking we
        // have in the client side validators.ts, so that we are in sync both sides.
        if (contactField == null) {
            return false;
        }
        DayOfWeek dayOfWeek = contactField.getDayOfWeek();
        if (dayOfWeek.getValue() == 6 || dayOfWeek.getValue() == 7) {
            return false;
        }
        LocalDate compare = LocalDate.now();
        if (contactField.isAfter(compare)) {
            return false;
        }
        return true;
    }

}
