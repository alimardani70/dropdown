import React, { useEffect, useRef, useState } from "react";
import Input from "@/components//Input";
import styles from "./DropDown.module.scss";
import { generateRandomId } from "@/helper/generateId";
import isFunction from "lodash.isfunction";

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

  const changeHandler = (value: string) => {
    setInputValue(value);
  };

  const closeDropDown = () => {
    setDropdownVisible(false);
  };

  const keyDownHandler = (key: string) => {
    if (key === "Enter") {
      const id = generateRandomId(6);
      const newItem = { id, title: inputValue };
      setTotalItems([newItem, ...totalItems]);
      if (multiSelect) {
        setSelectedItems([...selectedItems, newItem]);
      } else {
        setSelectedItems([newItem]);
      }
      setInputValue("");
    }
  };

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

    // Add event listener for outside clicks
    document.addEventListener("mousedown", handleCloseMenu);

    // Remove event listener on cleanup
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
        <Input
          value={inputValue}
          onFocus={() => setDropdownVisible(true)}
          onChange={changeHandler}
          onKeyDown={keyDownHandler}
        />
      </div>
      <ul
        className={dropdownVisible ? styles.showDropdown : ""}
        onBlur={closeDropDown}
        tabIndex={0}
      >
        {filteredItems.map((item, index) => (
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
                {item.Icon && <span>{item.Icon}</span>}
              </div>
              <div className={styles.selectedRow}>&#10004;</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropDown;
