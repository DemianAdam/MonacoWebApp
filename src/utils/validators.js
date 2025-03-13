// validators.js
export const isValidDate = (year, month, day) => {
    if (year < 30) {
      year += 2000;
    } else {
      year += 1900;
    }
  
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
  
    const date = new Date(year, month - 1, day);
    if (
      !(date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day)
    ) {
      return false;
    }
    return date;
  };
  
  export const calculateAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  export const validateDate = (input) => {
    const value = input.value;
    const date = value.split('/');
    const day = Number(date[0]);
    const month = Number(date[1]);
    const year = Number(date[2]);
  
    const result = isValidDate(year, month, day);
    if (!result) {
      input.setCustomValidity('Fecha invalida');
      input.reportValidity();
      return false;
    }
  
    const age = calculateAge(result);
    if (age < 18) {
      input.setCustomValidity('Debes ser mayor de 18 años');
      input.reportValidity();
      return false;
    }
  
    return true;
  };
  
  export const validateDni = (input) => {
    const value = input.value;
    if (value.length !== 3) {
      input.setCustomValidity('El DNI debe tener 3 digitos');
      input.reportValidity();
      return false;
    }
    return true;
  };
  