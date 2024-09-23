<script context="module">
  // import {Story} from '@storybook/addon-svelte-csf'
import Schema from './Schema.svelte';

  export const meta = {
    title : "Schema Editor",
    component : Schema
  }
</script>

<script>
  import { Story, Template } from '@storybook/addon-svelte-csf';

  let count = 0;
  function handleClick() {
    count += 1;
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
  <Schema></Schema>
</Story>

<Story name="Simple Schema">
  <Schema  schema={schema}></Schema>
</Story>