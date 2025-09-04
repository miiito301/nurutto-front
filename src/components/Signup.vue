<template>
  <div class="auth-form">
    <h3>ユーザー登録</h3>
    <form @submit.prevent="signup">
      <div class="form-group">
        <label>ユーザー名</label>
        <input v-model="username" required />
      </div>
      <div class="form-group">
        <label>パスワード</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">登録</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const errorMessage = ref("");

const router = useRouter();

const signup = async () => {
  errorMessage.value = "";
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.value, password: password.value }),
    });
    if (!res.ok) throw new Error("登録失敗");
    router.push("/login");
  } catch (err) {
    errorMessage.value = err.message;
  }
};
</script>
