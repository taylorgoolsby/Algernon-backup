// @flow

import type { MessageSQL } from "../../schema/Message/MessageSchema.mjs";
import React, { useEffect, useRef, useState } from "react";
import { MessageRole } from "../../schema/Message/MessageSchema.mjs";
import { View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons.js";
import Colors from "../../Colors.js";
import { BlurView } from "@react-native-community/blur";
import chatStore from "../../stores/ChatStore.js";

type ProfilePicProps = {
  message: MessageSQL,
  noBorder?: boolean,
  isActive?: boolean,
  tenX?: boolean,
}

const ProfilePic = (props: ProfilePicProps): any => {
  const {
    message,
    noBorder,
    isActive,
    tenX,
  } = props

  if (!message) return null

  const t = tenX ? 10 : 1

  const [time, setTime] = useState(Date.now())

  const step = () => {
    const nextTime = Date.now()
    setTime(nextTime)
    chatStore.updateOrbSim(message.messageId, nextTime)
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
  }, [time, message.role, message.messageId])

  const points = chatStore.orbSims[message.messageId.toString()]?.points ?? []

  let averageDistanceFromCenter = Math.sqrt(points.reduce((acc, orb, i) => {
    return acc + orb.xPos * orb.xPos + orb.yPos * orb.yPos
  }, 0) / 4)

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
        {points.map((orb, i) => {
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
                        -((8 * t + averageDistanceFromCenter / g) / 2) + orb.xPos,
                      marginTop:
                        -((8 * t + averageDistanceFromCenter / g) / 2) + -orb.yPos,
                      backgroundColor: orb.color,
                    }
                  : {
                      borderRadius: 5 * t,
                      width: 10 * t,
                      height: 10 * t,
                      top: '50%',
                      left: '50%',
                      marginLeft: -5 * t + orb.xPos,
                      marginTop: -5 * t + -orb.yPos,
                      backgroundColor: orb.color

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

export default ProfilePic
