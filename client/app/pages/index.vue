<template>
  <div class="games-page-container">
    <div class="header-container">
      <h1 class="page-title">Merkle Games</h1>

      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search by game title..."
        class="search-input"
      />

      <div class="sort-by-container">
        Sort by
        <select v-model="selectedSortBy" @change="sortGames">
          <option value="averageRating">Average Rating</option>
          <option value="release_date">Release Date</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
    </div>

    <!-- Responsive Card Grid Structure -->
    <div v-else class="card-grid">
      <a
        :href="`/games/${game.id}`"
        v-for="game in sortedGames"
        :key="game.id"
        class="card-item"
      >
        <div class="card-image-wrapper">
          <img
            :src="
              game.coverImage ||
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQ0AAACUCAMAAAC+0owFAAAAkFBMVEX///8jGBYAAAAlFxYiGRUkGRUfExG6trYtJiaRjo4cEAvMy8s6ODkOAAAXBADt6uv7+fni4eEfHyBkYWKwrq2Cf36mop/08/OHhIRNR0Y9MjS+vr5HQEBsaWhSUVEbDAosICI1Lyx3dHObmZnZ19dAOjcpIB0nJycPCgpcWlotLi1WT0wYGBgfERQYEw0YDBDvprabAAAKRklEQVR4nO2biXKrOhKGjdgMRAJizGJsExbnXI4nM+//diPZRrSwiLd7cmeq+q9UKmULLR8tqbulLBYoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVCov1ndaicV/FCbcesNyn+qzfsUEEKo+KHk3f2hNstfRKr9oTbvU0CMi5zlT9EI3nzLOjdK0h9q8z4hDSikAYU0oP5ZGibS+L+mkYWd23rrde4lXZjdU2eUhXHgpmkSdFkWadp8iEaWxV2ZpG3qBrx9TXWvKQrjLihLN+FyPfYtjSxOdnT0Dugx7TRAOrfk9XGVZcBBtKuv4QH/mAZXD4B1gzYl1FVR3n6zGdtnRV52oTqaZJTqymXgm26GRVymzYGNDRjzNKIoyJeEOIZhG7Z9KkPJcl1e1ZmP1S2bI4dWGafitnjAacrJCwU0DICakI94wiJobEIq51LbqTry1SQdqDACzzfK0yH4Jtey6NK+4p11jGtd0wjbN+JPStkV8dtJpxcesU3zUgul6gOmQz5bFQekAatmW7XioPm8al90gBReIGuM3m3j0ra/ntCwh4eYp2ERpntKHXvawAyNoGfVdVnTrMhuYniChr7SkyqyVnDM0DAmNJIt0b013gNGClkyeneeoxE3Dn9xc/2e0ihrfWds02F7dYbeoGE4qqXeR6N9Z+bMizOqj5dpxAXVDk9PI/g1rK+njptCZxrcMulKeYu3aBjOO1xs7qKREMc0ZmnUr9KID+T7F6jQiN+q4QvrwsIEjxMPLv8qDbXk+SO2B+XvoRF+29mXaYTFLXOGNLIeLoam6fi+st44BL5shcYU3OkzxwGOxT00CqYp8PfRWBOlPqeiZ+lptD6YVBX1l5v6g0BAdAW2fYWG5TCRLaG0GkubJt2NxgFpOFVV+Q6XSqP866qzDOyEr9IIoOXxbftz2692TeM1sllIoyuYLG6Summ5X5V4PRigCY0D0uA78H6X5/l6B1ZhvhEV4z4EaDj1tq6Xy0/LF17BRo5xBUyD0s+i7/v9xqLk0oNXaRzG6s2KrtIyiOOQO9pazzxq6bkBsWSQVXAxg7g1xy2XNOPLBjSqTe6evMUsDjywajsfI2voi+ZBcPJCXe57e95gb+FWcjerfVp2cSz858Rb1SdvTKEh/Y3qXhrQNOhbEoMvNDS6/cU0LMsku3FKROmXL02cjp+PNPxNMkKKXDA7Qc5vLqLP5KPl0r8MkcMAG03EQ5b8wJ3dzUu20Y+mQQ/QWdDScIlcBmkBw4LIG8cHpspIA04I0ey41JBcemC38xupcRkiX3CmHjIP4rwlk808QSP87QzD838rcYaORthIGg5R/aygkCZMxrYhDaV8QGS7ZC3f/G0aXmVLGro8cjaGgk/QSL/ky66mU+iaRvxRacZwbjuX5enxNo0Fk/DoThr3bRo5GxYD0/lX8m0U/wSN1cVi+dr+pg5PRyMA08ENFWWetH2H3KYRbeUMBe7rbRotcG4ccki/SWw8HrVFctkwp7GthkbUgsXvUBRbqM24Gt9BY7EbTekRGskSxhCMkHrX8o0l1CB53DbiYgiMbTIJPzU0snEIfElnqsZe2vfQWD9Ho3tTInnb4A4dMY5rvtdOgTxOI5CVA/Oep7FVvWJ7kPIpNzPZsXka+XM04B4o9nlL1C9SPVafTxJkj9Nwl4ObwOo7aBhqisVUNEK6j4bcqh+i4VIQyAgYMpnEPWNlU3ycRvI50KC72zRiNaKZ0500hh49RmPRk9loni1z4AM9voqmlj3kqNUH/ndpLE4xoi7oNg2fNMA/ftg2PP8xGt+nbn6GRnTgnttcR0CQ9ASNStJQ08q3bcOZ15+lscjyGiYFFJkkeZ5GK1MD5NF1w7ZMi4eylvg5/3H6LVa2P0xD5MwPVJu8NE32NsyVJ9aNj8HogDs9SyP8knuKU3vJrNI/TWMRBW1jESKcHL7BK/kyMjjO0bv1YETv1v6FhsNu08g2crO3/LtuIv0pGmJIZZLvHR7D+4aSyKSrp2nw5i80gMs0T2MnYxFrnJ//EI3FKYQv2xW3kQrgqP4dPUsj3I80JueGN+IU1qunnv8EjVOfsjBY/wdEDPK1AhpsevI4E8P2Ms1J+5s0RKLssgdxevdMlQdpdNuRhu5IcE5hA3CQy2sSe8pJts1WiuGH4KUqzeTSyJx/qcahzW9shh2Z1/NLbxxR1o3x36M0YF5UP3A31kXw3VGuaOOUX0oaVaGcec3SCH7JHBTrlahHRyPjY5DrN1np7mxkXQ6WlOdtoyr0NArSlPFVw/FKrmgjjeHkxbIdW5l34IBqkhfdDsZhOlUD067pmL0Z86IlPEoi6+l7CjtXbHz6vOgdNPgyJk8QlmP5KBwb2oucxjoJVCJJPXgfVrUcPhzWfB7asR4aRzxLwxu+MU2H9kPOPCw9WT+kASYof4wcwYWJrCuTdSEudTxPI9ozaXrVkdtAFsfieGA3hh/7StwFINY+T5MyiEXajW8sbyDXLVdMueZb/JGdvMoQlg2do5GRL2Os6bNfe2nqrVc1GX1feLrkLuE5I6X7xku5u5V6edPX9OQOvUBj0bAxAmHLvmlW/XZJCRk3sP153CKlwTZFL+5997VyuCU7Cw9HHLpdp24QuKm3q4FLPT1dypXgg/EBOYxSmMiANLJGuZPCizLj44PXSikbnnmBRuubcATDsSI4zdyPVuD4jJ6LgB5V/ri4KxcrxCnp4a02VJd+SiMjkwjIMY3JB/Activo9OvLYanUCzTKd+3VCT0NnUxwOrNoYMxtnk7Q/cmVnatT6eBW1kK9sVD+UuhZJynlX6Cx+H11gekxGuwTVKZEmSI9J7p6g0bk6a/qzNBYJO9Kh64To6/QSInuxgKkMRfLn7v6l6s2MpsImaOxyNZ/OZqrFXM0Fu7b7BUxIfMVGovfVNMVhcbs+Gyrslpl4w0LvntMk9g3aCzC3BBr+b00FsGKzdqr7RPgsz9OI3jnscKEhk3BnjJd5kaZ9LOd+GXBln7HQn8LLkzfrrJrjjRZzQ3JtCBUZ0vi2miT6M7o76WxcH+RaxrjcXzpfRD9q2Dk6F557cFRswyAT7Q3JKOuUeJicauFDudG9Pp/l6KO8yCVsv3w3ZmwXRrA8MUjfnUWvaJxOZ6qiOIn8vH2hCo0eGdAnJEFrbiGOxkjb3ubTm+rCnV5pfIQrtswsopRfXDI4wtL3JBm7HSJ9+i6G3mouL++JLyI4iCvz5equU5/HNbl9AjQox8XfU1oeMvNRcvdZBShW4hq+XZ47gs9gjuxoumQA6Gnzsoyom3tuPjAPHFBmvnCjzrdaS476zA0vpn7hzEefKbr/nDod+0pLspG6Q9+RWohyder43G39kTkcF0sApXc+83idIl8fawtp96u8lJ3QV803eZ9bVbW4diI/n5zXB9lQbo7fDJWF03SiZI3h4ZCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoW6pf8Cj3fZfnNlXEkAAAAASUVORK5CYII='
            "
            :alt="game.title"
            class="card-image"
            loading="lazy"
          />
        </div>

        <div class="card-body">
          <h2 class="card-title">
            {{ game.title }}
          </h2>

          <div class="card-details">
            <div class="card-release-date">
              <strong>Release Date:</strong>
              {{
                game.release_date
                  ? new Date(game.release_date).toLocaleDateString()
                  : "N/A"
              }}
            </div>
            <div class="card-average-rating">
              <strong>Average Rating ({{ game.reviews?.length || 0 }}):</strong>
              <span class="rating-value">
                ★ {{ game.averageRating }} / 10
              </span>
            </div>

            <div class="card-genre-name">
              <strong>Genre:</strong>
              {{ game.genre?.name }}
            </div>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
