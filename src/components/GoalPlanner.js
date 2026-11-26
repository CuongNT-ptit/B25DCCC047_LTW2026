import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectGoal, setTeamId, setTarget, setRemaining } from '../features/goalSlice';
import { TEAMS } from '../data';
import { calcNeeded } from '../utils';

function GoalPlanner({ standings }) {
  const { teamId, target, remaining } = useSelector(selectGoal);
  const dispatch = useDispatch();

  const result = useMemo(
    () => calcNeeded(standings, teamId, target, remaining),
    [standings, teamId, target, remaining]
  );

  return (
    <div>
      <div className="field">
        <label htmlFor="goal-team">Đội của bạn</label>
        <select
          id="goal-team"
          value={teamId}
          onChange={(e) => dispatch(setTeamId(e.target.value))}
        >
          {TEAMS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="goal-target">Số điểm mục tiêu</label>
        <input
          id="goal-target"
          type="number"
          value={target}
          onChange={(e) => dispatch(setTarget(e.target.value))}
        />
      </div>

      <div className="field">
        <label htmlFor="goal-remaining">Số trận còn lại</label>
        <input
          id="goal-remaining"
          type="number"
          value={remaining}
          onChange={(e) => dispatch(setRemaining(e.target.value))}
        />
      </div>

      <p>{result}</p>
    </div>
  );
}

export default GoalPlanner;
