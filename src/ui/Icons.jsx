import React from 'react';

/**
 * Icons are inline SVG on `currentColor` so they inherit text tokens and never
 * need their own color decisions.
 */
const base = {
  width: 16,
  height: 16,
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

export const ArrowUp = (props) => (
  <svg {...base} {...props}>
    <path d="M8 13V3M8 3 3.5 7.5M8 3l4.5 4.5" />
  </svg>
);

/** The composer's "attach a photo" affordance — a framed picture with a horizon. */
export const Image = (props) => (
  <svg {...base} {...props}>
    <rect x="2.25" y="3.25" width="11.5" height="9.5" rx="1.75" />
    <path d="M2.5 10.5 5.75 7.6l2.9 2.6M9.4 9.1l1.6-1.4 2.5 2.2" />
    <circle cx="10.4" cy="6.1" r="0.9" />
  </svg>
);

export const Sparkle = (props) => (
  <svg {...base} {...props}>
    <path d="M8 2.2 9.3 6l3.8 1.3L9.3 8.6 8 12.4 6.7 8.6 2.9 7.3 6.7 6 8 2.2Z" />
    <path d="M12.8 2v2.2M11.7 3.1h2.2" />
  </svg>
);

export const Desktop = (props) => (
  <svg {...base} {...props}>
    <rect x="1.8" y="3" width="12.4" height="8" rx="1.2" />
    <path d="M6 13.4h4" />
  </svg>
);

export const Mobile = (props) => (
  <svg {...base} {...props}>
    <rect x="5" y="1.8" width="6" height="12.4" rx="1.4" />
    <path d="M7.4 12.2h1.2" />
  </svg>
);

export const Close = (props) => (
  <svg {...base} {...props}>
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
);

export const Check = (props) => (
  <svg {...base} {...props}>
    <path d="M3.2 8.4 6.4 11.6 12.8 4.8" />
  </svg>
);

export const Refresh = (props) => (
  <svg {...base} {...props}>
    <path d="M13.2 7a5.2 5.2 0 1 0-.7 3.4" />
    <path d="M13.4 3.6V7h-3.3" />
  </svg>
);

export const Cloud = (props) => (
  <svg {...base} {...props}>
    <path d="M4.6 12.4a2.9 2.9 0 0 1 .3-5.8 3.9 3.9 0 0 1 7.4.9 2.5 2.5 0 0 1-.6 4.9H4.6Z" />
  </svg>
);

export const ChevronDown = (props) => (
  <svg {...base} {...props}>
    <path d="M4 6.5 8 10.5l4-4" />
  </svg>
);

export const Warning = (props) => (
  <svg {...base} {...props}>
    <circle cx="8" cy="8" r="6.2" />
    <path d="M8 5.2v3.4M8 10.9v.01" />
  </svg>
);

export const Search = (props) => (
  <svg {...base} {...props}>
    <circle cx="6.8" cy="6.8" r="4.3" />
    <path d="M13.2 13.2 9.9 9.9" />
  </svg>
);

export const Layers = (props) => (
  <svg {...base} {...props}>
    <path d="M8 1.9 14 5 8 8.1 2 5l6-3.1Z" />
    <path d="m2.6 8 5.4 2.8L13.4 8" />
    <path d="m2.6 11 5.4 2.8L13.4 11" />
  </svg>
);

export const Plus = (props) => (
  <svg {...base} {...props}>
    <path d="M8 3v10M3 8h10" />
  </svg>
);

/** Filled, 32×32-sourced glyphs — supplied assets, not hand-drawn like the rest of this file. */
const filled = {
  width: 16,
  height: 16,
  viewBox: '0 0 32 32',
  fill: 'currentColor',
  'aria-hidden': true,
  focusable: false,
};

export const Edit = (props) => (
  <svg {...filled} {...props}>
    <path d="M23 11L20 8L11.5 16.5L10.5 20.5L14.5 19.5L23 11Z" />
    <path d="M16 22.5H9V24H16V22.5Z" />
  </svg>
);

export const Undo = (props) => (
  <svg {...filled} {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.6697 14.75L13.5601 11.4983L12.439 10.5017L7.9692 15.5303L12.4692 20.0303L13.5299 18.9697L10.8102 16.25H19.9971C20.5987 16.25 20.9905 16.4521 21.2774 16.7483C21.5857 17.0666 21.8152 17.5401 21.9726 18.1307C22.2586 19.2035 22.2523 20.4274 22.2481 21.2394C22.2476 21.3319 22.2471 21.4191 22.2471 21.5001L23.7471 21.4999C23.7471 21.4272 23.7477 21.345 23.7484 21.2544C23.754 20.4618 23.7641 19.0276 23.422 17.7443C23.2296 17.0224 22.9092 16.2771 22.3549 15.7048C21.7793 15.1104 20.9959 14.75 19.9971 14.75H10.6697Z"
    />
  </svg>
);

export const Redo = (props) => (
  <svg {...filled} {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21.3303 14.75L18.4399 11.4983L19.561 10.5017L24.0308 15.5303L19.5308 20.0303L18.4701 18.9697L21.1898 16.25H12.0029C11.4013 16.25 11.0095 16.4521 10.7226 16.7483C10.4143 17.0666 10.1848 17.5401 10.0274 18.1307C9.74138 19.2035 9.74773 20.4274 9.75194 21.2394C9.75241 21.3319 9.75287 21.4191 9.75285 21.5001L8.25285 21.4999C8.25287 21.4272 8.25228 21.345 8.25164 21.2544C8.24604 20.4618 8.23589 19.0276 8.57799 17.7443C8.77044 17.0224 9.09082 16.2771 9.64509 15.7048C10.2207 15.1104 11.0041 14.75 12.0029 14.75H21.3303Z"
    />
  </svg>
);

export const Outline = (props) => (
  <svg {...filled} {...props}>
    <path d="M7 9.5H18V11H7V9.5Z" />
    <path d="M10.5 15H21.5V16.5H10.5V15Z" />
    <path d="M25 20.5H14V22H25V20.5Z" />
  </svg>
);

export const Page = (props) => (
  <svg {...base} {...props}>
    <path d="M5 2.5h4.5L12 5v8.5H5V2.5Z" />
    <path d="M9.5 2.5V5H12" />
  </svg>
);

export const Lock = (props) => (
  <svg {...base} {...props}>
    <rect x="3.5" y="7.2" width="9" height="6.3" rx="1.3" />
    <path d="M5.5 7.2V5.3a2.5 2.5 0 0 1 5 0v1.9" />
  </svg>
);

/**
 * The AI star's path data, exported so the loader can use the real mark as one
 * of its frames rather than an approximation of it. 32×32 viewBox, nonzero fill.
 */
export const STAR_PATH =
  'M30.4522 14.6269L24.0687 12.4249C21.5442 11.5576 19.5536 9.56687 18.6862 7.0424L16.4842 0.658917C16.184 -0.219639 14.9271 -0.219639 14.6269 0.658917L12.4249 7.0424C11.5576 9.56687 9.56687 11.5576 7.0424 12.4249L0.658917 14.6269C-0.219639 14.9271 -0.219639 16.184 0.658917 16.4842L7.0424 18.6862C9.56687 19.5536 11.5576 21.5442 12.4249 24.0687L14.6269 30.4522C14.9271 31.3307 16.184 31.3307 16.4842 30.4522L18.6862 24.0687C19.5536 21.5442 21.5442 19.5536 24.0687 18.6862L30.4522 16.4842C31.3307 16.184 31.3307 14.9271 30.4522 14.6269ZM23.0011 16.0282L19.8093 17.1291C18.5416 17.5629 17.5518 18.5638 17.118 19.8204L16.0171 23.0122C15.8613 23.4571 15.2387 23.4571 15.0829 23.0122L13.982 19.8204C13.5482 18.5527 12.5473 17.5629 11.2907 17.1291L8.09889 16.0282C7.65407 15.8724 7.65407 15.2498 8.09889 15.094L11.2907 13.9931C12.5584 13.5593 13.5482 12.5584 13.982 11.3018L15.0829 8.11003C15.2387 7.66518 15.8613 7.66518 16.0171 8.11003L17.118 11.3018C17.5518 12.5696 18.5527 13.5593 19.8093 13.9931L23.0011 15.094C23.446 15.2498 23.446 15.8724 23.0011 16.0282Z';

/**
 * The AI star. Drawn on `currentColor` rather than the source file's baked-in
 * #2D5AF2, so it takes the accent token like everything else.
 */
export const Star = (props) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="currentColor"
    aria-hidden
    focusable="false"
    {...props}
  >
    <path d={STAR_PATH} />
  </svg>
);

/** WordPress mark — kept as an outline glyph so it stays neutral for now. */
export const WordPressMark = (props) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    focusable="false"
    {...props}
  >
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 1.3a8.7 8.7 0 0 1 3.9.9h-.2c-.7 0-1.2.6-1.2 1.3 0 .6.3 1.1.7 1.7.3.5.6 1.1.6 2 0 .6-.2 1.4-.6 2.4l-.7 2.4-2.6-7.7c.4 0 .8-.1.8-.1.4 0 .3-.6 0-.6 0 0-1.2.1-2 .1-.7 0-1.9-.1-1.9-.1-.4 0-.4.6 0 .6 0 0 .4.1.7.1l1.1 3-1.5 4.6L6.3 7.4c.4 0 .8-.1.8-.1.4 0 .3-.6 0-.6 0 0-.6 0-1.1.1A8.7 8.7 0 0 1 12 3.3ZM4.1 8.9l4.2 11.4A8.7 8.7 0 0 1 4.1 8.9Zm8.1 3.6 2.2 6a8.7 8.7 0 0 1-4.6.2l2.4-6.2Zm5.4-3.2a8.7 8.7 0 0 1-2.6 10.1l2.2-6.4c.4-1 .5-1.9.5-2.6v-1.1Z" />
  </svg>
);

/**
 * The full WordPress badge — supplied asset, ink square with the mark knocked
 * out in white already baked in. Square on purpose: the app bar clips it to
 * an asymmetric two-corner radius itself (see AppBar.jsx), which only reads
 * right against a true square, not something already rounded.
 */
export const WordPressBadge = (props) => (
  <svg width="32" height="32" viewBox="0 0 60 60" fill="none" aria-hidden focusable="false" {...props}>
    <rect width="60" height="60" fill="#1E1E1E" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M45.248 29.7588C45.248 21.4938 38.513 14.7588 30.248 14.7588C21.968 14.7588 15.248 21.4938 15.248 29.7588C15.248 38.0388 21.968 44.7588 30.248 44.7588C38.513 44.7588 45.248 38.0388 45.248 29.7588ZM26.9181 37.8138L21.8031 24.0888C22.6281 24.0588 23.5581 23.9688 23.5581 23.9688C24.3081 23.8788 24.2181 22.2738 23.4681 22.3038C23.4681 22.3038 21.2931 22.4688 19.9131 22.4688C19.6431 22.4688 19.3581 22.4688 19.0431 22.4538C21.4281 18.7938 25.5531 16.4238 30.2481 16.4238C33.7431 16.4238 36.9231 17.7288 39.3231 19.9338C38.3031 19.7688 36.8481 20.5188 36.8481 22.3038C36.8481 23.2758 37.3656 24.1097 37.9476 25.0474C38.0302 25.1805 38.1141 25.3158 38.1981 25.4538C38.7231 26.3688 39.0231 27.4938 39.0231 29.1438C39.0231 31.3788 36.9231 36.6438 36.9231 36.6438L32.3781 24.0888C33.1881 24.0588 33.6081 23.8338 33.6081 23.8338C34.3581 23.7588 34.2681 21.9588 33.5181 22.0038C33.5181 22.0038 31.3581 22.1838 29.9481 22.1838C28.6431 22.1838 26.4531 22.0038 26.4531 22.0038C25.7031 21.9588 25.6131 23.8038 26.3631 23.8338L27.7431 23.9538L29.6331 29.0688L26.9181 37.8138ZM41.3958 29.6716L41.3631 29.7588C40.2762 32.6201 39.1976 35.5059 38.1211 38.3861L38.1206 38.3873C37.7412 39.4023 37.3621 40.4165 36.983 41.4288C40.9881 39.1188 43.5831 34.6938 43.5831 29.7588C43.5831 27.4488 43.0581 25.3188 42.0081 23.3838C42.4594 26.8486 41.7662 28.6886 41.3958 29.6716ZM24.3981 41.8938C19.9281 39.7338 16.9131 35.0538 16.9131 29.7588C16.9131 27.8088 17.2581 26.0388 17.9931 24.3738C18.4423 25.6044 18.8916 26.8357 19.3409 28.0673L19.3411 28.0679C21.0224 32.6761 22.7056 37.2896 24.3981 41.8938ZM34.313 42.4188L30.443 31.9488C29.73 34.0521 29.0117 36.1555 28.2913 38.2651C27.7992 39.7061 27.3061 41.15 26.813 42.5988C27.893 42.9288 29.063 43.0938 30.248 43.0938C31.673 43.0938 33.023 42.8538 34.313 42.4188Z"
      fill="white"
    />
  </svg>
);

/**
 * The "New" control — supplied asset, exact 32×32 with its own baked-in
 * accent fill, 2px corner radius and white plus. Rendered as-is, not run
 * through IconButton, so it keeps precisely these dimensions.
 */
export const AddBadge = (props) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden focusable="false" {...props}>
    <rect width="32" height="32" rx="2" fill="#3858E9" />
    <path d="M15 16.5V21.5H16.5V16.5H21.5V15H16.5V10H15V15H10V16.5H15Z" fill="white" />
  </svg>
);
