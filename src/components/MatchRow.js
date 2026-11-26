import { memo, useRef } from 'react';
import { RESULT_LABELS } from '../data';
import { getTeamName, getResult, isValidGoals } from '../utils';

function MatchRow({ match, onGoals, onRemove }) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  const handleHomeGoals = (e) => {
    const value = e.target.valueAsNumber;
    if (isValidGoals(value)) {
      onGoals(match, 'home', value);
    }
  };

  const handleAwayGoals = (e) => {
    const value = e.target.valueAsNumber;
    if (isValidGoals(value)) {
      onGoals(match, 'away', value);
    }
  };

  const homeName = getTeamName(match.home);
  const awayName = getTeamName(match.away);

  return (
    <tr
      style={
        getResult(match) === 'draw' ? { background: 'rgba(255, 193, 7, 0.25)' } : undefined
      }
    >
      <td>{match.round}</td>
      <td>{homeName}</td>
      <td>
        <input
          type="number"
          min="0"
          max="20"
          value={match.homeGoals}
          aria-label={`Bàn thắng nhà ${homeName} - ${awayName}`}
          onChange={handleHomeGoals}
        />
      </td>
      <td>
        <input
          type="number"
          min="0"
          max="20"
          value={match.awayGoals}
          aria-label={`Bàn thắng khách ${homeName} - ${awayName}`}
          onChange={handleAwayGoals}
        />
      </td>
      <td>{awayName}</td>
      <td>{RESULT_LABELS[getResult(match)]}</td>
      <td>{renderCount.current}</td>
      <td>
        <button onClick={() => onRemove(match)}>Xóa</button>
      </td>
    </tr>
  );
}

export default memo(MatchRow);
