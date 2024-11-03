<script>
  import "bootstrap/dist/css/bootstrap.min.css";
  import "$lib/default.style.css"
  import { onMount } from "svelte";
  import KeyRecord from "../beanbagdb_records/KeyRecord.svelte";
  import MediaRecord from "../beanbagdb_records/MediaRecord.svelte";
  import RecordMetadata from "../beanbagdb_records/RecordMetadata.svelte";
  import SchemaRecord from "../beanbagdb_records/SchemaRecord.svelte";
  import SettingRecord from "../beanbagdb_records/SettingRecord.svelte";
  import JsonEditor from "$lib/utils/JsonEditor.svelte";
  export let data;
  export let schema = {};
  let Loaded = false;
  let Error = "";

  const load_record = () => {
    console.log("Loading record...");
    Error = "";
    Loaded = false;
    let errors = [];
    if (Object.keys(schema).length === 0) {
      errors.push("No schema provided");
    }
    Error = errors.length > 0 ? errors.join(", ") : "";
    Loaded = true;
  };

  // onMount to load the record initially
  onMount(() => {
    load_record();
  });

  // Explicit reactive block to rerun when schema changes
  //$: if (schema) {load_record();}
  $: load_record()
</script>

{#if Loaded && !Error}
  {#if schema.data.name === "schema"}
    <SchemaRecord {data} {schema}></SchemaRecord>
  {:else if schema.data.name === "system_settings"}
    <SettingRecord  {data} {schema}></SettingRecord>
  {:else if schema.data.name === "system_keys"}
    <KeyRecord  {data} {schema}></KeyRecord>
  {:else if schema.data.name === "system_media"}
    <MediaRecord {data} {schema}></MediaRecord>
  {:else}
    <JsonEditor {data} schema={schema.data.schema}></JsonEditor>
  {/if}
{/if}

{#if Error && Loaded}
  <div class="alert alert-danger">
    {Error}
  </div>
{/if}

{#if !Loaded && !Error}
  <div class="alert alert-info">Loading...</div>
{/if}