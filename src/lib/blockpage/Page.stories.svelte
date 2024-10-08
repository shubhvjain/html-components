<script context="module">
  // import {Story} from '@storybook/addon-svelte-csf'

  import Page from './Page.svelte';

  export const meta = {
    title : "Block Page editor",
    component : Page
  }
</script>

<script>
  import { Story, Template } from '@storybook/addon-svelte-csf';
  
</script>

<Story name="Blank DocObj">
  <Page></Page>
</Story>


