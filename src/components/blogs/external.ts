/** The articles live on Medium, off the site, so their links open in a new tab
 *  and leave this one where the reader was. A relative href stays in the tab. */
export function external(href: string) {
  return /^https?:\/\//.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
}
