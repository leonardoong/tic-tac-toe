import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  return (
    <button
      className={props.bold ? "square bold" : "square"}
      onClick={() => props.onClick()}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, row, col) {
    let isBold;
    if (row === this.props.row && col === this.props.col) {
      isBold = true;
    }
    return (
      <Square
        value={this.props.squares[i]}
        bold={isBold}
        onClick={() => this.props.onClick(i, row, col)}
      />
    );
  }

  getBoard = () => {
    let col = [];
    let index = 0;
    for (let i = 1; i <= 3; i++) {
      let row = [];
      for (let j = 1; j <= 3; j++) {
        row.push(this.renderSquare(index, i, j));
        index++;
      }
      col.push(<div className="board-row">{row}</div>);
    }
    return col;
  };

  render() {
    return <div>{this.getBoard()}</div>;
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
      isAsc : true,
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

  toggleAscDesc() {
    this.setState({
      isAsc: !this.state.isAsc,
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

    if (!this.state.isAsc) {
      moves.reverse()
    }

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
        <div className="toggle">
          <ToggleSwitch label={"ASC/DESC"} onClick={() => this.toggleAscDesc()}/>
        </div>
      </div>
    );
  }
}

class ToggleSwitch extends React.Component {

  render() {
    return (
      <div className="container">
        {this.props.label}{" "}
        <div className="toggle-switch">
          <input
            type="checkbox"
            className="checkbox"
            name={this.props.label}
            id={this.props.label}
            onClick={() => this.props.onClick()}
          />
          <label className="label" htmlFor={this.props.label}>
            <span className="inner" />
            <span className="switch" />
          </label>
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
