<script context="module">
  import {Story} from '@storybook/addon-svelte-csf'
  import HelpDoc from './HelpDoc.svelte';
  export const meta = {
    title : "Help doc",
    component : HelpDoc
  }
</script>

<script>

</script>

<Story name="Initial">
  <HelpDoc key="list"></HelpDoc>
</Story>

