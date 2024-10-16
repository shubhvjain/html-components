<script>
  import { createEventDispatcher, onMount, afterUpdate} from 'svelte';
  import { writable } from 'svelte/store';
  export let query = {}; // Query provided by the parent in JSON format
  export let docs = []; // Document data passed from the parent component
  // openLink

  //*** this part is for record selection *//

  let selectionType = "no"; // default selection type
  let selectedDoc = null; // single selection
  let selectedDocs = []; // multiple selection
  const dispatch = createEventDispatcher();

  function handleSelection(docLink) {selectedDoc = docLink;}

  function handleMultiSelection(docLink, isChecked) {
    if (isChecked) {
      selectedDocs = [...selectedDocs, docLink];
    } else {
      selectedDocs = selectedDocs.filter(link => link !== docLink);
    }
  }

  function submitSelectedRecord() {
    if (selectionType === "single") {
      dispatch('selectedRecords', selectedDoc); // dispatch selected document to parent
    } else if (selectionType === "multiple") {
      dispatch('selectedRecords', selectedDocs); // dispatch selected documents to parent
    }
    console.log(selectedDocs)
  }

  function openPageLink(link){
    dispatch("openLink",`open/link/${link}`)
  }
  
  $: selectedCount = selectionType === "multiple" ? selectedDocs.length : (selectedDoc ? 1 : 0);

  


  //** this part is for loading the data and loading the list of fields available and to enable selection of fields ***//
  let isLoading = true; // Show loading state
  
  
  let showFields = {
    'meta.link': true,
    'meta.createdOn': true,
    'meta.updatedOn': true,
  };
  const toggledFields = writable({ ...showFields });
  let availableFields = new Set();
  let allFields = writable([]);

    // Function to dynamically gather all available fields from the docs
  function gatherFields() {
    docs.forEach(doc => {
      Object.keys(doc.data).forEach(field => availableFields.add(`data.${field}`));
      Object.keys(doc.meta).forEach(field => availableFields.add(`meta.${field}`));
    });
    //console.log(availableFields)
    // Combine provided additional fields with the ones found dynamically
    allFields.set(Array.from(availableFields));
  }


  // Helper function to access nested fields (data.field or meta.field)
  function getFieldValue(doc, field) {
    const [obj, key] = field.split('.');
    return doc[obj] && doc[obj][key] ? doc[obj][key] : '';
  }

  // Fetch and load the data based on the query
  async function loadData() {
    isLoading = true;
    try {
      allFields.set([])
      docs = [
  {"meta": {"link": "doc1", "createdOn": "2023-01-10", "updatedOn": "2023-01-12", "tags": ["tutorial", "beginner"]}, "schema": "article", "data": {"title": "Introduction to Svelte", "author": "John Doe", "views": 134, "likes": 23}},
  {"meta": {"link": "doc2", "createdOn": "2023-01-15", "updatedOn": "2023-01-18", "tags": ["svelte", "advanced"]}, "schema": "article", "data": {"title": "Advanced Svelte Concepts", "description": "A deep dive into Svelte's reactivity", "editor": "Sarah Blake"}},
  {"meta": {"link": "doc3", "createdOn": "2023-02-05", "updatedOn": "2023-02-08", "tags": ["reactivity"]}, "schema": "tutorial", "data": {"title": "Understanding Reactivity", "description": "How reactivity works in Svelte", "author": "Chris Evans", "rating": 4.5}},
  {"meta": {"link": "doc4", "createdOn": "2023-02-20", "updatedOn": "2023-02-22", "tags": ["UI", "components"]}, "schema": "guide", "data": {"title": "Building Reusable Components", "author": "Alex Green", "published": true, "comments": 15}},
  {"meta": {"link": "doc5", "createdOn": "2023-03-01", "updatedOn": "2023-03-02", "tags": ["performance"]}, "schema": "article", "data": {"title": "Optimizing Svelte Apps", "description": "Improve app performance with these tips", "views": 500, "likes": 80}},
  {"meta": {"link": "doc6", "createdOn": "2023-03-05", "updatedOn": "2023-03-06", "tags": ["backend", "api"]}, "schema": "guide", "data": {"title": "Connecting to a REST API", "api_url": "https://api.example.com", "author": "Michael Johnson", "likes": 45}},
  {"meta": {"link": "doc7", "createdOn": "2023-03-10", "updatedOn": "2023-03-12", "tags": ["tutorial"]}, "schema": "tutorial", "data": {"title": "State Management in Svelte", "author": "Sarah Lee", "difficulty": "Intermediate"}},
  {"meta": {"link": "doc8", "createdOn": "2023-03-15", "updatedOn": "2023-03-16", "tags": ["UI"]}, "schema": "article", "data": {"title": "Styling Svelte Components", "views": 320, "rating": 4.8, "author": "Tom Wilson"}},
  {"meta": {"link": "doc9", "createdOn": "2023-04-02", "updatedOn": "2023-04-04", "tags": ["testing"]}, "schema": "tutorial", "data": {"title": "Testing Svelte Apps", "description": "How to test your Svelte applications", "author": "Rebecca Taylor", "views": 150}},
  {"meta": {"link": "doc10", "createdOn": "2023-04-05", "updatedOn": "2023-04-06", "tags": ["beginner"]}, "schema": "guide", "data": {"title": "Getting Started with Svelte", "author": "David Wright", "views": 320, "difficulty": "Beginner"}},
  {"meta": {"link": "doc11", "createdOn": "2023-04-10", "updatedOn": "2023-04-12", "tags": ["components"]}, "schema": "article", "data": {"title": "Svelte's Component Model", "author": "Eve Harris", "views": 190, "likes": 100}},
  {"meta": {"link": "doc12", "createdOn": "2023-04-15", "updatedOn": "2023-04-16", "tags": ["hooks"]}, "schema": "article", "data": {"title": "Using Lifecycle Hooks in Svelte", "author": "Elena King", "published": false}},
  {"meta": {"link": "doc13", "createdOn": "2023-05-02", "updatedOn": "2023-05-04", "tags": ["reactivity"]}, "schema": "guide", "data": {"title": "Mastering Reactivity in Svelte", "author": "Nina Roberts", "rating": 4.7}},
  {"meta": {"link": "doc14", "createdOn": "2023-05-05", "updatedOn": "2023-05-06", "tags": ["app"]}, "schema": "tutorial", "data": {"title": "Building a CRUD App", "description": "Create, Read, Update, Delete in Svelte", "views": 540, "comments": 5}},
  {"meta": {"link": "doc15", "createdOn": "2023-05-08", "updatedOn": "2023-05-10", "tags": ["reactivity"]}, "schema": "article", "data": {"title": "Reactive Variables in Svelte", "author": "Jackie Thompson", "views": 250, "likes": 80, "published": true}},
  {"meta": {"link": "doc16", "createdOn": "2023-06-01", "updatedOn": "2023-06-03", "tags": ["UX"]}, "schema": "guide", "data": {"title": "Designing for Accessibility", "author": "Lily Davis", "rating": 4.2, "difficulty": "Advanced"}},
  {"meta": {"link": "doc17", "createdOn": "2023-06-05", "updatedOn": "2023-06-06", "tags": ["svelte"]}, "schema": "article", "data": {"title": "Svelte vs. React", "author": "Nash Moore", "views": 330, "likes": 20}},
  {"meta": {"link": "doc18", "createdOn": "2023-06-12", "updatedOn": "2023-06-14", "tags": ["framework"]}, "schema": "guide", "data": {"title": "Svelte vs Other Frameworks", "author": "Anna Lee", "rating": 4.9, "comments": 10}},
  {"meta": {"link": "doc19", "createdOn": "2023-06-18", "updatedOn": "2023-06-19", "tags": ["frontend"]}, "schema": "tutorial", "data": {"title": "Frontend Development with Svelte", "author": "Oliver Harris", "views": 280, "likes": 30}},
  {"meta": {"link": "doc20", "createdOn": "2023-07-02", "updatedOn": "2023-07-04", "tags": ["UI"]}, "schema": "article", "data": {"title": "Responsive Layout in Svelte", "author": "Mia Roberts", "likes": 18}},
  {"meta": {"link": "doc21", "createdOn": "2023-07-10", "updatedOn": "2023-07-12", "tags": ["components"]}, "schema": "guide", "data": {"title": "Reusable UI Components", "author": "Victor Lane", "views": 220, "rating": 4.8}},
  {"meta": {"link": "doc22", "createdOn": "2023-07-15", "updatedOn": "2023-07-16", "tags": ["API"]}, "schema": "tutorial", "data": {"title": "GraphQL API in Svelte", "author": "Sophia Adams", "comments": 12}},
  {"meta": {"link": "doc23", "createdOn": "2023-07-20", "updatedOn": "2023-07-22", "tags": ["performance"]}, "schema": "article", "data": {"title": "Svelte Performance Optimization", "author": "Liam Scott", "views": 350, "likes": 75}},
  {"meta": {"link": "doc24", "createdOn": "2023-08-01", "updatedOn": "2023-08-03", "tags": ["integration"]}, "schema": "guide", "data": {"title": "Integrating Firebase with Svelte", "author": "David Blake", "likes": 56, "published": true}},
  {"meta": {"link": "doc25", "createdOn": "2023-08-10", "updatedOn": "2023-08-12", "tags": ["api"]}, "schema": "article", "data": {"title": "Building REST API in Svelte", "author": "Jake Foster", "rating": 5.0, "comments": 5}},
  {"meta": {"link": "doc26", "createdOn": "2023-08-15", "updatedOn": "2023-08-17", "tags": ["svelte"]}, "schema": "guide", "data": {"title": "Svelte's State Management", "author": "Olivia Wright", "views": 290, "difficulty": "Advanced"}},
  {"meta": {"link": "doc27", "createdOn": "2023-08-20", "updatedOn": "2023-08-21", "tags": ["components"]}, "schema": "tutorial", "data": {"title": "Dynamic Components in Svelte", "author": "Jack Morrison", "comments": 20, "likes": 100}},
  {"meta": {"link": "doc28", "createdOn": "2023-08-25", "updatedOn": "2023-08-26", "tags": ["reactivity"]}, "schema": "article", "data": {"title": "Mastering Reactive Statements", "author": "Maria Hunter", "published": false}},
  {"meta": {"link": "doc29", "createdOn": "2023-09-01", "updatedOn": "2023-09-03", "tags": ["hooks"]}, "schema": "guide", "data": {"title": "Using Svelte's Hooks Effectively", "author": "Michael Green", "views": 415}},
  {"meta": {"link": "doc30", "createdOn": "2023-09-10", "updatedOn": "2023-09-12", "tags": ["design"]}, "schema": "article", "data": {"title": "Svelte Design Patterns", "author": "Emma Davis", "likes": 130, "comments": 30}},
  {"meta": {"link": "doc31", "createdOn": "2023-09-15", "updatedOn": "2023-09-17", "tags": ["api"]}, "schema": "guide", "data": {"title": "REST API in Svelte", "author": "Amelia White", "comments": 8}},
  {"meta": {"link": "doc32", "createdOn": "2023-09-20", "updatedOn": "2023-09-21", "tags": ["framework"]}, "schema": "tutorial", "data": {"title": "Choosing a Framework for Your App", "author": "Lucas Green", "views": 200, "rating": 4.2}},
  {"meta": {"link": "doc33", "createdOn": "2023-09-22", "updatedOn": "2023-09-23", "tags": ["performance"]}, "schema": "guide", "data": {"title": "Improving Performance in Svelte", "author": "Nina Brooks", "views": 210, "comments": 18}},
  {"meta": {"link": "doc34", "createdOn": "2023-10-01", "updatedOn": "2023-10-03", "tags": ["backend"]}, "schema": "article", "data": {"title": "Connecting Svelte with Node.js", "author": "Jake Adams", "rating": 4.3, "views": 300}},
  {"meta": {"link": "doc35", "createdOn": "2023-10-05", "updatedOn": "2023-10-07", "tags": ["design"]}, "schema": "article", "data": {"title": "Designing for Mobile with Svelte", "author": "Sophia Thomas", "views": 520}},
  {"meta": {"link": "doc36", "createdOn": "2023-10-12", "updatedOn": "2023-10-14", "tags": ["testing"]}, "schema": "tutorial", "data": {"title": "End-to-End Testing in Svelte", "author": "David Kim", "comments": 15}},
  {"meta": {"link": "doc37", "createdOn": "2023-10-14", "updatedOn": "2023-10-15", "tags": ["frontend"]}, "schema": "guide", "data": {"title": "Svelte for Frontend Developers", "author": "Natalie Brooks", "views": 680}},
  {"meta": {"link": "doc38", "createdOn": "2023-10-10", "updatedOn": "2023-10-11", "tags": ["UX"]}, "schema": "article", "data": {"title": "UI/UX Best Practices in Svelte", "author": "Aaron Lee", "likes": 40}},
  {"meta": {"link": "doc39", "createdOn": "2023-10-01", "updatedOn": "2023-10-05", "tags": ["reactivity"]}, "schema": "tutorial", "data": {"title": "Reacting to Data Changes in Svelte", "author": "Tracy Adams", "rating": 4.7}},
  {"meta": {"link": "doc40", "createdOn": "2023-10-01", "updatedOn": "2023-10-04", "tags": ["performance"]}, "schema": "article", "data": {"title": "Optimizing Svelte's Reactive Model", "author": "Ryan Harris", "views": 100, "likes": 25}},
  {"meta": {"link": "doc41", "createdOn": "2023-10-10", "updatedOn": "2023-10-12", "tags": ["api"]}, "schema": "tutorial", "data": {"title": "Integrating GraphQL with Svelte", "author": "Emma Reynolds", "likes": 15}},
  {"meta": {"link": "doc42", "createdOn": "2023-10-11", "updatedOn": "2023-10-13", "tags": ["components"]}, "schema": "article", "data": {"title": "Dynamic UI Components in Svelte", "author": "Oliver Evans", "rating": 4.8}},
  {"meta": {"link": "doc43", "createdOn": "2023-10-15", "updatedOn": "2023-10-17", "tags": ["testing"]}, "schema": "tutorial", "data": {"title": "End-to-End Testing for Svelte Apps", "author": "Sophie Brooks", "views": 250}},
  {"meta": {"link": "doc44", "createdOn": "2023-10-19", "updatedOn": "2023-10-21", "tags": ["frontend"]}, "schema": "guide", "data": {"title": "Frontend Development Workflow with Svelte", "author": "Elena White", "likes": 130, "comments": 12}},
  {"meta": {"link": "doc45", "createdOn": "2023-10-22", "updatedOn": "2023-10-23", "tags": ["UX"]}, "schema": "article", "data": {"title": "User Experience in Svelte", "author": "Mason Scott", "rating": 4.4, "views": 300}}
]
      gatherFields()
      isLoading = false; // Set loading to false once data is loaded
    } catch (error) {
      console.error('Error loading data:', error);
      isLoading = false; // Set loading to false on error
    }
  }

  function handleFieldSelectionCheckbox(field, event) {
    toggledFields.update(f => {
      f[field] = event.target.checked;
      console.log(f)
      return f;
    });
  }

  let sortDirections = writable({});


  function handleSort(field) {
    const currentDirection = $sortDirections[field] || "asc";
    const newDirection = currentDirection === "asc" ? "desc" : "asc";

    // Update the sort direction for the clicked field
    sortDirections.update(directions => {
      directions[field] = newDirection;
      return directions;
    });

    // Sort docs based on the clicked field and direction
    const direction = newDirection;
    docs = docs.sort((a, b) => {
      const aValue = field.includes("data.") ? a.data[field.split('.')[1]] : a.meta[field.split('.')[1]];
      const bValue = field.includes("data.") ? b.data[field.split('.')[1]] : b.meta[field.split('.')[1]];

      if (aValue === bValue) return 0;
      return direction === "asc" ? (aValue < bValue ? -1 : 1) : (aValue > bValue ? -1 : 1);
    });
  }



  // Load data on component mount and whenever query changes
  onMount(() => {
    loadData();
  });

  afterUpdate(() => {
    if (query && Object.keys(query).length > 0) {
      loadData();
    }
  });

