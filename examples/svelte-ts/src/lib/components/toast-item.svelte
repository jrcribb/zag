<script lang="ts">
  import { normalizeProps, useActor } from "@zag-js/svelte"
  import * as toast from "@zag-js/toast"
  import { XIcon } from "lucide-svelte"

  interface Props {
    actor: toast.Service
  }

  const { actor }: Props = $props()

  const [snapshot, send] = useActor(actor)
  const api = $derived(toast.connect(snapshot, send, normalizeProps))
</script>

<div {...api.rootProps}>
  <div {...api.ghostBeforeProps}></div>
  <div data-scope="toast" data-part="progressbar"></div>
  <p {...api.titleProps}>{api.title}</p>
  <p {...api.descriptionProps}>{api.description}</p>
  <button {...api.closeTriggerProps}>
    <XIcon />
  </button>
  <div {...api.ghostAfterProps}></div>
</div>
