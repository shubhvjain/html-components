<script>
  import Block from "./Block.svelte";
  let options = {
    showAddButtonAfterEachBlock: false,
  };
  let blocks = [
    {
        view: null,
        editor : {
          content:".[block1] This is the title of the block\nMore content comes here.This is great. This is just a single line.Next line will have an annotation\n>[block21]\n~[label,block12]\nSome more text will come here\n- This is a line\n- This is yet another line\n- key : Value\n/[This is a comment]",
          isValid: true,
          //options:{}
        }
    },
    // {
    //   content:
    //     "Ut enim ad minim veniam,\nquis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    //   view: null,
    //   isValid: true,
    // },
    // {
    //   content:
    //     "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    //   view: null,
    //   isValid: true,
    // },
    // {
    //   content:
    //     "Excepteur sint occaecat cupidatat non proident,\nsunt in culpa qui officia deserunt mollit anim id est laborum.",
    //   view: null,
    //   isValid: true,
    // },
    // {
    //   content:
    //     "Curabitur pretium tincidunt lacus.\nNulla gravida orci a odio.\nNullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis.",
    //   view: null,
    //   isValid: true,
    // },
  ];

  function bindEditorView(view, index) {
    blocks[index].view = view; // Store the view in the blocks array
  }

  function handleContentChange(newContent, isValid, index) {
    // Update the blocks array with the new content and validity status
    blocks[index].content = newContent;
    blocks[index].isValid = isValid;
  }

  function handleKeyDown(event, index) {
    const currentBlock = blocks[index];
    const currentEditorView = currentBlock.view;

    if (currentEditorView) {
      const cursorPos = currentEditorView.state.selection.main.head;
      const docLength = currentEditorView.state.doc.length;
      const lastLineEnd = currentEditorView.state.doc.lineAt(docLength).to;

      if (event.key === "ArrowDown") {
        // If at the end of the current editor (last line), move to the button or to the next editor based on the options
        if (cursorPos === lastLineEnd) {
          if (options.showAddButtonAfterEachBlock) {
            document.getElementById(`add-button-${index}`).focus(); // Focus the button
          } else {
            if (index < blocks.length - 1) {
              const nextEditorView = blocks[index + 1].view;
              if (nextEditorView) {
                nextEditorView.focus(); // Focus the next editor
                nextEditorView.dispatch({
                  selection: { anchor: 0 }, // Move cursor to the start of the next editor
                });
              }
            }
          }
        }
      } else if (event.key === "ArrowUp") {
        // Move to the button of the previous block
        if (options.showAddButtonAfterEachBlock) {
          if (index > 0 && cursorPos === 0) {
            document.getElementById(`add-button-${index - 1}`).focus(); // Focus the button of the previous block
          }
        } else {
          if (index > 0 && cursorPos === 0) {
            const prevEditorView = blocks[index-1].view;
            if (prevEditorView) {
              prevEditorView.focus();
              const lastLineEnd = prevEditorView.state.doc.lineAt(
                prevEditorView.state.doc.length
              ).to;
              prevEditorView.dispatch({
                selection: { anchor: lastLineEnd }, // Move cursor to the end of the previous editor
              });
            }
          }
        }
      }
    }
  }

  function addNewBlock(index) {
    // Add a new block to the blocks array
    blocks.splice(index + 1, 0, {
      content: `Title\nSub title\nSome text${index}`,
      view: null,
    });
    blocks = blocks;
  }

  function handleButtonKeyDown(event, index) {
    if (event.key === "Enter") {
      addNewBlock(index); // Add a new block below the current block
    } else if (event.key === "ArrowUp") {
      // Move focus to the last line of the previous editor
      if (index > -1) {
        const prevEditorView = blocks[index].view;
        if (prevEditorView) {
          prevEditorView.focus();
          const lastLineEnd = prevEditorView.state.doc.lineAt(
            prevEditorView.state.doc.length
          ).to;
          prevEditorView.dispatch({
            selection: { anchor: lastLineEnd }, // Move cursor to the end of the previous editor
          });
        }
      }
    } else if (event.key === "ArrowDown") {
      // Move to the next block's editor
      if (index < blocks.length - 1) {
        const nextEditorView = blocks[index + 1].view;
        if (nextEditorView) {
          nextEditorView.focus(); // Focus the next editor
          nextEditorView.dispatch({
            selection: { anchor: 0 }, // Move cursor to the start of the next editor
          });
        }
      }
    }
  }
</script>

<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Navbar</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Link</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Dropdown
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled" aria-disabled="true">Disabled</a>
        </li>
      </ul>
      <form class="d-flex" role="search">
        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
    </div>
  </div>
</nav>

{#each blocks as block, index}
  <Block
    Id={"block-" + index}
    Options={options}
    Content={block.editor.content}
    onKeyDown={(e) => handleKeyDown(e, index)}
    BindView={(view) => bindEditorView(view, index)}
    onContentChange={(newContent, isValid) =>
      handleContentChange(newContent, isValid, index)}
  />
  {#if options.showAddButtonAfterEachBlock}
    <button
      id={`add-button-${index}`}
      on:keydown={(e) => handleButtonKeyDown(e, index)}
      on:click={() => addNewBlock(index)}
    >
      Add Block
    </button>
  {/if}
{/each}

<!-- <table class="table">
  <thead>
    <tr>
      <th> Index </th>
      <th> Text </th>
      <th> Validity </th>
    </tr>
  </thead>
  <tbody>
    {#each blocks as block, index}
      <tr>
        <td>
          {index}
        </td>
        <td>
          {block.content}
        </td>
        <td>
          {block.isValid}
        </td>
      </tr>
    {/each}
  </tbody>
</table> -->

<style>
  .block {
    margin-bottom: 1rem;
  }
</style>
