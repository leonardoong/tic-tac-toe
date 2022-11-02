import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  return (
    <button className={props.bold ? 'square bold' : 'square'} onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, row, col) {
    let isBold;
    if (row == this.props.row && col == this.props.col) {
      isBold =true
    }
    return (
      <Square
      value={this.props.squares[i]}
      bold={isBold}
      onClick={() => this.props.onClick(i, row, col)}
    />
    )
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0, 1, 1)}
          {this.renderSquare(1, 1, 2)}
          {this.renderSquare(2, 1, 3)}
        </div>
        <div className="board-row">
          {this.renderSquare(3, 2, 1)}
          {this.renderSquare(4, 2, 2)}
          {this.renderSquare(5, 2, 3)}
        </div>
        <div className="board-row">
          {this.renderSquare(6, 3, 1)}
          {this.renderSquare(7, 3, 2)}
          {this.renderSquare(8, 3, 3)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          row: null,
          col: null,
        },
      ],
      isXNext: true,
      stepNumber: 0,
    };
  }

  handleClick(i, r, c) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.isXNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          row: r,
          col: c,
        },
      ]),
      isXNext: !this.state.isXNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      isXNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" +
          move +
          " Prev row : " +
          step.row +
          " col : " +
          step.col
        : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner : " + winner;
    } else {
      status = "Next player : " + (this.state.isXNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            col={current.col}
            row={current.row}
            onClick={(i, r, c) => this.handleClick(i, r, c)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return;
}
