import React, { Component } from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash/debounce'
import { withStyles } from '../../lib/css'
import styles from './styles'

import Icon from '../icon'
import RichText from '../rich-text'

class Typeahead extends Component {
  constructor () {
    super()
    this.handleChange = this.handleChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.hideResults = this.hideResults.bind(this)
    this.clearResults = this.clearResults.bind(this)
    this.scrollList = this.scrollList.bind(this)

    this.state = {
      q: '',
      highlighted: 0,
      showResults: false
    }
  }

  handleChange () {
    const { input, matches } = this.refs
    const { value } = input
    const { selected, onClear, onChange } = this.props

    if (selected) onClear()
    if (matches) matches.scrollTop = 0

    this.setState({ q: value, showResults: true })
    return onChange(value)
  }

  handleKeyDown (e) {
    const { highlighted } = this.state
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        this.highlightItem(highlighted - 1)
        return this.scrollList('up')
      case 'ArrowDown':
        e.preventDefault()
        this.highlightItem(highlighted + 1)
        return this.scrollList('down')
      case 'Enter':
        return this.selectHighlighted()
      case 'Escape':
        return this.clearResults()
      default:
        return null
    }
  }

  hideResults () {
    this.setState({
      showResults: false,
      highlighted: 0
    })
  }

  clearResults () {
    const { onClear } = this.props
    const { input } = this.refs

    onClear()
    this.hideResults()
    input.value = ''
    setTimeout(() => input.focus())
  }

  scrollList (direction) {
    const el = this.refs.root.querySelector('.selectedIndex')
    if (el) {
      const parent = el.parentElement

      if (direction === 'up') {
        const nextEl = el.nextSibling
        if (nextEl) {
          if ((parent.scrollTop + parent.offsetHeight) <= nextEl.offsetTop) {
            parent.scrollTop = nextEl.offsetTop - (parent.offsetHeight - nextEl.offsetHeight)
          }
        } else {
          parent.scrollTop = 0
        }
      } else {
        const previousEl = el.previousSibling
        if (previousEl) {
          if (previousEl.offsetTop <= parent.scrollTop) {
            parent.scrollTop = previousEl.offsetTop
          }
        } else {
          parent.scrollTop = parent.scrollHeight
        }
      }
    }
  }

  highlightItem (highlighted) {
    const { results = [] } = this.props
    const count = results.length

    if (count) {
      if (highlighted < 0) {
        this.setState({ highlighted: count - 1 })
      } else if (highlighted >= count) {
        this.setState({ highlighted: 0 })
      } else {
        this.setState({ highlighted })
      }
    }
  }

  selectHighlighted () {
    const { results, onSelect } = this.props
    const { highlighted } = this.state
    const highlightedMatch = results[highlighted]

    if (highlightedMatch) {
      this.refs.input.blur()
      onSelect(highlightedMatch)
    }
  }

  render () {
    const { highlighted, showResults } = this.state
    const { input = {} } = this.refs
    const { value } = input

    const {
      classNames,
      loading,
      notFound,
      onSelect,
      placeholder,
      results,
      selected,
      styles
    } = this.props

    const resultsVisible = value && !selected && showResults

    return (
      <div ref='root' className={classNames.root} onKeyDown={this.handleKeyDown}>
        <div className={classNames.field}>
          <input
            ref='input'
            type='search'
            onChange={debounce(this.handleChange, 300)}
            placeholder={placeholder}
            autoComplete='off'
            className={classNames.input}
          />

          {selected ? (
            <div className={classNames.selected} onClick={this.clearResults}>
              <input
                type='search'
                value={selected.label}
                className={classNames.input}
                readOnly
              />
              <Icon name='close' styles={styles.icon} />
            </div>
          ) : (
            <Icon name='search' styles={styles.icon} />
          )}

          {resultsVisible && (
            <div ref='matches' className={classNames.matches}>
              {results.length ? (
                results.map((result, index) => (
                  <div onClick={(e) => onSelect(result)} key={index} className={`${classNames.result} ${index === highlighted ? [classNames.highlighted, 'selectedIndex'].join(' ') : ''}`}>
                    <div
                      className={classNames.resultContent}
                      dangerouslySetInnerHTML={{ __html: result.string || result.label }}
                    />
                  </div>
                ))
              ) : (
                <div className={classNames.noMatch}>
                  {loading ? (
                    <Icon name='loading' size={1.5} spin />
                  ) : (
                    <RichText styles={styles.noMatchIntro}>{notFound}</RichText>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
}

Typeahead.propTypes = {
  /**
  * The onChange event handler to be fired
  */
  onChange: PropTypes.func.isRequired,

  /**
  * The event handler when an item is selected
  */
  onSelect: PropTypes.func.isRequired,

  /**
  * The event handler when the selected item is cleared
  */
  onClear: PropTypes.func,

  /**
  * The placeholder for the input
  */
  placeholder: PropTypes.string,

  /**
  * The array of results
  */
  results: PropTypes.array,

  /**
  * The label to display when no results are found
  */
  notFound: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ])
}

Typeahead.defaultProps = {
  placeholder: 'Start typing to search...',
  notFound: 'No results found',
  results: [],
  onClear: () => {}
}

export default withStyles(styles)(Typeahead)
