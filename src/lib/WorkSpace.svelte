<script>
  import 'bootstrap/dist/css/bootstrap.min.css';
  import { onMount } from "svelte";
  import HelpDoc from "./helppage/HelpDoc.svelte";
  import RecordSearch from "./beanbagdb/RecordSearch.svelte";
  import Record from "./beanbagdb/Record.svelte";
  import {getNewDB} from "./db.js"
  export let db ;
  export let BBDB;
  let Loaded = false
  let Error ;
  // This will hold our array of opened pages/components
  let workspace = {
    pages : [],
    title:"Workspace-"+Math.round(Math.random()*1000),
    theme: "dark"
  }

  let pages = [];

  // Search term input
  let searchTerm = '';

  // Method to add a new page
  function addPage(pageType, criteria={}, size = 'medium') {
    console.log(pageType)
    const singlePageTypes = ["dashboard","page"]
    let add_new = true;
    if(singlePageTypes.includes(singlePageTypes)){
      const existingPage = pages.find(page => page.pageType === pageType & page.criteria == criteria );
      if(existingPage){
        add_new = false
      }
    }else{
      add_new = true
    }

    if(add_new){
      pages = [...pages, { id: Math.round(Math.random()*10000), pageType, criteria, title: `Help page`, size }];
    }
    console.log(pages)
  }

  const searchPage = (text)=>{
    const [firstPart, ...rest] = text.split('/')
    if(firstPart=="help"){
      addPage("help",{key:rest.join("")})
    }

    if(firstPart=="find"){
      addPage("search",{key:rest.join("")})
    }

    if(firstPart=="open"){
      // todo add error handling 
      if(rest[0]=="link"){
        rest.shift()
        addPage("open",{key:rest.join("")})
      }
    }

    //addPage("Sample "+Math.round(Math.random()*1000))
    searchTerm = '';
  }

  // Method to close a page
  function closePage(pageId) {
    pages = pages.filter(page => page.id !== pageId);
  }

  // Method to minimize a page
  function toggleMinimize(page) {
    page.isMinimized = !page.isMinimized;
  }

  function changePageSize(page, newSize) {
    page.size = newSize;  // Update the size property
  }

  function handleKeydown(event) {
    if (event.key === 'Enter') {
      searchPage(searchTerm) // Trigger search on Enter
    }
  }

  function handleOpenLinkRequests(data){
    searchPage(data)
  }


  // Function to toggle the theme
  function toggleTheme() {
    workspace.theme = workspace.theme === 'light' ? 'dark' : 'light';
  }


  onMount(()=>{

    if(BBDB){
      console.log("hhh")
    }else{
      if(db){
        try {
          BBDB = getNewDB(db)
        } catch (error) {
          console.log(error)
          Error = error.message
        }
      }else{
        Error = "No details about the database provided."
      }
    }

    if(pages.length==0){
      // new workspace, open the dash board automatically 
      searchPage("find/search")
      searchPage("help/search")

    }
  })





</script>

<style>
  .workspace {
    display: flex;
    flex-direction: column;
    background-color: var(--bs-body-bg);
    color: var(--bs-body-color);
    height: 100vh;
    margin: 0px;
    padding: 0px;
    /* gap: 1rem; */
  }


  
  .search-box {
    display: flex;
    justify-content: space-between;
  }

  .pages-container {
    height: 97vh;
  display: flex;
  gap: 1rem;
  overflow-x: auto; /* Allow horizontal scrolling */
  /* padding: 0.25rem; */
  /* box-sizing: border-box; */
  /* border: 1px solid #ddd; */
}

.page {
  flex-shrink: 0; /* Prevent pages from shrinking */
  min-height: 100px;
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
  padding: 0.5rem;
   /* border: 0px solid #ddd;  */
  position: relative;
  margin-right: -14px;
  overflow-y: scroll;
  border-right: 5px solid hsl(180, 0%, 49%);
}
.card
{
  height: 97vh;
  border-radius: 0;
  padding: 0px;
  margin: 0px;
}

  .page.minimized {
    padding: 1rem;
    height: 50px;
  }

  .close-btn, .minimize-btn {
    position: absolute;
    top: 5px;
  }

  .close-btn {
    right: 5px;
  }

  .minimize-btn {
    right: 25px;
  }

  .page-title {
    /* font-weight: bolder; */
    /* padding-left:4px; */
    font-size: large;
    padding-left: 1.25rem;
  }
  /* Size classes */
