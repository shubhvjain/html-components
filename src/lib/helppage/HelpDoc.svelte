<script>
  import { onMount } from 'svelte';

  export let key = ''; // The title of the document passed as a prop
  export let tags = [];


  const help_docs = {
    "list":{
      title : "List of all help topics",
      tags:[],
      doc:``
    },
    "search":{
      title : "Search commands for workspace",
      tags : [],
      doc : `The search box in the workspace can be used to load records from the database in many ways. This page shows the list of all commands and how to use them. `
    }

  }


  let doc = {title:"",doc:"",tags:[]};
  let docFound = false;

  // Function to fetch the doc content based on the title
  function loadDoc(doc_key) {
    if(help_docs[doc_key]){
      docFound = true
      doc = help_docs[doc_key]
    }else{
      docFound = false
    }
  }

  // Load the document when the component is mounted
  onMount(() => {
    loadDoc(key);
  });

  $: if (key){
    loadDoc(key)
  }
  
</script>

<!-- Template: Render the document or a "not found" message -->
<div class="container mt-4">
  {#if docFound}
  
    <div class="card1">
     
      <div class="card-body1">
        <h3>{doc.title}</h3>
        {@html doc.doc} <!-- Render the HTML content safely -->

        {#if key == "list" }
        <ul>
          {#each Object.keys(help_docs) as page}          
          <li>
             <button type="button" class="btn btn-link" on:click={()=>{key=page}}>{page}</button>  : {help_docs[page]['title']}
          </li>
          {/each} 
        </ul>
        {/if}
        {#if key != "list" }
        <br><br>
         <button type="button" class="btn btn-link" on:click={()=>{key="list"}}>Help home</button>
        {/if}



      </div>
    </div>
  {:else}
  <div class="alert alert-danger" role="alert">
    Document not found!
  </div>
  {/if}
</div>
