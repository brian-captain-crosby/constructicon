import React, { Component } from 'react'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import merge from 'lodash/merge'
import mapValues from 'lodash/mapValues'

const withForm = (config) => (ComponentToWrap) => (
  class extends Component {
    constructor (props) {
      super(props)
      this.handleChange = this.handleChange.bind(this)
      this.submitForm = this.submitForm.bind(this)
      const options = this.initOptions(config)
      const fields = this.initFields(options.fields)
      this.state = {
        fields: this.validateFields(fields)
      }
    }

    initOptions (options) {
      const defaults = { fields: {} }
      const supplied = typeof options === 'function' ? options(this.props) : options
      return merge(defaults, supplied)
    }

    initFields (fields) {
      return mapValues(fields, (field, key) => ({
        ...field,
        value: field.initial,
        name: key,
        onChange: this.handleChange(key)
      }))
    }

    validateFields (fields) {
      return mapValues(fields, (field) => {
        const validations = this.validateField(
          field.validators,
          field.value,
          this.getValues(fields)
        )

        return {
          ...field,
          validations,
          invalid: !isEmpty(validations),
          error: field.touched && !isEmpty(validations)
        }
      })
    }

    validateField (validators, value, values) {
      switch (typeof validators) {
        case 'function':
          return validators(value, values)
        case 'object':
          const validations = validators.map((validator) => this.validateField(validator, value, values))
          return validations.filter((v) => v)
        default:
          return validators
      }
    }

    checkIfValid (fields) {
      return filter(fields, (filter) => filter.invalid).length === 0
    }

    touchFields (fields) {
      return mapValues(fields, (field) => merge(field, { touched: true }))
    }

    handleChange (key) {
      return (value) => {
        const field = this.state.fields[key]
        const updatedFields = {
          ...this.state.fields,
          [key]: {
            ...field,
            value,
            touched: true,
            dirty: value !== field.initial
          }
        }
        this.setState({
          fields: this.validateFields(updatedFields)
        })
      }
    }

    getValues (fields) {
      return mapValues(fields, 'value')
    }

    getValidations (fields) {
      return mapValues(fields, 'validations')
    }

    submitForm () {
      const fields = this.touchFields(this.state.fields)
      this.setState({ fields })
      return new Promise((resolve, reject) => (
        this.checkIfValid(fields) ? resolve(this.getValues(fields)) : reject(this.getValidations(fields))
      ))
    }

    getForm (fields) {
      return {
        fields,
        values: this.getValues(fields),
        invalid: !this.checkIfValid(fields),
        validations: this.getValidations(fields),
        submit: this.submitForm
      }
    }

    render () {
      return (
        <ComponentToWrap
          {...this.props}
          form={this.getForm(this.state.fields)}
        />
      )
    }
  }
)

export default withForm
