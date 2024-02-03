import React, { useState, ChangeEvent, useEffect, forwardRef } from "react";
import isFunction from "lodash.isfunction";
import styles from "./input.module.scss";

type PropsType = {
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (key: string) => void;
  ref?: React.Ref<HTMLInputElement>;
};

const Input = forwardRef<HTMLInputElement, PropsType>(
  ({ value: initValue = "", onChange, onFocus, onBlur, onKeyDown }, ref) => {
    const [value, setValue] = useState<string>(initValue);

    useEffect(() => {
      setValue(initValue);
    }, [initValue]);

    const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setValue(newValue);
      if (isFunction(onChange)) {
        onChange(newValue);
      }
    };

    const focusHandler = () => {
      if (isFunction(onFocus)) {
        onFocus();
      }
    };

    const blurHandler = () => {
      if (isFunction(onBlur)) {
        onBlur();
      }
    };

    const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (isFunction(onKeyDown)) {
        onKeyDown(event.key);
      }
    };

    return (
      <input
        ref={ref}
        className={styles.input}
        value={value}
        onChange={changeHandler}
        onFocus={focusHandler}
        onBlur={blurHandler}
        onKeyDown={keyDownHandler}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
