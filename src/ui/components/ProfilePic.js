// @flow

import type { MessageSQL } from "../../schema/Message/MessageSchema.mjs";
import React, { useEffect, useRef, useState } from "react";
import { MessageRole } from "../../schema/Message/MessageSchema.mjs";
import { View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons.js";
import Colors from "../../Colors.js";
import { BlurView } from "@react-native-community/blur";
import { observer } from "mobx-react";
import { observable } from "mobx";

type ProfilePicProps = {
  message: MessageSQL,
  noBorder?: boolean,
  isActive?: boolean,
  tenX?: boolean,
}

const InnerProfilePic = (props: ProfilePicProps): any => {
  const {
    message,
    noBorder,
    isActive,
    tenX,
  } = props

  if (!message) return null

  const t = tenX ? 10 : 1

  const r = 7 * t
  const v = 5 * t
  const m = Math.random()
  const xPos = useRef([
    0,
    // r * Math.sin((1 / 3) * 2 * Math.PI),
    // r * Math.sin((2 / 3) * 2 * Math.PI),
    // r * Math.sin((3 / 3) * 2 * Math.PI),
    r * Math.sin(Math.PI),
    0.5 * r * Math.sin(m * 2 * Math.PI),
    r * Math.sin(2 * Math.PI),
    0,
  ])
  const yPos = useRef([
    0,
    // r * Math.cos((1 / 3) * 2 * Math.PI),
    // r * Math.cos((2 / 3) * 2 * Math.PI),
    // r * Math.cos((3 / 3) * 2 * Math.PI),
    // (Math.random() - 0.5) * 2 * r
    r * Math.cos(Math.PI),
    0.5 * r * Math.cos(m * 2 * Math.PI),
    r * Math.cos(2 * Math.PI),
    0,
  ])
  // const xVel = useRef([
  //   0, 0, 0, 0
  // ])
  // const yVel = useRef([
  //   0, 0, 0, 0,
  // ])
  // get the x-coordinate of a vector tangent to a circle given phi:
  const phase = Math.random() * 2 * Math.PI
  const xVel = useRef([
    0,
    // v * Math.cos((1 / 3) * 2 * Math.PI),
    // v * Math.cos((2 / 3) * 2 * Math.PI),
    // v * Math.cos((3 / 3) * 2 * Math.PI),
    v * Math.cos(Math.PI + phase),
    (Math.random() - 0.5) * 2 * v,
    v * Math.cos(2 * Math.PI + phase),
    0,
  ])
  const yVel = useRef([
    0,
    -v * Math.sin(Math.PI + phase),
    (Math.random() - 0.5) * 2 * v,
    -v * Math.sin(2 * Math.PI + phase),
    0,
  ])

  const [time, setTime] = useState(Date.now())

  const step = () => {
    // Implement a simple spring force simulation on the dots:
    // 1. Calculate the force on each dot
    // 2. Update the velocity of each dot
    // 3. Update the position of each dot
    // 4. Repeat
    const k = 0.1
    // const dt = (Math.min(Date.now() - time, 1000) * 0.001) / 2
    const dt = 0
    setTime(Date.now())
    const n = 5

    for (let i = 0; i < n; i++) {
      if (i === 0) {
        // first point is fixed.
        continue
      }
      for (let j = 0; j < n; j++) {
        if (i === j) {
          continue
        }
        const dx = xPos.current[j] - xPos.current[i]
        const dy = yPos.current[j] - yPos.current[i]
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < 0.005) {
          continue
        }
        const f = k * d
        const fx = (f * dx) / d
        const fy = (f * dy) / d
        xVel.current[i] += fx * dt
        yVel.current[i] += fy * dt
        xPos.current[i] += xVel.current[i] * dt
        yPos.current[i] += yVel.current[i] * dt

        if (isNaN(xVel.current[i])) {
          xVel.current[i] = 0
        }
        if (isNaN(yVel.current[i])) {
          yVel.current[i] = 0
        }
        if (isNaN(xPos.current[i])) {
          xPos.current[i] = 0
        }
        if (isNaN(yPos.current[i])) {
          yPos.current[i] = 0
        }
      }
    }
  }

  const timeout = useRef<any>(null)
  useEffect(() => {
    if (message.role === MessageRole.ASSISTANT) {
      // A step must render first before queueing another step.
      // So setTimeout is called in a render, not at the end of the step function.
      // This prevents the event queue from being filled with step calls,
      // which blocks touch events as they are added to the end of a long queue.
      if (timeout.current) {
        clearTimeout(timeout.current)
        timeout.current = null
      }
      timeout.current = setTimeout(() => {
        timeout.current = null
        step()
      }, 17)
    }
  }, [time, message.role])

  let averageDistanceFromCenter = Math.sqrt(
    xPos.current.reduce((acc, x, i) => {
      return acc + x * x + yPos.current[i] * yPos.current[i]
    }, 0) / 4,
  )

  const overlay = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 24 * t,
    height: 24 * t,
  }

  if (message.role === MessageRole.USER) {
    // return (
    //   <Image
    //     style={{
    //       width: 28,
    //       height: 28,
    //       borderRadius: 14,
    //       borderWidth: 1,
    //       borderColor:
    //         message.role === MessageRole.USER
    //           ? // ? 'rgba(255, 186, 0, 0.9)'
    //             'white'
    //           : 'rgba(62, 56, 225, 0.7)',
    //     }}
    //     source={
    //       message.role === MessageRole.USER
    //         ? {uri: 'AppIcon'}
    //         : {uri: 'LogoTransparent'}
    //     }
    //   />
    // )

    return (
      <View
        style={{
          width: 24 * t,
          height: 24 * t,
          borderRadius: 12 * t,
          overflow: 'hidden',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        }}>
        <Icon
          style={[
            overlay,
            {
              width: 20,
              height: 20,
              marginTop: 6,
              marginLeft: 2,
            },
          ]}
          name={'person'}
          size={20}
          color={'rgba(0, 0, 0, 0.7)'}
        />

        <View
          style={[
            overlay,
            {
              width: 24 * t,
              height: 24 * t,
              borderRadius: 12 * t,
              // borderWidth: noBorder ? 0 : 1,
              borderWidth: noBorder ? 0 : 1,
              borderColor: 'rgba(0, 0, 0, 0.65)',
            },
          ]}
        />
      </View>
    )
  } else {
    const g = 2.8 / 10

    return (
      <View
        style={{
          width: 24 * t,
          height: 24 * t,
          borderRadius: 12 * t,
          overflow: 'hidden',
          // backgroundColor: darkMode ? 'black' : 'white',
          backgroundColor: 'white',
        }}>
        {xPos.current.map((x, i) => {
          const y = yPos.current[i]
          return (
            <View
              key={i}
              style={[
                overlay,
                i === 0
                  ? {
                      borderRadius: (8 * t + averageDistanceFromCenter / g) / 2,
                      width: 8 * t + averageDistanceFromCenter / g,
                      height: 8 * t + averageDistanceFromCenter / g,
                      top: '50%',
                      left: '50%',
                      marginLeft:
                        -((8 * t + averageDistanceFromCenter / g) / 2) + x,
                      marginTop:
                        -((8 * t + averageDistanceFromCenter / g) / 2) + -y,
                      backgroundColor: Colors.blue,
                    }
                  : {
                      borderRadius: 5 * t,
                      width: 10 * t,
                      height: 10 * t,
                      top: '50%',
                      left: '50%',
                      marginLeft: -5 * t + x,
                      marginTop: -5 * t + -y,
                      backgroundColor:
                        i === 1
                          ? 'rgba(255, 186, 0, 0.9)'
                          : i === 2
                          ? 'rgb(215, 29, 29)'
                          : i === 3
                          ? Colors.teal
                          : Colors.blue,
                    },
              ]}
            />
          )
        })}

        <BlurView
          style={[
            overlay,
            {
              width: 24 * t,
              height: 24 * t,
              borderRadius: 12 * t,
              // borderWidth: noBorder ? 0 : 1,
              borderWidth: noBorder ? 0 : 1,
              borderColor: Colors.blue,
            },
          ]}
          blurAmount={5 * t}
          blurType="light"
        />
      </View>
    )
  }
}

const profilePicCache: {value: {[number]: any}} = observable({
  value: {}
})
const ProfilePic: (props: ProfilePicProps) => any = observer((props: ProfilePicProps): any => {
  const messageId = props.message.messageId

  console.log("Object.keys(profilePicCache.value)", Object.keys(profilePicCache.value));
  console.log("profilePic messageId", messageId);

  useEffect(() => {
    if (!profilePicCache.value[messageId]) {
      console.log('initializing profile pic')
      profilePicCache.value[messageId] = <InnerProfilePic {...props} />
    }
    // return () => {
    //   delete profilePicCache[messageId]
    // }
  }, [messageId])

  return profilePicCache.value[messageId]
})

export default ProfilePic
