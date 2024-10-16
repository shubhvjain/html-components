<script context="module">
  import {Story} from '@storybook/addon-svelte-csf'
import RecordSearch from './RecordSearch.svelte';
  export const meta = {
    title : "Record search",
    component : RecordSearch
  }
</script>

<Story name="Basic">
  <RecordSearch></RecordSearch>
</Story>