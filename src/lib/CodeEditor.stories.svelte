<script context="module">
  // import {Story} from '@storybook/addon-svelte-csf'
  import CodeEditor from './CodeEditor.svelte';
  export const meta = {
    title : "Code editor",
    component : CodeEditor
  }
</script>

<script>
  import { Story, Template } from '@storybook/addon-svelte-csf';
  let code = `let a = 1;\nlet b = 3;`
  let json_code = `{"valid":"yes"}`
</script>

<Story name="Code missing">
  <div class="alert alert-dark">Blank code editor.No language specified</div>
  <CodeEditor code={""} ></CodeEditor>
</Story>

<Story name="Javascript Code">
  <div class="alert alert-dark">Code editor with JS code</div>
  <CodeEditor code={code} language={'javascript'}></CodeEditor>
</Story>

<Story name="JSON">
  <div class="alert alert-dark">Code editor with valid JSON.</div>
  <CodeEditor code={json_code} language={'json'}></CodeEditor>

  <div class="alert alert-dark">Code editor with invalid JSON.</div>
  <CodeEditor code={code} language={'json'}></CodeEditor>

  <div class="alert alert-dark">Blank JSON Code editor</div>
  <CodeEditor code={"{}"} language={'json'}></CodeEditor>
</Story>

