function Dashboard(props) {
  return (
    <div id="dashboard">
      <div id="dashboardInfo">
        <div id="timeLeftLabel">
          Time:
          <div id="timeLeft">{`${props.time}s`}</div>
        </div>
        <div id="movesMadeLabel">
          <div id="movesMade">{props.moves}</div>
          moves
        </div>
        <div id="currentScoreLabel">
          Score:
          <div id="currentScore">{props.score}</div>
        </div>
      </div>
      <button
        id="restartBtn"
        onClick={() => {
          props.winBtn();
        }}
      >
        Restart
      </button>
    </div>
  );
}

export default Dashboard;