let loading = ref(false);
let games = ref([]);
let selectedSortBy = ref("averageRating");
const sortOptions = [
  { value: "averageRating", label: "Average Rating" },
  { value: "release_date", label: "Release Date" },
];
let searchQuery = ref("");

onMounted(async () => {
  loading.value = true;
  await fetchGames();
  loading.value = false;
});

const sortedGames = computed(() => {
  return [...games.value]
    .filter((game) => {
      return game.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    })
    .sort((a, b) => {
      if (selectedSortBy.value === "averageRating") {
        return b.averageRating - a.averageRating;
      } else if (selectedSortBy.value === "release_date") {
        return new Date(b.release_date) - new Date(a.release_date);
      }
      return 0;
    });
});

async function fetchGames() {
  const games_list = await useFetch(
    `http://localhost:8000/api/v1/games/by-date-range?from=${new Date("2015-01-01").toISOString().split("T")[0]}&to=${new Date("2017-12-31").toISOString().split("T")[0]}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const game_ids = games_list?.data?.value?.ids?.splice(0, 15) || [];

  // Games_ids contains an array of game IDs, fetch each game's details
  for (const id of game_ids) {
    const game_data = await useFetch(
      `http://localhost:8000/api/v1/games/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    games.value.push(game_data?.data?.value?.data);
  }

  // Map through the games and add coverImage and averageRating properties
  games.value = games.value.map((game_data) => ({
    ...game_data,
    coverImage: game_data.images?.length
      ? `http://localhost:8000` +
          game_data.images?.find((img) => img.image_type === "Cover")
            ?.image_url || game_data.images?.[0]?.image_url
      : "",
    averageRating: game_data.reviews?.length
      ? (
          game_data.reviews.reduce((acc, review) => acc + review.rating, 0) /
          game_data.reviews.length
        ).toFixed(1)
      : 0,
  }));
}
</script>

<style scoped>
/* Page Layout Container */
.games-page-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    sans-serif;
}
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 24px;
}

@media (min-width: 640px) {
  .card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

/* Card Component Styling */
.card-item {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
}

.card-item:hover {
  transform: translateY(-4px);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Card Image Wrapper */
.card-image-wrapper {
  height: 192px;
  width: 100%;
  background-color: #e5e7eb;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.card-image {
  width: 100%;
  height: 100%;
}

/* Card Body */
.card-body {
  padding: 10px 20px 10px 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-details {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-right: auto;
}

.card-release-date,
.card-average-rating,
.card-genre-name {
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.5;
  flex-grow: 1;
}

.rating-value {
  font-weight: 700;
}

.card-button {
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.2s ease;
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
