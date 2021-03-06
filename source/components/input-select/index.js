import React from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash/omit'
import { withStyles } from '../../lib/css'
import styles from './styles'

import Icon from '../icon'

const InputSelect = ({
  label,
  name,
  value,
  options = [],
  placeholder,
  onChange,
  onBlur,
  required,
  error,
  validations,
  classNames,
  styles,
  ...props
}) => {
  const propsBlacklist = ['children', 'dirty', 'initial', 'invalid', 'styles', 'touched', 'validators']
  const allowedProps = omit(props, propsBlacklist)

  return (
    <div className={classNames.root}>
      {label && (
        <label className={classNames.label}>
          {label}
          {required && <span className={classNames.required}>*</span>}
        </label>
      )}

      <div className={classNames.wrapper}>
        <select
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange && onChange(e.target.value)}
          onBlur={(e) => onBlur && onBlur(e.target.value)}
          className={classNames.input}
          required
          {...allowedProps}>
          {placeholder && <option>{placeholder}</option>}
          {options.map(({ value, label, disabled }, index) => (
            <option value={value} key={index} disabled={disabled}>{label}</option>
          ))}
        </select>

        <span className={classNames.field} />

        <Icon name='dropdown' size={0.75} styles={styles.icon} />
      </div>

      {error && (
        <div className={classNames.errors}>
          {validations.map((error, i) => (
            <div className={classNames.error} key={i}>
              {error}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

InputSelect.propTypes = {
  /**
  * The label for the field
  */
  label: PropTypes.string.isRequired,

  /**
  * The name of the field
  */
  name: PropTypes.string.isRequired,

  /**
  * The ID of the field
  */
  id: PropTypes.string,

  /**
  * The current value
  */
  value: PropTypes.string,

  /**
  * The available options i.e. [{ value, label}, { value, label }]
  */
  options: PropTypes.array.isRequired,

  /**
  * The change handler that will receive the updated value as it's only param
  */
  onChange: PropTypes.func.isRequired,

  /**
  * The blur handler that will receive the updated value as it's only param
  */
  onBlur: PropTypes.func,

  /**
  * The placeholder for the field
  */
  placeholder: PropTypes.string,

  /**
  * Mark the field as required and displays an asterisk next to the label
  */
  required: PropTypes.bool
}

export default withStyles(styles)(InputSelect)
