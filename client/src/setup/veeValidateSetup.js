import { extend, localize } from 'vee-validate';
import en from 'vee-validate/dist/locale/en.json';

import {
  required,
  max,
  // eslint-disable-next-line
  min_value,
  numeric,
  // eslint-disable-next-line
  alpha_num,
} from 'vee-validate/dist/rules';

// Install rules
extend('max', max);
extend('min_value', min_value);
extend('numeric', numeric);
extend('alpha_num', alpha_num);

extend('required', {
  ...required,
  message: (field) => `The ${field} is required.`,
});

extend('decimalValidator', {
  message: (field, values) => (values.digits || values.decimals
    ? `Maximum length: ${values.digits || ''} digits + ${values.decimals || ''} decimals.` : ''),
  params: ['digits', 'decimals', 'negative'],
  validate: (value, values) => new Promise((resolve) => {
    if (values) {
      const reg = new RegExp(`^${values.negative ? '-?' : ''}(\\d{0,${values.digits ? values.digits : ''}})?(\\.\\d{1,${values.decimals ? values.decimals : ''}})?$`);
      resolve({
        valid: !value || reg.test(value),
      });
    } else {
      resolve({
        valid: true,
      });
    }
  }),
});

extend('duplicateValues', {
  message: (field) => `The ${field}s must not contain the same value.`,
  params: ['controls'],
  validate: (value, { controls }) => new Promise((resolve) => {
    if (controls instanceof Array) {
      const duplicateValues = controls.filter((el) => el === value);
      resolve({
        valid: duplicateValues.length === 1,
      });
    } else {
      resolve({
        valid: true,
      });
    }
  }),
});

localize({
  en,
});
