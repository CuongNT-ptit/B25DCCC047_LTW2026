import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useFetch from './hooks/useFetch';
import useLocalStorage from './hooks/useLocalStorage';
import useDebounce from './hooks/useDebounce';
import { hasSaved } from './store';
import { selectMatches, setMatches, removeMatch, setGoals } from './features/matchesSlice';
import { useTheme } from './context/ThemeContext';
import { useNotice } from './context/NoticeContext';
import StandingsTable from './components/StandingsTable';
import AddMatchForm from './components/AddMatchForm';
import GoalPlanner from './components/GoalPlanner';
import MatchRow from './components/MatchRow';
import { ROUNDS, RESULT_LABELS } from './data';
import { getTeamName, calcStandings, calcMatchStats } from './utils';

const BUILD_TAG = "bd-5918";

function App() {
  const { data, loading, error } = useFetch('/data/matches.json');
  const matches = useSelector(selectMatches);
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();
  const [round, setRound] = useLocalStorage('ltw_bongda_round', 'all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const searchRef = useRef(null);

  useEffect(() => {
    if (data && !hasSaved) {
      dispatch(setMatches(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === '/') {
        const tag = document.activeElement ? document.activeElement.tagName : '';
        if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') {
          return;
        }
        if (searchRef.current) {
          e.preventDefault();
          searchRef.current.focus();
        }
      } else if (e.key === 'Escape') {
        if (searchRef.current && document.activeElement === searchRef.current) {
          setSearch('');
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const roundMatches = useMemo(() => {
    if (round === 'all') {
      return matches;
    }
    return matches.filter((m) => m.round === Number(round));
  }, [matches, round]);

  const visibleMatches = useMemo(() => {
    const keyword = debouncedSearch.trim().toLowerCase();
    if (keyword === '') {
      return roundMatches;
    }
    return roundMatches.filter(
      (m) =>
        getTeamName(m.home).toLowerCase().includes(keyword) ||
        getTeamName(m.away).toLowerCase().includes(keyword)
    );
  }, [roundMatches, debouncedSearch]);

  const standings = useMemo(() => calcStandings(matches), [matches]);

  const stats = useMemo(() => calcMatchStats(roundMatches), [roundMatches]);

  const leaderName = matches.length > 0 ? standings[0].name : '';

  const leaderText =
    matches.length > 0 ? `${standings[0].name} (${standings[0].points} điểm)` : '—';

  useEffect(() => {
    document.title = leaderName ? `${leaderName} dẫn đầu – Giải bóng đá khoa` : 'Giải bóng đá khoa';
  }, [leaderName]);

  const handleGoals = useCallback(
    (match, field, value) => {
      dispatch(
        setGoals({
          id: match.id,
          homeGoals: field === 'home' ? value : match.homeGoals,
          awayGoals: field === 'away' ? value : match.awayGoals,
        })
      );
    },
    [dispatch]
  );

  const handleRemove = useCallback(
    (match) => {
      dispatch(removeMatch(match.id));
      showNotice(`Đã xóa trận ${getTeamName(match.home)} - ${getTeamName(match.away)}`);
    },
    [dispatch, showNotice]
  );

  const handleTeamShift = (e) => {
    setSearch(e.target.value);
  };

  const handleReset = () => {
    if (!data) {
      return;
    }
    dispatch(setMatches(data));
    showNotice('Đã đặt lại dữ liệu mẫu.');
  };

  const showLoading = !hasSaved && loading;
  const showError = !hasSaved && !loading && error;
  const showPage = hasSaved || (!loading && !error);

  return (
    <div className={`app ${theme}`} data-build={BUILD_TAG}>
      <h1>Giải bóng đá khoa</h1>
      <button onClick={toggleTheme}>
        {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
      </button>

      {showLoading && <p>Đang tải lịch thi đấu...</p>}
      {showError && <p>Không tải được lịch thi đấu.</p>}

      {showPage && (
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
            <h3>Phân bố kết quả</h3>
            <ul>
              {Object.keys(RESULT_LABELS).map((key) => (
                <li key={key}>
                  {`${RESULT_LABELS[key]}: ${stats.counts[key]}`}
                  <span
                    style={{
                      display: 'inline-block',
                      marginLeft: 8,
                      height: 10,
                      width: 24 * stats.counts[key],
                      background: '#1976d2',
                    }}
                  />
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Lịch thi đấu</h2>
            <div className="field">
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
            </div>

            <div className="field">
              <label htmlFor="team-search">Tìm đội</label>
              <input
                id="team-search"
                type="text"
                ref={searchRef}
                value={search}
                onChange={handleTeamShift}
              />
            </div>
            <p>{`Tìm thấy ${visibleMatches.length} trận`}</p>

            {visibleMatches.length === 0 ? (
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
                    <th>Số lần render</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {visibleMatches.map((m) => (
                    <MatchRow
                      key={m.id}
                      match={m}
                      onGoals={handleGoals}
                      onRemove={handleRemove}
                    />
                  ))}
                </tbody>
              </table>
            )}

            <button onClick={handleReset}>Đặt lại dữ liệu mẫu</button>
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
