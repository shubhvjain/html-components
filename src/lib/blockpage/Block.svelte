<script>
  // var naming convention all global var including external vars are camel case with first letter Capital too.
  import { onMount } from "svelte";
  import { EditorView, keymap, drawSelection,dropCursor,} from "@codemirror/view";
  import { indentWithTab,defaultKeymap,history,historyKeymap,} from "@codemirror/commands";
  import { EditorState } from "@codemirror/state";
  import { loadBlockSyntax } from "./blocklang.js"; // Import your custom language extension
  import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";

  import { myHighlightStyle } from "./highlight.js";
  import { searchKeymap,search} from "@codemirror/search";
  import {bracketMatching,foldKeymap,codeFolding,syntaxHighlighting} from "@codemirror/language";
  import { parser } from "./parser.js";

  /**
   * Unique identifier for the editor block.
   * Important for scrolling between multiple editors or identifying the block.
   * @type {string}
   */
  export let Id;
  export let Options = {};
  /**
   * The initial content of the editor. If not provided, a random block ID is generated.
   * @type {string}
   */
  export let Content = "";
  export let BindView;

  export let onKeyDown = () => {};
  export let onContentChange = () => {};

  // loading the block
  let BlockLoaded = false;
  let BlockStatus = "Loading...";
  // Loading the editor
  let Editor;
  let View;
  let ContentValid = true; // Flag for content validity
  let TextErrors = []; // Errors in the content

  let OptionDivVisible = false;

  const loadBlock = () => {
    BlockLoaded = false;
    BlockStatus = "Loading...";
    let error = [];
    // Id is important for scrolling from one editor to another
    if (!Id) {
      error.push("Block Id not provided");
    }

    let default_options = {
      addRandomIdInNewBlock: true,
    };

    // load default values of option
    Options = { ...Options, ...default_options };

    if (!Content) {
      let randomId = `.[${Math.round(Math.random() * 100)}]`;
      Content = `${Options.addRandomIdInNewBlock ? randomId : ".[ ] "}`;
    }

    if (!BindView) {
      error.push("The required input 'bindview' is not provided");
    }
    if (error.length == 0) {
      BlockLoaded = true;
    } else {
      BlockStatus = `Error in loading block. ${error.join(",")}`;
      BlockLoaded = false;
    }
  };

  const loadEditor = () => {
    
  };

  



  function validateContent(text) {
    let errors = [];
    const hasDoubleNewlines = text.includes("\n\n");
    if (hasDoubleNewlines) {
      errors.push("A block cannot have a blank line");
    }
    const isNotEmpty = text.trim() !== "";
    let validity = isNotEmpty && !hasDoubleNewlines;
    return { validity, errors }; // Valid if not empty and no double newlines
  }

  function checkValidity() {
    let v = validateContent(Content);
    ContentValid = v.validity;
    TextErrors = v.errors;
    onContentChange(Content, ContentValid);
  }

  onMount(() => {
    loadBlock();
    if (BlockLoaded) {
      // Create the editor view only after the DOM element is mounted
      setTimeout(() => {
        if (Editor) {
          View = new EditorView({
            state: EditorState.create({
              doc: Content,
              extensions: [
                keymap.of([
                  indentWithTab,
                  ...defaultKeymap,
                  ...searchKeymap,
                  ...historyKeymap,
                  ...closeBracketsKeymap,
                  ...foldKeymap,
                ]),
                loadBlockSyntax(),
                syntaxHighlighting(myHighlightStyle),
                search(),
                history(),
                bracketMatching(),
                drawSelection(),
                dropCursor(),
                codeFolding(),
                closeBrackets(),
                EditorView.lineWrapping,
                EditorView.updateListener.of((update) => {
                  if (update.changes) {
                    Content = update.state.doc.toString();
                  }
                })
              ]
            }),
            parent: Editor,
          });
          BindView(View);
          Editor.addEventListener("focusout", checkValidity);
        } else {
          console.log("Editor DOM element not found yet.");
        }
      }, 0); // Wait for the next tick to ensure DOM is updated
    } else {
      console.log("Editor cannot be loaded since the component was not loaded successfully");
    }
  });

  $: {
    if (View && Content !== View.state.doc.toString()) {
      View.dispatch({
        changes: { from: 0, to: View.state.doc.length, insert: Content },
      });
    }
  }
</script>

{#if BlockLoaded == true}
  <div>
    <div class="d-flex">
      <div class="p-2 flex-grow-1">
        <div
          bind:this={Editor}
          id={Id}
          class:error={!ContentValid}
          tabindex="0"
          on:keydown={onKeyDown}
          spellcheck="true"
        ></div>
        {#if !ContentValid}
          <small class="text-danger" role="alert">{TextErrors.join(",")}</small>
        {/if}
      </div>
      <div class="p-2">
        <div>
          <button
            class="btn btn-sm"
            on:click={() => {
              OptionDivVisible = !OptionDivVisible;
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-three-dots"
              viewBox="0 0 16 16"
            >
              <path
                d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"
              />
            </svg>
          </button>
        </div>
        <div style="display: {OptionDivVisible ? 'block' : 'none'};">
          <ul class="list-group">
            <li class="list-group-item">An item</li>
            <li class="list-group-item">A second item</li>
            <li class="list-group-item">A third item</li>
            <li class="list-group-item">A fourth item</li>
            <li class="list-group-item">And a fifth one</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
{/if}

{#if BlockLoaded == false}
  <div>
    {BlockStatus}
  </div>
{/if}

<style>
  .error {
    outline: 1px solid var(--bs-danger);
  }
</style>
