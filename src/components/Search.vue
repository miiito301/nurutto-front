<template>
  <div class="search-form">
    <h3>保存した作品</h3>
    <form @submit.prevent="searchWorks" @keydown.enter.prevent>
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
            @input="fetchTagSuggestions"
            @keyup.enter.prevent="addTag(tagInput)"
          />
          <button type="button" @click="addTag(tagInput)">＋</button>
        </div>

        <!-- サジェスト候補 -->
        <ul v-if="tagSuggestions.length > 0" class="suggestion-list">
          <li
            v-for="(suggestion, index) in tagSuggestions"
            :key="index"
            @click="addTag(suggestion)"
            class="suggestion-item"
          >
            {{ suggestion }}
          </li>
        </ul>

        <div class="tag-list">
          <span v-for="(tag, index) in tags" :key="index" class="tag-item">
            {{ tag }}
            <button type="button" class="remove-btn" @click="removeTag(index)">×</button>
          </span>
        </div>
      </div>

      <!-- Search button -->
      <div class="form-actions">
        <button type="submit">検索</button>
      </div>
    </form>

    <!-- Results -->
    <div class="results" v-if="results.length > 0">
      <h4>検索結果</h4>
      <ul class="work-list">
        <li v-for="(work, index) in results" :key="index" class="work-item">
          <a
            :href="work.URL"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ work.title }}
          </a>

          <!-- タグ表示 -->
          <div class="work-tags" v-if="work.tags.length > 0">
            <small>タグ: {{ work.tags.join('　') }}</small>
          </div>

          <!-- 削除ボタン -->
          <button @click="deleteWork(work.id)">削除</button>
        </li>
      </ul>
    </div>

    <div class="no-results" v-else>
      <p>検索結果はありません</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const type = ref("manga");
const tagInput = ref("");
const tags = ref([]);
const tagSuggestions = ref([]); // ← 追加
const results = ref([]);


//ログインしていない場合はリダイレクト
import { onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
onMounted(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("ログインしてください");
    router.push("/login"); // return ではなくリダイレクト
  }
});

// タグ追加
const addTag = (tag) => {
  const trimmed = tag.trim();
  if (trimmed && !tags.value.includes(trimmed)) {
    tags.value.push(trimmed);
  }
  tagInput.value = "";
  tagSuggestions.value = []; // 候補を消す
};

// タグ削除
const removeTag = (index) => {
  tags.value.splice(index, 1);
};

// タグ候補取得（前方一致）
const fetchTagSuggestions = async () => {
  if (!tagInput.value.trim()) {
    tagSuggestions.value = [];
    return;
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/tags?q=${encodeURIComponent(tagInput.value)}`
  );
  tagSuggestions.value = await response.json();
};



// JWTをlocalStorageから取得
const token = localStorage.getItem("token");

const searchWorks = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // JWTを付与
    },
    body: JSON.stringify({
      type: type.value,
      tags: tags.value,
    }),
  });

  if (response.ok) {
    results.value = await response.json();
  } else {
    const data = await response.json();
    alert("検索エラー: " + data.error);
  }
};

// 削除
const deleteWork = async (id) => {
  if (!confirm("本当に削除しますか？")) return;

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/works/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // JWTを付与
    },
  });

  if (res.ok) {
    results.value = results.value.filter((work) => work.id !== id);
  } else {
    const data = await res.json();
    alert("削除失敗: " + data.error);
  }
};
</script>
