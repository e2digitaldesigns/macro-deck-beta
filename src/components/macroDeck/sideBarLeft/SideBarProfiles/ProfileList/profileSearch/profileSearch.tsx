import React from "react";
import { ArrowLeftCircleFill } from "react-bootstrap-icons";
import * as Styled from "./profileSearch.style";
import { useProfile } from "../../../../../../hookers";

interface IntProfileSearch {
  count: number;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
}

const ProfileSearch: React.FC<IntProfileSearch> = ({
  count,
  searchText,
  setSearchText
}) => {
  const { readProfiles: profiles } = useProfile();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchText("");
  };

  return (
    <Styled.ProfileSearchWrapper>
      <Styled.ProfileSearchStats>
        <ArrowLeftCircleFill />
        <div>
          Viewing:{" "}
          <Styled.ProfileSearchStatsCount>
            {count} / {profiles.length}
          </Styled.ProfileSearchStatsCount>
        </div>

        <Styled.ProfileSearchShowAll>
          <span onClick={handleClearSearch}>Show All</span>
        </Styled.ProfileSearchShowAll>
      </Styled.ProfileSearchStats>

      <div>
        <Styled.ProfileSearchBox
          value={searchText}
          onChange={handleSearchChange}
        />
      </div>
    </Styled.ProfileSearchWrapper>
  );
};

export default ProfileSearch;
