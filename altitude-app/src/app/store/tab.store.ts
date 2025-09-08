import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

interface tabState {
  activeTab: 'home' | 'dashboard';
}
const initialState: tabState = {
  activeTab: 'home',
};

export const TabStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store: any) => ({
    setActiveTab(tab: 'home' | 'dashboard') {
      patchState(store, { activeTab: tab });
    },
  }))
);
