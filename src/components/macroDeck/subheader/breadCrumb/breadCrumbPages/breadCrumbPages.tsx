import React from "react";
import * as Styled from "./../breadCrumbMenu.style";
import _map from "lodash/map";
import { Trash2Fill, PlusCircle } from "react-bootstrap-icons";

import { BreadCrumbMenuTypes, Page } from "../../../../../types_";
import { BreadCrumbMenuCloseButton } from "../closeButton";
import { useActive, usePage } from "../../../../../hookers";

interface IBreadCrumbMenuPages {
  dropDownType: BreadCrumbMenuTypes;
  handleCloseMenu: () => void;
  handleCreateNewPage: (e: React.MouseEvent<HTMLElement>) => void;
}

export const BreadCrumbMenuPages: React.FC<IBreadCrumbMenuPages> = ({
  dropDownType,
  handleCloseMenu,
  handleCreateNewPage
}) => {
  const { page } = useActive();
  const { activatePage, createPage, deletePage, readPages } = usePage();

  const handleActiveProfileAndCloseMenu = (_id: string) => {
    activatePage(_id);
    handleCloseMenu();
  };

  const handleDeletePage = (e: React.MouseEvent<SVGElement>, _id: string) => {
    e.stopPropagation();

    deletePage(_id);
    handleCloseMenu();
  };

  return dropDownType === BreadCrumbMenuTypes.Page ? (
    <Styled.BreadCrumbMenu>
      <Styled.BreadCrumbMenuItemNewPage onClick={createPage}>
        <div>
          <PlusCircle />
        </div>

        <div>Create New Page</div>
      </Styled.BreadCrumbMenuItemNewPage>

      {_map(readPages, (item: Page, index: number) => (
        <Styled.BreadCrumbMenuItemPage
          active={item._id === page?._id}
          key={item._id}
          onClick={() => handleActiveProfileAndCloseMenu(item._id)}
        >
          <div>page: {index + 1}</div>

          <div>
            {readPages.length > 1 && (
              <Trash2Fill
                onClick={(e: React.MouseEvent<SVGElement>) =>
                  handleDeletePage(e, item._id)
                }
              />
            )}
          </div>
        </Styled.BreadCrumbMenuItemPage>
      ))}

      <BreadCrumbMenuCloseButton handleCloseMenu={handleCloseMenu} />
    </Styled.BreadCrumbMenu>
  ) : null;
};
