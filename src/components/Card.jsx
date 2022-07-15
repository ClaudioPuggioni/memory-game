function Card(props) {
  return (
    <div className="card" onClick={() => props.handleClick(props.identifier)}>
      <div className="innerCard" id={props.identifier} style={{ transform: `rotateY(${props.inputDeg}deg)` }}>
        <div className="cardFront"></div>
        <div className="cardBack" style={{ backgroundColor: props.bgColor }}>
          <img className="cardImg" src={`/assets/fruits/${props.fruitName}.png`} alt={`Fruit ${props.idx}`} />
        </div>
      </div>
    </div>
  );
}

export default Card;
