function leadValidation(request) {
  const firstNameIsValid = request.first_name.trim().length > 0;
  const lastNameIsValid = request.last_name.trim().length > 0;
  const mobileNumberIsValid = request.mobile_number.trim().length > 0;
  const addressIsValid = request.address.trim().length > 0;
  const occupationIsValid = request.occupation.trim().length > 0;
  const ageIsValid = !isNaN(request.age) && request.age > 0;
  const civilStatusIsValid = request.civil_status.trim().length > 0;
  const sourcePrefixIsValid = request.source_prefix.trim().length > 0;
  const sourceIsValid = request.source.trim().length > 0;

  // set default data
  const data = {
    first_name: {
      value: request.first_name,
      isValid: firstNameIsValid,
    },
    middle_name: {
      value: request.middle_name,
      isValid: true,
    },
    last_name: {
      value: request.last_name,
      isValid: lastNameIsValid,
    },
    companion_first_name: {
      value: request.companion_first_name,
      isValid: true,
    },
    companion_middle_name: {
      value: request.companion_middle_name,
      isValid: true,
    },
    companion_last_name: {
      value: request.companion_last_name,
      isValid: true,
    },
    address: {
      value: request.address,
      isValid: addressIsValid,
    },
    hotel: {
      value: request.hotel,
      isValid: true,
    },
    mobile_number: {
      value: request.mobile_number,
      isValid: mobileNumberIsValid,
    },
    occupation: {
      value: request.occupation,
      isValid: occupationIsValid,
    },
    age: { value: request.age, isValid: true },
    source_prefix: {
      value: request.source,
      isValid: sourceIsValid,
    },
    source: {
      value: request.source,
      isValid: sourceIsValid,
    },
    civil_status: {
      value: request.civil_status,
      isValid: civilStatusIsValid,
    },
    remarks: {
      value: request.remarks,
      isValid: true,
    },
    is_uploaded: {
      value: request.is_uploaded,
      isValid: true,
    },
    created_at: {
      value: request.created_at,
      isValid: true,
    },
  };

  if (
    !firstNameIsValid ||
    !lastNameIsValid ||
    !mobileNumberIsValid ||
    !occupationIsValid ||
    !addressIsValid ||
    // !ageIsValid ||
    !civilStatusIsValid ||
    !sourceIsValid
  ) {
    return {
      isFormValid: false,
      data: data,
    };
  }

  return {
    isFormValid: true,
    data: data,
  };
}

export default leadValidation;
