<script>
  import { onMount } from "svelte";
  import HelpDoc from "./helppage/HelpDoc.svelte";

  // This will hold our array of opened pages/components
  let pages = [];

  // Search term input
  let searchTerm = '';

  // Method to add a new page
  function addPage(pageType, criteria={}, size = 'medium') {
    const singlePageTypes = ["dashboard"]
    const existingPage = pages.find(page => page.pageType === pageType);
    
    if (existingPage) {
      existingPage.isMinimized = false;
    } else {
      pages = [...pages, { id: Date.now(), pageType, criteria, title: `Help page`, size }];
    }
    
  }

  const searchPage = (text)=>{
    const [firstPart, ...rest] = text.split('/')
    if(firstPart=="help"){
      addPage("helpPage",{key:rest.join("")})
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

  onMount(()=>{
    if(pages.length==0){
      // new workspace, open the dash board automatically 

    }
  })
</script>

<style>
  .workspace {
    display: flex;
    flex-direction: column;
    gap: 1rem;
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
  justify-content: space-between;
  /* background-color: #fff; */
  /* padding: 1rem; */
   border: 0px solid #ddd; 
  position: relative;
  margin-right: -14px;
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
    font-weight: bold;
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

</style>

<div class="workspace">
  <!-- Search Box -->
  <div class="search-box">

    <div class="input-group">
      <input type="text" class="form-control" bind:value={searchTerm} placeholder="Search or open new page..." aria-label="Search term">
      <button on:click={() => searchPage(searchTerm)} class="btn btn-outline-secondary" type="button">Search</button>
      <button  class="btn btn-outline-secondary" type="button">Button</button>
    </div>

    <!-- <input type="text" class="form-control" bind:value={searchTerm} placeholder="Search or open new page..." style="flex-grow: 1;" />
    <button >Open Page</button> -->
  </div>

  <!-- Pages Container -->
  <div class="pages-container">
    {#each pages as page}
    <div class="page {page.isMinimized ? 'minimized' : ''} {page.size}">
      <div class="card">

        <div class="card-header d-flex justify-content-between align-items-center">
          <!-- Page title on the left -->
          <span class="page-title">{page.title}</span>
      
          <!-- Dropdown and Close button on the right -->
          <div class="d-flex align-items-center">
            <!-- Size Dropdown -->
            <select class="form-select form-select-sm me-2" style="width: auto;" on:change={(e) => changePageSize(page, e.target.value)} bind:value={page.size}>
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
        <div class="card-body">
          {#if page.pageType == "helpPage"}
            <HelpDoc key={page.criteria.key} ></HelpDoc>
          {/if}
        </div>
      </div>

      

    </div>
  {/each}
  </div>
</div>
