<script>
  import "bootstrap/dist/css/bootstrap.min.css";
  import { onMount } from "svelte";
  import JsonEditor from "$lib/utils/JsonEditor.svelte";
  import SchemaEditor from "./SchemaEditor.svelte";
  export let data;
  export let schema = {};
  let Loaded = false;
  let Error = "";
  let system_schemas = {}
  const load_record = () => {
    console.log("Loading record...");
    Error = "";
    Loaded = false;
    let errors = [];
    if (Object.keys(schema).length === 0) {
      errors.push("No schema provided");
    }
    console.log(schema)
    system_schemas["settings"] = schema.data.schema.properties.settings 
    console.log(system_schemas)
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



<details open>
  <summary>Schema</summary>
  <SchemaEditor schema_object={data["schema"]}></SchemaEditor>
</details>

<details>
  <summary>Settings</summary>
  <JsonEditor schema={system_schemas["settings"]}></JsonEditor>
</details>

{/if}

{#if Error && Loaded}
  <div class="alert alert-danger">
    {Error}
  </div>
{/if}

{#if !Loaded && !Error}
  <div class="alert alert-info">Loading...</div>
{/if}