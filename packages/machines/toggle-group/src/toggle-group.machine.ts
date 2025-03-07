import { createMachine, createGuards } from "@zag-js/core"
import { raf } from "@zag-js/dom-query"
import { add, compact, isEqual, remove } from "@zag-js/utils"
import * as dom from "./toggle-group.dom"
import type { ToggleGroupSchema } from "./toggle-group.types"

const { not, and } = createGuards<ToggleGroupSchema>()

export const machine = createMachine<ToggleGroupSchema>({
  props({ props }) {
    return {
      defaultValue: [],
      orientation: "horizontal",
      rovingFocus: true,
      loopFocus: true,
      ...compact(props),
    }
  },

  initialState() {
    return "idle"
  },

  context({ prop, bindable }) {
    return {
      value: bindable<string[]>(() => ({
        defaultValue: prop("defaultValue"),
        value: prop("value"),
        onChange(value) {
          prop("onValueChange")?.({ value })
        },
      })),
      focusedId: bindable<string | null>(() => ({
        defaultValue: null,
      })),
      isTabbingBackward: bindable<boolean>(() => ({
        defaultValue: false,
      })),
      isClickFocus: bindable<boolean>(() => ({
        defaultValue: false,
      })),
      isWithinToolbar: bindable<boolean>(() => ({
        defaultValue: false,
      })),
    }
  },

  computed: {
    currentLoopFocus: ({ context, prop }) => prop("loopFocus") && !context.get("isWithinToolbar"),
  },

  entry: ["checkIfWithinToolbar"],

  on: {
    "VALUE.SET": {
      actions: ["setValue"],
    },
    "TOGGLE.CLICK": {
      actions: ["setValue"],
    },
    "ROOT.MOUSE_DOWN": {
      actions: ["setClickFocus"],
    },
  },

  states: {
    idle: {
      on: {
        "ROOT.FOCUS": {
          target: "focused",
          guard: not(and("isClickFocus", "isTabbingBackward")),
          actions: ["focusFirstToggle", "clearClickFocus"],
        },
        "TOGGLE.FOCUS": {
          target: "focused",
          actions: ["setFocusedId"],
        },
      },
    },

    focused: {
      on: {
        "ROOT.BLUR": {
          target: "idle",
          actions: ["clearIsTabbingBackward"],
        },
        "TOGGLE.FOCUS": {
          actions: ["setFocusedId"],
        },
        "TOGGLE.FOCUS_NEXT": {
          actions: ["focusNextToggle"],
        },
        "TOGGLE.FOCUS_PREV": {
          actions: ["focusPrevToggle"],
        },
        "TOGGLE.FOCUS_FIRST": {
          actions: ["focusFirstToggle"],
        },
        "TOGGLE.FOCUS_LAST": {
          actions: ["focusLastToggle"],
        },
        "TOGGLE.SHIFT_TAB": {
          target: "idle",
          actions: ["setIsTabbingBackward"],
        },
      },
    },
  },

  implementations: {
    guards: {
      isClickFocus: ({ context }) => context.get("isClickFocus"),
      isTabbingBackward: ({ context }) => context.get("isTabbingBackward"),
    },

    actions: {
      setIsTabbingBackward({ context }) {
        context.set("isTabbingBackward", true)
      },
      clearIsTabbingBackward({ context }) {
        context.set("isTabbingBackward", false)
      },
      setClickFocus({ context }) {
        context.set("isClickFocus", true)
      },
      clearClickFocus({ context }) {
        context.set("isClickFocus", false)
      },
      checkIfWithinToolbar({ context, scope }) {
        const closestToolbar = dom.getRootEl(scope)?.closest("[role=toolbar]")
        context.set("isWithinToolbar", !!closestToolbar)
      },
      setFocusedId({ context, event }) {
        context.set("focusedId", event.id)
      },
      clearFocusedId({ context }) {
        context.set("focusedId", null)
      },
      setValue({ context, event, prop }) {
        if (!event.value) return
        const value = context.get("value")
        let next = Array.from(value)
        if (prop("multiple")) {
          next = next.includes(event.value) ? remove(next, event.value) : add(next, event.value)
        } else {
          next = isEqual(value, [event.value]) ? [] : [event.value]
        }
        context.set("value", next)
      },
      focusNextToggle({ context, scope, prop }) {
        raf(() => {
          const focusedId = context.get("focusedId")
          if (!focusedId) return
          dom.getNextEl(scope, focusedId, prop("loopFocus"))?.focus({ preventScroll: true })
        })
      },
      focusPrevToggle({ context, scope, prop }) {
        raf(() => {
          const focusedId = context.get("focusedId")
          if (!focusedId) return
          dom.getPrevEl(scope, focusedId, prop("loopFocus"))?.focus({ preventScroll: true })
        })
      },
      focusFirstToggle({ scope }) {
        raf(() => {
          dom.getFirstEl(scope)?.focus({ preventScroll: true })
        })
      },
      focusLastToggle({ scope }) {
        raf(() => {
          dom.getLastEl(scope)?.focus({ preventScroll: true })
        })
      },
    },
  },
})
