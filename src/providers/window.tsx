import React, {
  createContext,
  FunctionComponent,
  useEffect,
  useState,
} from "react";
import { Dimensions, ScaledSize, StatusBar } from "react-native";

const getOrientation = (screen: ScaledSize) => {
  if (screen.height > screen.width) {
    return OrientationTypes.Portrait;
  }

  return OrientationTypes.Landscape;
};

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

export enum OrientationTypes {
  Landscape = "landscape",
  Portrait = "portrait",
}

interface WindowType {
  orientation: OrientationTypes;
  deviceScreen: ScaledSize;
  applicationWindow: ScaledSize;
}

type DimensionsType = { window: ScaledSize; screen: ScaledSize };

export const WindowContext = createContext({} as WindowType);

export const WindowProvider: FunctionComponent = (props) => {
  const [orientation, setOrientation] = useState<OrientationTypes>(
    getOrientation(screen),
  );

  const [dimensions, setDimensions] = useState<DimensionsType>({
    window,
    screen,
  });

  const onChange = ({ window, screen }: DimensionsType) => {
    const orientation = getOrientation(screen);

    setOrientation(orientation);
    setDimensions({ window, screen });

    StatusBar.setHidden(orientation === OrientationTypes.Landscape);
  };

  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  });

  return (
    <WindowContext.Provider
      value={{
        orientation,
        deviceScreen: dimensions.screen,
        applicationWindow: dimensions.window,
      }}>
      {props.children}
    </WindowContext.Provider>
  );
};
