import React from 'react';
import Validation from 'react-validation';
import validator from 'validator';

Object.assign(Validation.rules, {

  none: {
    rule: ()=>{
      return true;
    }
  },
  required: {
    rule: value => {
      return value.toString().trim();
    },
    hint: () => {
      return <span className="form-error is-visible">Required</span>;
    }
  },
  email: {
    rule: value => {
      return validator.isEmail(value);
    },
    hint: value => {
      return <span className="form-error is-visible">{value} isnt an Email.</span>;
    }
  },
  password: {
    rule: (value, components) => {
      const password = components.password.state;
      const passwordConfirm = components.passwordConfirm.state;
      const isBothUsed = password
        && passwordConfirm
        && password.isUsed
        && passwordConfirm.isUsed;
      const isBothChanged = isBothUsed && password.isChanged && passwordConfirm.isChanged;

      if (!isBothUsed || !isBothChanged) {
        return true;
      }

      return password.value === passwordConfirm.value;
    },
    hint: () => <span className="form-error is-visible">Passwords should be equal.</span>
  },
  api: {
    hint: value => (
      <button
        className="form-error is-visible"
      >
        API Error on "{value}" value. Focus to hide.
      </button>
    )
  }
});
