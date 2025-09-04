<template>
  <div>
    <h3>ログイン</h3>
    <form @submit.prevent="login">
      <div class="form-group">
        <label>ユーザー名</label>
        <input v-model="username" required />
      </div>
      <div class="form-group">
        <label>パスワード</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">ログイン</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p class="signup-text">アカウントがない方は</p>
    <div class="signup-container">
      <button class="btn" @click="goSignup">Sign Up</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const errorMessage = ref("");

const router = useRouter();

const login = async () => {
  errorMessage.value = "";
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.value, password: password.value }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "ログイン失敗");
    }

    const data = await res.json();
    console.log("サーバーから受け取ったデータ:", data);

    // ✅ JWTをlocalStorageに保存
    localStorage.setItem("token", data.token);

    // ログイン後にフォーム画面へ遷移
    router.push("/form");
    window.location.reload(); // App.vueのisAuthenticatedを更新させる
  } catch (err) {
    console.error("ログインエラー:", err);
    errorMessage.value = err.message;
  }
};

const goSignup = () => {
  router.push("/signup");
};
</script>
