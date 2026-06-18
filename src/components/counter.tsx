"use client";

import { decrement, increment } from "@/lib/features/counter/counterSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export default function Counter() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="counter">
      <button
        type="button"
        onClick={() => dispatch(decrement())}
        className="counter__btn"
        aria-label="Decrement"
      >
        -
      </button>
      <span className="counter__value">{count}</span>
      <button
        type="button"
        onClick={() => dispatch(increment())}
        className="counter__btn"
        aria-label="Increment"
      >
        +
      </button>
    </div>
  );
}
