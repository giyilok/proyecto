<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
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
  font-family: Avenir, Helvetica, Arial, sans-serif;
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
