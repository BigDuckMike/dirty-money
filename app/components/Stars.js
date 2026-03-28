'use client';

export default function Stars({ count, onUpdate }) {
  const handleStarClick = (index) => {
    const newCount = index + 1;
    onUpdate(newCount - count);
  };

  return (
    <div className="stars-container">
      <div className="stars-label">ЗВЁЗДЫ ЗА РЕПУТАЦИЮ</div>
      <div className="stars-row">
        {[0, 1, 2, 3, 4].map((index) => (
          <span
            key={index}
            className={`star ${index < count ? 'star-red' : 'star-grey'}`}
            onClick={() => handleStarClick(index)}
          >
            ★
          </span>
        ))}
      </div>
      <div className="stars-buttons">
        <button onClick={() => onUpdate(-1)}>-</button>
        <span className="stars-count">{count} / 5</span>
        <button onClick={() => onUpdate(1)}>+</button>
      </div>
    </div>
  );
}