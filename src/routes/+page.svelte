<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>


<script>
  import JsonEditor from "../lib/JsonEditor.svelte";
  import Page from "$lib/blockpage/Page.svelte";
  let components = [
    {
      name:"JsonEditor",
      use:"To show a form based on its "
    }
  ]


</script>

<h2> JSON Editor setup </h2>

<!-- <JsonEditor></JsonEditor> -->
 <Page></Page>