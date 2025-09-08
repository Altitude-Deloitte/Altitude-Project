import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ContentGenerationService } from '../services/content-generation.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

// interface MemeState {
//   templates: any[];
//   hashtags: string[];
//   selectedTemplate: any | null;
//   selectedHashtags: string[];
//   memeText: string;
//   generatedMemeUrl: string | null;
//   loading:boolean;
//   error: string | null;
//   visibleTemplates: any[];
//   showCount:number;

// }
// const initialState: MemeState = {
//   templates: [],
//   hashtags: [],
//   selectedTemplate: null,
//   selectedHashtags: [],
//   memeText: '',
//   generatedMemeUrl: null,
//   loading:false,
//   error: null,
//   visibleTemplates: [],
//   showCount: 0,
// };

// export const MemeStore = signalStore(
//   { providedIn: 'root' },
//   withState(initialState),
//   withMethods((store: any,memeService = inject(ContentGenerationService)) => ({
//     loadTemplates:rxMethod<void>(pipe(tap(()=>patchState(store,{loading:true})),switchMap(()=>memeService.getMemeTemplates().pipe(tapResponse({
//         next:(templates)=>patchState(store,{templates:templates,visibleTemplates:templates.slice(0,5),showCount:5}),
//     }))))),
//   }))
