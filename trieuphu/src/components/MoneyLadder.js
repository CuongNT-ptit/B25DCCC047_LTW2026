import { PRIZES, MILESTONES, formatMoney } from "../data";

const MoneyLadder = ({ current }) => {
  return (
    <ul className="ladder">
      {PRIZES.map((prize, index) => {
        let className = "";
        if (MILESTONES.includes(index + 1)) className += " milestone";
        if (index === current) className += " active";

        return (
          <li key={index} className={className}>
            Câu {index + 1}: {formatMoney(prize)}
          </li>
        );
      })}
    </ul>
  );
};

export default MoneyLadder;