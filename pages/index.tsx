import React from "react";
import DropDown, { ListItem } from "components/DropDown";
import styles from "./home.module.scss";
const listItems: Array<ListItem> = [
  { Icon: "🎓", id: "1", title: "Education" },
  { Icon: "⚗️", id: "2", title: "Science" },
  { Icon: "🎭", id: "3", title: "Art" },
  { Icon: "⚽️", id: "4", title: "Sport" },
  { Icon: "🎮", id: "5", title: "Games" },
  { Icon: "🏥", id: "6", title: "Health" },
  { Icon: "🎼", id: "7", title: "Music" },
  { Icon: "🍕", id: "8", title: "Food" },
  { Icon: "🎳", id: "9", title: "Entertainment" },
  { Icon: "🎞", id: "10", title: "Movie" },
  { Icon: "🛒", id: "11", title: "Shopping" },
  { Icon: "⚙️", id: "12", title: "industry" },
];

const Index = () => {
  const changeHandler = (values: ListItem[]) => {
    console.log("selected item is :", JSON.stringify(values));
  };
  return (
    <div className={styles.home}>
      <div className={styles.boxItem}>
        <h2> single select</h2>
        <DropDown items={listItems} />
      </div>
      <div className={styles.boxItem}>
        <h2> multi select </h2>
        <DropDown items={listItems} onChange={changeHandler} multiSelect />
      </div>
    </div>
  );
};

export default Index;
