// @flow

import React, {useEffect, useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {compiler} from 'markdown-to-jsx'
import Text from './Text.js'
import Colors from '../../Colors.js'

const Bullet = (props: any) => {
  return (
    <Text
      style={{
        marginRight: Colors.fontSize / 2,
        marginLeft: Colors.fontSize / 2,
        fontFamily: 'Verdana',
      }}>
      {'• '}
    </Text>
  )
}

const Wrapper = (props: any) => {
}

const H1 = () => {}

const H2 = () => {}

const H3 = () => {}

const P = () => {}

const UL = () => {}

const OL = () => {}

const LI = () => {}

const Strong = () => {}

const A = () => {}

const Code = () => {}

const MarkdownText = (props: any): any => {
  const {style, textStyle, children, onLayout} = props

  const [compiledChildren, setCompiledChildren] = useState<Array<any>>([])

  useEffect(() => {
    const compiled = compiler(children, {
      forceWrapper: true,
      wrapper: Wrapper,
      createElement(type, props, children) {
        if (type === 'h1') {
          return <H1 {...props} children={children} />
        }

        if (type === 'h2') {
          return <H2 {...props} children={children} />
        }

        if (type === 'h3') {
          return <H3 {...props} children={children} />
        }

        if (type === 'p') {
          return <P {...props} children={children} />
        }

        if (type === 'ul') {
          return (
            <UL {...props}>
              {children.map((child, index) => (
                <LI key={index} children={child.props.children} />
              ))}
            </UL>
          )
        }

        if (type === 'ol') {
          return (
            <OL {...props}>
              {children.map((child, index) => (
                <LI key={index} children={child.props.children} />
              ))}
            </OL>
          )
        }

        if (type === 'li') {
          return <LI {...props} children={children} />
        }

        if (type === 'strong') {
          console.log("type", type);
          return <Strong {...props} children={children} />
        }

        if (type === 'a') {
          return <A {...props} children={children} />
        }

        if (type === 'code') {
          return <Code {...props} children={children} />
        }

        return <Text {...props} children={children} />
      },
    })
    // console.log("compiled", compiled);
    // console.log("compiled.children", compiled.props.children);
    if (Array.isArray(compiled.props.children)) {
      setCompiledChildren(compiled.props.children)
    } else if (typeof compiled.props.children === 'string') {
      setCompiledChildren([compiled.props.children])
    } else {
      console.warn('unknown markdown case')
      setCompiledChildren([])
    }
  }, [children])

  function getMargins(children: Array<any>) {
    return children.map((child, index) => {
      const isFirst = index === 0
      const isLast = index === compiledChildren.length - 1

      let result: any = {}

      if (child.type === P || child.type === UL || child.type === OL) {
        result = {
          marginTop: isFirst ? 0 : (Colors.fontSize * 1.5) / 2,
          marginBottom: isLast ? 0 : (Colors.fontSize * 1.5) / 2,
        }
      }

      const prevType = compiledChildren[index - 1]?.type
      if (prevType === P || prevType === UL || prevType === OL) {
        result.marginTop = 0
      }

      return result
    })
  }

  if (!compiledChildren.length) {
    return <View style={style} onLayout={onLayout} />
  }

  function renderChildren(children: Array<any>, parentType: any): Array<any> {
    const margins = getMargins(children)

    return children.map((child, index) => {
      if (typeof child === 'string') {
        return (
          <Text key={index} style={{...textStyle, ...margins[index]}}>
            {child}
          </Text>
        )
      }

      if (child.type === H1) {
        return (
          <Text
            key={index}
            style={{
              ...textStyle,
              ...margins[index],
              fontSize: Colors.fontSize * 2,
              lineHeight: Colors.fontSize * 2 * 1.5,
              fontWeight: '700',
            }}
          >
            {renderChildren(child.props.children, Text)}
          </Text>
        )
      }

      if (child.type === H2) {
        return (
          <Text
            key={index}
            style={{
              ...textStyle,
              ...margins[index],
              fontSize: Colors.fontSize * 1.5,
              lineHeight: Colors.fontSize * 1.5 * 1.5,
              fontWeight: '700',
            }}
          >
            {renderChildren(child.props.children, Text)}
          </Text>
        )
      }

      if (child.type === H3) {
        return (
          <Text
            key={index}
            style={{
              ...textStyle,
              ...margins[index],
              fontSize: Colors.fontSize * 1.25,
              lineHeight: Colors.fontSize * 1.25 * 1.5,
              fontWeight: '600',
            }}
          >
            {renderChildren(child.props.children, Text)}
          </Text>
        )
      }

      if (child.type === P) {
        if (parentType === Text) {
          // a View cannot be placed inside of a Text
          return (
            <Text
              key={index}
              style={{
                ...margins[index], // Text inside of Text does not support margin.
              }}>
              {renderChildren(child.props.children, Text)}
            </Text>
          )
        } else {
          return (
            <View
              key={index}
              style={{
                ...margins[index],
              }}>
              {renderChildren(child.props.children, View)}
            </View>
          )
        }
      }

      if (child.type === UL || child.type === OL) {
        return (
          <View
            key={index}
            style={{
              ...margins[index],
            }}>
            {renderChildren(child.props.children, View)}
          </View>
        )
      }

      if (child.type === LI) {
        return (
          <Text key={index} style={textStyle}>
            <Bullet />
            {renderChildren(child.props.children, Text)}
          </Text>
        )
      }

      if (child.type === Strong) {
        return (
          <Text
            key={index}
            style={{...textStyle, ...margins[index], fontWeight: 600}}
          >
            {renderChildren(child.props.children, Text)}
          </Text>
        )
      }

      if (child.type === A) {
        return (
          <Text
            key={index}
            style={{...textStyle, ...margins[index], color: Colors.blue}}
          >
            {renderChildren(child.props.children, Text)}
          </Text>
        )
      }

      if (child.type === Code) {
        // todo: monospace font
        return (
          <Text
            key={index}
            style={{...textStyle, ...margins[index]}}
          >
            {renderChildren(child.props.children, Text)}
          </Text>
        )
      }
    })
  }

  return (
    <View style={style} onLayout={onLayout}>
      {renderChildren(compiledChildren)}
    </View>
  )
}

const styles = StyleSheet.create({})

export default MarkdownText
