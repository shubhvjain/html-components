<script>
import JsonEditor from "$lib/JsonEditor.svelte";
import CodeEditor from "$lib/CodeEditor.svelte";
export let schema = {}
let config = {
  schema_exists :false
}
let schemas = {
  "basic":{
    "title":"Basic details",
    "properties":{
      "name":{
        "type":"string",
        "title":"Name of the schema",
        "description":"Unique schema name. Single word. Numbers allowed. No symbols except underscore ans dash.",
        "pattern": "^[a-zA-Z_-][a-zA-Z0-9_-]*$",
        "required":true,
        "minLength": 5,
        "maxLength": 50
      },
      "title":{
        "type":"string",
        "title":"Title",
        "description":"Title of the form for this schema",
        "required":true,
        "maxLength": 500
      },
      "description":{
        "type":"string",
        "title":"Schema description",
        "required":false,
        "maxLength": 5000
      }
    }
  },
  "fields":{
    "title":"Field details",
    "properties":{
      "fields":{
        "type":"array",
        "unique":true,
        "format": "table",
        "properties":{
          "type": {
              "type": "string",
              "enum": [
                "string",
                "number",
                "array",
                "reptile",
                "other"
              ],
              "default": "dog"
            },
        }
      }
    }
  }
}

</script>

<details>
  <summary>Basic</summary>
  <JsonEditor schema={schemas.basic}></JsonEditor>
</details>

<details open>
  <summary>Fields</summary>

  <CodeEditor code=""></CodeEditor>

  <JsonEditor schema={schemas.fields}></JsonEditor>
</details>

<details>
  <summary>Additional options</summary>
  primary key, 
  single document,
  primary keys,


</details>

<details>
  <summary>Views</summary>
</details>

<details>
  <summary>Filters</summary>
</details>

<code>


<pre>
 
 
</pre>
</code>