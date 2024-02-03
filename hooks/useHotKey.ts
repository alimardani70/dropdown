import React, { useCallback } from "react";
type HotKeyMap = {
  targetKey: string;
  action: () => void;
};

const useHotKeys = (hotKeyMaps: HotKeyMap[]) => {
  const keyDownHandler = useCallback(
    (insertedKey: string) => {
      console.log("hotKeyMap", insertedKey);

      const hotKeyMap = hotKeyMaps.find(
        (hotKey) => hotKey.targetKey === insertedKey,
      );

      if (hotKeyMap) {
        hotKeyMap.action();
      }
    },
    [hotKeyMaps],
  );

  return keyDownHandler;
};

export default useHotKeys;
