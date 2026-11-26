import { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addMatch, selectMatches } from '../features/matchesSlice';
import { useNotice } from '../context/NoticeContext';
import { TEAMS, ROUNDS } from '../data';
import { getTeamName, isValidGoals } from '../utils';

const emptyForm = { round: '1', home: '', away: '', homeGoals: '', awayGoals: '' };

function AddMatchForm() {
  const matches = useSelector(selectMatches);
  const dispatch = useDispatch();
  const showNotice = useNotice();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const homeRef = useRef(null);

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

    dispatch(
      addMatch({
        round: Number(form.round),
        home: homeId,
        away: awayId,
        homeGoals,
        awayGoals,
      })
    );
    showNotice(`Đã thêm trận ${getTeamName(homeId)} - ${getTeamName(awayId)}`);
    setForm(emptyForm);
    homeRef.current.focus();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="round">Vòng</label>
        <select id="round" name="round" value={form.round} onChange={handleChange}>
          {ROUNDS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
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

      <div className="field">
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

      <div className="field">
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

      <div className="field">
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
  );
}

export default AddMatchForm;
