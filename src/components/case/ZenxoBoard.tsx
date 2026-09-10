/* eslint-disable @next/next/no-img-element -- The 51 icons here are the app's own
   exported SVGs, all under 1.5KB. next/image does not optimize SVG without
   dangerouslyAllowSVG, so routing them through it would add a loader hop and a
   security flag to buy nothing. They are also decorative and never the LCP
   element: the board is a figure well below the fold. */
import { Public_Sans } from "next/font/google";
import ZenxoStep5Pane from "./ZenxoStep5Pane";

/**
 * The Zenxo strategy builder, reproduced exactly.
 *
 * Not a redraw. Every box in here is a real app pixel: the frame was captured
 * off the running product into Figma with its layers intact, and this is that
 * capture transcribed — same coordinates, same colours, same exported icons.
 * Cross-checked against the live app at the same 1470x745 viewport, where the
 * form pane measures x=383 w=572 against the capture's x=383 w=573.
 *
 * WHY IT IS A FIXED-SIZE BOARD
 *
 * The capture is absolutely positioned in pixels throughout. Re-solving that
 * into percentages is what turns a replica back into a drawing, so the board
 * keeps its literal 1470x745 and the whole thing is scaled instead:
 *
 *     transform: scale(calc(100cqw / 1470px))
 *
 * A length divided by a length is a number, so the factor is exactly the
 * container's share of the artboard - 0.5 at 735px, verified in-browser. One
 * transform carries geometry and type together, which is why the type stays in
 * proportion without a single font-size being touched.
 *
 * FOUR THINGS WERE CORRECTED, AND NOTHING ELSE
 *
 *  1. The date-range chip is gone. With it present the header's centre group
 *     needs 792px between a fixed left group (ends 278.1) and right group
 *     (starts 995) that leave 717 - so it collides at BOTH ends. That is the
 *     product's own overflow, not a capture fault: live, the chip is absent at
 *     zero legs and the header is clean, and it reappears with the first leg
 *     and overlaps exactly as captured. Dropping the chip is the app's own
 *     zero-leg answer, so the remaining run is re-centred in the free span.
 *  2. The floating assistant bubble and the build-hash badge are removed. Both
 *     are runtime chrome rather than product design.
 *  3. The account email is replaced. The capture carried a real address and
 *     this page is public.
 *  4. The info badges keep their italic. Figma stamps a blanket `not-italic`
 *     that cancels the family it just assigned; the live app really does set
 *     them in Georgia bold italic at 9.5px.
 *
 * Fonts: the app's body face is the OS stack, which is why so much of the
 * capture reads as Helvetica Neue - that is genuinely what it renders. Only
 * Public Sans is a webfont here, and only the header chrome uses it.
 */

/* Public Sans is a variable font, so no weight list is needed. */
const publicSans = Public_Sans({
  variable: "--zx-public",
  subsets: ["latin"],
  display: "swap",
});

/** The artboard's true size, and the divisor the fit above depends on. */
export const BOARD = { width: 1470, height: 745 } as const;

/** The app's own stacks, copied from its computed styles rather than guessed. */
const FONTS = {
  "--zx-sans": '"Helvetica Neue", Helvetica, Arial, -apple-system, system-ui, sans-serif',
  "--zx-serif": 'Georgia, "Times New Roman", serif',
} as const;

