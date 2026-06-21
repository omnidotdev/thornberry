import { expect, test } from "bun:test";

import { Position } from "@xyflow/react";

import {
  chooseConnectionSides,
  getBestConnectionPoints,
} from "./edge-geometry";

const source = { x: 0, y: 0, width: 100, height: 60 };

test("target directly below picks Bottom -> Top", () => {
  const target = { x: 0, y: 400, width: 100, height: 60 };
  expect(chooseConnectionSides(source, target)).toEqual({
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  });
});

test("target directly above picks Top -> Bottom", () => {
  const target = { x: 0, y: -400, width: 100, height: 60 };
  expect(chooseConnectionSides(source, target)).toEqual({
    sourcePosition: Position.Top,
    targetPosition: Position.Bottom,
  });
});

test("target directly to the right picks Right -> Left", () => {
  const target = { x: 400, y: 0, width: 100, height: 60 };
  expect(chooseConnectionSides(source, target)).toEqual({
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  });
});

test("target directly to the left picks Left -> Right", () => {
  const target = { x: -400, y: 0, width: 100, height: 60 };
  expect(chooseConnectionSides(source, target)).toEqual({
    sourcePosition: Position.Left,
    targetPosition: Position.Right,
  });
});

test("diagonal target where horizontal dominates picks Right -> Left", () => {
  const target = { x: 600, y: 150, width: 100, height: 60 };
  expect(chooseConnectionSides(source, target)).toEqual({
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  });
});

test("getBestConnectionPoints returns side-center coordinates", () => {
  const target = { x: 0, y: 400, width: 100, height: 60 };
  expect(getBestConnectionPoints(source, target)).toEqual({
    sourceX: 50,
    sourceY: 60,
    targetX: 50,
    targetY: 400,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  });
});
