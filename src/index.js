import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return(
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {


  renderSquare() {
    var squares=[];
    for (let i=0;i<3;i++){
      squares.push(<div className="board-row"></div>);
      for (let j=0;j<3;j++){
        let n = singleIndex(i, j);
        squares.push(
          <Square 
            value={this.props.squares[n]} 
            onClick={() => this.props.onClick(n)}
          />
        )
      }
     //passa 2 props a square: value (dei dati, value i dell'array squares di board) e onClick (funct per aggiornare lo state chiamabile da Square)
    }
    return squares;
  }

  render() {
    
    let square=this.renderSquare();
      return(
        <div>
          {square}
        </div>
        )
    }
  }

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        actualMove: false,
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      isAsc: true,
      stepNumber: 0,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber +1);
    const current = history[history.length -1];
    const squares = current.squares.slice(); //copia l'array dello state
    if (calculateWinner(squares)||squares[i]) { 
      return; 
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'; //modifica l'indice alla square cliccata
    this.setState({ //concatena per formare la history
      history: history.concat ([{
        actualMove: i,
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    }); //risetta
  }

  jumpTo(step) {
    this.setState ({
      stepNumber: step,
      xIsNext: (step%2)===0,
    })
  }

  invertHistory(){
    let invertHistory=[];
    console.log(this.state.history.length);
    for (let i=this.state.history.length-1; i>-1; i--){
      invertHistory.push(this.state.history[i]);
    }
    return invertHistory;
  }

  toggleAsc(){
     this.state.isAsc ? this.setState({isAsc: false}) : this.setState({isAsc: true});
     this.setState({history: this.invertHistory()});
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
    const openBold = move === history.length-1 ?
        'bold' :
        null ;
    const desc = this.state.isAsc ? 
        move === 0 ?
          'Go to game start' :
          'Go to move # ' + move + ' {' + toRowCol(step.actualMove) +'}' 
       :
       move === history.length-1? 
         'Go to game start' :
         'Go to move # ' + move + ' {' + toRowCol(step.actualMove) +'}' ;

      return (
        <li key={move}> 
          <button className={openBold} onClick={() => this.jumpTo(move)}>
           {desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.player;
    } else {
      status = 'Next player: ' + (this.state.xIsNext? 'X' : 'O');
    }

    let toggle;
    if (this.state.isAsc) {
      toggle = "Descending";
    }
    else {
      toggle = "Ascending";
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggleAsc()}>{toggle}</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);



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
      let result = {
        player: squares[a],
        move: lines[i],
      }
      return result; 
    }
  }
  return null;
}

function toRowCol(value){
    let result;
    if (value<3){
      result='0, '+ value; 
    }
    else if(value<6){
      result='1, '+ (value-3); 
    }
    else {
      result='2, '+ (value-6); 
    }
    return result;
  }

function singleIndex(i, j){
    let result;
    if (i===0){
      if (j===0){ result=0; }
      else if (j===1) { result = 1; }
      else { result = 2; }
    }
    else if(i===1){
      if (j===0){ result=3; }
      else if (j===1) { result = 4; }
      else { result = 5; }
    }
    else {
      if (j===0){ result=6; }
      else if (j===1) { result = 7; }
      else { result = 8; }
    }
    return result;
  }