.page.small {
  width: 25%;
}

.page.medium {
  width: 50%;
}

.page.large {
  width: 75%;
}
.page.full {
  width: 98%; /* Take up the full width of the container */
}
.card-header1{
  padding: 2px;
  margin: 3px;
}
.btn{
  border-radius: 0;
}
.form-control{
  border-radius: 0;
}
.b{
  border-left: 0px;
}

.small-dropdown {
    font-size: 1rem;   /* Reduce text size */
    padding-left: 1.5rem;    /* Smaller padding */
    width: auto;         /* Adjust width if needed */
    padding-right: 1.35rem
  }

</style>
{#if !Error & Loaded }
  

<div class="workspace container-fluid" data-bs-theme={workspace.theme}>
  <nav class="navbar bg-body-tertiary">
    <div class="container-fluid">
      <h4 class="navbar-brand pl-4 ml-2 mb-0">{workspace.title}</h4>
      <div class="d-flex" role="search">
        <input  class="form-control form-control-sm" bind:value={searchTerm} placeholder="Search or open new page..." aria-label="Search term" type="text" >
        <button class="btn btn-sm btn-outline-secondary" type="button" on:click={() => searchPage(searchTerm)} >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
          </svg>
        </button>
        <button on:click={toggleTheme} type="button" class="btn btn-sm btn-outline-secondary b"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-palette-fill" viewBox="0 0 16 16">
          <path d="M12.433 10.07C14.133 10.585 16 11.15 16 8a8 8 0 1 0-8 8c1.996 0 1.826-1.504 1.649-3.08-.124-1.101-.252-2.237.351-2.92.465-.527 1.42-.237 2.433.07M8 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m4.5 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3M5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
        </svg></button>
        <button on:click={toggleTheme} type="button" class="btn btn-sm btn-outline-secondary b"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy" viewBox="0 0 16 16">
          <path d="M11 2H9v3h2z"/>
          <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
        </svg></button>

        <button on:click={toggleTheme} type="button" class="btn btn-sm btn-outline-secondary b">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-door-open" viewBox="0 0 16 16">
            <path d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1"/>
            <path d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117M11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5M4 1.934V15h6V1.077z"/>
          </svg>
        </button>

        <button on:click={toggleTheme} type="button" class="btn btn-sm btn-outline-secondary b">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sliders" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1z"/>
          </svg>
        </button>
       
            
      </div>
    </div>
  </nav>
  <!-- Pages Container -->
  <div class="pages-container">
    {#each pages as page}
    <div class="page {page.size}">
      <div class="d-flex justify-content-between align-items-center">
        <span class="page-title"></span>
        <div class="d-flex align-items-center">
          <select  class="form-select form-select-sm" style="width: auto;border-radius:0px;" on:keydown={handleKeydown} on:change={(e) => changePageSize(page, e.target.value)} bind:value={page.size}>
            <option value="small">25%</option>
            <option value="medium">50%</option>
            <option value="large">75%</option>
            <option value="full">100%</option>
          </select>
    
          <!-- Close Button -->
          <button class="btn btn-sm btn-outline-danger" on:click={() => closePage(page.id)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
          </svg></button>
        </div>
      </div>
      {#if page.pageType == "help"}
      <HelpDoc key={page.criteria.key} ></HelpDoc>
      {/if}

      {#if page.pageType == "search"}
      <RecordSearch  on:openLink={(event) => handleOpenLinkRequests(event.detail)} ></RecordSearch>
      {/if}

      {#if page.pageType == "open"}
      <Record  on:openLink={(event) => handleOpenLinkRequests(event.detail)}></Record>
      {/if}
      

    </div>
  {/each}
  </div>
</div>
{:else}
<div class="alert alert-primary">
Loading workspace
</div>
{/if}