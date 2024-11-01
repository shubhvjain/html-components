<script>
  import SimpleEditor from "$lib/utils/SimpleEditor.svelte";
  import { onMount } from "svelte";
  import JsonEditor from "$lib/utils/JsonEditor.svelte";
  
  export let schema_object = {};
  let isValidJson = false;
  let schema_string = "";
  let lastValidText = "";
  let enableLivePreview = false; // New variable for live preview checkbox
  let valid_fields = ["string", "number", "array", "boolean"];
  let form_data = {}
  // On component mount, initialize schema_string
  onMount(() => {
    load_string();
    lastValidText = schema_string; // Variable to track the last valid JSON
    isValidJson = true; // Flag to track JSON validity
  });

  const add_new_blank_field = (ftype = "text") => {
    const random_field_name = ftype + "-" + Math.round(Math.random() * 1000);
    
    const ftypes = {
      string: () => ({
        type: "string",
        title: random_field_name,
        description: "",
        minLength: 0,
        maxLength: 100,
      }),
      number: () => ({
        type: "number",
        title: random_field_name,
        minimum: null,
        maximum: null,
      }),
      boolean: () => ({
        type: "boolean",
        title: random_field_name,
        default: false,
      }),
      array: () => ({
        type: "array",
        title: random_field_name,
        items: {
          type: "string", // Default item type can be string
          minItems: 0,
          uniqueItems: false,
        },
      }),
    };

    // Check if the field type exists in the ftypes object
    if (ftypes[ftype]) {
      let blank = ftypes[ftype](); // Call the function to create the field schema
      
      // Create a new schema_object with the new field added
      schema_object = {
        ...schema_object,
        properties: {
          ...schema_object.properties,
          [random_field_name]: blank, // Add the new field
        },
      };
      
      // Update schema_string after modifying schema_object
      schema_string = JSON.stringify(schema_object, null, 2);
    } else {
      throw new Error(`Field type '${ftype}' is not supported.`);
    }
  };

  const load_string = () => {
    if (Object.keys(schema_object).length == 0) {
      schema_object = {
        type: "object",
        additionalProperties: false,
        required: [],
        properties: {},
      };
    }
    schema_string = JSON.stringify(schema_object, null, 2); // Stringify with pretty formatting
  };


  const handleInputChanged = (event) => {
    form_data = {...event.detail}
  };

  let form_schema = {}
  const show_preview = ()=>{
    enableLivePreview = false
    form_schema = {...form_schema,...schema_object}
    setTimeout(()=>{
      enableLivePreview = true
    },100)
    //
  }

  // Reactive statement to monitor changes to schema_string
  $: if (schema_string !== lastValidText) {
    // Validate JSON when schema_string changes
    try {
      schema_object = JSON.parse(schema_string); // Attempt to parse the new text
      lastValidText = schema_string; // If valid, update lastValidText
      isValidJson = true; // Mark as valid JSON
    } catch (e) {
      schema_string = lastValidText; // Revert to last valid JSON on error
      isValidJson = false; // Mark as invalid JSON
    }
  }

  $: if(schema_object){
    console.log("ggg")
    schema_string = JSON.stringify(schema_object, null, 2)}
</script>

<div class="row">
  <div class="col-8">
    <h5>Schema</h5>

    <!-- Bind schema_string to the SimpleEditor for two-way data binding -->
    <SimpleEditor bind:text={schema_string} />

    <p style="color: {isValidJson ? 'green' : 'red'};">
      {isValidJson ? "Valid JSON" : "Invalid JSON"}
    </p>
    {#if isValidJson}
      {#each valid_fields as f}
        <button class="btn btn-sm btn-light m-1" on:click={() => { add_new_blank_field(f) }}>+ {f}</button>
      {/each}
    {/if}
  </div>

  <div class="col-4">
    <h5>Preview</h5>
    <button class="btn btn-sm btn-success" on:click={()=>{show_preview()}}>Show preview</button>

    {#if enableLivePreview}
      {#if isValidJson}
        
        <!-- Show the JSON in a preformatted text block -->
        <JsonEditor schema={form_schema}  on:inputChanged={handleInputChanged}/>

        <b>Form response :</b>
        <pre>{JSON.stringify(form_data,null,2)}</pre>


      {/if}
    {/if}
  </div>
</div>
