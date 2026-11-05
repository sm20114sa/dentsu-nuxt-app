<template>
  <div class="game-detail-container">
    <!-- Navigation Back Button -->
    <nav class="navigation">
      <button @click="goBack" class="back-btn">← Back to Games</button>
    </nav>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
    </div>

    <div v-else>
      <!-- Game Details -->
      <main class="game-card">
        <!-- cover Image -->
        <div class="cover-image">
          <img
            :src="gameDetail.coverImage"
            :alt="gameDetail.title"
            class="featured-image"
          />
          <div class="cover-title">
            <h1 class="game-title">{{ gameDetail.title }}</h1>
          </div>
        </div>

        <div class="game-content">
          <div class="meta-sidebar">
            <div class="meta-item">
              <span class="meta-label"
                >Average Rating ({{ gameDetail.reviews?.length || 0 }})</span
              >
              <span class="meta-value">
                ★ {{ gameDetail.averageRating }} / 10
              </span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Developer </span>
              <span class="meta-value">{{ gameDetail.developer?.name }} </span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Release Date </span>
              <span class="meta-value">{{
                gameDetail.release_date
                  ? new Date(gameDetail.release_date).toLocaleDateString()
                  : "N/A"
              }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Genre </span>
              <span class="meta-value">{{ gameDetail.genre?.name }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Created at</span>
              <span class="meta-value">{{
                gameDetail.genre?.createdAt
                  ? new Date(gameDetail.genre?.createdAt).toLocaleDateString()
                  : "N/A"
              }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Updated at</span>
              <span class="meta-value">{{
                gameDetail.genre?.updatedAt
                  ? new Date(gameDetail.genre?.updatedAt).toLocaleDateString()
                  : "N/A"
              }}</span>
            </div>
          </div>

          <div class="main-description">
            <h2>About the Game</h2>
            <p class="description-text">{{ gameDetail.description }}</p>
          </div>
        </div>
      </main>

      <!-- Reviews Section -->
      <section class="reviews-section" v-if="gameDetail.reviews?.length">
        <h2>Player Reviews ({{ gameDetail.reviews?.length || 0 }})</h2>
        <div class="reviews-list">
          <div
            v-for="(review, index) in gameDetail.reviews"
            :key="index"
            class="review-card"
          >
            <div class="review-header">
              <span class="review-username">@{{ review?.user?.username }}</span>
              <span class="review-rating">★ {{ review.rating }} / 10</span>
            </div>
            <p class="review-text">"{{ review.review_text }}"</p>
          </div>
        </div>
      </section>

      <section v-else class="reviews-section">
        <h2>Player Reviews</h2>
        <p class="description-text">No reviews available for this game.</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
let loading = ref(false);
let game = ref({});

onMounted(async () => {
  loading.value = true;
  await fetchGameDetail();
  loading.value = false;
});

const gameDetail = computed(() => game.value);

async function fetchGameDetail() {
  try {
    const game_data = await useFetch(
      `http://localhost:8000/api/v1/games/${useRoute().params.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    game.value = {
      ...game_data.data.value?.data,
      coverImage: game_data.data.value?.data.images?.length
        ? `http://localhost:8000` +
            game_data.data.value?.data.images?.find(
              (img) => img.image_type === "Cover",
            )?.image_url || game_data.data.value?.data.images?.[0]?.image_url
        : "",
      averageRating: game_data.data.value?.data.reviews?.length
        ? (
            game_data.data.value?.data.reviews.reduce(
              (acc, review) => acc + review.rating,
              0,
            ) / game_data.data.value?.data.reviews.length
          ).toFixed(1)
        : 0,
    };
    console.log("Fetched game data:", game);
  } catch (error) {
    console.error("Error fetching game data:", error);
  }
}

const router = useRouter();
const goBack = () => {
  router.back();
};
</script>

<style scoped>
.game-detail-container {
  --bg-primary: #fff;
  --bg-secondary: #f5f5f5;
  --accent: #3b82f6;
  --text-main: #000000;
  --text-muted: #94a3b8;
  --border-color: #e5e7eb;
  background-color: var(--bg-primary);
  color: var(--bg-primary);
  min-height: 100vh;
  padding: 1rem;
  margin: 0 auto;
}

.navigation {
  margin-bottom: 1.5rem;
}

.back-btn {
  background-color: transparent;
  border: 1px solid var(--accent);
  color: var(--text-main);
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

/* Game Main Card */
.game-card {
  background-color: var(--bg-primary);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  margin-bottom: 1rem;
}

.cover-image {
  position: relative;
  width: 100%;
  height: 450px;
}

.featured-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
}

.game-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.game-content {
  display: grid;
  grid-template-columns: 30% 1fr;
  gap: 1rem;
  padding: 1rem;
}

@media (max-width: 768px) {
  .game-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.meta-sidebar {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: var(--bg-primary);
  padding: 0.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.meta-item {
  gap: 0.5rem;
  align-items: end;
  display: grid;
  grid-template-columns: 35% 1fr;
}

.meta-label {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  font-weight: bold;
}

.meta-value {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
}

.main-description h2 {
  color: var(--text-main);
  font-size: 1.5rem;
  margin: 0;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.description-text {
  line-height: 1.7;
  color: var(--text-muted);
  font-size: 1.05rem;
  margin: 0;
}

/* Reviews Section */
.reviews-section h2 {
  font-size: 1.75rem;
  margin: 0;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.review-username {
  font-weight: 600;
  color: var(--accent);
}

.review-rating {
  background-color: rgba(251, 191, 36, 0.1);
  color: #fbbf24;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
}

.review-text {
  margin: 0;
  line-height: 1.5;
  color: #cbd5e1;
  font-style: italic;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 256px;
}

.spinner {
  animation: spin 1s linear infinite;
  border-radius: 50%;
  height: 48px;
  width: 48px;
  border-top: 2px solid #2563eb;
  border-bottom: 2px solid #2563eb;
  border-left: 2px solid transparent;
  border-right: 2px solid transparent;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
