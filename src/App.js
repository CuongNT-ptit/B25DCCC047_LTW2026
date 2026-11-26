import { useReducer, useRef, useMemo, useState, useEffect } from 'react';
import useFetch from './hooks/useFetch';
import matchesReducer from './matchesReducer';
import { TEAMS, ROUNDS, RESULT_LABELS, formatDiff } from './data';
import {
  getTeamName,
  getResult,
  isValidGoals,
  calcStandings,
  calcMatchStats,
} from './utils';

const BUILD_TAG = "bd-5918";

const emptyForm = { round: '1', home: '', away: '', homeGoals: '', awayGoals: '' };

function App() {
  const { data, loading, error } = useFetch('/data/matches.json');
  const [matches, dispatch] = useReducer(matchesReducer, []);
  const [round, setRound] = useState('all');
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const homeRef = useRef(null);

  useEffect(() => {
    if (data) {
      dispatch({ type: 'LOAD', payload: data });
    }
  }, [data]);

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
    dispatch({
      type: 'SET_GOALS',
      payload: {
        id: match.id,
        homeGoals: field === 'home' ? value : match.homeGoals,
        awayGoals: field === 'away' ? value : match.awayGoals,
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    const homeId = Number(form.home);
    const awayId = Number(form.away);

    if (form.home === '') {
      newErrors.home = 'Hãy chọn đội nhà';
    }

    if (form.away === '') {
      newErrors.away = 'Hãy chọn đội khách';
    } else if (form.home !== '') {
      if (form.home === form.away) {
        newErrors.away = 'Hai đội phải khác nhau';
      } else {
        const played = matches.some(
          (m) =>
            (m.home === homeId && m.away === awayId) ||
            (m.home === awayId && m.away === homeId)
        );
        if (played) {
          newErrors.away = 'Hai đội đã đá với nhau rồi';
        }
      }
    }

    const homeGoals = form.homeGoals === '' ? NaN : Number(form.homeGoals);
    const awayGoals = form.awayGoals === '' ? NaN : Number(form.awayGoals);

    if (!isValidGoals(homeGoals)) {
      newErrors.homeGoals = 'Số bàn thắng phải là số nguyên từ 0 đến 20';
    }
    if (!isValidGoals(awayGoals)) {
      newErrors.awayGoals = 'Số bàn thắng phải là số nguyên từ 0 đến 20';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    dispatch({
      type: 'ADD',
      payload: {
        round: Number(form.round),
        home: homeId,
        away: awayId,
        homeGoals,
        awayGoals,
      },
    });
    setForm(emptyForm);
    homeRef.current.focus();
  };

  return (
    <div className="app" data-build={BUILD_TAG}>
      <h1>Giải bóng đá khoa</h1>

      {loading && <p>Đang tải lịch thi đấu...</p>}
      {error && <p>Không tải được lịch thi đấu.</p>}

      {!loading && !error && (
        <div>
          <section>
            <h2>Bảng xếp hạng</h2>
            <table>
              <thead>
                <tr>
                  <th>Hạng</th>
                  <th>Đội</th>
                  <th>Trận</th>
                  <th>Thắng</th>
                  <th>Hòa</th>
                  <th>Thua</th>
                  <th>BT</th>
                  <th>BB</th>
                  <th>HS</th>
                  <th>Điểm</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((t, index) => (
                  <tr
                    key={t.id}
                    style={index === standings.length - 1 ? { color: '#c62828' } : undefined}
                  >
                    <td>{index + 1}</td>
                    <td>{t.name}</td>
                    <td>{t.played}</td>
                    <td>{t.won}</td>
                    <td>{t.drawn}</td>
                    <td>{t.lost}</td>
                    <td>{t.gf}</td>
                    <td>{t.ga}</td>
                    <td>{formatDiff(t.diff)}</td>
                    <td>{t.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                        <button onClick={() => dispatch({ type: 'REMOVE', payload: m.id })}>
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section>
            <h2>Thêm trận đấu</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="round">Vòng</label>
                <select id="round" name="round" value={form.round} onChange={handleChange}>
                  {ROUNDS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="home">Đội nhà</label>
                <select
                  id="home"
                  name="home"
                  ref={homeRef}
                  value={form.home}
                  onChange={handleChange}
                >
                  <option value="">-- Chọn đội --</option>
                  {TEAMS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                {errors.home && <p role="alert">{errors.home}</p>}
              </div>

              <div>
                <label htmlFor="away">Đội khách</label>
                <select id="away" name="away" value={form.away} onChange={handleChange}>
                  <option value="">-- Chọn đội --</option>
                  {TEAMS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                {errors.away && <p role="alert">{errors.away}</p>}
              </div>

              <div>
                <label htmlFor="homeGoals">Bàn thắng đội nhà</label>
                <input
                  id="homeGoals"
                  name="homeGoals"
                  type="number"
                  value={form.homeGoals}
                  onChange={handleChange}
                />
                {errors.homeGoals && <p role="alert">{errors.homeGoals}</p>}
              </div>

              <div>
                <label htmlFor="awayGoals">Bàn thắng đội khách</label>
                <input
                  id="awayGoals"
                  name="awayGoals"
                  type="number"
                  value={form.awayGoals}
                  onChange={handleChange}
                />
                {errors.awayGoals && <p role="alert">{errors.awayGoals}</p>}
              </div>

              <button type="submit">Thêm trận</button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
