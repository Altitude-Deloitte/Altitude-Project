import { computed, Injectable } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { read } from 'fs';
interface selectionType {
  name: string;
  code: string;
  icon: string;
}

interface sleectionState {
  campaignType: selectionType[] | null;
}
const initialState: sleectionState = {
  campaignType: null,
};
export const SelectionStore = signalStore(
  withState(initialState),
  withComputed(({ campaignType }) => ({
    isCampaignTypeSelected: computed(() => campaignType !== null),
  })),
  withMethods((store) => ({
    setCampaignType: (campaignType: selectionType[]) => {
      patchState(store, { campaignType });
    },
    clearSelection: () => {
      patchState(store, initialState);
    },
  }))
);
