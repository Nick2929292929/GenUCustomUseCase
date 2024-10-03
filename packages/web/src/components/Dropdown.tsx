export type Fruit = "A" | "B" | "C" | "D";
type Props = {
  isOpen: boolean;
  onClickDropdown: () => void;
  onClickItem: (fruit: Fruit) => void;
  selectedFruit: Fruit;
  containerRef: React.RefObject<HTMLDivElement>;
};

const fruits: Fruit[] = ["A", "B", "C", "D"];

export const Presentation: React.FC<Props> = ({
  isOpen,
  onClickDropdown,
  onClickItem,
  selectedFruit,
  containerRef
}) => (
  <div className="dropdown" ref={containerRef}>
    <button onClick={onClickDropdown} className="dropdown__button">
      <span>好きなくだもの</span>
      <span>{isOpen ? "▲" : "▼"}</span>
    </button>
    {isOpen ? (
      <div className="dropdown__wrap">
        <ul className="dropdown__item-list">
          {fruits.map((fruit) => (
            <li
              key={fruit}
              className="dropdown__item"
              onClick={() => onClickItem(fruit)}
            >
              {fruit}
            </li>
          ))}
        </ul>
      </div>
    ) : null}
    {selectedFruit && !isOpen && (
      <div className="dropdown__selected-item">
        選択しているフルーツ：{selectedFruit}
      </div>
    )}
  </div>
);