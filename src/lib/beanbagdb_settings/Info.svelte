<script>
  import { onMount } from "svelte";
  import {BeanBagDB} from "beanbagdb"
  export let BBDB
  let  Loaded = false

  let data = {system_schema:[],logs:[]}
  onMount(async () => {
  if (!(BBDB instanceof BeanBagDB)) {
    throw new Error("Invalid database object");
  }
  await load_settings();
  Loaded = true; // Set Loaded only after data loading
});

  const load_settings = async()=>{
    
    let sch = await BBDB.search({"selector":{"schema":"schema"}})
    console.log(sch)
    data["system_schema"] = sch["docs"]
    let log = await BBDB.search({"selector":{"schema":"system_settings","data.name":"system_logs"}})
    console.log(log)
    Loaded =true
  }

</script>
{#if Loaded}
<div class="container">

  <h4 class="pt-2">Database Info</h4>
  <table class="table">
    <tr>
      <td>Active</td>
      <td>  
        <code>{BBDB.active}</code>   
        
      </td>
    </tr>

  {#if BBDB.active}

    <tr>
      <td>Database name</td>
      <td>  
        <code>{BBDB.meta.database_name}</code>   
      </td>
    </tr>

    <tr>
      <td>BeanBagDB version</td>
      <td>  
        <code>{BBDB.meta.beanbagdb_version_db}</code>   
      </td>
    </tr>

    <tr>
      <td>List of system databases installed</td>
      <td>  
        {#if data.system_schema && data.system_schema.length > 0}
        <ul>
          {#each data.system_schema as s}
            <li>{s.data.name}</li> 
          {/each}
        </ul>
      {:else}
        <p>No system databases found.</p>
      {/if}
      </td>
    </tr>

  {/if}  
  </table>

</div>
{/if}