export default function ZenxoBoard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`zx ${publicSans.variable} ${className} absolute inset-0 overflow-hidden`}
      style={{ containerType: "inline-size", ...FONTS } as React.CSSProperties}
    >
      <div className="zx__lens absolute inset-0">
        <div
          style={{
            width: BOARD.width,
            height: BOARD.height,
            transformOrigin: "0 0",
            transform: `scale(calc(100cqw / ${BOARD.width}px))`,
          }}
        >
        <div className="relative size-full" data-node-id="684:2192" style={{ backgroundImage: "linear-gradient(90deg, rgb(251, 251, 249) 0%, rgb(251, 251, 249) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="1470w default">
          <div className="absolute bg-[#fdfdfc] inset-0 overflow-clip" data-node-id="684:2193" data-name="Background">
            <div className="absolute bg-[#fbfbf9] inset-[8px_8px_8px_72px] overflow-clip rounded-[16px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.12)]" data-node-id="684:2194" data-name="Main">
              <div className="absolute bg-[#fbfbf9] inset-[56px_0_0_0] overflow-auto" data-node-id="684:2195" data-name="Main">
                <div className="absolute bg-gradient-to-b border-[#ecebe7] border-r border-solid from-[#fbfbf9] inset-[0_1110px_0_0] overflow-clip to-[#f8f8f6]" data-node-id="684:2196" data-name="Nav - ARC NAVIGATOR">
                  <div className="absolute blur-[0.3px] inset-[508.48px_85.54px_127.48px_44px] opacity-35" data-node-id="684:2197" data-name="Button">
                    <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[15.88px] justify-center leading-[0] left-[99.6px] not-italic text-[#9a9a91] text-[14.1px] text-center top-[calc(50%-0.22px)] tracking-[-0.3528px] w-[100.425px]" data-node-id="684:2198">
                      <p className="leading-[normal]">Payoff Analyzer</p>
                    </div>
                    <div className="-translate-y-1/2 absolute bg-[#f2f2ef] left-0 rounded-[14px] size-[37.04px] top-1/2" data-node-id="684:2199" data-name="Background">
                      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[17.64px] top-1/2" data-node-id="684:2200" data-name="SVG">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg.svg" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute blur-[0.24px] inset-[446.48px_70.91px_189.48px_44px] opacity-35" data-node-id="684:2203" data-name="Button">
                    <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[15.88px] justify-center leading-[0] left-[106.93px] not-italic text-[#9a9a91] text-[14.1px] text-center top-[calc(50%-0.22px)] tracking-[-0.3528px] w-[115.078px]" data-node-id="684:2204">
                      <p className="leading-[normal]">Risk Management</p>
                    </div>
                    <div className="-translate-y-1/2 absolute bg-[#f2f2ef] left-0 rounded-[14px] size-[37.04px] top-1/2" data-node-id="684:2205" data-name="Background">
                      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[17.64px] top-1/2" data-node-id="684:2206" data-name="SVG">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg1.svg" />
                      </div>
                    </div>
                  </div>
                  <div className="zx-railitem--boff absolute blur-[0.18px] inset-[383.48px_96.86px_252.48px_44px] opacity-35" data-node-id="684:2209" data-name="Button">
                    <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[15.88px] justify-center leading-[0] left-[94px] not-italic text-[#9a9a91] text-[14.1px] text-center top-[calc(50%-0.22px)] tracking-[-0.3528px] w-[89.214px]" data-node-id="684:2210">
                      <p className="leading-[normal]">Strategy Legs</p>
                    </div>
                    <div className="-translate-y-1/2 absolute bg-[#f2f2ef] left-0 rounded-[14px] size-[37.04px] top-1/2" data-node-id="684:2211" data-name="Background">
                      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[17.64px] top-1/2" data-node-id="684:2212" data-name="SVG">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg2.svg" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute blur-[0.12px] inset-[320.48px_120.02px_315.48px_44px] opacity-46" data-node-id="684:2219" data-name="Button">
                    <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[15.88px] justify-center leading-[0] left-[82.38px] not-italic text-[#9a9a91] text-[14.1px] text-center top-[calc(50%-0.22px)] tracking-[-0.3528px] w-[65.982px]" data-node-id="684:2220">
                      <p className="leading-[normal]">Templates</p>
                    </div>
                    <div className="-translate-y-1/2 absolute bg-[#f2f2ef] left-0 rounded-[14px] size-[37.04px] top-1/2" data-node-id="684:2221" data-name="Background">
                      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[17.64px] top-1/2" data-node-id="684:2222" data-name="SVG">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg3.svg" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute blur-[0.06px] inset-[256.48px_56.19px_379.48px_44px] opacity-64" data-node-id="684:2227" data-name="Button">
                    <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[15.88px] justify-center leading-[0] left-[114.3px] not-italic text-[#9a9a91] text-[14.1px] text-center top-[calc(50%-0.22px)] tracking-[-0.3528px] w-[129.821px]" data-node-id="684:2228">
                      <p className="leading-[normal]">Strategy Level Entry</p>
                    </div>
                    <div className="-translate-y-1/2 absolute bg-[#f2f2ef] left-0 rounded-[14px] size-[37.04px] top-1/2" data-node-id="684:2229" data-name="Background">
                      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[17.64px] top-1/2" data-node-id="684:2230" data-name="SVG">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg4.svg" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-[192.48px_77.1px_443.48px_44px] opacity-82" data-node-id="684:2234" data-name="Button">
                    <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[15.88px] justify-center leading-[0] left-[103.83px] not-italic text-[#9a9a91] text-[14.1px] text-center top-[calc(50%-0.22px)] tracking-[-0.3528px] w-[108.878px]" data-node-id="684:2235">
                      <p className="leading-[normal]">{`Session & Filters`}</p>
                    </div>
                    <div className="-translate-y-1/2 absolute bg-[#f2f2ef] left-0 rounded-[14px] size-[37.04px] top-1/2" data-node-id="684:2236" data-name="Background">
                      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[17.64px] top-1/2" data-node-id="684:2237" data-name="SVG">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg5.svg" />
                      </div>
                    </div>
                  </div>
                  <div className="zx-railitem zx-railitem--a absolute inset-[127.6px_36.74px_506.59px_44px]" data-node-id="684:2240" data-name="Button">
                    <div className="-translate-y-1/2 absolute bg-white border border-[#ecebe7] border-solid drop-shadow-[0px_6px_12px_rgba(20,20,25,0.07)] h-[32.19px] left-[58.21px] rounded-[999px] top-[calc(50%-0.01px)] w-[140.05px]" data-node-id="684:2241" data-name="Background+Border+Shadow">
                      <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[15.88px] justify-center leading-[0] left-[calc(50%+0.19px)] not-italic text-[#1b1a17] text-[14.1px] text-center top-[14.88px] tracking-[-0.3528px] w-[110.43px]" data-node-id="684:2242">
                        <p className="leading-[normal]">Strategy Settings</p>
                      </div>
                    </div>
                    <div className="-translate-y-1/2 absolute bg-[#e9f1fe] border border-[#3b82f6] border-solid h-[38.81px] left-0 rounded-[16px] top-1/2 w-[45.86px]" data-node-id="684:2243" data-name="Background+Border">
                      <div className="-translate-y-1/2 absolute bg-[rgba(255,255,255,0)] h-[38.81px] left-[-1px] rounded-[16px] shadow-[0px_8px_22px_-8px_rgba(20,20,25,0.28)] top-1/2 w-[45.86px]" data-node-id="684:2244" data-name="Overlay+Shadow" />
                      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[17.64px] top-[calc(50%-0.01px)]" data-node-id="684:2245" data-name="SVG">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg6.svg" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute bg-gradient-to-b from-[#fbfbf9] h-[150px] left-0 to-[rgba(251,251,249,0)] top-0 w-[279px]" data-node-id="684:2250" data-name="Gradient" />
                  <div className="absolute bg-gradient-to-b from-[rgba(248,248,246,0)] h-[150px] left-0 to-[#f8f8f6] top-[523px] w-[279px]" data-node-id="684:2251" data-name="Gradient" />
                  <div className="zx-railitem zx-railitem--aoff absolute blur-[0.18px] h-[37.04px] left-[44px] top-[128.485px] w-[159.45px]" data-node-id="689:2582">
                    <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[15.68px] justify-center leading-[0] left-[104.6px] not-italic text-[#9a9a91] text-[14.1px] text-center top-[calc(50%-0.24px)] tracking-[-0.3528px] w-[110.44px]">
                      <p className="leading-[normal]">Strategy Settings</p>
                    </div>
                    <div className="-translate-y-1/2 absolute bg-[#f2f2ef] left-0 rounded-[14px] size-[37.04px] top-1/2">
                      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[17.64px] top-1/2">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/step5-rail-settings-off.svg" />
                      </div>
                    </div>
                  </div>
                  <div className="zx-railbar absolute bg-[#1b1a17] h-[34px] left-[24px] opacity-85 rounded-[99px] top-[130px] w-[6px]" data-node-id="684:2252" data-name="Background" />
                  <div className="zx-railitem zx-railitem--b absolute h-[38.8px] left-[44px] top-[382.6px] w-[176.15px]" data-node-id="689:2623">
                    <div className="-translate-y-1/2 absolute bg-white border border-[#ecebe7] border-solid drop-shadow-[0px_6px_12px_rgba(20,20,25,0.07)] h-[31.25px] left-[58.2px] rounded-[999px] top-[calc(50%+0.01px)] w-[117.94px]">
                      <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[15.68px] justify-center leading-[0] left-[calc(50%+0.24px)] not-italic text-[#1b1a17] text-[14.1px] text-center top-[14.38px] tracking-[-0.3528px] w-[89.214px]">
                        <p className="leading-[normal]">Strategy Legs</p>
                      </div>
                    </div>
                    <div className="-translate-y-1/2 absolute bg-[#fce7ee] border border-[#e85c82] border-solid h-[38.8px] left-0 rounded-[16px] top-1/2 w-[45.86px]">
                      <div className="-translate-y-1/2 absolute bg-[rgba(255,255,255,0)] h-[38.8px] left-[-1px] rounded-[16px] shadow-[0px_8px_22px_-8px_rgba(20,20,25,0.28)] top-1/2 w-[45.86px]" />
                      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[17.64px] top-1/2">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/step5-rail-icon.svg" />
                      </div>
                    </div>
                  </div>
                  <div className="-translate-x-1/2 absolute bg-white border border-[#deddd8] border-solid bottom-[18px] left-1/2 rounded-[999px] size-[30px]" data-node-id="684:2253" data-name="Button - Collapse navigation">
                    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[14px] top-1/2" data-node-id="684:2254" data-name="SVG">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg7.svg" />
                    </div>
                  </div>
                </div>
                <div className="absolute inset-[0_0_0_280px]" data-node-id="684:2256" data-name="EDITOR">
                  <div className="absolute inset-[0_0_69.5px_0] overflow-auto" data-node-id="684:2257" data-name="Container">
                    <div className="absolute inset-[26px_30px_38px_30px]" data-node-id="684:2258" data-name="OVERALL SETTINGS">
                      <div className="zx-eyebrow zx-eyebrow--a -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[16.5px] justify-center leading-[0] left-0 not-italic right-[888.95px] text-[#c6c5bf] text-[11px] top-[8.25px] tracking-[0.99px] uppercase" data-node-id="684:2259">
                        <p className="leading-[16.5px]">Step 1 · Configuration</p>
                      </div>
                      <div className="zx-eyebrow zx-eyebrow--b -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[16.5px] justify-center leading-[0] left-0 not-italic right-[891.23px] text-[#c6c5bf] text-[11px] top-[8.25px] tracking-[0.99px] uppercase">
                        <p className="leading-[16.5px]">Step 5 · Strategy legs</p>
                      </div>
                      <div className="absolute bg-white border border-[#ecebe7] border-solid h-[527.5px] left-0 overflow-clip right-0 rounded-[16px] top-[28.5px]" data-node-id="684:2260" data-name="Background+Border">
                        <div className="zx-pane zx-pane--a absolute bg-white border-[#ecebe7] border-r border-solid bottom-0 left-0 overflow-auto top-0 w-[573px]" data-node-id="684:2261" data-name="Aside">
                          <div className="absolute h-[525.25px] left-0 right-0 top-0" data-node-id="684:2262" data-name="Section">
                            <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[30px] justify-center leading-[0] left-[22px] not-italic right-[391.87px] text-[#1b1a17] text-[20px] top-[33px] tracking-[-0.4px]" data-node-id="684:2263">
                              <p className="leading-[30px]">Strategy Settings</p>
                            </div>
                            <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[16.5px] justify-center leading-[0] left-[22px] not-italic right-[449.36px] text-[#9a9a91] text-[11px] top-[78.25px] tracking-[0.66px] uppercase" data-node-id="684:2264">
                              <p className="leading-[16.5px]">Strategy Name</p>
                            </div>
                            <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[16.5px] justify-center leading-[0] left-[128.28px] not-italic right-[438.6px] text-[#ec5e1a] text-[11px] top-[78.25px] tracking-[0.66px] uppercase" data-node-id="684:2265">
                              <p className="leading-[16.5px]">*</p>
                            </div>
                            <div className="absolute border border-[#deddd8] border-solid h-[14px] left-[139.02px] right-[418.98px] rounded-[999px] top-[71.25px]" data-node-id="684:2266" data-name="Border">
                              <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-serif)] font-bold italic h-[10.5px] justify-center leading-[0] left-[calc(50%+0.18px)] text-[#c6c5bf] text-[9.5px] text-center top-1/2 tracking-[0.66px] w-[4.497px]" data-node-id="684:2267">
                                <p className="leading-[9.5px]">i</p>
                              </div>
                            </div>
                            <div className="absolute bg-white border border-[#deddd8] border-solid h-[44px] left-[22px] overflow-clip right-[22px] rounded-[12px] top-[94.5px]" data-node-id="684:2268" data-name="Input">
                              <div className="absolute h-[17px] left-[14px] overflow-auto right-[14px] top-[12.5px]" data-node-id="684:2269" data-name="Container">
                                <div className="zx-type -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[16.5px] justify-center leading-[0] left-0 not-italic text-[#1b1a17] text-[14px] top-[8.25px] w-[79.142px]" data-node-id="684:2270">
                                  <p className="leading-[normal]">My_Strategy</p>
                                </div>
                              </div>
                            </div>
                            <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[16.5px] justify-center leading-[0] left-[22px] not-italic right-[483.92px] text-[#9a9a91] text-[11px] top-[166.75px] tracking-[0.66px] uppercase" data-node-id="684:2271">
                              <p className="leading-[16.5px]">Exchange</p>
                            </div>
                            <div className="absolute border border-[#deddd8] border-solid h-[14px] left-[93.78px] right-[464.22px] rounded-[999px] top-[159.75px]" data-node-id="684:2272" data-name="Border">
                              <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-serif)] font-bold italic h-[10.5px] justify-center leading-[0] left-[calc(50%+0.18px)] text-[#c6c5bf] text-[9.5px] text-center top-1/2 tracking-[0.66px] w-[4.497px]" data-node-id="684:2273">
                                <p className="leading-[9.5px]">i</p>
                              </div>
                            </div>
                            <div className="absolute bg-white border border-[#deddd8] border-solid h-[44px] left-[22px] right-[350.32px] rounded-[12px] top-[183px]" data-node-id="684:2274" data-name="Button listbox">
                              <div className="-translate-y-1/2 absolute bg-[#f2f2ef] left-[12px] rounded-[7px] size-[22px] top-1/2" data-node-id="684:2275" data-name="Background">
                                <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[11px] justify-center leading-[0] left-[calc(50%+0.15px)] not-italic text-[#4a4a44] text-[9px] text-center top-[calc(50%-0.25px)] tracking-[0.18px] w-[19.192px]" data-node-id="684:2276">
                                  <p className="leading-[normal]">NSE</p>
                                </div>
                              </div>
                              <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[15.5px] justify-center leading-[0] left-[44px] not-italic right-[127.57px] text-[#1b1a17] text-[13px] top-[calc(50%-0.25px)]" data-node-id="684:2277">
                                <p className="leading-[normal]">NSE</p>
                              </div>
                              <div className="-translate-y-1/2 absolute left-[173.68px] size-[12px] top-1/2" data-node-id="684:2278" data-name="SVG">
                                <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg8.svg" />
                              </div>
                            </div>
                            <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[16.5px] justify-center leading-[0] left-[237.68px] not-italic right-[221.56px] text-[#9a9a91] text-[11px] top-[166.75px] tracking-[0.66px] uppercase" data-node-id="684:2280">
                              <p className="leading-[16.5px]">Instrument type</p>
                            </div>
                            <div className="absolute border border-[#deddd8] border-solid h-[14px] left-[356.07px] right-[201.93px] rounded-[999px] top-[159.75px]" data-node-id="684:2281" data-name="Border">
                              <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-serif)] font-bold italic h-[10.5px] justify-center leading-[0] left-[calc(50%+0.18px)] text-[#c6c5bf] text-[9.5px] text-center top-1/2 tracking-[0.66px] w-[4.497px]" data-node-id="684:2282">
                                <p className="leading-[9.5px]">i</p>
                              </div>
                            </div>
                            <div className="absolute bg-[#f2f2ef] border border-[#ecebe7] border-solid h-[44px] left-[237.68px] right-[22px] rounded-[12px] top-[183px]" data-node-id="684:2283" data-name="Background+Border">
                              <div className="absolute bg-white drop-shadow-[0px_1px_1px_rgba(20,20,25,0.04)] h-[34px] left-[4px] right-[157.16px] rounded-[9px] top-[4px]" data-node-id="684:2284" data-name="Button">
                                <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[15.5px] justify-center leading-[0] left-[calc(50%+0.15px)] not-italic text-[#1b1a17] text-[13px] text-center top-[calc(50%-0.25px)] w-[33.531px]" data-node-id="684:2285">
                                  <p className="leading-[normal]">Index</p>
                                </div>
                              </div>
                              <div className="absolute h-[34px] left-[157.16px] right-[4px] rounded-[9px] top-[4px]" data-node-id="684:2286" data-name="Button">
                                <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[15.5px] justify-center leading-[0] left-[calc(50%-26.75px)] not-italic text-[#c6c5bf] text-[13px] text-center top-[calc(50%-0.25px)] w-[83.649px]" data-node-id="684:2287">
                                  <p className="leading-[normal]">Stock options</p>
                                </div>
                                <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#ecebe7] h-[15.5px] left-[calc(50%+48.66px)] rounded-[999px] top-1/2 w-[39.81px]" data-node-id="684:2288" data-name="Background">
                                  <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[11px] justify-center leading-[0] left-[calc(50%+0.18px)] not-italic text-[#7c7c74] text-[9px] text-center top-[7.5px] tracking-[0.45px] w-[28.178px]" data-node-id="684:2289">
                                    <p className="leading-[normal]">SOON</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[16.5px] justify-center leading-[0] left-[22px] not-italic right-[499.24px] text-[#9a9a91] text-[11px] top-[255.25px] tracking-[0.66px] uppercase" data-node-id="684:2290">
                              <p className="leading-[16.5px]">Symbol</p>
                            </div>
                            <div className="absolute border border-[#deddd8] border-solid h-[14px] left-[78.41px] right-[479.59px] rounded-[999px] top-[248.25px]" data-node-id="684:2291" data-name="Border">
                              <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-serif)] font-bold italic h-[10.5px] justify-center leading-[0] left-[calc(50%+0.18px)] text-[#c6c5bf] text-[9.5px] text-center top-1/2 tracking-[0.66px] w-[4.497px]" data-node-id="684:2292">
                                <p className="leading-[9.5px]">i</p>
                              </div>
                            </div>
                            <div className="absolute bg-white border border-[#deddd8] border-solid h-[44px] left-[22px] right-[350.32px] rounded-[12px] top-[271.5px]" data-node-id="684:2293" data-name="Button listbox">
                              <div className="-translate-y-1/2 absolute bg-[#f2f2ef] left-[12px] rounded-[7px] size-[22px] top-1/2" data-node-id="684:2294" data-name="Background">
                                <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[11px] justify-center leading-[0] left-[calc(50%+0.17px)] not-italic text-[#4a4a44] text-[9px] text-center top-[calc(50%-0.25px)] tracking-[0.18px] w-[7.196px]" data-node-id="684:2295">
                                  <p className="leading-[normal]">N</p>
                                </div>
                              </div>
                              <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[15.5px] justify-center leading-[0] left-[44px] not-italic right-[117.27px] text-[#1b1a17] text-[13px] top-[calc(50%-0.25px)]" data-node-id="684:2296">
                                <p className="leading-[normal]">NIFTY</p>
                              </div>
                              <div className="-translate-y-1/2 absolute left-[173.68px] size-[12px] top-1/2" data-node-id="684:2297" data-name="SVG">
                                <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg8.svg" />
                              </div>
                            </div>
                            <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[16.5px] justify-center leading-[0] left-[237.68px] not-italic right-[246.18px] text-[#9a9a91] text-[11px] top-[255.25px] tracking-[0.66px] uppercase" data-node-id="684:2299">
                              <p className="leading-[16.5px]">Trading Type</p>
                            </div>
                            <div className="absolute border border-[#deddd8] border-solid h-[14px] left-[331.48px] right-[226.52px] rounded-[999px] top-[248.25px]" data-node-id="684:2300" data-name="Border">
                              <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-serif)] font-bold italic h-[10.5px] justify-center leading-[0] left-[calc(50%+0.18px)] text-[#c6c5bf] text-[9.5px] text-center top-1/2 tracking-[0.66px] w-[4.497px]" data-node-id="684:2301">
                                <p className="leading-[9.5px]">i</p>
                              </div>
                            </div>
                            <div className="absolute bg-[#f2f2ef] border border-[#ecebe7] border-solid h-[44px] left-[237.68px] right-[22px] rounded-[12px] top-[271.5px]" data-node-id="684:2302" data-name="Background+Border">
                              <div className="absolute bg-white drop-shadow-[0px_1px_1px_rgba(20,20,25,0.04)] h-[34px] left-[4px] right-[157.16px] rounded-[9px] top-[4px]" data-node-id="684:2303" data-name="Button">
                                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-27.57px)] size-[13px] top-1/2" data-node-id="684:2304" data-name="SVG">
                                  <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg9.svg" />
                                </div>
                                <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[15.5px] justify-center leading-[0] left-[calc(50%+9.67px)] not-italic text-[#1b1a17] text-[13px] text-center top-[calc(50%-0.25px)] w-[49.48px]" data-node-id="684:2307">
                                  <p className="leading-[normal]">Intraday</p>
                                </div>
                              </div>
                              <div className="absolute h-[34px] left-[157.16px] right-[4px] rounded-[9px] top-[4px]" data-node-id="684:2308" data-name="Button">
                                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-34.63px)] size-[13px] top-1/2" data-node-id="684:2309" data-name="SVG">
                                  <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg10.svg" />
                                </div>
                                <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[15.5px] justify-center leading-[0] left-[calc(50%+11.69px)] not-italic text-[#7c7c74] text-[13px] text-center top-[calc(50%-0.25px)] w-[59.642px]" data-node-id="684:2314">
                                  <p className="leading-[normal]">Positional</p>
                                </div>
                              </div>
                            </div>
                            <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[16.5px] justify-center leading-[0] left-[22px] not-italic right-[473.01px] text-[#9a9a91] text-[11px] top-[343.75px] tracking-[0.66px] uppercase" data-node-id="684:2315">
                              <p className="leading-[16.5px]">Underlying</p>
                            </div>
                            <div className="absolute border border-[#deddd8] border-solid h-[14px] left-[104.67px] right-[453.33px] rounded-[999px] top-[336.75px]" data-node-id="684:2316" data-name="Border">
                              <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-serif)] font-bold italic h-[10.5px] justify-center leading-[0] left-[calc(50%+0.18px)] text-[#c6c5bf] text-[9.5px] text-center top-1/2 tracking-[0.66px] w-[4.497px]" data-node-id="684:2317">
                                <p className="leading-[9.5px]">i</p>
                              </div>
                            </div>
                            <div className="absolute bg-white border border-[#deddd8] border-solid h-[44px] left-[22px] right-[294px] rounded-[12px] top-[360px]" data-node-id="684:2318" data-name="Button listbox">
                              <div className="-translate-y-1/2 absolute bg-[#f2f2ef] left-[12px] rounded-[7px] size-[22px] top-1/2" data-node-id="684:2319" data-name="Background">
                                <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[11px] justify-center leading-[0] left-[calc(50%+0.15px)] not-italic text-[#4a4a44] text-[9px] text-center top-[calc(50%-0.25px)] tracking-[0.18px] w-[20.047px]" data-node-id="684:2320">
                                  <p className="leading-[normal]">CSH</p>
                                </div>
                              </div>
                              <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[15.5px] justify-center leading-[0] left-[44px] not-italic right-[179.52px] text-[#1b1a17] text-[13px] top-[calc(50%-0.25px)]" data-node-id="684:2321">
                                <p className="leading-[normal]">Cash</p>
                              </div>
                              <div className="-translate-y-1/2 absolute left-[230px] size-[12px] top-1/2" data-node-id="684:2322" data-name="SVG">
                                <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg8.svg" />
                              </div>
                            </div>
                            <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[16.5px] justify-center leading-[0] left-[294px] not-italic right-[180.17px] text-[#9a9a91] text-[11px] top-[343.75px] tracking-[0.66px] uppercase" data-node-id="684:2324">
                              <p className="leading-[16.5px]">Lot Multiplier</p>
                            </div>
                            <div className="absolute border border-[#deddd8] border-solid h-[14px] left-[397.48px] right-[160.52px] rounded-[999px] top-[336.75px]" data-node-id="684:2325" data-name="Border">
                              <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-serif)] font-bold italic h-[10.5px] justify-center leading-[0] left-[calc(50%+0.18px)] text-[#c6c5bf] text-[9.5px] text-center top-1/2 tracking-[0.66px] w-[4.497px]" data-node-id="684:2326">
                                <p className="leading-[9.5px]">i</p>
                              </div>
                            </div>
                            <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[17.25px] justify-center leading-[0] left-[294px] not-italic right-[58.44px] text-[#7c7c74] text-[11.5px] top-[420.63px] tracking-[-0.154px]" data-node-id="684:2327">
                              <p className="leading-[17.25px]">Lot multiplier applies on the overall position.</p>
                            </div>
                            <div className="absolute bg-white border border-[#deddd8] border-solid h-[44px] left-[294px] overflow-clip right-[22px] rounded-[12px] top-[360px]" data-node-id="684:2328" data-name="Input">
                              <div className="absolute h-[17px] left-[14px] overflow-auto right-[32px] top-[12.5px]" data-node-id="684:2329" data-name="Container">
                                <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[16.5px] justify-center leading-[0] left-0 not-italic text-[#1b1a17] text-[14px] top-[8.25px] tracking-[-0.28px] w-[7.873px]" data-node-id="684:2330">
                                  <p className="leading-[normal]">1</p>
                                </div>
                              </div>
                            </div>
                            <div className="absolute border-[#ecebe7] border-l border-solid h-[42px] left-[523px] overflow-clip right-[23px] rounded-br-[12px] rounded-tr-[12px] top-[361px]" data-node-id="684:2331" data-name="VerticalBorder">
                              <div className="absolute bg-white bottom-[21.5px] left-0 top-0 w-[25px]" data-node-id="684:2332" data-name="Button - Increase lot multiplier">
                                <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[8.5px] justify-center leading-[0] left-[calc(50%+0.19px)] not-italic text-[#7c7c74] text-[8px] text-center top-[calc(50%-0.25px)] w-[8.293px]" data-node-id="684:2333">
                                  <p className="leading-[8px]">▲</p>
                                </div>
                              </div>
                              <div className="absolute bg-white border-[#ecebe7] border-solid border-t bottom-0 left-0 top-[20.5px] w-[25px]" data-node-id="684:2334" data-name="Button - Decrease lot multiplier">
                                <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[8.5px] justify-center leading-[0] left-[calc(50%+0.19px)] not-italic text-[#7c7c74] text-[8px] text-center top-[calc(50%-0.25px)] w-[8.293px]" data-node-id="684:2335">
                                  <p className="leading-[8px]">▼</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="zx-pane zx-pane--b absolute bottom-0 left-0 top-0 w-[573px]">
                          <ZenxoStep5Pane />
                        </div>
                        <div className="absolute inset-[0_0_0_573px] overflow-clip" data-node-id="684:2336" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 475 525.5' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(63.816 0 0 70.601 23.75 26.275)'><stop stop-color='rgba(222,221,216,1)' offset='0.037216'/><stop stop-color='rgba(222,221,216,0)' offset='0.037216'/></radialGradient></defs></svg>\"), linear-gradient(90deg, rgb(248, 248, 246) 0%, rgb(248, 248, 246) 100%)" }} data-name="Background">
                          <div className="zx-graph absolute inset-0" style={{ transformOrigin: "0 0" }}>
                            <div className="zx-spine -translate-x-1/2 -translate-y-1/2 absolute h-[389.842px] left-[calc(50%+0.01px)] top-1/2 w-[320.56px]" data-node-id="684:2337" data-name="SVG">
                              <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg11.svg" />
                            </div>
                            <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-white border border-[#deddd8] border-solid h-[206.81px] left-[calc(50%-11.36px)] overflow-clip rounded-[10px] shadow-[0px_1px_2px_0px_rgba(20,20,25,0.06)] top-[calc(50%-66.69px)] w-[256.45px]" data-node-id="684:2340" data-name="Background+Border+Shadow">
                              <div className="absolute bg-[#e9f1fe] h-[31.44px] left-[13.06px] right-[209.95px] rounded-[11px] top-[11.4px]" data-node-id="684:2341" data-name="Background">
                                <div className="absolute left-[7.03px] size-[17.37px] top-[7.04px]" data-node-id="684:2342" data-name="SVG">
                                  <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg12.svg" />
                                </div>
                              </div>
                              <div className="absolute h-[15.72px] left-[54.42px] overflow-clip right-[125.9px] top-[19.26px]" data-node-id="684:2346" data-name="Container">
                                <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[15.3px] justify-center leading-[0] left-0 not-italic text-[#1b1a17] text-[12.8px] top-[7.65px] tracking-[-0.1919px] w-[74.444px]" data-node-id="684:2347">
                                  <p className="leading-[normal]">My_Strategy</p>
                                </div>
                              </div>
                              <div className="zx-row -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[12.82px] justify-center leading-[0] left-[13.06px] not-italic right-[194.47px] text-[#7c7c74] text-[10.8px] top-[63.31px] tracking-[-0.1274px]" data-node-id="684:2348">
                                <p className="leading-[16.131px]">Exchange</p>
                              </div>
                              <div className="zx-row -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[12.82px] justify-center leading-[0] left-[220.26px] not-italic right-[12.73px] text-[#1b1a17] text-[10.8px] top-[63.31px] tracking-[-0.1274px]" data-node-id="684:2349">
                                <p className="leading-[16.131px]">NSE</p>
                              </div>
                              <div className="zx-row -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[12.82px] justify-center leading-[0] left-[13.06px] not-italic right-[190.91px] text-[#7c7c74] text-[10.8px] top-[91.03px] tracking-[-0.1274px]" data-node-id="684:2350">
                                <p className="leading-[16.131px]">Instrument</p>
                              </div>
                              <div className="zx-row -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[12.82px] justify-center leading-[0] left-[214.53px] not-italic right-[12.71px] text-[#1b1a17] text-[10.8px] top-[91.03px] tracking-[-0.1274px]" data-node-id="684:2351">
                                <p className="leading-[16.131px]">Index</p>
                              </div>
                              <div className="zx-row -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[12.82px] justify-center leading-[0] left-[13.06px] not-italic right-[205.39px] text-[#7c7c74] text-[10.8px] top-[118.74px] tracking-[-0.1274px]" data-node-id="684:2352">
                                <p className="leading-[16.131px]">Symbol</p>
                              </div>
                              <div className="zx-row -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[12.82px] justify-center leading-[0] left-[177.96px] not-italic right-[12.48px] text-[#1b1a17] text-[10.8px] top-[118.74px] tracking-[-0.1274px]" data-node-id="684:2353">
                                <p className="leading-[16.131px]">NIFTY · Cash</p>
                              </div>
                              <div className="absolute border border-[#deddd8] border-dashed bottom-[9.76px] h-[38.88px] left-[9.75px] right-[130.54px] rounded-[8px]" data-node-id="684:2354" data-name="Button">
                                <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[13.65px] justify-center leading-[0] left-[calc(50%+0.17px)] not-italic text-[#4a4a44] text-[11.6px] text-center top-[calc(50%-0.21px)] w-[89.257px]" data-node-id="684:2355">
                                  <p className="leading-[normal]">+ Strategy Entry</p>
                                </div>
                              </div>
                              <div className="absolute border border-[#deddd8] border-dashed bottom-[9.76px] h-[38.88px] left-[130.53px] right-[9.76px] rounded-[8px]" data-node-id="684:2356" data-name="Button">
                                <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[13.65px] justify-center leading-[0] left-[calc(50%+0.15px)] not-italic text-[#4a4a44] text-[11.6px] text-center top-[calc(50%-0.21px)] w-[34.694px]" data-node-id="684:2357">
                                  <p className="leading-[normal]">+ Risk</p>
                                </div>
                              </div>
                            </div>
                            <div className="zx-leg -translate-x-1/2 -translate-y-1/2 absolute bg-white border border-[#deddd8] border-solid h-[94.1px] left-[calc(50%-11.15px)] overflow-clip rounded-[10px] shadow-[0px_1px_2px_0px_rgba(20,20,25,0.06)] top-[calc(50%+129.26px)] w-[196.89px]" data-node-id="684:2358" data-name="Background+Border+Shadow">
                              <div className="absolute border border-[#deddd8] border-dashed bottom-[9.85px] h-[35.11px] left-[9.85px] right-[9.87px] rounded-[10px]" data-node-id="684:2359" data-name="Button">
                                <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[13.03px] justify-center leading-[0] left-[calc(50%+0.19px)] not-italic text-[#4a4a44] text-[10.9px] text-center top-[calc(50%-0.19px)] w-[29.405px]" data-node-id="684:2360">
                                  <p className="leading-[normal]">+ Exit</p>
                                </div>
                              </div>
                              <div className="absolute bg-[#ece9fa] h-[27.51px] left-[9.85px] right-[157.53px] rounded-[10px] top-[9.13px]" data-node-id="684:2361" data-name="Background">
                                <div className="absolute left-[6.52px] size-[14.48px] top-[6.52px]" data-node-id="684:2362" data-name="SVG">
                                  <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg13.svg" />
                                </div>
                              </div>
                              <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[17.37px] justify-center leading-[0] left-[45.32px] not-italic right-[112.53px] text-[#1b1a17] text-[14.5px] top-[22.71px] tracking-[-0.2172px]" data-node-id="684:2365">
                                <p className="leading-[normal]">Leg 1</p>
                              </div>
                            </div>
                            <div className="zx-junction -translate-x-1/2 -translate-y-1/2 absolute h-[389.842px] left-[calc(50%+0.01px)] top-1/2 w-[320.56px]" data-node-id="684:2366" data-name="SVG">
                              <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg14.svg" />
                            </div>
                            <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[155.11px] left-[calc(50%-5.16px)] top-[calc(50%-117.36px)] w-[310.22px]" data-node-id="684:2368" data-name="SVG" />
                            <div className="zx-ghost absolute h-[94.1px] left-[353.34px] top-[344.96px] w-[196.47px] rounded-[10px] border border-dashed border-[#deddd8] bg-[#f8f8f6]">
                              <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold justify-center leading-[0] left-1/2 text-[#7c7c74] text-[13px] top-1/2 tracking-[-0.154px] whitespace-nowrap">
                                <p className="leading-[normal]">+ Add Leg</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="absolute inset-[0_0_0_573px]" data-node-id="684:2369" style={{ backgroundImage: "linear-gradient(90deg, rgb(248, 248, 246) 0%, rgba(248, 248, 246, 0) 5.0526%), linear-gradient(270deg, rgb(248, 248, 246) 0%, rgba(248, 248, 246, 0) 5.0526%), linear-gradient(180deg, rgb(248, 248, 246) 0%, rgba(248, 248, 246, 0) 3.8059%)" }} data-name="Gradient" />
                        <div className="overflow-clip absolute bg-[#f8f8f6] border-[#ecebe7] border-solid border-t inset-[494px_0_0_573px]" data-node-id="684:2370" data-name="Background+HorizontalBorder">
                          <div className="zx-eyebrow zx-eyebrow--a -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[13px] justify-center leading-[0] left-[14px] not-italic text-[#7c7c74] text-[11px] top-[15px] tracking-[-0.154px] w-[298.526px]" data-node-id="684:2371">
                            <p className="leading-[16.5px]">The strategy card mirrors this form live · click it any time to edit</p>
                          </div>
                          <div className="zx-caption--wrap zx-eyebrow zx-eyebrow--b -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[13px] justify-center leading-[0] left-[14px] not-italic text-[#7c7c74] text-[11px] top-[15px] tracking-[-0.154px] w-[298.526px]" data-name="Canvas caption · step 5">
                            <p className="leading-[13px]">Click a block to edit on the left · + Entry branches left, + Exit branches right · + Add leg for more legs</p>
                          </div>
                        </div>
                        <div className="absolute bg-white border border-[#ecebe7] border-solid drop-shadow-[0px_2px_4px_rgba(20,20,25,0.08)] inset-[12px_429px_481.5px_587px] rounded-[999px]" data-node-id="684:2372" data-name="Button - Hide canvas (switch to Edit view)">
                          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[15px] top-1/2" data-node-id="684:2373" data-name="SVG">
                            <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg15.svg" />
                          </div>
                          <div className="absolute bg-[#1b1a17] drop-shadow-[0px_4px_6px_rgba(20,20,25,0.16)] h-[23.5px] left-0 opacity-0 rounded-[6px] top-[35px] w-[82.18px]" data-node-id="684:2377" data-name="Background+Shadow">
                            <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[13px] justify-center leading-[0] left-[calc(50%+0.2px)] not-italic text-[11px] text-center text-white top-[11.5px] w-[64.577px]" data-node-id="684:2378">
                              <p className="leading-[normal]">Hide canvas</p>
                            </div>
                          </div>
                        </div>
                        <div className="absolute bg-white border border-[#ecebe7] border-solid drop-shadow-[0px_2px_4px_rgba(20,20,25,0.08)] inset-[12px_14px_477.5px_891px] rounded-[999px]" data-node-id="684:2379" data-name="Top-right control cluster: the Auto-arrange button sits directly beside the zoom → Group - Canvas zoom">
                          <div className="-translate-y-1/2 absolute left-[9.5px] size-[15px] top-1/2" data-node-id="684:2380" data-name="Button - Zoom out → SVG">
                            <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/button-zoom-out-svg.svg" />
                          </div>
                          <div className="zx-zoom zx-zoom--a -translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[13.5px] justify-center leading-[0] left-[52.19px] not-italic text-[#7c7c74] text-[11.5px] text-center top-[calc(50%-0.25px)] tracking-[-0.154px] w-[30.452px]" data-node-id="684:2384">
                            <p className="leading-[normal]">103%</p>
                          </div>
                          <div className="zx-zoom zx-zoom--b -translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[13.5px] justify-center leading-[0] left-[52.19px] not-italic text-[#7c7c74] text-[11.5px] text-center top-[calc(50%-0.25px)] tracking-[-0.154px] w-[30.452px]" data-name="Canvas zoom · re-fit">
                            <p className="leading-[normal]">87%</p>
                          </div>
                          <div className="-translate-y-1/2 absolute left-[79.5px] size-[15px] top-1/2" data-node-id="684:2385" data-name="Button - Zoom in → SVG">
                            <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/button-zoom-in-svg.svg" />
                          </div>
                          <div className="-translate-y-1/2 absolute bg-[#ecebe7] h-[16px] left-[105px] top-1/2 w-px" data-node-id="684:2390" data-name="Vertical Divider" />
                          <div className="-translate-y-1/2 absolute left-[116.5px] size-[15px] top-1/2" data-node-id="684:2391" data-name="Button - Fit graph to screen → SVG">
                            <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/button-fit-graph-to-screen-svg.svg" />
                          </div>
                        </div>
                        <div className="absolute inset-[0_0_0_573px] opacity-0 rounded-br-[15px] rounded-tr-[15px]" data-node-id="684:2396" data-name="Zenbot has taken over the canvas' aura — an Apple-Intelligence-style animated">
                          <div className="absolute blur-[5.5px] inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-size-[100%_100%] opacity-42 rounded-br-[15px] rounded-tr-[15px]" data-node-id="684:2399" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 475 525.5' preserveAspectRatio='none'><g transform='matrix(-11.875 20.568 -20.568 -11.875 237.5 262.75)'><foreignObject x='-269.64' y='-269.64' width='539.29' height='539.29'><div xmlns='http://www.w3.org/1999/xhtml' style='background-image: conic-gradient(from 90deg, rgba(236, 94, 26, 0.34) 0%, rgba(246, 145, 67, 0.41) 12.5%, rgba(255, 196, 107, 0.48) 25%, rgba(246, 145, 67, 0.41) 37.5%, rgba(236, 94, 26, 0.34) 50%, rgba(246, 154, 83, 0.39) 62.5%, rgba(255, 214, 140, 0.44) 75%, rgba(246, 154, 83, 0.39) 87.5%, rgba(236, 94, 26, 0.34) 100%); opacity:1; height: 100%; width: 100%;'></div></foreignObject></g></svg>\")", maskImage: `url("$"/case/zenxo/builder/gradient-blur.svg"")` }} data-name="Gradient+Blur" />
                          <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-size-[100%_100%] rounded-br-[15px] rounded-tr-[15px]" data-node-id="684:2402" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 475 525.5' preserveAspectRatio='none'><g transform='matrix(0 -23.75 23.75 0 237.5 262.75)'><foreignObject x='-210.2' y='-210.2' width='420.4' height='420.4'><div xmlns='http://www.w3.org/1999/xhtml' style='background-image: conic-gradient(from 90deg, rgba(236, 94, 26, 0) 0%, rgb(236, 94, 26) 5%, rgb(241, 124, 58) 6.5%, rgb(246, 155, 90) 8%, rgb(250, 185, 122) 9.5%, rgb(255, 215, 154) 11%, rgb(250, 185, 122) 12.5%, rgb(246, 155, 90) 14%, rgb(241, 124, 58) 15.5%, rgb(236, 94, 26) 17%, rgba(236, 94, 26, 0) 27%, rgba(236, 94, 26, 0) 50%, rgb(236, 94, 26) 55%, rgb(241, 124, 58) 56.5%, rgb(246, 155, 90) 58%, rgb(250, 185, 122) 59.5%, rgb(255, 215, 154) 61%, rgb(250, 185, 122) 62.5%, rgb(246, 155, 90) 64%, rgb(241, 124, 58) 65.5%, rgb(236, 94, 26) 67%, rgba(236, 94, 26, 0) 77%, rgba(236, 94, 26, 0) 100%); opacity:1; height: 100%; width: 100%;'></div></foreignObject></g></svg>\")", maskImage: `url("$"/case/zenxo/builder/gradient.svg"")` }} data-name="Gradient" />
                        </div>
                        <div className="absolute h-[28px] left-0 top-[497.5px] w-[573px]" data-node-id="684:2403" data-name="Mask Group">
                          <div className="absolute backdrop-blur-[2.5px] bg-gradient-to-t from-[rgba(255,255,255,0.5)] h-[28px] left-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-size-[573px_28px] to-[rgba(255,255,255,0)] top-0 w-[573px]" data-node-id="684:2405" style={{ maskImage: `url("$"/case/zenxo/builder/gradient-overlay-blur.svg"")` }} data-name="Gradient+OverlayBlur" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bg-white border-[#ecebe7] border-solid border-t h-[69.5px] left-0 right-0 top-[603.5px]" data-node-id="684:2406" data-name="ACTION BAR">
                    <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#f8f8f6] border border-[#ecebe7] border-solid h-[40px] left-[calc(50%-150.14px)] rounded-[12px] top-1/2 w-[128px]" data-node-id="684:2407" data-name="Label">
                      <div className="-translate-y-1/2 absolute left-[12px] size-[13px] top-1/2" data-node-id="684:2408" data-name="SVG">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg16.svg" />
                      </div>
                      <div className="-translate-y-1/2 [word-break:break-word] absolute font-[family-name:var(--zx-sans)] font-normal h-[20px] leading-[0] left-[32px] not-italic overflow-clip text-[#4a4a44] text-[12px] top-1/2 w-[82px]" data-node-id="684:2411" data-name="Input">
                        <div className="-translate-y-1/2 absolute flex flex-col h-[14px] justify-center left-px top-[10px] w-[13.704px]" data-node-id="684:2412">
                          <p className="leading-[18px]">11</p>
                        </div>
                        <div className="-translate-y-1/2 absolute flex flex-col h-[14px] justify-center left-[15.35px] top-[10px] w-[4.35px]" data-node-id="684:2413">
                          <p className="leading-[18px]">/</p>
                        </div>
                        <div className="-translate-y-1/2 absolute flex flex-col h-[14px] justify-center left-[20.35px] top-[10px] w-[13.704px]" data-node-id="684:2414">
                          <p className="leading-[18px]">11</p>
                        </div>
                        <div className="-translate-y-1/2 absolute flex flex-col h-[14px] justify-center left-[34.7px] top-[10px] w-[4.35px]" data-node-id="684:2415">
                          <p className="leading-[18px]">/</p>
                        </div>
                        <div className="-translate-y-1/2 absolute flex flex-col h-[14px] justify-center left-[39.7px] top-[10px] w-[27.061px]" data-node-id="684:2416">
                          <p className="leading-[18px]">2025</p>
                        </div>
                      </div>
                    </div>
                    <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#f8f8f6] border border-[#ecebe7] border-solid h-[40px] left-[calc(50%-14.14px)] rounded-[12px] top-1/2 w-[128px]" data-node-id="684:2417" data-name="Label">
                      <div className="-translate-y-1/2 absolute left-[12px] size-[13px] top-1/2" data-node-id="684:2418" data-name="SVG">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg16.svg" />
                      </div>
                      <div className="-translate-y-1/2 [word-break:break-word] absolute font-[family-name:var(--zx-sans)] font-normal h-[20px] leading-[0] left-[32px] not-italic overflow-clip text-[#4a4a44] text-[12px] top-1/2 w-[82px]" data-node-id="684:2421" data-name="Input">
                        <div className="-translate-y-1/2 absolute flex flex-col h-[14px] justify-center left-px top-[10px] w-[13.704px]" data-node-id="684:2422">
                          <p className="leading-[18px]">15</p>
                        </div>
                        <div className="-translate-y-1/2 absolute flex flex-col h-[14px] justify-center left-[15.35px] top-[10px] w-[4.35px]" data-node-id="684:2423">
                          <p className="leading-[18px]">/</p>
                        </div>
                        <div className="-translate-y-1/2 absolute flex flex-col h-[14px] justify-center left-[20.35px] top-[10px] w-[13.704px]" data-node-id="684:2424">
                          <p className="leading-[18px]">06</p>
                        </div>
                        <div className="-translate-y-1/2 absolute flex flex-col h-[14px] justify-center left-[34.7px] top-[10px] w-[4.35px]" data-node-id="684:2425">
                          <p className="leading-[18px]">/</p>
                        </div>
                        <div className="-translate-y-1/2 absolute flex flex-col h-[14px] justify-center left-[39.7px] top-[10px] w-[27.061px]" data-node-id="684:2426">
                          <p className="leading-[18px]">2026</p>
                        </div>
                      </div>
                    </div>
                    <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-white border border-[#ecebe7] border-solid h-[36px] left-[calc(50%-267.03px)] rounded-[12px] top-1/2 w-[89.77px]" data-node-id="684:2427" data-name="Button listbox">
                      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[15.5px] justify-center leading-[0] left-[12px] not-italic text-[#1b1a17] text-[13px] top-[calc(50%-0.25px)] w-[46.11px]" data-node-id="684:2428">
                        <p className="leading-[normal]">Custom</p>
                      </div>
                      <div className="-translate-y-1/2 absolute left-[63.77px] size-[12px] top-1/2" data-node-id="684:2429" data-name="SVG">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg8.svg" />
                      </div>
                    </div>
                    <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-white border border-[#deddd8] border-solid h-[40.5px] left-[calc(50%+107.5px)] rounded-[12px] top-1/2 w-[91.28px]" data-node-id="684:2431" data-name="Button">
                      <div className="-translate-y-1/2 absolute left-[18px] size-[14px] top-1/2" data-node-id="684:2432" data-name="SVG">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg17.svg" />
                      </div>
                      <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[16px] justify-center leading-[0] left-[calc(50%+11.19px)] not-italic text-[#1b1a17] text-[13.5px] text-center top-[calc(50%-0.25px)] w-[31.669px]" data-node-id="684:2435">
                        <p className="leading-[normal]">Save</p>
                      </div>
                    </div>
                    <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#ec5e1a] border border-[rgba(0,0,0,0)] border-solid h-[40.5px] left-[calc(50%+238.53px)] rounded-[12px] top-1/2 w-[146.77px]" data-node-id="684:2436" data-name="Button">
                      <div className="-translate-y-1/2 absolute left-[18px] size-[14px] top-1/2" data-node-id="684:2437" data-name="SVG">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg18.svg" />
                      </div>
                      <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[16px] justify-center leading-[0] left-[calc(50%+11.17px)] not-italic text-[13.5px] text-center text-white top-[calc(50%-0.25px)] w-[87.104px]" data-node-id="684:2439">
                        <p className="leading-[normal]">Run Backtest</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute h-[729px] inset-0 pointer-events-none" data-node-id="684:2440">
                <div className="h-[56px] pointer-events-auto sticky top-0" data-name="Container">
                  <div className="absolute bg-[#fdfdfc] border-[#edece8] border-b border-solid h-[56px] left-0 right-0 top-0" data-node-id="684:2441" data-name="Header">
                    <div className="-translate-y-1/2 absolute left-[30px] size-[16px] top-1/2" data-node-id="684:2442" data-name="Button → SVG">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/button-svg.svg" />
                    </div>
                    <div className="-translate-y-1/2 absolute bg-[#ecebe7] h-[16px] left-[64px] top-1/2 w-px" data-node-id="684:2445" data-name="Vertical Divider" />
                    <div className="-translate-y-1/2 absolute h-[20px] left-[85px] top-1/2 w-[121.05px]" data-node-id="684:2446" data-name="Nav - breadcrumb → Ordered List → Item → Link">
                      <div className="-translate-y-1/2 absolute left-0 size-[14px] top-1/2" data-node-id="684:2447" data-name="SVG">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg19.svg" />
                      </div>
                      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[16.5px] justify-center leading-[0] left-[22px] not-italic text-[#7c7c74] text-[14px] top-[calc(50%-0.25px)] tracking-[-0.096px] w-[99.403px]" data-node-id="684:2451">
                        <p className="leading-[20px]">Strategy Builder</p>
                      </div>
                    </div>
                    <div className="[word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold inset-[14.75px_1042.33px_14.75px_251.69px] justify-center leading-[0] not-italic text-[#1b1a17] text-[17px] tracking-[-0.51px]" data-node-id="684:2452">
                      <p className="leading-[25.5px]">My_Strategy</p>
                    </div>
                    <div className="absolute inset-[12.5px_746.49px_12.5px_359.17px] overflow-clip" data-node-id="684:2453" data-name="Container">
                      <div className="-translate-y-1/2 absolute bg-white border border-[#ecebe7] border-solid h-[30px] left-0 rounded-[9999px] top-1/2 w-[74.02px]" data-node-id="684:2454" data-name="Background+Border">
                        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[14px] justify-center leading-[0] left-[12px] not-italic text-[#4a4a44] text-[12px] top-[14px] tracking-[-0.096px] w-[48.367px]" data-node-id="684:2455">
                          <p className="leading-[16px]">Unsaved</p>
                        </div>
                      </div>
                      <div className="-translate-y-1/2 absolute bg-white border border-[#ecebe7] border-solid h-[30px] left-[82.01px] rounded-[9999px] top-1/2 w-[59.53px]" data-node-id="684:2456" data-name="Background+Border">
                        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[14px] justify-center leading-[0] left-[12px] not-italic text-[#4a4a44] text-[12px] top-[14px] tracking-[-0.096px] w-[33.832px]" data-node-id="684:2457">
                          <p className="leading-[16px]">NIFTY</p>
                        </div>
                      </div>
                      <div className="-translate-y-1/2 absolute bg-white border border-[#ecebe7] border-solid h-[30px] left-[149.55px] rounded-[9999px] top-1/2 w-[70.59px]" data-node-id="684:2458" data-name="Background+Border">
                        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[14px] justify-center leading-[0] left-[12px] not-italic text-[#4a4a44] text-[12px] top-[14px] tracking-[-0.096px] w-[44.926px]" data-node-id="684:2459">
                          <p className="leading-[16px]">Intraday</p>
                        </div>
                      </div>
                      <div className="-translate-y-1/2 absolute bg-white border border-[#ecebe7] border-solid h-[30px] left-[228.13px] rounded-[9999px] top-1/2 w-[56.21px]" data-node-id="684:2460" data-name="Background+Border">
                        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[14px] justify-center leading-[0] left-[12px] not-italic text-[#4a4a44] text-[12px] top-[14px] tracking-[-0.096px] w-[30.593px]" data-node-id="684:2461">
                          <p className="leading-[16px]">1 Leg</p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bg-[#f5f5f3] border border-[#ecebe7] border-solid inset-[10.5px_512.67px_10.5px_659.51px] rounded-[9999px]" data-node-id="684:2464" data-name="Tablist - Builder view">
                      <div className="-translate-y-1/2 absolute bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] h-[28px] left-[2px] rounded-[9999px] top-1/2 w-[87.43px]" data-node-id="684:2465" data-name="Tab">
                        <div className="-translate-y-1/2 absolute left-[14px] size-[13px] top-1/2" data-node-id="684:2466" data-name="SVG">
                          <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg20.svg" />
                        </div>
                        <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[14px] justify-center leading-[0] left-[calc(50%+9.66px)] not-italic text-[#1b1a17] text-[12px] text-center top-1/2 tracking-[-0.096px] w-[40.753px]" data-node-id="684:2476">
                          <p className="leading-[16px]">Default</p>
                        </div>
                      </div>
                      <div className="-translate-y-1/2 absolute h-[28px] left-[91.43px] rounded-[9999px] top-1/2 w-[122.39px]" data-node-id="684:2477" data-name="Tab">
                        <div className="-translate-y-1/2 absolute left-[14px] size-[13px] top-1/2" data-node-id="684:2478" data-name="SVG">
                          <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg21.svg" />
                        </div>
                        <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[14px] justify-center leading-[0] left-[calc(50%+9.66px)] not-italic text-[#8c7a55] text-[12px] text-center top-1/2 tracking-[-0.096px] w-[75.706px]" data-node-id="684:2482">
                          <p className="leading-[16px]">Block Builder</p>
                        </div>
                        <div className="absolute bg-[#ff6f20] h-[12px] right-[-6px] rounded-[9999px] top-[-6px] w-[27.27px]" data-node-id="684:2483" data-name="Background">
                          <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[9999px] shadow-[0px_0px_0px_2px_white,0px_1px_2px_0px_rgba(0,0,0,0.05)]" data-node-id="684:2484" data-name="Overlay+Shadow" />
                          <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[9.5px] justify-center leading-[0] left-[calc(50%+0.16px)] not-italic text-[8px] text-center text-white top-[5.75px] tracking-[0.2px] uppercase w-[19.584px]" data-node-id="684:2485">
                            <p className="leading-[8px]">New</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="-translate-y-1/2 absolute h-[36px] left-[922.97px] top-1/2 w-[443.03px]" data-node-id="684:2486" data-name="Container">
                      <div className="-translate-y-1/2 absolute left-[144.16px] size-[20px] top-1/2" data-node-id="684:2487" data-name="Button - Toggle theme → SVG">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/button-toggle-theme-svg.svg" />
                      </div>
                      <div className="-translate-y-1/2 absolute bg-[#ecebe7] h-[16px] left-[180.16px] top-1/2 w-px" data-node-id="684:2489" data-name="Vertical Divider" />
                      <div className="-translate-y-1/2 absolute bg-white h-[32px] left-0 rounded-[8px] top-1/2 w-[84.16px]" data-node-id="684:2490" data-name="Button">
                        <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-size-[100%_100%] rounded-[8px]" data-node-id="684:2493" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 84.16 32' preserveAspectRatio='none'><g transform='matrix(0 -4.208 4.208 0 42.08 16)'><foreignObject x='-190' y='-190' width='380' height='380'><div xmlns='http://www.w3.org/1999/xhtml' style='background-image: conic-gradient(from 90deg, rgb(232, 114, 46) 0%, rgb(239, 150, 53) 12.5%, rgb(246, 185, 59) 25%, rgb(251, 201, 110) 37.5%, rgb(255, 217, 160) 50%, rgb(251, 201, 110) 62.5%, rgb(246, 185, 59) 75%, rgb(239, 150, 53) 87.5%, rgb(232, 114, 46) 100%); opacity:1; height: 100%; width: 100%;'></div></foreignObject></g></svg>\")", maskImage: `url("$"/case/zenxo/builder/gradient1.svg"")` }} data-name="Gradient" />
                        <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-public)] font-semibold font-semibold h-[20px] justify-center leading-[0] left-[42.27px] text-[#171717] text-[14px] text-center top-1/2 tracking-[-0.096px] w-[56.532px]" data-node-id="684:2494">
                          <p className="leading-[20px]">Upgrade</p>
                        </div>
                      </div>
                      <div className="-translate-y-1/2 absolute left-[92.16px] rounded-[12px] size-[36px] top-1/2" data-node-id="684:2495" data-name="Button dialog - Notifications, 3 unread">
                        <div className="absolute left-[8px] size-[20px] top-[8px]" data-node-id="684:2496" data-name="SVG">
                          <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg22.svg" />
                        </div>
                        <div className="absolute bg-[#ec5e1a] right-[-4px] rounded-[9999px] size-[18px] top-[-4px]" data-node-id="684:2499" data-name="Background">
                          <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-public)] font-medium font-medium h-[12px] justify-center leading-[0] left-[calc(50%+0.18px)] text-[12px] text-center text-white top-1/2 tracking-[-0.096px] w-[7.955px]" data-node-id="684:2500">
                            <p className="leading-[12px]">3</p>
                          </div>
                        </div>
                      </div>
                      <div className="-translate-y-1/2 absolute h-[32px] left-[189.16px] overflow-clip right-[-0.01px] rounded-[8px] top-1/2" data-node-id="684:2501" data-name="List → Item → Button menu">
                        <div className="-translate-y-1/2 absolute h-[20px] left-[40px] overflow-clip top-1/2 w-[181.88px]" data-node-id="684:2502" data-name="Container">
                          <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[16.5px] justify-center leading-[0] left-0 not-italic text-[#1b1a17] text-[14px] top-[9.75px] tracking-[-0.096px] w-[182.221px]" data-node-id="684:2503">
                            <p className="leading-[20px]">trader@zenxo.ai</p>
                          </div>
                        </div>
                        <div className="-translate-y-1/2 absolute right-[8.01px] size-[16px] top-1/2" data-node-id="684:2504" data-name="SVG">
                          <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg23.svg" />
                        </div>
                        <div className="-translate-y-1/2 absolute left-[8px] overflow-clip rounded-[8px] size-[24px] top-1/2" data-node-id="684:2507" data-name="Container">
                          <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <img alt="" className="absolute left-0 max-w-none size-full top-0" src="/case/zenxo/builder/container.png" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute h-[745px] left-0 top-0 w-[66px]" data-node-id="684:2509" data-name="Container">
            <div className="absolute bg-[#fdfdfc] inset-[8px]" data-node-id="684:2510" data-name="Background">
              <div className="absolute h-[32px] left-[8px] overflow-clip right-[10px] rounded-[8px] top-[12px]" data-node-id="684:2511" data-name="Link">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[50px] left-1/2 top-1/2 w-[32px]" data-node-id="684:2512" data-name="image">
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <img alt="" className="absolute h-[64%] left-0 max-w-none top-[18%] w-full" src="/case/zenxo/builder/image.png" />
                  </div>
                </div>
              </div>
              <div className="absolute inset-[56px_0_92px_0] overflow-clip" data-node-id="684:2513" data-name="Container">
                <div className="absolute h-[32px] left-[8px] overflow-clip right-[10px] rounded-[8px] top-[8px]" data-node-id="684:2514" data-name="List → Item → Link">
                  <div className="-translate-y-1/2 absolute left-[8px] size-[16px] top-1/2" data-node-id="684:2515" data-name="SVG">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg24.svg" />
                  </div>
                </div>
                <div className="absolute h-[32px] left-[8px] overflow-clip right-[10px] rounded-[8px] top-[52px]" data-node-id="684:2518" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(2.56 0 0 1.76 16 0)'><stop stop-color='rgba(255,255,255,0.45)' offset='0'/><stop stop-color='rgba(255,255,255,0)' offset='0.65'/></radialGradient></defs></svg>\"), linear-gradient(90deg, rgb(236, 94, 26) 0%, rgb(236, 94, 26) 100%)" }} data-name="List → Item → Button">
                  <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[15px] top-1/2" data-node-id="684:2519" data-name="SVG">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg25.svg" />
                  </div>
                </div>
                <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[14px] justify-center leading-[0] left-[16px] not-italic opacity-0 right-[-5.1px] text-[12px] text-[rgba(28,27,23,0.7)] top-[88px] tracking-[-0.096px]" data-node-id="684:2522">
                  <p className="leading-[16px]">Trading</p>
                </div>
                <div className="absolute h-[68px] left-[8px] right-[8px] top-[104px]" data-node-id="684:2523" data-name="List">
                  <div className="absolute bg-[#e8e7e3] h-[32px] left-0 overflow-clip right-[2px] rounded-[8px] top-0" data-node-id="684:2524" data-name="Item → Link">
                    <div className="-translate-y-1/2 absolute left-[8px] size-[16px] top-1/2" data-node-id="684:2525" data-name="SVG">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg26.svg" />
                    </div>
                  </div>
                  <div className="absolute h-[32px] left-0 overflow-clip right-[2px] rounded-[8px] top-[36px]" data-node-id="684:2529" data-name="Item → Link">
                    <div className="-translate-y-1/2 absolute left-[8px] size-[16px] top-1/2" data-node-id="684:2530" data-name="SVG">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg27.svg" />
                    </div>
                  </div>
                </div>
                <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[14px] justify-center leading-[0] left-[16px] not-italic opacity-0 right-[-10.21px] text-[12px] text-[rgba(28,27,23,0.7)] top-[180px] tracking-[-0.096px]" data-node-id="684:2534">
                  <p className="leading-[16px]">Account</p>
                </div>
                <div className="absolute h-[68px] left-[8px] right-[8px] top-[196px]" data-node-id="684:2535" data-name="List">
                  <div className="absolute h-[32px] left-0 overflow-clip right-[2px] rounded-[8px] top-0" data-node-id="684:2536" data-name="Item → Link">
                    <div className="-translate-y-1/2 absolute left-[8px] size-[16px] top-1/2" data-node-id="684:2537" data-name="SVG">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg28.svg" />
                    </div>
                  </div>
                  <div className="absolute h-[32px] left-0 overflow-clip right-[2px] rounded-[8px] top-[36px]" data-node-id="684:2540" data-name="Item → Link">
                    <div className="-translate-y-1/2 absolute left-[8px] size-[16px] top-1/2" data-node-id="684:2541" data-name="SVG">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/svg29.svg" />
                    </div>
                  </div>
                </div>
                <div className="absolute border border-[#d6cdb8] border-solid h-[112px] left-[8px] opacity-0 overflow-clip right-[8px] rounded-[12px] top-[284px]" data-node-id="684:2544" data-name="Border">
                  <div className="absolute bottom-[-20px] h-[70px] opacity-90 right-0 w-[32px]" data-node-id="684:2545" data-name="news-sidebar.a04934bbc4102e491dd8.png">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <img alt="" className="absolute h-full left-[-62.18%] max-w-none top-0 w-[224.36%]" src="/case/zenxo/builder/news-sidebar-a04934-bbc4102-e491-dd8-png.png" />
                    </div>
                  </div>
                  <div className="absolute bg-gradient-to-r from-[#fdfdfc] inset-0 to-[rgba(253,253,252,0)] via-1/2 via-[rgba(253,253,252,0.8)]" data-node-id="684:2546" data-name="Gradient" />
                  <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--font-jetbrains-mono)] font-normal font-normal h-[15px] justify-center leading-[0] left-[16px] right-[-2.31px] text-[#7c7c74] text-[10px] top-[19.5px]" data-node-id="684:2547">
                    <p className="leading-[15px]">NEW</p>
                  </div>
                  <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[16px] justify-center leading-[0] left-[16px] not-italic right-[-96.8px] text-[#1c1b17] text-[12px] top-[39px] tracking-[-0.096px]" data-node-id="684:2548">
                    <p className="leading-[16px]">AI Strategy Optimizer</p>
                  </div>
                  <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[15px] justify-center leading-[0] left-[16px] not-italic right-[-128.61px] text-[#7c7c74] text-[10px] top-[58.5px] tracking-[-0.096px]" data-node-id="684:2549">
                    <p className="leading-[15px]">Auto-tune your backtest params.</p>
                  </div>
                  <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[14px] justify-center leading-[0] left-[16px] not-italic right-[-70.13px] text-[#1c1b17] text-[12px] text-center top-[86px] tracking-[-0.096px]" data-node-id="684:2550">
                    <p className="leading-[16px]">{`See what's new`}</p>
                  </div>
                  <div className="absolute right-[12px] size-[16px] top-[12px]" data-node-id="684:2551" data-name="Button → SVG">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/button-svg1.svg" />
                  </div>
                </div>
              </div>
              <div className="absolute h-[18px] left-[16px] overflow-clip right-[16px] top-[656px]" data-node-id="684:2554" data-name="Button - Support → SVG">
                <div className="absolute inset-[8.33%]" data-node-id="684:2555" data-name="Vector">
                  <div className="absolute inset-[-5%]">
                    <img alt="" className="block max-w-none size-full" src="/case/zenxo/builder/vector.svg" />
                  </div>
                </div>
                <div className="absolute inset-[20.54%_61.79%_61.79%_20.54%]" data-node-id="684:2556" data-name="Vector">
                  <div className="absolute inset-[-23.58%]">
                    <img alt="" className="block max-w-none size-full" src="/case/zenxo/builder/vector1.svg" />
                  </div>
                </div>
                <div className="absolute inset-[20.54%_20.54%_61.79%_61.79%]" data-node-id="684:2557" data-name="Vector">
                  <div className="absolute inset-[-23.58%]">
                    <img alt="" className="block max-w-none size-full" src="/case/zenxo/builder/vector2.svg" />
                  </div>
                </div>
                <div className="absolute inset-[61.79%_20.54%_20.54%_61.79%]" data-node-id="684:2558" data-name="Vector">
                  <div className="absolute inset-[-23.58%]">
                    <img alt="" className="block max-w-none size-full" src="/case/zenxo/builder/vector3.svg" />
                  </div>
                </div>
                <div className="absolute inset-[61.79%_61.79%_20.54%_20.54%]" data-node-id="684:2559" data-name="Vector">
                  <div className="absolute inset-[-23.58%]">
                    <img alt="" className="block max-w-none size-full" src="/case/zenxo/builder/vector4.svg" />
                  </div>
                </div>
                <div className="absolute inset-[33.33%]" data-node-id="684:2560" data-name="Vector">
                  <div className="absolute inset-[-12.5%]">
                    <img alt="" className="block max-w-none size-full" src="/case/zenxo/builder/vector5.svg" />
                  </div>
                </div>
              </div>
              <div className="absolute h-[18px] left-[16px] overflow-clip right-[16px] top-[692px]" data-node-id="684:2561" data-name="Link - User Manual → SVG">
                <div className="absolute bottom-[12.5%] left-[8.33%] right-1/2 top-[12.5%]" data-node-id="684:2562" data-name="Vector">
                  <div className="absolute inset-[-5.56%_-10%]">
                    <img alt="" className="block max-w-none size-full" src="/case/zenxo/builder/vector6.svg" />
                  </div>
                </div>
                <div className="absolute bottom-[12.5%] left-1/2 right-[8.33%] top-[12.5%]" data-node-id="684:2563" data-name="Vector">
                  <div className="absolute inset-[-5.56%_-10%]">
                    <img alt="" className="block max-w-none size-full" src="/case/zenxo/builder/vector7.svg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="zx-cursor absolute left-0 top-0 z-50 h-[22px] w-[17px]" aria-hidden>
          <span className="zx-click absolute left-[-15px] top-[-15px] h-[30px] w-[30px] rounded-full bg-[#ec5e1a]" />
          <svg viewBox="0 0 17 22" className="absolute inset-0 h-full w-full overflow-visible">
            <path
              d="M1.2 1.1 L1.2 17.4 L5.5 13.4 L8.3 20.6 L11.4 19.3 L8.6 12.3 L14.1 12.1 Z"
              fill="#1b1a17"
              stroke="#ffffff"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        </div>
      </div>
    </div>
  );
}
