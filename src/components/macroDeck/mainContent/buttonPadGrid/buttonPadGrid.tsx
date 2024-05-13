import React from "react";
import _map from "lodash/map";
import _range from "lodash/range";
import { buttonMapper } from "./buttonMapper";

import * as Styled from "./buttonPadGrid.style";
import ButtonPadParser from "./../buttonPadParser/buttonPadParser";
import { useActive } from "../../../../hookers";

const ButtonPadGrid: React.FC = () => {
  const { profile } = useActive();

  const [isPaddedGrid, setIsPaddedGrid] = React.useState<boolean>(false);
  const [gridCount, setGridCount] = React.useState<number>(32);

  React.useEffect(() => {
    let stillMounted = true;
    if (!profile) return;

    const pads = Number(profile.buttonPads);

    if (stillMounted) {
      if (pads === 6 || pads === 15) {
        setIsPaddedGrid(true);
        setGridCount(36);
      } else {
        setIsPaddedGrid(false);
        setGridCount(32);
      }
    }

    return () => {
      stillMounted = false;
    };
  }, [profile]);

  const buttonPadArray: number[] = _range(1, gridCount + 1);

  const buttonPadParserNumbering = (padNumber: number): number => {
    const padCount = profile?.buttonPads;

    const buttonPadNumber: number =
      padCount && buttonMapper?.[padCount]?.[padNumber]
        ? Number(buttonMapper[padCount][padNumber])
        : 0;

    return buttonPadNumber;
  };

  return (
    <>
      <Styled.ButtonWrapperGrid
        data-testid="button_pad_grid_wrapper"
        isGrid6x15={isPaddedGrid}
      >
        {_map(
          buttonPadArray,
          (number: number): React.ReactElement => (
            <ButtonPadParser
              key={number}
              buttonPadNumber={buttonPadParserNumbering(number)}
            />
          )
        )}
      </Styled.ButtonWrapperGrid>
    </>
  );
};

export default ButtonPadGrid;
