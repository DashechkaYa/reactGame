import { useState } from "react";

// ф створює одну ячейку поля; value передається в кнопку з return в ф Board; при кліку виконується ф onSquareClick з Board яка в свою чергу виконує handleClick
function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({xIsNext, squares, onPlay}) {   // якщо головний компонент Game контролює гру, то Board відображає її. Тут параметри це: xIsNext - тру або фолс(наступний гравець); squares - останній елемент масиву history (поточний стан гри); onPlay - ф handlePlay в компоненті Game (для оновлення стануів гри)

  // основна задача ф нижче - зміна стану гри після кліку гравця на певну клітинку (параметр - це клітинка на дошці - з return ф Board)
  function handleClick(idx) {
    if(squares[idx] || calculateWinner(squares)) {   // тут перевірка чи заповнені всі клітинки (і по індексам його клітинок дивимось чи клітинка пуста (тут мб або Х/О - true або null - false)). І також перевірка чи є вже переможець
      return;
    }
    const nextSquares = squares.slice();  // якщо клітинка була все ж пуста - ф створює новий масив (копію актуального стану гри)
    if(xIsNext) {               // і залежно від тру/фолс стану в ф Game вписує елемент Х або О під потрібним індексом в масив
      nextSquares[idx] = 'X';
    } else {
      nextSquares[idx] = 'O';
    }
    onPlay(nextSquares);    // по суті це виконання ф handlePlay в ф Game для оновлення історії гри
  };

  const winner = calculateWinner(squares);
  let status;
  if(winner) {
    status = "Winner:" + winner; 
  } else if (isGameOver(squares)) {
      status = "Game draw"; 
  } else {
      status = "Next player:" + (xIsNext ? 'X' : "O");
  }

  return ( // Board повертає ,,, value={squares[..]} - передає компоненту Square значення що має відобразитись в клітинці
    <>
      <div className="status">{status}</div>

      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
        <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
        <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
        <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
        <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
        <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
        <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);       // цей код задає першого гравця (Х)
  const [history, setHistory] = useState([Array(9).fill(null)]);     // history це масив масивів (кожен вкладений масив це дошка з 9 клітинок з певним станом в певний момет гри; кожен наступний вкладений масив це новий стан гри - після кожного кліку гравців)
  const [currentMove, setCurrentMove] = useState(0);       // currentMove - це індекс останнього (поточного стану гри) елементу масиву
  const currentSquares = history[currentMove];       // змінна є посиланням на останній (актуальний стан гри) вкладений масив (дошку з 9 клітинок), по суті history[currentMove] з кожним кліком змінюється

  function handlePlay(nextSquares) {       // ф виконується з кожним кліком по дошці (з ф Board). Її параметр - це масив (актуальний стан гри) - за допомогою нього вона оновлює стани (useState) ф Game
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];     // взали в змінну: копія існуючого масиву масивів history + з останній хід (останній вкладений масив) 
    setHistory(nextHistory);     // нові данні з попереднього рядка використовуємо для оновлення історії гри
    setCurrentMove(nextHistory.length - 1);     // оновлюємо данні про останній індекс в історії
    setXIsNext(!xIsNext);     // тут змінюємо гравця з Х на О і навпаки для наступного ходу
  };

  function jumpTo(nextMove) {     // ф виконується з кліком по одній з кнопок (кожна кнопка - повернення на певний хід), що виникають з кожним кліком на дошку; обробник кліку кнопки - в return ф що створює ці кнопки
    setCurrentMove(nextMove);    // тут оновлюється індекс стану currentMove (це стає ніби останнім індексом - так змінюється відображення історії гри)
    setXIsNext(nextMove % 2 === 0);   // вказує який гравець може далі робити хід
  };

  const moves = history.map((squares, move) => {    // moves це масив кнопок, map - ф що створює ці кнопки
    let description;
    if(move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (   // тут кожній кнопці (що є елементом списку) присвоюється унікальний ключ; 
      <li key={squares.toString()}> 
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (   // тут Game створює дом елемент що містить дошку гри (передає компоненет Board), та елемент де обгортку списку потрапляють кнопки з ходами гри (масив moves що створювався вище)
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-board">
        <ol>{moves}</ol>
      </div>
    </div>
  )
};

function isGameOver(squares) {
  return squares.every(cell => cell);
};

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for(let i =0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

// const arr = [['a', 'b', 'f', 'd'], ['e', 'a', 'p', 'd'], ['g', 'b', 'k', 'd']];
// const el = arr[0];
// el = arr[1];
// console.log(el);

// for(let i = 0; i < arr.length; i++) {
// const el = arr[i];
//   console.log(el);
// };