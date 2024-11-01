<script>
  import "bootstrap/dist/css/bootstrap.min.css"
  export let base64Image = '';   // Optional base64 image prop

  let imageSrc = base64Image;    // Holds the current image source
  let originalImageSrc = '';      // Holds the original image source for undo functionality
  let originalWidth = 0;         // Original width of the image
  let originalHeight = 0;        // Original height of the image
  let width = 0;                 // Width input value
  let height = 0;                // Height input value
  let cropX = 0;                 // X coordinate for cropping
  let cropY = 0;                 // Y coordinate for cropping
  let cropWidth = 0;             // Width of cropping area
  let cropHeight = 0;            // Height of cropping area
  let imgElement;                // Reference to the image element
  let showCropOverlay = false;   // Show cropping rectangle overlay

  // Update imageSrc whenever base64Image changes from outside
  $: if (base64Image && base64Image !== imageSrc) {
    imageSrc = base64Image;
    originalImageSrc = base64Image; // Store original image for undo
    setTimeout(() => setImageDimensions(), 0); // Set dimensions after image loads
  }

  // Function to handle file input change and load the image
  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        imageSrc = reader.result;
        base64Image = imageSrc; // Update the base64Image to reflect the new image
        originalImageSrc = imageSrc; // Store the new original image for undo
        setTimeout(() => setImageDimensions(), 0); // Set dimensions after image loads
      };
      reader.readAsDataURL(file);
    }
  }

  // Set initial dimensions of the image when loaded
  function setImageDimensions() {
    if (imgElement) {
      originalWidth = imgElement.naturalWidth;
      originalHeight = imgElement.naturalHeight;
      width = originalWidth;  
      height = originalHeight; 
      cropX = 0;
      cropY = 0;
      cropWidth = originalWidth;  
      cropHeight = originalHeight; 
    }
  }

  // Function to resize the base64 image using a canvas
  function resizeBase64Image() {
    if (!imageSrc) return;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      const resizedBase64 = canvas.toDataURL('image/png');
      imageSrc = resizedBase64;
      base64Image = resizedBase64;
    };
  }

  // Function to finalize the cropping area and display it
  function showCropArea() {
    showCropOverlay = true; // Show cropping rectangle overlay
  }

  // Function to apply cropping using a canvas
  function applyCrop() {
    if (!imageSrc) return;

    const canvas = document.createElement('canvas');
    canvas.width = cropWidth;
    canvas.height = cropHeight;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );
      const croppedBase64 = canvas.toDataURL('image/png');
      imageSrc = croppedBase64;
      base64Image = croppedBase64;

      // Reset crop area to the full image and hide overlay
      resetCropArea();
    };
  }

  // Function to reset the cropping area and hide overlay
  function resetCropArea() {
    cropX = 0;
    cropY = 0;
    cropWidth = originalWidth;
    cropHeight = originalHeight;
    showCropOverlay = false; // Hide cropping rectangle overlay
  }

  // Function to reset the image to its original dimensions
  function undoResize() {
    width = originalWidth;
    height = originalHeight;
    resizeBase64Image(); // Resize to original dimensions
  }

  // Function to reset the crop area to the original dimensions
  function undoCrop() {
    // Reset to original image and dimensions
    imageSrc = originalImageSrc; // Restore original image
    base64Image = originalImageSrc; // Update base64Image to original
    resetCropArea(); // Reset cropping parameters
  }

  // Handle mouse events to resize the crop rectangle
  let isResizing = false;
  let resizeCorner = null;

  function startResize(corner) {
    isResizing = true;
    resizeCorner = corner;
  }

  function stopResize() {
    isResizing = false;
    resizeCorner = null;
  }

  function resizeCropArea(event) {
    if (!isResizing) return;

    const mouseX = event.clientX - imgElement.getBoundingClientRect().left;
    const mouseY = event.clientY - imgElement.getBoundingClientRect().top;

    if (resizeCorner === 'bottom-right') {
      cropWidth = Math.max(10, mouseX - cropX);
      cropHeight = Math.max(10, mouseY - cropY);
    } else if (resizeCorner === 'bottom-left') {
      cropWidth = Math.max(10, cropWidth + cropX - mouseX);
      cropX = Math.min(mouseX, cropX + cropWidth);
      cropHeight = Math.max(10, mouseY - cropY);
    } else if (resizeCorner === 'top-right') {
      cropWidth = Math.max(10, mouseX - cropX);
      cropHeight = Math.max(10, cropHeight + cropY - mouseY);
      cropY = Math.min(mouseY, cropY + cropHeight);
    } else if (resizeCorner === 'top-left') {
      cropWidth = Math.max(10, cropWidth + cropX - mouseX);
      cropX = Math.min(mouseX, cropX + cropWidth);
      cropHeight = Math.max(10, cropHeight + cropY - mouseY);
      cropY = Math.min(mouseY, cropY + cropHeight);
    }
  }

  function resetAll() {
    imageSrc = originalImageSrc; // Restore original image
    base64Image = originalImageSrc; // Update base64Image to original
    resetCropArea(); // Reset cropping parameters
    width = originalWidth; // Reset width input
    height = originalHeight; // Reset height input
    resizeBase64Image(); // Resize to original dimensions
}
</script>
<style>
  .image-editor {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
  }

  img {
    border: 1px solid #ccc;
    margin-bottom: 10px;
    position: relative; /* Position relative for the overlay */
    max-width: 100%; /* Make the image responsive */
    height: auto; /* Maintain aspect ratio */
  }

  .crop-overlay {
    position: absolute;
    border: 2px dashed rgba(255, 0, 0, 0.7);
    background: rgba(255, 0, 0, 0.3); /* Semi-transparent red background */
    pointer-events: none; /* Allow clicks to pass through */
  }

  .image-container {
    position: relative; /* Allow absolute positioning of overlay */
  }

  /* Resizing corners */
  .resize-corner {
    position: absolute;
    background: rgba(255, 0, 0, 0.7);
    width: 10px;
    height: 10px;
    cursor: nwse-resize;
  }

  .bottom-right {
    bottom: -5px;
    right: -5px;
    cursor: nwse-resize;
  }

  .bottom-left {
    bottom: -5px;
    left: -5px;
    cursor: nesw-resize;
  }

  .top-right {
    top: -5px;
    right: -5px;
    cursor: nesw-resize;
  }

  .top-left {
    top: -5px;
    left: -5px;
    cursor: nwse-resize;
  }
