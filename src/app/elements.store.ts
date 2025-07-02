import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState, withHooks } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, timer, debounceTime, distinctUntilChanged } from 'rxjs';
import { ELEMENT_DATA, PeriodicElement } from './periodic-element.model';

type ElementsState = {
  elements: PeriodicElement[];
  isLoading: boolean;
  filter: string;
};

const initialState: ElementsState = {
  elements: [],
  isLoading: true,
  filter: '',
};

export const ElementsStore = signalStore(
  withState(initialState),
  withComputed(({ elements, filter }) => ({
    filteredElements: computed(() => {
      const lowerCaseFilter = filter().toLowerCase();
      if (!lowerCaseFilter) {
        return elements();
      }
      return elements().filter(el =>
        el.name.toLowerCase().includes(lowerCaseFilter) ||
        el.symbol.toLowerCase().includes(lowerCaseFilter) ||
        String(el.weight).includes(lowerCaseFilter) ||
        String(el.number).includes(lowerCaseFilter)
      );
    }),
  })),
  withMethods((store) => ({
    updateElement(updatedElement: PeriodicElement) {
      patchState(store, (state) => ({
        elements: state.elements.map(el => el.number === updatedElement.number ? updatedElement : el),
      }));
    },
    updateFilter: rxMethod<string>(pipe(
        debounceTime(2000),
        distinctUntilChanged(),
        tap(filterValue => patchState(store, { filter: filterValue }))
    )),
  })),
  withHooks({
    onInit({ ...store }) {
      patchState(store, { isLoading: true });
      timer(1500).pipe(
          tap(() => {
              patchState(store, { elements: ELEMENT_DATA, isLoading: false });
          })
      ).subscribe();
    }
  })
);