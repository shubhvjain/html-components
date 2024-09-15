<script context="module">
  // import {Story} from '@storybook/addon-svelte-csf'
  import JsonEditor from './JsonEditor.svelte';
  export const meta = {
    title : "JSON Schema Form",
    component : JsonEditor
  }
</script>

<script>
  import { Story, Template } from '@storybook/addon-svelte-csf';

  let count = 0;
  function handleClick() {
    count += 1;
  }
</script>

<Story name="blank">
  <JsonEditor></JsonEditor>
</Story>