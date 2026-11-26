import { TEAMS, POINTS, MAX_GOALS } from './data';

export const getTeamName = (id) => {
  const team = TEAMS.find((t) => t.id === id);
  return team ? team.name : '';
};

export const getResult = (match) => {
  if (match.homeGoals > match.awayGoals) {
    return 'home';
  }
  if (match.homeGoals < match.awayGoals) {
    return 'away';
  }
  return 'draw';
};

export const isValidGoals = (n) => Number.isInteger(n) && n >= 0 && n <= MAX_GOALS;

export const calcStandings = (matches) => {
  const table = TEAMS.map((t) => ({
    id: t.id,
    name: t.name,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    diff: 0,
    points: 0,
  }));

  matches.forEach((m) => {
    const home = table.find((t) => t.id === m.home);
    const away = table.find((t) => t.id === m.away);
    if (!home || !away) {
      return;
    }

    home.played += 1;
    away.played += 1;
    home.gf += m.homeGoals;
    home.ga += m.awayGoals;
    away.gf += m.awayGoals;
    away.ga += m.homeGoals;

    const result = getResult(m);
    if (result === 'home') {
      home.won += 1;
      away.lost += 1;
      home.points += POINTS.win;
      away.points += POINTS.loss;
    } else if (result === 'away') {
      away.won += 1;
      home.lost += 1;
      away.points += POINTS.win;
      home.points += POINTS.loss;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += POINTS.draw;
      away.points += POINTS.draw;
    }
  });

  table.forEach((t) => {
    t.diff = t.gf - t.ga;
  });

  const sorted = [...table];
  sorted.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    if (b.diff !== a.diff) {
      return b.diff - a.diff;
    }
    if (b.gf !== a.gf) {
      return b.gf - a.gf;
    }
    return a.name.localeCompare(b.name, 'vi');
  });

  return sorted;
};

export const calcMatchStats = (matches) => {
  const counts = { home: 0, draw: 0, away: 0 };
  let goals = 0;

  matches.forEach((m) => {
    goals += m.homeGoals + m.awayGoals;
    counts[getResult(m)] += 1;
  });

  const count = matches.length;
  const average = count === 0 ? 0 : Math.round((goals / count) * 100) / 100;

  return { count, goals, average, counts };
};
