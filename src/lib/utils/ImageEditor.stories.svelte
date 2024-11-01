<script context="module">
  // import {Story} from '@storybook/addon-svelte-csf'
  import ImageEditor from './ImageEditor.svelte';
  export const meta = {
    title : "Image editor",
    component : ImageEditor
  }
</script>

<script>
  import { Story, Template } from '@storybook/addon-svelte-csf';
  let test_image = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/irp/wAAAABJRU5ErkJggg==`
</script>

<Story name="Image">
  <ImageEditor bind:base64Image={test_image} />

  <code>
    {test_image}
  </code>
</Story>

