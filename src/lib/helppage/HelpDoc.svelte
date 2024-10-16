<script>
  // import { onMount } from "svelte";
  export let key = ""; // The title of the document passed as a prop
  let command_list = [
    {
      command: `help/"topic"`,
      task: `To view a help topic. "list" will show the list of all topics available `,
    },
    {
      command: `find/"search criteria"`,
      task: `To view a help topic. "list" will show the list of all topics available `,
    },
    {
      command:`open/"identifier"/"id"`,
      task:`This command will open (if not already) the given record. The record identified can be  'id' or 'link' followed by the respective value`
    }

  ];

  let help_docs_list = {
    "list":"View the list of all help docs available (opens this page) ",
    "search":"Describes how the search box works and a list of commands that can be used"
  }

  let docFound = false;
  // Function to fetch the doc content based on the title
  function loadDoc(doc_key) {
    if (help_docs_list[doc_key]) {
      docFound = true;
    } else {
      docFound = false;
    }
  }

  $: if (key) {
    loadDoc(key);
  }
</script>

<!-- Template: Render the document or a "not found" message -->
<div class="container mt-4">
  {#if docFound}
    {#if key == "list"}
      <h3>List of help pages</h3>
      <ul>
        {#each Object.keys(help_docs_list) as page}
          <li>
            <button
              type="button"
              class="btn btn-link"
              on:click={() => {
                key = page;
              }}>{page}</button
            >
            : {help_docs_list[page]}
          </li>
        {/each}
      </ul>
    {:else if (key = "search")}
    <h3>Search box commands</h3>
      <p>
        The search box in the workspace can be used to load records from the
        database in many ways. This page shows the list of all commands and how
        to use them.
      </p>
      <p>
        <b>Format of commands</b>: Each command has a main key word which is
        then separated by a "/"
      </p>
      <ul>
        {#each command_list as item}
          <li><code>{item.command}</code> : {item.task}</li>
        {/each}
      </ul>
    {/if}
    {#if key != "list"}
      <br /><br />
      <button
        type="button"
        class="btn btn-link"
        on:click={() => {
          key = "list";
        }}>Help home</button
      >
    {/if}
  {:else}
    <div class="alert alert-danger" role="alert">
      Document not found!
      {#if key != "list"}
        <br /><br />
        <button
          type="button"
          class="btn btn-link"
          on:click={() => {
            key = "list";
          }}>Help home</button
        >
      {/if}
    </div>
  {/if}
</div>
