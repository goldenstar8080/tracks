import React, { Component } from 'react'
import PropTypes from 'prop-types'
import htmlToElement from './htmlToElement'
import {
  Linking,
  StyleSheet,
  View,
  Text
} from 'react-native'
import StyleConsts from '/constants/styleConstants'

const boldStyle = { fontFamily: StyleConsts.fontFamily.openSansBold }
const italicStyle = { fontFamily: StyleConsts.fontFamily.openSansItalic }
const codeStyle = { fontFamily: StyleConsts.fontFamily.openSans }

const baseStyles = StyleSheet.create({
  b: boldStyle,
  strong: boldStyle,
  i: italicStyle,
  em: italicStyle,
  pre: codeStyle,
  code: codeStyle,
  a: {
    fontWeight: '500',
    color: '#007AFF'
  },
  h1: { fontWeight: '500', fontSize: 36 },
  h2: { fontWeight: '500', fontSize: 30 },
  h3: { fontWeight: '500', fontSize: 24 },
  h4: { fontWeight: '500', fontSize: 18 },
  h5: { fontWeight: '500', fontSize: 14 },
  h6: { fontWeight: '500', fontSize: 12 }
})

class HtmlView extends Component {
  constructor () {
    super()
    this.state = {
      element: null
    }
  }

  componentDidMount () {
    this.mounted = true
    this.startHtmlRender(this.props.value)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.value !== nextProps.value) {
      this.startHtmlRender(nextProps.value)
    }
  }

  componentWillUnmount () {
    this.mounted = false
  }

  startHtmlRender (value) {
    if (!value) {
      this.setState({ element: null })
    }

    const opts = {
      addLineBreaks: this.props.addLineBreaks,
      linkHandler: this.props.onLinkPress,
      styles: Object.assign({}, baseStyles, this.props.stylesheet),
      customRenderer: this.props.renderNode
    }

    htmlToElement(value, opts, (err, element) => {
      if (err) {
        this.props.onError(err)
      }

      if (this.mounted) {
        this.setState({ element })
      }
    })
  }

  render () {
    if (this.state.element) {
      return (
        <Text style={this.props.style}>
          {this.state.element}
        </Text>
      )
    }
    return <Text style={this.props.style} />
  }
}

HtmlView.propTypes = {
  addLineBreaks: PropTypes.bool,
  value: PropTypes.string,
  stylesheet: PropTypes.object,
  style: PropTypes.object,
  onLinkPress: PropTypes.func,
  onError: PropTypes.func,
  renderNode: PropTypes.func
}

HtmlView.defaultProps = {
  addLineBreaks: true,
  onLinkPress: url => Linking.openURL(url),
  onError: console.error.bind(console),
  value: {},
  stylesheet: {},
  style: {},
  renderNode: () => {}
}

export default HtmlView