</style>

<div class="image-editor">
  {#if imageSrc}
    <div class="image-container">
      <img bind:this={imgElement} src={imageSrc} alt="Uploaded Image" on:load={setImageDimensions} 
           on:mousemove={resizeCropArea} on:mouseup={stopResize} on:mouseleave={stopResize} />

      {#if showCropOverlay}
        <div 
          class="crop-overlay" 
          style="left: {cropX}px; top: {cropY}px; width: {cropWidth}px; height: {cropHeight}px;">
        </div>

        <div class="resize-corner bottom-right" on:mousedown={() => startResize('bottom-right')} />
        <div class="resize-corner bottom-left" on:mousedown={() => startResize('bottom-left')} />
        <div class="resize-corner top-right" on:mousedown={() => startResize('top-right')} />
        <div class="resize-corner top-left" on:mousedown={() => startResize('top-left')} />
      {/if}
    </div>

    <!-- Add Bootstrap cards for controls -->
     <details>
      <summary>Edit</summary>
      <div class="container mt-4">
        <div class="row">
          <div class="col-md-3">
            <div class="card mb-3">
              <div class="card-body text-center">
                <h5 class="card-title">Upload Image</h5>
                <input type="file" accept="image/*" class="form-control" on:change={handleFileUpload} />
                <p class="card-text">Upload a new image to edit.</p>
              </div>
            </div>
          </div>
  
          <div class="col-md-3">
            <div class="card mb-3">
              <div class="card-body text-center">
                <h5 class="card-title">Resize Image</h5>
                <label class="form-label">Width:</label>
                <input type="number" class="form-control mb-2" bind:value={width} min="1" />
                <label class="form-label">Height:</label>
                <input type="number" class="form-control mb-2" bind:value={height} min="1" />
                <button class="btn btn-primary" on:click={resizeBase64Image}>Resize</button>
                <button class="btn btn-secondary" on:click={undoResize}>Undo Resize</button>
              </div>
            </div>
          </div>
  
          <div class="col-md-3">
            <div class="card mb-3">
              <div class="card-body text-center">
                <h5 class="card-title">Crop Image</h5>
                <button class="btn btn-info mb-2" on:click={showCropArea}>Show Crop Area</button>
                <button class="btn btn-success mb-2" on:click={applyCrop}>Apply Changes</button>
                <button class="btn btn-warning" on:click={undoCrop}>Undo Crop</button>
              </div>
            </div>
          </div>
  
          <div class="col-md-3">
            <div class="card mb-3">
              <div class="card-body text-center">
                <h5 class="card-title">Reset Changes</h5>
                <button class="btn btn-danger" on:click={resetAll}>Reset All Changes</button>
                <p class="card-text">Revert all modifications to the original image.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
     </details>
    
  {:else}
    <p>No image uploaded.</p>
  {/if}
</div>