<script context="module">
  import {Story} from '@storybook/addon-svelte-csf'
import RecordSearch from './RecordSearch.svelte';
import Record from './Record.svelte';
import { getNewDB } from "./db.js";
  export const meta = {
    title : "BeanBagDB",
  }

  let data = {}, schema = {}; // Initialize schema and data with default values

  // Load schema asynchronously
  (async () => {
    let BBDB = getNewDB({
      "name": "test_story",
      "encryption_key": "qwerty3232323233uiop123456"
    });
    await BBDB.ready();
    let sample = await BBDB.get("schema", { name: "schema" });
    schema = sample;
    console.log(schema);
  })();
</script>

<Story name="Record Search 1">
  <RecordSearch></RecordSearch>
</Story>


<Story name="Schema record">
  <Record {schema} {data}></Record>
</Story>