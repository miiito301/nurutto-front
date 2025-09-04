<template>
  <div class="work-form">
    <h3>作品登録フォーム</h3>
    <form @submit.prevent="saveWork" @keydown.enter.prevent>
      <!--URL-->
      <div class="form-group">
        <label>URL</label>
        <input v-model="URL" />
      </div>

      <!-- Title -->
      <div class="form-group">
        <label>タイトル</label>
        <input v-model="title" />
      </div>

      <!-- Type -->
      <div class="form-group">
        <label>作品タイプ</label>
        <select v-model="type">
          <option value="manga">漫画</option>
          <option value="movie">動画</option>
          <option value="audio">音声</option>
        </select>
      </div>

      <!-- Tags -->
      <div class="form-group">
        <label>タグ</label>
        <div class="tag-input">
          <input
            v-model="tagInput"
            placeholder="タグを追加"
            @input="fetchSuggestions"
            @keyup.enter.prevent="addTag"
          />
          <button type="button" @click="addTag">＋</button>
        </div>

        <!-- サジェスト -->
        <ul v-if="suggestions.length > 0" class="suggestions">
          <li
            v-for="(s, i) in suggestions"
            :key="i"
            @click="selectSuggestion(s)"
            class="suggestion-item"
          >
            {{ s }}
          </li>
        </ul>

        <div class="tag-list">
          <span
            v-for="(tag, index) in tags"
            :key="index"
            class="tag-item"
          >
            {{ tag }}
            <button type="button" class="remove-btn" @click="removeTag(index)">×</button>
          </span>
        </div>
      </div>

      <!-- Submit -->
      <div class="form-actions">
        <button type="submit">保存</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";

const URL = ref("");
const title = ref("");
const type = ref("manga");
const tagInput = ref("");
const tags = ref([]);
const suggestions = ref([]);

// タグ追加
const addTag = () => {
  const trimmed = tagInput.value.trim();
  if (trimmed && !tags.value.includes(trimmed)) {
    tags.value.push(trimmed);
    tagInput.value = "";
    suggestions.value = [];
  }
};

// サジェストから選択
const selectSuggestion = (s) => {
  if (!tags.value.includes(s)) {
    tags.value.push(s);
  }
  tagInput.value = "";
  suggestions.value = [];
};

// タグ削除
const removeTag = (index) => {
  tags.value.splice(index, 1);
};

// サジェスト取得
const fetchSuggestions = async () => {
  const q = tagInput.value.trim();
  if (!q) {
    suggestions.value = [];
    return;
  }
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/tags?q=${encodeURIComponent(q)}`
  );
  if (res.ok) {
    suggestions.value = await res.json();
  }
};

// 保存処理
const saveWork = async () => {
  if (tagInput.value.trim()) addTag();
  if (tags.value.length === 0) {
    alert("タグを1つ以上追加してください");
    return;
  }

  const token = localStorage.getItem("token");
  console.log("送信するtoken:", token)
  if (!token) {
    alert("ログインしてください");
    return;
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/works`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      URL: URL.value,
      title: title.value,
      type: type.value,
      tags: tags.value,
    }),
  });

  if (res.ok) {
    alert("保存しました！");
    URL.value = "";
    title.value = "";
    type.value = "manga";
    tags.value = [];
  } else {
    const data = await res.json();
    alert("保存失敗: " + data.error);
  }
};
</script>


