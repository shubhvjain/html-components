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

  let data = {
    "name":"John Doe",
    "city":"Erlangen",
    "country":"Germany",
    "age":100,
    "is_alien":true
  }

  let schema = {
    title:"Living being",
    properties : {
      "name":{
        "type":"string"
      },
      "city":{
        "type":"string"
      },
      "country":{
        "type":"string"
      },
      "age":{
        type:"number"
      },
      "is_alien":{
        type:"boolean"
      }
    
    }
  }

</script>

<Story name="Schema missing">
  <JsonEditor data={data}></JsonEditor>
</Story>

<Story name="Data missing">
  Shows a blank form based on the schema : 
  <JsonEditor schema={schema}></JsonEditor>
</Story>

<Story name="Simple 1">
  <JsonEditor data={data} schema={schema}></JsonEditor>
</Story>