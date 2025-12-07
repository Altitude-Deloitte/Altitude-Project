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

// Fix: Extended state to include taskDetails for persistent form data across navigation
interface sleectionState {
  campaignType: selectionType[] | null;
  brandName: string | null;
  taskDetails: any | null; // Stores Combined Form data (brand, topic, purpose, etc.)
}
const initialState: sleectionState = {
  campaignType: null,
  brandName: null,
  taskDetails: null, // Fix: Initialize taskDetails
};
export const SelectionStore = signalStore(
  withState(initialState),
  withComputed(({ campaignType, brandName, taskDetails }) => ({
    isCampaignTypeSelected: computed(() => campaignType !== null),
    isBrandNameAvailable: computed(() => brandName !== null),
    isTaskDetailsAvailable: computed(() => taskDetails !== null), // Fix: Computed for task details availability
  })),
  withMethods((store) => ({
    setCampaignType: (campaignType: selectionType[]) => {
      patchState(store, { campaignType });
    },
    setBrandName: (brandName: string) => {
      console.log('🏪 SelectionStore - setBrandName called with:', brandName);
      patchState(store, { brandName });
    },
    // Fix: New method to persist task details (form data) across navigation
    setTaskDetails: (taskDetails: any) => {
      console.log('🏪 SelectionStore - setTaskDetails called with:', taskDetails);
      patchState(store, { taskDetails });
    },
    clearSelection: () => {
      patchState(store, initialState);
    },
    clearBrandName: () => {
      patchState(store, { brandName: null });
    },
    // Fix: Clear task details only when user explicitly resets
    clearTaskDetails: () => {
      console.log('🏪 SelectionStore - clearTaskDetails called');
      patchState(store, { taskDetails: null });
    },
  }))
);
