<script>
  import { onMount } from "svelte";
  import HelpDoc from "./helppage/HelpDoc.svelte";
  import RecordSearch from "./beanbagdb/RecordSearch.svelte";
  // This will hold our array of opened pages/components
  let pages = [];

  // Search term input
  let searchTerm = '';

  // Method to add a new page
  function addPage(pageType, criteria={}, size = 'medium') {
    console.log(pageType)
    const singlePageTypes = ["dashboard"]
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
      addPage("helpPage",{key:rest.join("")})
    }

    if(firstPart=="find"){
      addPage("searchPage",{key:rest.join("")})
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

  onMount(()=>{
    if(pages.length==0){
      // new workspace, open the dash board automatically 
      searchPage("find/search")

    }
  })
</script>

<style>
  .workspace {
    display: flex;
    flex-direction: column;
    /* gap: 1rem; */
  }

  html, body, .workspace {
  height: 97vh;
  margin: 0;
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
  /* background-color: #f0f0f0; */
}

.page {
  flex-shrink: 0; /* Prevent pages from shrinking */
  min-height: 100px;
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
  /* background-color: #fff; */
  padding: 0.5rem;
   /* border: 0px solid #ddd;  */
  position: relative;
  margin-right: -14px;
  overflow-y: scroll;
  border-right: 5px solid #f8f9fa;
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

.small-dropdown {
    font-size: 1rem;   /* Reduce text size */
    padding-left: 1.5rem;    /* Smaller padding */
    width: auto;         /* Adjust width if needed */
    padding-right: 1.35rem
  }

</style>
<div class="container-fluid">

</div>
<div class="workspace">
  <nav class="navbar bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand">Workspace</a>
      <form class="d-flex" role="search">
        <input  class="form-control" bind:value={searchTerm} placeholder="Search or open new page..." aria-label="Search term" type="text" >
        <button class="btn btn-outline-success" type="button" on:click={() => searchPage(searchTerm)} >Search</button>
      </form>
    </div>
  </nav>
  <!-- Pages Container -->
  <div class="pages-container">
    {#each pages as page}
    <div class="page {page.isMinimized ? 'minimized' : ''} {page.size}">
      <div class="card-header1 d-flex justify-content-between align-items-center">
        <!-- Page title on the left -->
        <span class="page-title">{page.title}</span>
    
        <!-- Dropdown and Close button on the right -->
        <div class="d-flex align-items-center">
          <!-- Size Dropdown -->
          <select class="form-select form-select-sm me-2 small-dropdown" style="width: auto;" on:keydown={handleKeydown} on:change={(e) => changePageSize(page, e.target.value)} bind:value={page.size}>
            <option value="small">25%</option>
            <option value="medium">50%</option>
            <option value="large">75%</option>
            <option value="full">100%</option>
          </select>
    
          <!-- Close Button -->
          <button class="btn btn-sm btn-danger" on:click={() => closePage(page.id)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
          </svg></button>
        </div>
      </div>
      {#if page.pageType == "helpPage"}
      <HelpDoc key={page.criteria.key} ></HelpDoc>
      {/if}

      {#if page.pageType == "searchPage"}
      <RecordSearch></RecordSearch>
      <!-- <HelpDoc key={page.criteria.key} ></HelpDoc> -->
      {/if}

      

    </div>
  {/each}
  </div>
</div>
