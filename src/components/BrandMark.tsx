/** The site's periwinkle mark (public/nav-logo.svg) as JSX, so the generated
 *  favicon and app icons draw the real logo rather than a lookalike. */
export default function BrandMark({ size }: { size: number }) {
  return (
    <svg width={size} height={(size * 17.2793) / 18.9901} viewBox="0 0 18.9901 17.2793" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 0L9.8263 0L9.8263 4.80305L4.91315 8.63964L9.8263 12.4835V17.2793L0 17.2793L0 13.4427L5.24216 13.4427L0 9.59879L0 7.68049L5.24216 3.83659L0 3.83659L0 0Z"
        fill="#8581FF"
      />
      <path
        d="M18.9901 17.2793H9.16379L9.16379 12.4762L14.0769 8.63964L9.16379 4.79573L9.16379 0L18.9901 0V3.83659L13.7479 3.83659L18.9901 7.68049V9.59879L13.7479 13.4427H18.9901V17.2793Z"
        fill="#8581FF"
      />
      <rect x="8.2989" y="4.27868" width="2.30961" height="9.23843" fill="#8581FF" />
    </svg>
  );
}
