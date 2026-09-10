/* eslint-disable @next/next/no-img-element -- see the note in ZenxoBoard.tsx */

/**
 * Step 5 of the builder - the leg editor - captured off the running app the
 * same way step 1 was, and transcribed with the same rules.
 *
 * It came from a wider browser window than step 1 (1633 vs 1470), which sounds
 * like a problem and is not: the app pins the step rail at 280 and this pane at
 * 573, and hands every spare pixel to the canvas. So the pane transplants into
 * the 1470 board at its literal coordinates with nothing re-solved.
 *
 * What the narrower board does change is how much of it you see. The capture is
 * 631.57 tall and the slot is 525.5, so the Add Entry and Add Exit cards fall
 * past the fold. That is the app's own behaviour - the pane is a scroller with
 * a gradient fade at its foot - so the crop is honest rather than a compromise.
 * Everything the figure needs (the leg header, lots/position/type, expiry, and
 * the strike slider ending at 489.95) clears the fold with 35px to spare.
 *
 * The two hover-only overlays in the capture were dropped: Figma exports them
 * at opacity-0, so they are markup that can never paint.
 */
export default function ZenxoStep5Pane() {
  return (
    <div
      className="absolute bg-white border-[#ecebe7] border-r-[0.556px] border-solid bottom-0 left-0 overflow-clip top-0 w-[573px]"
      data-node-id="689:2646"
      data-name="Aside - DOCKED EDITOR"
    >
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[12.78px] justify-center leading-[0] left-[22px] not-italic right-[519.1px] text-[#9a9a91] text-[11px] top-[87.82px] tracking-[0.66px] uppercase" data-node-id="689:2647">
        <p className="leading-[16.5px]">Lots</p>
      </div>
      <div className="absolute border border-[#deddd8] border-solid h-[13.99px] left-[58.95px] right-[499.49px] rounded-[999px] top-[81.01px]" data-node-id="689:2648" data-name="Border">
        <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-serif)] font-bold italic h-[11.11px] justify-center leading-[0] left-[calc(50%+0.17px)] text-[#c6c5bf] text-[9.5px] text-center top-[calc(50%-0.3px)] tracking-[0.66px] w-[4.497px]" data-node-id="689:2649">
          <p className="leading-[9.5px]">i</p>
        </div>
      </div>
      <div className="absolute bg-white border border-[#deddd8] border-solid h-[43.99px] left-[22px] overflow-clip right-[383.62px] rounded-[12px] top-[104.25px]" data-node-id="689:2650" data-name="Input">
        <div className="absolute h-[16.67px] left-[13.55px] overflow-auto right-[13.54px] top-[12.66px]" data-node-id="689:2651" data-name="Container">
          <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[16.11px] justify-center leading-[0] left-0 not-italic text-[#1b1a17] text-[14px] top-[8.06px] tracking-[-0.28px] w-[7.873px]" data-node-id="689:2652">
            <p className="leading-[normal]">1</p>
          </div>
        </div>
      </div>
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[12.78px] justify-center leading-[0] left-[202.81px] not-italic right-[312.23px] text-[#9a9a91] text-[11px] top-[88.62px] tracking-[0.66px] uppercase" data-node-id="689:2653">
        <p className="leading-[16.5px]">Position</p>
      </div>
      <div className="absolute border border-[#deddd8] border-solid h-[13.99px] left-[265.83px] right-[292.61px] rounded-[999px] top-[81.81px]" data-node-id="689:2654" data-name="Border">
        <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-serif)] font-bold italic h-[11.11px] justify-center leading-[0] left-[calc(50%+0.17px)] text-[#c6c5bf] text-[9.5px] text-center top-[calc(50%-0.3px)] tracking-[0.66px] w-[4.497px]" data-node-id="689:2655">
          <p className="leading-[9.5px]">i</p>
        </div>
      </div>
      <div className="absolute bg-[#f2f2ef] border border-[#ecebe7] border-solid h-[43.19px] left-[202.81px] right-[202.8px] rounded-[12px] top-[105.05px]" data-node-id="689:2656" data-name="Background+Border">
        <div className="absolute bg-[#fbe9e9] drop-shadow-[0px_1px_1px_rgba(20,20,25,0.04)] h-[34.1px] left-[3.55px] right-[83.41px] rounded-[9px] top-[3.55px]" data-node-id="689:2657" data-name="Button">
          <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[15.56px] justify-center leading-[0] left-[calc(50%+0.19px)] not-italic text-[#da3b3b] text-[13px] text-center top-[calc(50%-0.28px)] w-[32.675px]" data-node-id="689:2658">
            <p className="leading-[normal]">SELL</p>
          </div>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[15.56px] justify-center leading-[0] left-[108.61px] not-italic right-[28.38px] text-[#7c7c74] text-[13px] text-center top-[20.32px]" data-node-id="689:2659">
          <p className="leading-[normal]">BUY</p>
        </div>
      </div>
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[12.78px] justify-center leading-[0] left-[383.62px] not-italic right-[157.88px] text-[#9a9a91] text-[11px] top-[88.62px] tracking-[0.66px] uppercase" data-node-id="689:2660">
        <p className="leading-[16.5px]">Type</p>
      </div>
      <div className="absolute border border-[#deddd8] border-solid h-[13.99px] left-[420.17px] right-[138.27px] rounded-[999px] top-[81.81px]" data-node-id="689:2661" data-name="Border">
        <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-serif)] font-bold italic h-[11.11px] justify-center leading-[0] left-[calc(50%+0.17px)] text-[#c6c5bf] text-[9.5px] text-center top-[calc(50%-0.3px)] tracking-[0.66px] w-[4.497px]" data-node-id="689:2662">
          <p className="leading-[9.5px]">i</p>
        </div>
      </div>
      <div className="absolute bg-[#f2f2ef] border border-[#ecebe7] border-solid h-[43.19px] left-[383.62px] right-[22px] rounded-[12px] top-[105.05px]" data-node-id="689:2663" data-name="Background+Border">
        <div className="absolute bg-white drop-shadow-[0px_1px_1px_rgba(20,20,25,0.04)] h-[34.1px] left-[3.55px] right-[110.02px] rounded-[9px] top-[3.55px]" data-node-id="689:2664" data-name="Button">
          <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[15.56px] justify-center leading-[0] left-[calc(50%+0.15px)] not-italic text-[#1b1a17] text-[13px] text-center top-[calc(50%-0.28px)] w-[18.367px]" data-node-id="689:2665">
            <p className="leading-[normal]">CE</p>
          </div>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[15.56px] justify-center leading-[0] left-[73.86px] not-italic right-[73.55px] text-[#7c7c74] text-[13px] text-center top-[20.32px]" data-node-id="689:2666">
          <p className="leading-[normal]">PE</p>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[15.56px] justify-center leading-[0] left-[123px] not-italic right-[16.17px] text-[#7c7c74] text-[13px] text-center top-[20.32px]" data-node-id="689:2667">
          <p className="leading-[normal]">FUT</p>
        </div>
      </div>
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[12.78px] justify-center leading-[0] left-[22px] not-italic right-[507.24px] text-[#9a9a91] text-[11px] top-[174.29px] tracking-[0.66px] uppercase" data-node-id="689:2668">
        <p className="leading-[16.5px]">Expiry</p>
      </div>
      <div className="absolute border border-[#deddd8] border-solid h-[13.99px] left-[70.86px] right-[487.58px] rounded-[999px] top-[167.49px]" data-node-id="689:2669" data-name="Border">
        <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-serif)] font-bold italic h-[11.11px] justify-center leading-[0] left-[calc(50%+0.17px)] text-[#c6c5bf] text-[9.5px] text-center top-[calc(50%-0.31px)] tracking-[0.66px] w-[4.497px]" data-node-id="689:2670">
          <p className="leading-[9.5px]">i</p>
        </div>
      </div>
      <div className="absolute bg-white border border-[#deddd8] border-solid h-[43.99px] left-[22px] right-[293.21px] rounded-[12px] top-[190.73px]" data-node-id="689:2671" data-name="Button listbox">
        <div className="-translate-y-1/2 absolute bg-[#f2f2ef] left-[11.55px] rounded-[7px] size-[22px] top-[calc(50%-0.01px)]" data-node-id="689:2672" data-name="Background">
          <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[11.11px] justify-center leading-[0] left-[calc(50%+0.19px)] not-italic text-[#4a4a44] text-[9px] text-center top-1/2 tracking-[0.18px] w-[15.729px]" data-node-id="689:2673">
            <p className="leading-[normal]">WK</p>
          </div>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[15px] justify-center leading-[0] left-[43.55px] not-italic right-[169.94px] text-[#1b1a17] text-[13px] top-[calc(50%-0.29px)]" data-node-id="689:2674">
          <p className="leading-[normal]">Weekly</p>
        </div>
        <div className="-translate-y-1/2 absolute left-[231.67px] size-[12px] top-[calc(50%-0.01px)]" data-node-id="689:2675" data-name="SVG">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/step5-chevron.svg" />
        </div>
      </div>
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[12.78px] justify-center leading-[0] left-[293.22px] not-italic right-[186.36px] text-[#9a9a91] text-[11px] top-[174.29px] tracking-[0.66px] uppercase" data-node-id="689:2677">
        <p className="leading-[16.5px]">Expiry offset</p>
      </div>
      <div className="absolute border border-[#deddd8] border-solid h-[13.99px] left-[391.72px] right-[166.72px] rounded-[999px] top-[167.49px]" data-node-id="689:2678" data-name="Border">
        <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-serif)] font-bold italic h-[11.11px] justify-center leading-[0] left-[calc(50%+0.17px)] text-[#c6c5bf] text-[9.5px] text-center top-[calc(50%-0.31px)] tracking-[0.66px] w-[4.497px]" data-node-id="689:2679">
          <p className="leading-[9.5px]">i</p>
        </div>
      </div>
      <div className="absolute bg-white border border-[#deddd8] border-solid h-[43.99px] left-[293.22px] right-[21.99px] rounded-[12px] top-[190.73px]" data-node-id="689:2680" data-name="Button listbox">
        <div className="-translate-y-1/2 absolute bg-[#f2f2ef] left-[11.55px] rounded-[7px] size-[22px] top-[calc(50%-0.01px)]" data-node-id="689:2681" data-name="Background">
          <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[11.11px] justify-center leading-[0] left-[calc(50%+0.16px)] not-italic text-[#4a4a44] text-[9px] text-center top-1/2 tracking-[0.18px] w-[12.368px]" data-node-id="689:2682">
            <p className="leading-[normal]">C0</p>
          </div>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[15px] justify-center leading-[0] left-[43.54px] not-italic right-[168.01px] text-[#1b1a17] text-[13px] top-[calc(50%-0.29px)]" data-node-id="689:2683">
          <p className="leading-[normal]">Current</p>
        </div>
        <div className="-translate-y-1/2 absolute left-[231.67px] size-[12px] top-[calc(50%-0.01px)]" data-node-id="689:2684" data-name="SVG">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/step5-chevron.svg" />
        </div>
      </div>
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[17.25px] justify-center leading-[0] left-[22px] not-italic right-[318.05px] text-[#7c7c74] text-[11.5px] top-[249.35px] tracking-[-0.154px]" data-node-id="689:2686">
        <p className="leading-[17.25px]">{`Weekly & monthly are both available for NIFTY.`}</p>
      </div>
      <div className="absolute bg-white border border-[#ecebe7] border-solid h-[217.99px] left-[22px] right-[21.98px] rounded-[16px] top-[271.96px]" data-node-id="689:2687" data-name="Background+Border">
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[12.78px] justify-center leading-[0] left-[17.55px] not-italic right-[394.91px] text-[#9a9a91] text-[11px] top-[23.61px] tracking-[0.66px] uppercase" data-node-id="689:2688">
          <p className="leading-[16.5px]">Strike selection</p>
        </div>
        <div className="absolute border border-[#deddd8] border-solid h-[13.99px] left-[137.16px] right-[375.3px] rounded-[999px] top-[16.8px]" data-node-id="689:2689" data-name="Border">
          <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-serif)] font-bold italic h-[11.11px] justify-center leading-[0] left-[calc(50%+0.17px)] text-[#c6c5bf] text-[9.5px] text-center top-[calc(50%-0.3px)] tracking-[0.66px] w-[4.497px]" data-node-id="689:2690">
            <p className="leading-[9.5px]">i</p>
          </div>
        </div>
        <div className="absolute bg-white border border-[#deddd8] border-solid h-[43.99px] left-[17.55px] right-[17.55px] rounded-[12px] top-[46.04px]" data-node-id="689:2691" data-name="Button listbox">
          <div className="-translate-y-1/2 absolute bg-[#f2f2ef] left-[11.55px] rounded-[7px] size-[22px] top-1/2" data-node-id="689:2692" data-name="Background">
            <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[11.11px] justify-center leading-[0] left-[calc(50%+0.16px)] not-italic text-[#4a4a44] text-[9px] text-center top-[calc(50%-0.01px)] tracking-[0.18px] w-[19.846px]" data-node-id="689:2693">
              <p className="leading-[normal]">ATM</p>
            </div>
          </div>
          <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[15px] justify-center leading-[0] left-[43.55px] not-italic right-[398.65px] text-[#1b1a17] text-[13px] top-[calc(50%-0.28px)]" data-node-id="689:2694">
            <p className="leading-[normal]">ATM ±N</p>
          </div>
          <div className="-translate-y-1/2 absolute left-[465.8px] size-[12px] top-1/2" data-node-id="689:2695" data-name="SVG">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/step5-chevron.svg" />
          </div>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-medium h-[22.5px] justify-center leading-[0] left-[17.55px] not-italic right-[457.98px] text-[#1b1a17] text-[15px] top-[124.02px] tracking-[-0.3px]" data-node-id="689:2697">
          <p className="leading-[22.5px]">ATM +0</p>
        </div>
        <div className="absolute border border-[#deddd8] border-solid h-[13.99px] left-[74.12px] right-[438.34px] rounded-[999px] top-[117.03px]" data-node-id="689:2698" data-name="Border">
          <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-serif)] font-bold italic h-[11.11px] justify-center leading-[0] left-[calc(50%+0.15px)] text-[#c6c5bf] text-[9.5px] text-center top-[calc(50%-0.31px)] tracking-[-0.154px] w-[3.636px]" data-node-id="689:2699">
            <p className="leading-[9.5px]">i</p>
          </div>
        </div>
        <div className="absolute bg-white border border-[#deddd8] border-solid h-[32px] left-[420.9px] overflow-clip right-[17.56px] rounded-[12px] top-[108.03px]" data-node-id="689:2700" data-name="Input">
          <div className="absolute h-[16.67px] left-[13.55px] overflow-auto right-[13.54px] top-[6.66px]" data-node-id="689:2701" data-name="Container">
            <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[16.11px] justify-center leading-[0] left-[calc(50%+0.18px)] not-italic text-[#1b1a17] text-[14px] text-center top-[8.06px] tracking-[-0.28px] w-[7.873px]" data-node-id="689:2702">
              <p className="leading-[normal]">0</p>
            </div>
          </div>
        </div>
        <div className="absolute bg-[#c6c5bf] h-[2.99px] left-[28.55px] opacity-60 right-[494.91px] rounded-[1.5px] top-[178.45px]" data-node-id="689:2703" data-name="Background" />
        <div className="absolute bg-[#c6c5bf] h-[2.99px] left-[145.14px] opacity-60 right-[378.32px] rounded-[1.5px] top-[178.45px]" data-node-id="689:2704" data-name="Background" />
        <div className="absolute bg-[#c6c5bf] h-[2.99px] left-[261.73px] opacity-60 right-[261.73px] rounded-[1.5px] top-[178.45px]" data-node-id="689:2705" data-name="Background" />
        <div className="absolute bg-[#c6c5bf] h-[2.99px] left-[378.31px] opacity-60 right-[145.15px] rounded-[1.5px] top-[178.45px]" data-node-id="689:2706" data-name="Background" />
        <div className="absolute bg-[#c6c5bf] h-[2.99px] left-[494.9px] opacity-60 right-[28.56px] rounded-[1.5px] top-[178.45px]" data-node-id="689:2707" data-name="Background" />
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[15px] justify-center leading-[0] left-[17.55px] not-italic right-[491.83px] text-[#7c7c74] text-[10px] top-[192.94px] tracking-[-0.154px]" data-node-id="689:2708">
          <p className="leading-[15px]">−20</p>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[15px] justify-center leading-[0] left-[135.5px] not-italic right-[373.88px] text-[#7c7c74] text-[10px] top-[192.94px] tracking-[-0.154px]" data-node-id="689:2709">
          <p className="leading-[15px]">−10</p>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[15px] justify-center leading-[0] left-[253.45px] not-italic right-[253.13px] text-[#7c7c74] text-[10px] top-[192.94px] tracking-[-0.154px]" data-node-id="689:2710">
          <p className="leading-[15px]">ATM</p>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[15px] justify-center leading-[0] left-[374.28px] not-italic right-[135.1px] text-[#7c7c74] text-[10px] top-[192.94px] tracking-[-0.154px]" data-node-id="689:2711">
          <p className="leading-[15px]">+10</p>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[15px] justify-center leading-[0] left-[492.23px] not-italic right-[17.15px] text-[#7c7c74] text-[10px] top-[192.94px] tracking-[-0.154px]" data-node-id="689:2712">
          <p className="leading-[15px]">+20</p>
        </div>
        <div className="absolute h-[6px] left-[17.55px] right-[17.55px] rounded-[999px] top-[155.01px]" data-node-id="689:2713" style={{ backgroundImage: "linear-gradient(90deg, rgb(236, 94, 26) 0%, rgb(236, 94, 26) 50%, rgb(124, 124, 116) 50%, rgb(124, 124, 116) 100%)" }} data-name="Input" />
        <div className="absolute border border-[rgba(255,255,255,0.7)] border-solid h-[23.99px] left-[251.22px] pointer-events-none right-[251.24px] rounded-[12px] shadow-[0px_3px_8px_0px_rgba(20,20,25,0.24),0px_1px_2px_0px_rgba(20,20,25,0.16)] top-[148.74px]" data-node-id="689:2714" data-name="Gradient+Border+Shadow+OverlayBlur">
          <div aria-hidden className="absolute backdrop-blur-[3.5px] bg-gradient-to-b from-[rgba(255,255,255,0.72)] inset-0 rounded-[12px] to-[rgba(255,255,255,0.38)]" />
          <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0px_1px_0px_1px_rgba(255,255,255,0.85)]" />
        </div>
      </div>
      <div className="absolute bg-white border border-[#ecebe7] border-solid h-[184.4px] left-[22px] right-[21.98px] rounded-[16px] top-[511.95px]" data-node-id="689:2715" data-name="Background+Border">
        <div className="absolute border-[#ecebe7] border-b-[0.556px] border-solid h-[66.54px] left-[0.11px] right-[0.12px] top-[0.11px]" data-node-id="689:2716" data-name="Button">
          <div className="-translate-y-1/2 absolute bg-[#f8f8f6] left-[15px] rounded-[999px] size-[37.99px] top-[calc(50%-0.01px)]" data-node-id="689:2717" data-name="Background">
            <div className="absolute left-[9.5px] size-[18.99px] top-[9.5px]" data-node-id="689:2718" data-name="SVG">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/step5-add-entry.svg" />
            </div>
          </div>
          <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[16.67px] justify-center leading-[0] left-[65.99px] not-italic right-[394.32px] text-[#7c7c74] text-[14px] top-[calc(50%-8.5px)]" data-node-id="689:2722">
            <p className="leading-[normal]">Add Entry</p>
          </div>
          <div className="-translate-y-1/2 absolute h-[14.44px] left-[65.99px] overflow-clip right-[15px] top-[calc(50%+9.6px)]" data-node-id="689:2723" data-name="Container">
            <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[13.89px] justify-center leading-[0] left-0 not-italic text-[#7c7c74] text-[12px] top-[6.95px] w-[146.333px]" data-node-id="689:2724">
              <p className="leading-[normal]">All legs together is selected</p>
            </div>
          </div>
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[50.44px] justify-center leading-[0] left-[15.11px] not-italic right-[19.71px] text-[#7c7c74] text-[12px] top-[109.53px] tracking-[-0.154px]" data-node-id="689:2725">
          <p className="leading-[18px] mb-0">All legs together is selected — the whole position enters on one shared signal, so per-leg entry</p>
          <p className="leading-[18px] mb-0">{`conditions are unavailable. Switch Entry mode (Strategy Settings) to "Each leg on its own" to`}</p>
          <p className="leading-[18px]">configure this leg individually.</p>
        </div>
        <div className="[word-break:break-word] absolute h-[15.56px] leading-[0] left-[15.11px] not-italic right-[408.81px] text-[#ec5e1a] text-[12.5px] text-center top-[147.63px]" data-node-id="689:2726" data-name="Button">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[15px] justify-center left-[calc(50%-9.09px)] top-[calc(50%-0.28px)] w-[84.36px]" data-node-id="689:2727">
            <p className="leading-[normal]">Take me there</p>
          </div>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[15px] justify-center left-[96.45px] top-[calc(50%-0.28px)] w-[12.844px]" data-node-id="689:2728">
            <p className="leading-[normal]">→</p>
          </div>
        </div>
      </div>
      <div className="absolute border border-[#deddd8] border-dashed h-[68.2px] left-[22px] overflow-clip right-[21.98px] rounded-[16px] top-[708.35px]" data-node-id="689:2736" data-name="Border">
        <div className="absolute h-[65.98px] left-[0.11px] right-[0.12px] top-[0.11px]" data-node-id="689:2737" data-name="Button">
          <div className="-translate-y-1/2 absolute bg-[#fbe9e9] left-[15px] rounded-[999px] size-[37.99px] top-[calc(50%-0.01px)]" data-node-id="689:2738" data-name="Background">
            <div className="absolute left-[9.5px] size-[18.99px] top-[9.5px]" data-node-id="689:2739" data-name="SVG">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src="/case/zenxo/builder/step5-add-exit.svg" />
            </div>
          </div>
          <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[16.67px] justify-center leading-[0] left-[65.99px] not-italic right-[404.14px] text-[#1b1a17] text-[14px] top-[calc(50%-8.51px)]" data-node-id="689:2743">
            <p className="leading-[normal]">Add Exit</p>
          </div>
          <div className="-translate-y-1/2 absolute h-[14.44px] left-[65.99px] overflow-clip right-[15px] top-[calc(50%+9.6px)]" data-node-id="689:2744" data-name="Container">
            <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[13.89px] justify-center leading-[0] left-0 not-italic text-[#7c7c74] text-[12px] top-[6.95px] w-[148.505px]" data-node-id="689:2745">
              <p className="leading-[normal]">Target · SL · Trail · Re-entry</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none" data-node-id="689:2758">
        <div className="bg-white border-[#ecebe7] border-b-[0.556px] border-solid h-[63.77px] pointer-events-auto sticky top-0" data-name="Background+HorizontalBorder">
          <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[15px] justify-center leading-[0] left-[22px] not-italic right-[502.9px] text-[#9a9a91] text-[10px] top-[19.49px] tracking-[0.9px] uppercase" data-node-id="689:2759">
            <p className="leading-[15px]">Editing</p>
          </div>
          <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[21.67px] justify-center leading-[0] left-[22px] not-italic right-[504.75px] text-[#1b1a17] text-[18px] top-[39.82px] tracking-[-0.36px]" data-node-id="689:2760">
            <p className="leading-[normal]">Leg 1</p>
          </div>
          <div className="[word-break:break-word] absolute bg-[#f2f2ef] h-[33.98px] leading-[0] left-[227.57px] not-italic rounded-[999px] top-[11.99px] w-[129.77px]" data-node-id="689:2761" data-name="Paragraph+Background">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[16.67px] justify-center left-[17.14px] text-[#c6c5bf] text-[15px] text-center top-[calc(50%-0.27px)] w-[5.3px]" data-node-id="689:2762">
              <p className="leading-[15px]">‹</p>
            </div>
            <div className="-translate-y-1/2 absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[15px] justify-center left-[39.99px] text-[#1b1a17] text-[12.5px] top-[calc(50%-0.28px)] tracking-[-0.154px] w-[50.163px]" data-node-id="689:2763">
              <p className="leading-[normal]">Leg 1 / 1</p>
            </div>
            <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[16.67px] justify-center left-[112.93px] text-[#c6c5bf] text-[15px] text-center top-[calc(50%-0.27px)] w-[5.3px]" data-node-id="689:2764">
              <p className="leading-[15px]">›</p>
            </div>
          </div>
          <div className="absolute bg-white border border-[#deddd8] border-solid h-[33.99px] left-[367.35px] rounded-[999px] top-[11.99px] w-[132px]" data-node-id="689:2765" data-name="Button">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#fbeed8] left-[calc(50%-34.59px)] rounded-[999px] size-[22px] top-1/2" data-node-id="689:2766" data-name="Background">
              <div className="absolute bg-[#ec5e1a] h-[2px] left-[6px] rounded-[1px] top-[10px] w-[10px]" data-node-id="689:2767" data-name="Horizontal Divider" />
              <div className="absolute bg-[#ec5e1a] h-[10px] left-[10px] rounded-[1px] top-[6px] w-[2px]" data-node-id="689:2768" data-name="Vertical Divider" />
            </div>
            <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-bold h-[15.56px] justify-center leading-[0] left-[calc(50%+8.17px)] not-italic text-[#1b1a17] text-[13px] text-center top-[calc(50%-0.39px)] w-[47.514px]" data-node-id="689:2769">
              <p className="leading-[13px]">Add leg</p>
            </div>
          </div>
          <div className="absolute bg-white border border-[#deddd8] border-solid h-[33.99px] left-[517.34px] opacity-40 overflow-clip rounded-[999px] top-[11.99px] w-[33.11px]" data-node-id="689:2770" data-name="Button - Remove this leg">
            <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-[family-name:var(--zx-sans)] font-normal h-[11px] justify-center leading-[0] left-[15.75px] not-italic text-[#7c7c74] text-[11px] text-center top-1/2 w-[8.775px]" data-node-id="689:2771">
              <p className="leading-[11px]">✕</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
