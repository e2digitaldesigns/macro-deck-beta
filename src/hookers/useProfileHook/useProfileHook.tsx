import {
  IGlobalDataStore,
  useGlobalDataStore
} from "../../dataStores/useGlobalDataStore/useGlobalDataStore";

import { Profile } from "../../types_";

type ActivateProfile = (_id: string) => void;
type CreateProfile = (type: string) => void;
type DeleteProfile = (_id: string) => void;
type ReadProfiles = Profile[];
type SetProfile = () => void;
type UpdateProfile = (profile: Profile) => void;
type ReOrderProfiles = (dragId: string, dropId: string) => void;

export interface IntUseProfilesHook {
  activateProfile: ActivateProfile;
  createProfile: CreateProfile;
  deleteProfile: DeleteProfile;
  readProfiles: ReadProfiles;
  reOrderRofiles: ReOrderProfiles;
  setProfiles: SetProfile;
  updateProfile: UpdateProfile;
}

const useProfilesHook = (): IntUseProfilesHook => {
  const globalDataStore = useGlobalDataStore(
    (state: Partial<IGlobalDataStore>) => state
  );

  const activateProfile: ActivateProfile = _id => {
    globalDataStore?.activateProfile && globalDataStore.activateProfile(_id);
  };

  const createProfile: CreateProfile = type => {
    globalDataStore?.createProfile && globalDataStore.createProfile(type);
  };

  const deleteProfile = (_id: string) => {
    globalDataStore?.removeProfile && globalDataStore.removeProfile(_id);
  };

  const readProfiles: ReadProfiles = globalDataStore?.profiles
    ? globalDataStore.profiles
    : [];

  const reOrderRofiles: ReOrderProfiles = (dragId, dropId) => {
    globalDataStore?.reOrderProfiles &&
      globalDataStore.reOrderProfiles(dragId, dropId);
  };

  const setProfiles: SetProfile = () => {
    return globalDataStore?.fetchProfiles && globalDataStore.fetchProfiles();
  };

  const updateProfile: UpdateProfile = profile => {
    globalDataStore?.updateProfile && globalDataStore.updateProfile(profile);
  };

  return {
    activateProfile,
    createProfile,
    deleteProfile,
    readProfiles,
    reOrderRofiles,
    setProfiles,
    updateProfile
  };
};

export default useProfilesHook;
