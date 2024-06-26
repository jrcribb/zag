import * as floatingPanel from "@zag-js/floating-panel"
import { floatingPanelControls } from "@zag-js/shared"
import { normalizeProps, useMachine } from "@zag-js/solid"
import { ArrowDownLeft, Maximize2, Minus, XIcon } from "lucide-solid"
import { createMemo, createUniqueId } from "solid-js"
import { StateVisualizer } from "~/components/state-visualizer"
import { Toolbar } from "~/components/toolbar"
import { useControls } from "~/hooks/use-controls"

export default function Page() {
  const controls = useControls(floatingPanelControls)

  const [state, send] = useMachine(floatingPanel.machine({ id: createUniqueId() }), {
    context: controls.context,
  })

  const api = createMemo(() => floatingPanel.connect(state, send, normalizeProps))

  return (
    <>
      <main class="floating-panel">
        <div>
          <button {...api().triggerProps}>Toggle Panel</button>
          <div {...api().positionerProps}>
            <div {...api().contentProps}>
              <div {...api().dragTriggerProps}>
                <div {...api().headerProps}>
                  <p {...api().titleProps}>Floating Panel</p>
                  <div data-scope="floating-panel" data-part="trigger-group">
                    <button {...api().minimizeTriggerProps}>
                      <Minus />
                    </button>
                    <button {...api().maximizeTriggerProps}>
                      <Maximize2 />
                    </button>
                    <button {...api().restoreTriggerProps}>
                      <ArrowDownLeft />
                    </button>
                    <button {...api().closeTriggerProps}>
                      <XIcon />
                    </button>
                  </div>
                </div>
              </div>
              <div {...api().bodyProps}>
                <p>Some content</p>
              </div>

              <div {...api().getResizeTriggerProps({ axis: "n" })} />
              <div {...api().getResizeTriggerProps({ axis: "e" })} />
              <div {...api().getResizeTriggerProps({ axis: "w" })} />
              <div {...api().getResizeTriggerProps({ axis: "s" })} />
              <div {...api().getResizeTriggerProps({ axis: "ne" })} />
              <div {...api().getResizeTriggerProps({ axis: "se" })} />
              <div {...api().getResizeTriggerProps({ axis: "sw" })} />
              <div {...api().getResizeTriggerProps({ axis: "nw" })} />
            </div>
          </div>
        </div>
      </main>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
