import { useMachine, useSnapshot } from "@ui-machines/react"
import {
  connectTooltipMachine,
  tooltipMachine,
  tooltipStore,
} from "@ui-machines/dom"
import { useMount } from "hooks/use-mount"

const Tooltip = (props: { id?: string }) => {
  const [state, send] = useMachine(tooltipMachine.withContext({ id: props.id }))

  const ref = useMount<HTMLButtonElement>(send)

  const { isVisible, triggerProps, tooltipProps } = connectTooltipMachine(
    state,
    send,
  )

  return (
    <div className="App">
      <button ref={ref} {...triggerProps}>
        Over me
      </button>
      {isVisible && (
        <div {...tooltipProps} style={{ background: "red", padding: 10 }}>
          Tooltip
        </div>
      )}
    </div>
  )
}

function Page() {
  const snap = useSnapshot(tooltipStore)
  return (
    <>
      <h3>{JSON.stringify(snap)}</h3>
      <div style={{ display: "flex" }}>
        <Tooltip id="tip-1" />
        <div style={{ marginLeft: "80px" }}>
          <Tooltip id="tip-2" />
        </div>
      </div>
    </>
  )
}

export default Page
