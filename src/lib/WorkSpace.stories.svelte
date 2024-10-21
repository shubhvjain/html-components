<script context="module">
  import {Story} from '@storybook/addon-svelte-csf'
  import WorkSpace from './WorkSpace.svelte';
  export const meta = {
    title : "Workspace",
    component : WorkSpace
  }
</script>

<script>
  let db = {
    name: "test",
    encryption_key:"SampleKeyForTesting1234"
  }
</script>

<Story name="Initial">
  <WorkSpace db={db}></WorkSpace>
</Story>

