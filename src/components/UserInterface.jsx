import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import Dashboard from "./Dashboard";
import Card from "./Card";

let prevChoice;
let timer;
let closedMatrix = new Array(4).fill(null).map((ele) => new Array(4).fill(1));

function UserInterface() {
  let [currMatrix, setCurrMatrix] = useState(null);
  let [matrixState, setMatrixState] = useState(null);
  let [currSelected, setCurrSelected] = useState([]);
  let [score, setScore] = useState(0);
  let [moves, setMoves] = useState(0);
  let [time, setTime] = useState(0);
  let [won, setWon] = useState(false);
  let firstRender = useRef(true);
  let [maxWidth, setMaxWidth] = useState(470);
  const [countEnabled, setCountEnabled] = useState(true);

  const handleResize = useCallback(() => {
    window.innerWidth < 470 ? setMaxWidth(window.innerWidth) : setMaxWidth(470);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  function generateMatrix() {
    let numsArr = [
      ["apple", 2],
      ["apricot", 2],
      ["banana", 2],
      ["grape", 2],
      ["orange", 2],
      ["watermelon", 2],
      ["strawberry", 2],
      ["grapefruit", 2],
    ];
    let toFillMatrix = new Array(4).fill(null).map((ele) => new Array(4).fill(null));

    toFillMatrix.forEach((row, rIdx) => {
      row.forEach((col, cIdx) => {
        let numIdx = Math.floor(Math.random() * numsArr.length);
        toFillMatrix[rIdx][cIdx] = numsArr[numIdx][0];
        numsArr[numIdx][1] === 1 ? numsArr.splice(numIdx, 1) : numsArr[numIdx][1]--;
      });
    });
    return toFillMatrix;
  }

  useEffect(() => {
    setMatrixState(JSON.parse(JSON.stringify(closedMatrix)));
    setCurrMatrix(generateMatrix());
  }, []);

  let userSelection = (i) => {
    if (time === 0) {
      setTimeout(() => {
        setTime(1);
      }, 1000);
    }
    if (i === prevChoice) return;
    prevChoice = i;
    if (currSelected.length < 2) setCurrSelected((prevArr) => [...prevArr, i]);
  };

  useEffect(() => {
    if (currSelected.length === 2) {
      setMoves((prevMoves) => prevMoves + 1);
      let regex = /\d+/g;
      let first = currSelected[0].match(regex);
      let second = currSelected[1].match(regex);
      let match = currMatrix[first[0]][first[1]] === currMatrix[second[0]][second[1]];
      if (match) {
        let tempMatrix = JSON.parse(JSON.stringify(matrixState));
        tempMatrix[first[0]][first[1]] = 0;
        tempMatrix[second[0]][second[1]] = 0;
        if (tempMatrix.flat().reduce((acc, cur) => acc + cur) === 0) {
          clearInterval(timer);
          setTimeout(() => {
            setWon(true);
            setCountEnabled(false);
          }, 1000);
        }
        setMatrixState(tempMatrix);
        setScore((prevScore) => prevScore + 1);
      }
      setTimeout(() => {
        setCurrSelected((prevState) => []);
        prevChoice = null;
      }, 1100);
    }
    // eslint-disable-next-line
  }, [currSelected]);

  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    } else {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [time]);

  function restart() {
    setWon(false);
    setTime(0);
    setScore(0);
    setMoves(0);
    firstRender.current = true;
    setMatrixState(JSON.parse(JSON.stringify(closedMatrix)));
    setCurrMatrix(generateMatrix());
    setCountEnabled(true);
  }

  return (
    <div id="container">
      <div id="gameTitle">Memory Game</div>
      <Dashboard score={score} moves={moves} time={time} winBtn={restart} />
      <div id="winner" style={{ opacity: !won ? "0" : "100%", zIndex: !won ? "-9" : "9" }}>{`Congratulations! You won in ${moves} moves! You took ${time} seconds!`}</div>
      <div id="cardContainer" className={!won ? "" : "vanish"} style={{ background: "linear-gradient(135deg, #60dd8e, #188a8d)", maxHeight: `${maxWidth}px`, maxWidth: `${maxWidth}px` }}>
        {currMatrix === null && !won ? (
          "Loading"
        ) : !won ? (
          currMatrix.map((row, rIdx) => {
            return row.map((col, cIdx) => {
              return <Card key={`card${cIdx}`} inputDeg={matrixState[rIdx][cIdx] === 0 ? "180" : currSelected.includes(`r${rIdx}c${cIdx}`) ? "180" : "0"} identifier={`r${rIdx}c${cIdx}`} fruitName={currMatrix[rIdx][cIdx]} handleClick={userSelection} bgColor={matrixState[rIdx][cIdx] === 0 ? "#60dd8e" : currSelected.includes(`r${rIdx}c${cIdx}`) ? "#ebdd83" : "#60dd8e"} />;
            });
          })
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default UserInterface;
