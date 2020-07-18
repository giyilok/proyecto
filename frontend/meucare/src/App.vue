<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
:root {
  --my-color1: #238be6;
  --my-color2: #1964ab;
  --my-color3: #e7f0fe;
  --my-color4: #495157;
  --my-bgcolor: #f8f9fa;
}

* {
  padding: 0;
  margin: 0;
  box-sizing: content-box;
}

body {
  /*position: relative;*/
  margin-bottom: 0;
}

#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*   text-align: center;
 */
  color: #2c3e50;
}

.footerapp {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 30px;
  color: black;
}
</style>
