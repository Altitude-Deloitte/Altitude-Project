import {
  trigger,
  transition,
  style,
  animate,
  query,
} from '@angular/animations';
export const routeAnimations = trigger('routeAnimations', [
  transition('* => *', [
    query(':enter', [style({ opacity: 0 })], { optional: true }),
    query(
      ':leave',
      [style({ opacity: 1 }), animate('0.5s', style({ opacity: 0 }))],
      { optional: true }
    ),
    query(
      ':enter',
      [style({ opacity: 0 }), animate('0.5s', style({ opacity: 1 }))],
      { optional: true }
    ),
  ]),
]);
