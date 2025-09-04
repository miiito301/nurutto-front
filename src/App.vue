<template>
  <div>
    <!-- 認証済みならナビゲーション表示 -->
    <nav v-if="isAuthenticated">
      <router-link to="/form">作品登録</router-link>
      <router-link to="/search">作品検索</router-link>
      <button @click="logout">ログアウト</button>
    </nav>

    <!-- 画面切り替え -->
    <router-view :is-authenticated="isAuthenticated" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isAuthenticated = ref(false);

// マウント時に localStorage の token を確認
onMounted(() => {
  isAuthenticated.value = !!localStorage.getItem("token");
});

// ログアウト処理
const logout = () => {
  localStorage.removeItem("token");
  isAuthenticated.value = false;
  router.push("/login");
};
</script>


