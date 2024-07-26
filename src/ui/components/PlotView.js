// @flow

import React, { useState, useEffect, useRef } from "react";
import { View, Dimensions } from "react-native";
import AnnotationInterface from "../../schema/Annotation/AnnotationInterface";
import type { AnnotationSQL } from "../../schema/Annotation/AnnotationSchema.mjs";
import { Svg, Circle, Line, Text } from 'react-native-svg';
import { PCA } from 'ml-pca';
import Colors, { aiText, userText } from "../../Colors";

const screenWidth = Dimensions.get("window").width;

function applyPCA(embeddings: Array<Array<number>>) {
  const pca = new PCA(embeddings);
  const reduced = pca.predict(embeddings, {nComponents: 2});
  return [...reduced];
}

function normalizeCoordinates(data: Array<Array<number>>, width: number, height: number) {
  const xValues = data.map(point => point[0]);
  const yValues = data.map(point => point[1]);

  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  const rangeX = maxX - minX;
  const rangeY = maxY - minY;

  return data.map(point => {
    const normalizedX = ((point[0] - minX) / rangeX) * width;
    const normalizedY = ((point[1] - minY) / rangeY) * height;

    // Apply padding by rescaling:
    const padding = 20;
    const paddedX = (normalizedX - width / 2) * (width - padding * 2) / width + width / 2;
    const paddedY = (normalizedY - height / 2) * (height - padding * 2) / height + height / 2;

    return [paddedX, paddedY];
  });
}

// $FlowFixMe
// const PlotView = requireNativeComponent('PlotView');

const PlotView: any = () => {
  const [annotations, setAnnotations] = useState<Array<AnnotationSQL>>([]);
  const [reducedData, setReducedData] = useState<Array<Array<number>>>([]);

  const initialized = useRef(false);
  useEffect(() => {
    async function fetchData() {
      try {
        if (!initialized.current) {
          initialized.current = true;
          const data = await AnnotationInterface.getAll();
          setAnnotations(data);
          const embeddings = data.map(item => JSON.parse(item.embedding));
          const reduced = applyPCA(embeddings);
          const normalizedData = normalizeCoordinates(reduced, screenWidth, screenWidth);
          setReducedData(normalizedData);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  const gridSize = 10

  return (
    <View>
      <Svg height={screenWidth} width={screenWidth}>
        {Array.from({ length: gridSize }).map((_, index) => {
          const x = (index / (gridSize - 1)) * screenWidth;
          const y = (index / (gridSize - 1)) * screenWidth;
          return (
            <React.Fragment key={index}>
              <Line
                x1={x}
                y1={0}
                x2={x}
                y2={screenWidth}
                stroke={Colors.blue}
                strokeWidth="1"
              />
              <Line
                x1={0}
                y1={y}
                x2={screenWidth}
                y2={y}
                stroke={Colors.blue}
                strokeWidth="1"
              />
            </React.Fragment>
          );
        })}
        {reducedData.map((point, index) => {
          const annotation = annotations[index];
          return (
            <React.Fragment key={index}>
              <Circle
                cx={point[0]}
                cy={point[1]}
                r="3"
                fill={aiText}
              />
              <Text
                x={point[0] + 5} // Adjust position to avoid overlapping the point
                y={point[1] - 5} // Adjust position to avoid overlapping the point
                fontSize="10"
                fill={aiText}
              >
                {annotation?.text ?? ''}
              </Text>
            </React.Fragment>
          )
        })}
      </Svg>
    </View>
  )
}

export default PlotView;
