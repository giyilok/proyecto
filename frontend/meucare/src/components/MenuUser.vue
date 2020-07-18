<template>
  <div>
    <div class="menu-user">
      <img :src="user.image" />
      <p>{{ user.user_name }}</p>
      <!--       <p>{{ user.email }}</p>
 -->
      <p>
        <a href="#"
          ><i class="fas fa-list-ul fa-lg"></i>

          Mis ofertas</a
        >
      </p>
      <p>
        <a href="#"
          ><i class="far fa-bookmark fa-lg"></i>

          Mis reservas</a
        >
      </p>
      <p>
        <a href="#"><i class="fas fa-user-md fa-lg"></i>Mis cuidadores</a>
      </p>
      <p><i class="fas fa-user-circle fa-lg"></i><a href="#">Mi Perfil</a></p>
      <button>Logout</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "MenuUser",
  props: {
    user: Object,
  },
};
</script>

<style scoped>
.menu-user {
  min-width: 300px;
  height: 450px;
  background: #f9f9f9;
  border-radius: 20px;
  margin: 10px 8rem;
  border: 0.5px solid lightgrey;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
  position: fixed;
}

.menu-user p:first-of-type {
  margin: 0 auto;
  font-weight: bolder;
}

.menu-user p {
  margin-left: 5rem;
}

img {
  margin: 0 auto;
  border-radius: 8px;
}

button {
  width: 70px;
  padding: 6px 6px;
  border: none;
  font-size: 14px;
  color: black;
  background: #f5a821;
  border-radius: 18px;
  font-weight: 300;
  margin: 0 auto;
}

a {
  color: black;
  text-decoration: none;
}

i {
  margin-right: 1rem;
}
/* .menu-options {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  margin-left: 15px;
  border: 1px solid;
} */
</style>
