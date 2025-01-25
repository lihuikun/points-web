<template>
  <div class="iframe-container">
    <iframe 
      src="https://new-year.lihk.top/" 
      frameborder="0" 
      class="iframe-content"
      @load="onIframeLoad">
    </iframe>
  </div>
</template>

<script lang='ts' setup>
function onIframeLoad() {
      console.log('Iframe loaded successfully');
    }
</script>
<style lang='scss' scoped>
.iframe-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  .iframe-content{
    width: 100%;
    height: 100%;
  }
}
</style>