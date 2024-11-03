<script>
  import "bootstrap/dist/css/bootstrap.min.css"
  import { onMount } from "svelte";
  import axios from "axios";

  export let database_list = []; // Expected to be an array of databases
  export let prompt_list = [];    // Expected to be an array of prompts
  export let settings = { api_key: null }; // Expected to be an object containing an api_key

  let prompt = "";
  let promptName = "";
  let selectedDatabase = "";
  let selectedSavedPrompt = "";
  let statusMessage = "";
  let statusType = ""; // 'success', 'error', 'info'
  let databases = [
    { name: "Database 1", schema: {/* JSON Schema */} },
    { name: "Database 2", schema: {/* JSON Schema */} },
  ];
  let result = null;
  let loading = false;
  let savedPrompts = [];
  let isUpdating = false;  // Flag to check if we're in update mode

  // Check if required data is available
  const isReady = () => {
    const missingElements = [];
    if (!database_list || database_list.length === 0) {
      missingElements.push("Database List");
    }
    if (!prompt_list || prompt_list.length === 0) {
      missingElements.push("Prompt List");
    }
    if (!settings || !settings.api_key) {
      missingElements.push("Key 'YOUR_OPENAI_API_KEY' in the database Settings");
    }
    return missingElements.length === 0 ? true : missingElements;
  };

  // Check if all required elements are present
  const readyStatus = isReady();

  // Function to update status messages
  function updateStatus(message, type) {
    statusMessage = message;
    statusType = type;
  }

  // Load databases and saved prompts on mount
  onMount(async () => {
    await loadSavedPrompts();
  });

  // Function to load saved prompts from the database
  async function loadSavedPrompts() {
    try {
      const response = await axios.get("/api/prompts");  // Replace with your actual API endpoint
      savedPrompts = response.data;
    } catch (error) {
      console.error("Error fetching saved prompts:", error);
    }
  }

  // Function to handle prompt submission
  async function handleSubmit() {
    if (!prompt || !selectedDatabase) return;

    loading = true;
    result = null;

    try {
      const selectedSchema = databases.find(db => db.name === selectedDatabase).schema;

      const response = await axios.post("https://api.openai.com/v1/engines/davinci-codex/completions", {
        prompt: `Generate data according to this schema: ${JSON.stringify(selectedSchema)}. ${prompt}`,
        max_tokens: 150,
        temperature: 0.7,
      }, {
        headers: {
          Authorization: `Bearer ${settings.api_key}`
        }
      });

      result = response.data.choices[0].text.trim();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      loading = false;
    }
  }

  // Function to save the current prompt with a name
  async function savePrompt() {
    if (!prompt || !promptName) return;

    try {
      await axios.post("/api/prompts", { name: promptName, prompt });  // Replace with your actual API endpoint
      await loadSavedPrompts();  // Reload saved prompts after saving the new one
      promptName = "";  // Clear the name input after saving
      prompt = "";  // Clear the prompt input after saving
    } catch (error) {
      console.error("Error saving prompt:", error);
    }
  }

  // Function to load a saved prompt based on the selected name
  function loadSavedPrompt() {
    const selectedPrompt = savedPrompts.find(p => p.name === selectedSavedPrompt);
    if (selectedPrompt) {
      prompt = selectedPrompt.prompt;
      promptName = selectedPrompt.name;
      isUpdating = true;  // Set to update mode
    }
  }

  // Function to update an existing prompt
  async function updatePrompt() {
    if (!prompt || !promptName || !selectedSavedPrompt) return;

    try {
      await axios.put(`/api/prompts/${selectedSavedPrompt}`, { name: promptName, prompt });  // Replace with your actual API endpoint
      await loadSavedPrompts();  // Reload saved prompts after updating
      isUpdating = false;  // Exit update mode
      prompt = "";  // Clear the prompt input
      promptName = "";  // Clear the prompt name
      selectedSavedPrompt = "";  // Reset the dropdown selection
    } catch (error) {
      console.error("Error updating prompt:", error);
    }
  }

  // Function to add the generated record to the database
  function addRecord() {
    // Implement logic to add result to the actual database
    alert("Record added to database!");
  }
</script>


<!-- Main Component HTML -->
<div class="container mt-4">
  {#if readyStatus === true}
    <div class="card shadow-sm p-4 mb-4">
      <h3 class="card-title mb-4">Prompt Generator</h3>
      <div class="row">
        <!-- Left column: Generate and Save Prompts -->
        <div class="col-md-6 pe-4">
          <h5>Generate and Save Prompts</h5>
          <div class="mb-3">
            <label for="prompt" class="form-label">Enter your prompt:</label>
            <textarea
              id="prompt"
              class="form-control"
              bind:value={prompt}
              placeholder="Describe the data you need..."
              rows="4"
            ></textarea>
          </div>

          <div class="mb-3">
            <label for="prompt-name" class="form-label">Prompt Name:</label>
            <input
              id="prompt-name"
              type="text"
              class="form-control"
              bind:value={promptName}
              placeholder="Name this prompt..."
            />
          </div>

          <div class="mb-3">
            <label for="database" class="form-label">Select a database:</label>
            <select id="database" class="form-select" bind:value={selectedDatabase}>
              <option disabled selected>Select a database</option>
              {#each database_list as db}
                <option value={db.name}>{db.name}</option>
              {/each}
            </select>
          </div>

          <div class="mb-3">
            <button
              class="btn btn-primary me-2"
              on:click={handleSubmit}
              disabled={!prompt || !selectedDatabase || loading}
            >
              {loading ? "Loading..." : "Generate Query"}
            </button>

            <button
              class="btn btn-success"
              on:click={savePrompt}
              disabled={!prompt || !promptName}
            >
              Save Prompt
            </button>
          </div>
        </div>

        <!-- Right column: Load a Saved Prompt with border separator -->
        <div class="col-md-6 border-start ps-4">
          <h5>Load a Saved Prompt</h5>
          <div class="mb-3">
            <label for="saved-prompts" class="form-label">Select a saved prompt:</label>
            <select
              id="saved-prompts"
              class="form-select"
              bind:value={selectedSavedPrompt}
              on:change={loadSavedPrompt}
            >
              <option disabled selected>Select a saved prompt</option>
              {#each prompt_list as savedPrompt}
                <option value={savedPrompt.name}>{savedPrompt.name}</option>
              {/each}
            </select>
          </div>
        </div>
      </div>

      <!-- Status Message at the Bottom of the Card -->
      <div class="mt-3">
        {#if statusMessage}
          <div class="alert" class:alert-success={statusType === 'success'} class:alert-danger={statusType === 'error'} class:alert-info={statusType === 'info'}>
            {statusMessage}
          </div>
        {/if}
      </div>
    </div>

    <!-- Results Card (only visible when there is a result) -->
    {#if result}
      <div class="card shadow-sm mt-4 p-4">
        <h3 class="card-title">Generated Data</h3>
        <pre class="p-3 bg-light border rounded">{JSON.stringify(result, null, 2)}</pre>
        <button class="btn btn-outline-primary mt-3" on:click={addRecord}>
          Add Record to Database
        </button>
      </div>
    {/if}
  {:else}
    <!-- Display Missing Items -->
    <div class="alert alert-danger alert-message">
      <strong>Missing Required Information:</strong> To run the AI Assistant, some setup is required which is missing 
      <ul>
        {#each readyStatus as item}
          <li>{item}</li>
        {/each}
      </ul>
    </div>
  {/if}
</div>