import React from "react";
import * as Styled from "./sectionFormWrapper.style";
import ActionForm from "../forms/actionForm/actionForm";
import BtmButtonPadForm from "../forms/buttonPadFormBottom/btmButtonPadForm";
import IconSelector from "../forms/iconSelector/iconSelector";
import ActionList from "../forms/actionList/actionList";

const SectionWrapper: React.FC = () => {
  const [newIcon, setNewIcon] = React.useState<string>("");
  const [isIconSelectorOpen, setIsIconSelectorOpen] =
    React.useState<boolean>(false);

  return (
    <Styled.SectionWrapperGrid showIconSelector={isIconSelectorOpen}>
      <BtmButtonPadForm
        newIcon={newIcon}
        setIsIconSelectorOpen={setIsIconSelectorOpen}
      />

      {isIconSelectorOpen ? (
        <IconSelector
          setIsIconSelectorOpen={setIsIconSelectorOpen}
          setNewIcon={setNewIcon}
        />
      ) : (
        <>
          <ActionList />
          <ActionForm />
        </>
      )}
    </Styled.SectionWrapperGrid>
  );
};

export default SectionWrapper;
