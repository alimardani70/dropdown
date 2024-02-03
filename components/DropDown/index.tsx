import React, { useEffect, useRef, useState } from "react";
import Input from "@/components//Input";
import styles from "./DropDown.module.scss";
import { generateRandomId } from "@/helper/generateId";
import isFunction from "lodash.isfunction";
import useHotKeys from "../../hooks/useHotKey";

export type ListItem = {
  id: string;
  title: string;
  Icon?: string;
};

type DropdownProps = {
  items: ListItem[];
  multiSelect?: boolean;
  onChange?: (values: ListItem[] | []) => void;
};

const DropDown: React.FC<DropdownProps> = ({
  items,
  multiSelect,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [totalItems, setTotalItems] = useState<ListItem[]>(items);
  const [filteredItems, setFilteredItems] = useState<ListItem[]>(totalItems);
  const [selectedItems, setSelectedItems] = useState<ListItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const changeHandler = (value: string) => {
    setInputValue(value);
  };

  const closeDropDown = () => {
    setDropdownVisible(false);
  };

  const addNewToList = () => {
    const id = generateRandomId(6);
    const newItem = { id, title: inputValue };
    setTotalItems([newItem, ...totalItems]);
    if (multiSelect) {
      setSelectedItems([...selectedItems, newItem]);
    } else {
      setSelectedItems([newItem]);
    }
    setInputValue("");
  };
  const closeExitInput = () => {
    setDropdownVisible(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };
  const removeLastItem = () => {
    setSelectedItems((prevArray) => prevArray.slice(0, -1));
  };
  const hotKeyActions = [
    { targetKey: "Enter", action: addNewToList },
    {
      targetKey: "Escape",
      action: closeExitInput,
    },
    { targetKey: "Backspace", action: removeLastItem },
  ];
  const keyDownHandler = useHotKeys(hotKeyActions);

  const handleItemClick = (clickedItem: ListItem) => {
    const isAlreadySelected = selectedItems.some(
      (item) => item.id === clickedItem.id,
    );
    if (multiSelect) {
      let updatedSelectedItems;
      if (isAlreadySelected) {
        updatedSelectedItems = selectedItems.filter(
          (item) => item.id !== clickedItem.id,
        );
      } else {
        updatedSelectedItems = [...selectedItems, clickedItem];
        setInputValue("");
      }
      setSelectedItems(updatedSelectedItems);
    } else {
      setSelectedItems([clickedItem]);
    }
  };
  const removeItems = () => {
    console.log("-------");
    setSelectedItems([]);
    closeExitInput();
  };

  useEffect(() => {
    const filtered = totalItems.filter((item) =>
      item.title.toLowerCase().includes(inputValue.toLowerCase()),
    );
    setFilteredItems(filtered);
  }, [inputValue]);

  useEffect(() => {
    const handleCloseMenu = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleCloseMenu);
    return () => document.removeEventListener("mousedown", handleCloseMenu);
  }, []);

  useEffect(() => {
    if (isFunction(onChange)) {
      onChange(selectedItems);
    }
  }, [selectedItems]);

  return (
    <div className={styles.menuItems} ref={dropdownRef}>
      <div className={styles.inputSection}>
        {selectedItems.map((item, index) => (
          <span className={styles.chipItem} key={`${index}-${item.id}`}>
            {item.title}
          </span>
        ))}
        <div className={styles.flexInput}>
          <Input
            value={inputValue}
            onFocus={() => setDropdownVisible(true)}
            onChange={changeHandler}
            onKeyDown={keyDownHandler}
            ref={inputRef}
          />
          {selectedItems.length > 0 && (
            <button className={styles.button} onClick={removeItems}>
              &#10005;
            </button>
          )}
        </div>
      </div>
      <ul
        className={dropdownVisible ? styles.showDropdown : ""}
        onBlur={closeDropDown}
        tabIndex={0}
      >
        {filteredItems?.length > 0 ? (
          filteredItems.map((item, index) => (
            <li
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={
                selectedItems.some((selected) => selected.id === item.id)
                  ? styles.selectedItem
                  : ""
              }
            >
              <div className={styles.row}>
                <div className={styles.item}>
                  {item.title}
                  {!!item.Icon && <span>{item.Icon}</span>}
                </div>
                <div className={styles.selectedRow}>&#10004;</div>
              </div>
            </li>
          ))
        ) : (
          <span className={styles.noResult}>
            -- No result found. Press Enter to add your custom entry.
          </span>
        )}
      </ul>
    </div>
  );
};

export default DropDown;
