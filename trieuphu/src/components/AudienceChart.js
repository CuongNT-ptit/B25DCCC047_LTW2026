import { LETTERS } from "../data";

const AudienceChart = ({ percents }) => {
  return (
    <div className="audience">
      {percents.map((p, i) => (
        <div key={i} className="bar" style={{ width: `${p}%` }}>
          {LETTERS[i]}: {p}%
        </div>
      ))}
    </div>
  );
};

export default AudienceChart;