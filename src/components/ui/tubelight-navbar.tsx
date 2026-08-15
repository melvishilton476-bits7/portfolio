"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Reveal on scroll-up, hide on scroll-down — always shown near the very top.
  // Unlike the raw FloatingNav behaviour, a single pixel of upward motion is
  // NOT enough: we accumulate upward distance (in px) and only reveal once it
  // crosses REVEAL_PX, so a stray jitter or momentum bounce is ignored and it
  // takes a deliberate flick up to bring the bar in. Any downward scroll hides
  // it immediately and resets the accumulator.
  //
  // Once revealed away from the top, the bar auto-hides after IDLE_MS of no
  // scrolling — otherwise it lingers forever the moment you stop. Every scroll
  // reschedules the timer, hovering the bar pauses it (so it can't vanish out
  // from under a click), and near the top it stays pinned with no timer.
  const REVEAL_PX = 80
  const TOP_PX = 40
  const IDLE_MS = 5000
  const upAccum = useRef(0)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hovering = useRef(false)
  const { scrollY } = useScroll()

  const clearIdle = () => {
    if (idleTimer.current) {
      clearTimeout(idleTimer.current)
      idleTimer.current = null
    }
  }
  const scheduleIdle = () => {
    clearIdle()
    idleTimer.current = setTimeout(() => {
      // Don't disappear while the pointer is on the bar; onMouseLeave will
      // restart the countdown once the cursor moves off.
      if (hovering.current) return
      setVisible(false)
    }, IDLE_MS)
  }

  useMotionValueEvent(scrollY, "change", (current) => {
    const delta = current - (scrollY.getPrevious() ?? 0)

    if (current < TOP_PX) {
      // Pinned open near the top — no idle countdown here.
      upAccum.current = 0
      clearIdle()
      setVisible(true)
      return
    }

    if (delta > 0) {
      // Scrolling down: hide and forget any banked upward distance.
      upAccum.current = 0
      clearIdle()
      setVisible(false)
    } else if (delta < 0) {
      // Scrolling up: bank the distance; reveal only past the threshold, then
      // (re)arm the idle timer so a pause after revealing hides it again.
      upAccum.current += -delta
      if (upAccum.current > REVEAL_PX) {
        setVisible(true)
        scheduleIdle()
      }
    }
  })

  useEffect(() => clearIdle, [])

  // The bar hides by sliding off its own edge: up on desktop (pinned top),
  // down on mobile (pinned bottom). Horizontal centring stays on the CSS
  // `translate` utility, so framer's `y` composes without fighting it.
  const hiddenY = isMobile ? 96 : -96

  return (
    <motion.div
      initial={false}
      animate={{ y: visible ? 0 : hiddenY, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      onMouseEnter={() => {
        hovering.current = true
        clearIdle()
      }}
      onMouseLeave={() => {
        hovering.current = false
        if (scrollY.get() >= TOP_PX) scheduleIdle()
      }}
      className={cn(
        "fixed bottom-0 sm:bottom-auto sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:mb-0 sm:pt-6",
        !visible && "pointer-events-none",
        className,
      )}
    >
      {/* <nav>, not <div>: this is the site's primary navigation, so it needs to
          be a landmark screen-reader users can jump to. aria-label distinguishes
          it from the footer's nav, which is also a landmark. */}
      <nav aria-label="Main" className="relative flex items-center gap-5 sm:gap-[52px] border border-[#d9d9d9] bg-white px-3 sm:px-6 h-[43px]">
        {/* Registration dots centred on the four corners — blueprint marks that
            echo the hero's crop-dots (node 464:856-859). */}
        <span aria-hidden className="pointer-events-none absolute left-0 top-0 size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-btn-dark" />
        <span aria-hidden className="pointer-events-none absolute right-0 top-0 size-[5px] translate-x-1/2 -translate-y-1/2 rounded-full bg-btn-dark" />
        <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 size-[5px] -translate-x-1/2 translate-y-1/2 rounded-full bg-btn-dark" />
        <span aria-hidden className="pointer-events-none absolute bottom-0 right-0 size-[5px] translate-x-1/2 translate-y-1/2 rounded-full bg-btn-dark" />

        {/* Logo emblem — desktop only; mobile keeps the icon bar clean. */}
        {/* Root-relative so the logo returns home from a case-study route too. */}
        <Link href="/#top" aria-label="Home" className="hidden shrink-0 sm:block">
          <Image src="/nav-logo.svg" alt="" width={19} height={17} unoptimized className="h-[17px] w-[19px]" />
        </Link>

        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer px-1 py-2 font-light uppercase transition-colors",
                "text-[12px] tracking-[-0.08em] text-neutral-900 hover:text-[#8581ff]",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2} />
              </span>
              {isActive && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-1 -bottom-0.5 h-[1.5px] bg-[#8581ff]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          )
        })}
      </nav>
    </motion.div>
  )
}
