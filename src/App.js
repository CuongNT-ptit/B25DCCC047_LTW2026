import { useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useFetch from './hooks/useFetch';
import { selectMatches, setMatches, removeMatch, setGoals } from './features/matchesSlice';
import { useTheme } from './context/ThemeContext';
import { useNotice } from './context/NoticeContext';
import StandingsTable from './components/StandingsTable';
import AddMatchForm from './components/AddMatchForm';
import GoalPlanner from './components/GoalPlanner';
import { ROUNDS, RESULT_LABELS } from './data';
import {
  getTeamName,
  getResult,
  isValidGoals,
  calcStandings,
  calcMatchStats,
} from './utils';

const BUILD_TAG = "bd-5918";

function App() {
  const { data, loading, error } = useFetch('/data/matches.json');
  const matches = useSelector(selectMatches);
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();
  const [round, setRound] = useState('all');

  useEffect(() => {
    if (data) {
      dispatch(setMatches(data));
    }
  }, [data, dispatch]);

  const filteredMatches = useMemo(() => {
    if (round === 'all') {
      return matches;
    }
    return matches.filter((m) => m.round === Number(round));
  }, [matches, round]);

  const standings = useMemo(() => calcStandings(matches), [matches]);

  const stats = useMemo(() => calcMatchStats(filteredMatches), [filteredMatches]);

  const leaderText =
    matches.length > 0 ? `${standings[0].name} (${standings[0].points} điểm)` : '—';

  const handleGoals = (match, field, e) => {
    const value = e.target.valueAsNumber;
    if (!isValidGoals(value)) {
      return;
    }
    dispatch(
      setGoals({
        id: match.id,
        homeGoals: field === 'home' ? value : match.homeGoals,
        awayGoals: field === 'away' ? value : match.awayGoals,
      })
    );
  };

  const handleRemove = (match) => {
    dispatch(removeMatch(match.id));
    showNotice(`Đã xóa trận ${getTeamName(match.home)} - ${getTeamName(match.away)}`);
  };

  return (
    <div className={`app ${theme}`} data-build={BUILD_TAG}>
      <h1>Giải bóng đá khoa</h1>
      <button onClick={toggleTheme}>
        {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
      </button>

      {loading && <p>Đang tải lịch thi đấu...</p>}
      {error && <p>Không tải được lịch thi đấu.</p>}

      {!loading && !error && (
        <div>
          <section>
            <h2>Bảng xếp hạng</h2>
            <StandingsTable standings={standings} />
          </section>

          <section>
            <h2>Thống kê</h2>
            <p>{`Số trận: ${stats.count}`}</p>
            <p>{`Tổng số bàn thắng: ${stats.goals}`}</p>
            <p>{`Bàn thắng mỗi trận: ${stats.average.toFixed(2)}`}</p>
            <p>{`Đội dẫn đầu: ${leaderText}`}</p>
          </section>

          <section>
            <h2>Lịch thi đấu</h2>
            <label htmlFor="round-filter">Xem vòng</label>
            <select
              id="round-filter"
              value={round}
              onChange={(e) => setRound(e.target.value)}
            >
              <option value="all">Tất cả</option>
              {ROUNDS.map((r) => (
                <option key={r} value={r}>
                  {`Vòng ${r}`}
                </option>
              ))}
            </select>

            {filteredMatches.length === 0 ? (
              <p>Chưa có trận đấu nào</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Vòng</th>
                    <th>Đội nhà</th>
                    <th>BT nhà</th>
                    <th>BT khách</th>
                    <th>Đội khách</th>
                    <th>Kết quả</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMatches.map((m) => (
                    <tr
                      key={m.id}
                      style={
                        getResult(m) === 'draw'
                          ? { background: 'rgba(255, 193, 7, 0.25)' }
                          : undefined
                      }
                    >
                      <td>{m.round}</td>
                      <td>{getTeamName(m.home)}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={m.homeGoals}
                          aria-label={`Bàn thắng nhà ${getTeamName(m.home)} - ${getTeamName(m.away)}`}
                          onChange={(e) => handleGoals(m, 'home', e)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={m.awayGoals}
                          aria-label={`Bàn thắng khách ${getTeamName(m.home)} - ${getTeamName(m.away)}`}
                          onChange={(e) => handleGoals(m, 'away', e)}
                        />
                      </td>
                      <td>{getTeamName(m.away)}</td>
                      <td>{RESULT_LABELS[getResult(m)]}</td>
                      <td>
                        <button onClick={() => handleRemove(m)}>Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section>
            <h2>Thêm trận đấu</h2>
            <AddMatchForm />
          </section>

          <section>
            <h2>Mục tiêu điểm</h2>
            <GoalPlanner standings={standings} />
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
