import  { useState, useCallback, useRef } from "react";
import { produce } from "immer";

const numRows = 30;
const numCols = 30;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

const App = () => {
  const [grid, setGrid] = useState(generateEmptyGrid());
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(100); // Speed in milliseconds
  const runningRef = useRef(running);
  const speedRef = useRef(speed);
  runningRef.current = running;
  speedRef.current = speed;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += g[newI][newJ];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });
    setTimeout(runSimulation, speedRef.current);
  }, [speed]);

  const nextPhase = useCallback(() => {
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += g[newI][newJ];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });
  }, []);

  const resetGrid = () => {
    setGrid(generateEmptyGrid());
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-1/3 bg-gray-200 p-4 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-8">Conway&apos;s Game of Life</h1>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex gap-4 mb-2">
            <button
              className={`px-4 py-2 text-white rounded hover:bg-opacity-80 ${
                running ? "bg-red-500" : "bg-green-500"
              }`}
              onClick={() => {
                setRunning(!running);
                if (!running) {
                  runningRef.current = true;
                  runSimulation();
                }
              }}
            >
              {running ? "Stop" : "Start"}
            </button>
            <button
              className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-700"
              onClick={() => {
                const rows = [];
                for (let i = 0; i < numRows; i++) {
                  rows.push(
                    Array.from(Array(numCols), () =>
                      Math.random() > 0.7 ? 1 : 0
                    )
                  );
                }
                setGrid(rows);
              }}
            >
              Random
            </button>
            <button
              className="px-4 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-700"
              onClick={nextPhase}
            >
              Next
            </button>
            <button
              className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-700"
              onClick={resetGrid}
            >
              Reset
            </button>
          </div>
          <div className="flex flex-col items-center gap-4 mt-4">
            <p className="text-lg font-semibold">Current Speed: {speed} ms</p>
            <div className="flex gap-4 items-center justify-center">
              <button
                className="px-4 py-2 text-white bg-violet-500 rounded hover:bg-violet-700"
                onClick={() => setSpeed((s) => Math.max(s - 50, 50))}
              >
                Speed Up
              </button>
              <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="mx-2"
              />
              <button
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                onClick={() => setSpeed((s) => Math.min(s + 50, 1000))}
              >
                Slow Down
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="w-2/3 flex items-center justify-center bg-white"
        style={{
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${numCols}, 20px)`,
          }}
        >
          {grid.map((rows, i) =>
            rows.map((col, j) => (
              <div
                key={`${i}-${j}`}
                onClick={() => {
                  const newGrid = produce(grid, (gridCopy) => {
                    gridCopy[i][j] = grid[i][j] ? 0 : 1;
                  });
                  setGrid(newGrid);
                }}
                className={`w-5 h-5 border border-gray-400 ${
                  grid[i][j] ? "bg-gray-800" : "bg-white"
                }`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