</script>

<!-- Dropdown for selecting "no", "single", or "multiple" -->
<!-- <div class="form-group">
  <label for="selectionType">Select Mode:</label>
  <select id="selectionType" bind:value={selectionType} class="form-control">
    <option value="no">No Selection</option>
    <option value="single">Single Selection</option>
    <option value="multiple">Multiple Selection</option>
  </select>
</div> -->

<div>

  {#if isLoading}
  <p>Searching...</p>
{:else}
  <div>
    <!-- Show the fields dynamically in a details tag -->
    <details>
      <summary>Show/Hide Fields</summary>
      <div class="fields-grid">
        {#each $allFields as field (field)}
          <div class="field-checkbox">
            <label>
              <input type="checkbox" checked={$toggledFields[field]} on:change={(e) => handleFieldSelectionCheckbox(field, e)} />
              {field}
            </label>
          </div>
        {/each}
      </div>
    </details>

    

    <!-- Display the search results in a table -->
    <table class="table">
      <thead>
        <tr>
          {#each $allFields as field, index}
            {#if $toggledFields[field]} 
              <td>{field}  
                <button class="btn btn-sm btn-outline-secondary" on:click={() => handleSort(field)}>Sort</button>  
              </td> 
            {/if}
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each docs as doc}
          <tr>
            
            {#each $allFields as field, index}
              {#if $toggledFields[field]} <td>
                {#if field=="meta.link"}
                  <button type="button" class="btn btn-link" on:click={openPageLink(doc.meta.link)}>{getFieldValue(doc,field)}</button>
                {:else}
                  {getFieldValue(doc,field)}
                {/if}


                </td> 
              {/if}
            {/each}

            <td>
              {#if selectionType === 'single'}
              <td>
                <input type="radio" name="docSelection" on:change={() => handleSelection(doc.meta.link)} />
              </td>
            {/if}
            {#if selectionType === 'multiple'}
              <td>
                <input type="checkbox" on:change={(e) => handleMultiSelection(doc.meta.link, e.target.checked)} />
              </td>
            {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>

    {#if selectionType !== 'no'}
    <button class="btn btn-primary mt-2" on:click={submitSelectedRecord}>
      Submit {selectedCount > 0 ? `(${selectedCount} selected)` : ''}
    </button>
  {/if}
  </div>
{/if}

</div>



<style>

.fields-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    padding: 10px;
  }

  .field-checkbox {
    display: flex;
    align-items: center;
  }

  .field-checkbox input {
    margin-right: 5px;
  }

details {
  border: 1px solid #aaa;
  border-radius: 4px;
  padding: 0.5em 0.5em 0;
}

summary {
  font-weight: bold;
  margin: -0.5em -0.5em 0;
  padding: 0.5em;
}

details[open] {
  padding: 0.5em;
}

details[open] summary {
  border-bottom: 1px solid #aaa;
  margin-bottom: 0.5em;
}

</style>