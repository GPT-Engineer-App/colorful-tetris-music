import { useState, useEffect, useCallback } from "react";
import { Container, Box, useBoolean } from "@chakra-ui/react";
import { FaArrowLeft, FaArrowRight, FaArrowDown, FaArrowUp } from "react-icons/fa";

// Constants for the game
const ROWS = 20;
const COLS = 10;
const CELL_SIZE = 30; // cell size in pixels

// Create an empty grid
const createGrid = () => Array.from({ length: ROWS }, () => Array(COLS).fill(0));

// Tetris shapes with additional shapes
const SHAPES = [
  [[1, 1, 1, 1]],

  [
    [1, 1],
    [1, 1],
  ],

  [
    [0, 1, 0],
    [1, 1, 1],
  ],

  [
    [0, 1, 1],
    [1, 1, 0],
  ],

  [
    [1, 1, 0],
    [0, 1, 1],
  ],

  [
    [1, 0],
    [1, 0],
    [1, 1],
  ],

  [
    [0, 1],
    [0, 1],
    [1, 1],
  ],
];

// Random shape selector
const randomShape = () => {
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  return shape.map((row) => row.slice());
};

const Index = () => {
  const [grid, setGrid] = useState(createGrid());
  const [activeShape, setActiveShape] = useState(randomShape());
  const [position, setPosition] = useState({ x: COLS / 2 - 1, y: 0 });
  const [bgColor, setBgColor] = useState("white");

  // Place shape in grid
  const updateGrid = useCallback((newGrid, shape, pos) => {
    const newUpdatedGrid = newGrid.map((row) => row.slice());
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          newUpdatedGrid[y + pos.y][x + pos.x] = shape[y][x];
        }
      }
    }
    return newUpdatedGrid;
  }, []);

  // Handle key events
  useEffect(() => {
    const handleKeyDown = (event) => {
      let newX = position.x;
      let newY = position.y;
      switch (event.key) {
        case "ArrowLeft":
          newX = Math.max(position.x - 1, 0);
          break;
        case "ArrowRight":
          newX = Math.min(position.x + 1, COLS - activeShape[0].length);
          break;
        case "ArrowDown":
          newY = Math.min(position.y + 1, ROWS - activeShape.length);
          break;
        case "ArrowUp":
          break;
      }
      if (!checkCollision(newX, newY, activeShape)) {
        setPosition({ x: newX, y: newY });
      }
    };

    const checkCollision = (x, y, shape) => {
      for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
          if (shape[i][j] && (grid[y + i] && grid[y + i][x + j]) !== 0) {
            return true;
          }
        }
      }
      return false;
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Game loop
  useEffect(() => {
    const loop = setInterval(() => {
      setPosition((prev) => ({ ...prev, y: prev.y + 1 }));
    }, 1000);

    return () => clearInterval(loop);
  }, []);

  // Update grid when position or active shape changes
  useEffect(() => {
    const newGrid = updateGrid(createGrid(), activeShape, position);
    setGrid(newGrid);
  }, [position, activeShape, updateGrid]);

  return (
    <Container maxW="container.md" height="100vh" centerContent>
      <Box width={COLS * CELL_SIZE} height={ROWS * CELL_SIZE} bg={bgColor} position="relative">
        {grid.map((row, y) => row.map((cell, x) => <Box key={`${x}-${y}`} position="absolute" top={y * CELL_SIZE} left={x * CELL_SIZE} width={CELL_SIZE} height={CELL_SIZE} bg={cell ? "blue" : "transparent"} border="1px solid" borderColor="gray.200" />))}
      </Box>
    </Container>
  );
};

export default Index;
