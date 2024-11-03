<script context="module">
  // import {Story} from '@storybook/addon-svelte-csf'
  import ImageEditor from './ImageEditor.svelte';
  import JsonEditor from './JsonEditor.svelte';
  import AIAssistant from './AIAssistant.svelte';
  export const meta = {
    title : "Utility Components",
    //component : ImageEditor
  }
  import { get_test_db } from "../beanbagdb/testdb.js";  
  let search_records = [];
  console.log("db loading started...")
  let db;
  get_test_db().then(async(db_instance)=>{
    db = db_instance
    let s = await db.search({ selector: {} });
    search_records = [...s.docs]; 
    console.log("db loading done...")
  }).catch(error=>{
    console.log(error)
  })

</script>

<script>
  import { Story, Template } from '@storybook/addon-svelte-csf';
  let test_image = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/irp/wAAAABJRU5ErkJggg==`


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

  let obj_obj = {
  "type": "object",
  "patternProperties": {
    "^.*$": {
      "type": "object",
      "properties": {
        "text": {
          "type": "string"
        }
      },
      "required": ["text"]
    }
  },
  "additionalProperties": true
}


</script>


<Story name="JSONSchema Editor - missing schema">
  <JsonEditor data={data}></JsonEditor>
</Story>

<Story name="JSONSchema Editor - missing data">
  Shows a blank form based on the schema : 
  <JsonEditor schema={schema}></JsonEditor>
</Story>

<Story name="JSONSchema Editor - Simple">
  <JsonEditor data={data} schema={schema}></JsonEditor>
</Story>

<Story name="JSONSchema Editor -  Object of object">
  <JsonEditor data={{"t":{"text":"hahaha"}}}  schema={obj_obj}></JsonEditor>
</Story>


<Story name="Image Editor 1">
  <ImageEditor bind:base64Image={test_image} />
  <code>
    {test_image}
  </code>
</Story>


<Story name="Prompts 1">
  <AIAssistant/>
  
</Story>
