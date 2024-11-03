<script context="module">
  import { Story } from "@storybook/addon-svelte-csf";
  import RecordSearch from "./RecordSearch.svelte";
  import RecordEdit from "./RecordEdit.svelte";
  export const meta = { title: "BeanBagDB"}
  // import Keys from "$lib/beanbagdb_settings/Keys.svelte";
  // import DBSetting from "$lib/beanbagdb_settings/DBSetting.svelte";
  import Info from "$lib/beanbagdb_page/Info.svelte";
  import { get_test_db ,add_test_data} from "./testdb.js";  
  let data = {},schema = {}; // Initialize schema and data with default values
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

  const run = async()=>{
    try {
      await add_test_data(db)  
    } catch (error) {
      
    }
    
  }

  const run1 = async()=>{
    try {
      //let s = await db.search({ selector: {} });
      //console.log(JSON.stringify(s))
      await db.initialize()
      //let t = await db.search({ selector: {} });
      //console.log(JSON.stringify(t))
    } catch (error) {
      console.log(error)
    }
    
  }

  const run2 = async()=>{
    try {
      //let s = await db.search({ selector: {} });
      //console.log(JSON.stringify(s))
      await db.initialize()
      //let t = await db.search({ selector: {} });
      //console.log(JSON.stringify(t))
    } catch (error) {
      console.log(error)
    }
    
  }

</script>
<script></script>

<Story name="Database test">
  <button on:click={()=>{run()}}>Add test data to the database</button>
  <br>
  <button on:click={()=>{run1()}}>Re initialized the DB</button>
  <br>
  <button on:click={()=>{run1()}}>Re initialized UI stuff</button>

</Story>


<Story name="Database Info">
  <Info BBDB={db} />
</Story>

<Story name="Record Search-All docs">
  <RecordSearch docs={search_records} />
</Story>

<!-- <Story name="Schema record">
  <RecordEdit {schema} {data} />
</Story> -->


