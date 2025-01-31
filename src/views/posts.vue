<template>
  <van-nav-bar title="朋友圈" left-arrow @click-left="$router.back()" class="nav-bar">
    <template #right>
      <van-icon name="plus" @click="addPost" />
    </template>
  </van-nav-bar>
  <div class="friend-circle">
    <PullToRefreshList class="pullToRefreshList" ref="pullToRefreshListRef" :fetchDataFn="getTableData" :pageSize="10">
      <template v-slot:item="{ tableData }">
        <div v-for="item in tableData" :key="item.id" class="post-item" :class="{ 'self-post-item': item.userId === userInfo.id }">
          <div class="user-info-box" :class="{ 'self-post': item.userId === userInfo.id }">
            <div class="user-info">
              <van-image class="user-avatar" :src="item.user.avatar || avatar" round width="40px" height="40px" fit="cover" />
              <span class="user-name">{{ item.user.nickname }}</span>
            </div>
          </div>
          <div class="post-content">
            <p>{{ item.content }}</p>
          </div>
          <van-grid class="post-images" :border="false" :column-num="3">
            <van-grid-item v-for="img,i in item.images" :key="img"  class="grid-item">
              <van-image :src="img" width="100%" height="100%" fit="cover" @click="showImage(item.images,i)" />
            </van-grid-item>
          </van-grid>
          <div class="post-meta">
            <div class="post-time">
              <span>{{ formatDate(item.createdAt) }}</span>
              <van-icon v-if="item.userId === userInfo.id" name="delete-o" class="delete-icon" @click="deletePost(item.id)" />
            </div>
            <div class="post-location">
              <span>{{ item.location }}</span>
            </div>
          </div>
          <div class="post-actions">
            <van-icon name="good-job-o" class="action-icon" />
            <van-icon name="chat-o" class="action-icon" />
            <van-icon name="share-o" class="action-icon" />
          </div>
        </div>
      </template>
    </PullToRefreshList>
    <PostToMoments ref="postPopupRef" @refresh="refresh" />
    <van-image-preview v-model:show="showImg" :images="imgUrl" :start-position="startPosition"></van-image-preview>
  </div>
</template>

<script lang='ts' setup>
import { getPosts, deletePosts } from "@/api/posts";
import PullToRefreshList from "@/components/PullToRefreshList.vue";
import { toRefs, reactive, onMounted } from "vue";
import type { UserInfo } from "../types";
import avatar from "@/assets/img/avatar.jpg";
import { showToast } from "vant";
import { formatDate } from "@/utils/time";

const state = reactive({
  userInfo: JSON.parse(localStorage.getItem("userInfo")) as UserInfo,
  page: 1,
  pageSize: 10,
  total: 0,
  imgUrl: [],
  showImg: false,
  startPosition:0
});

const { userInfo, imgUrl, showImg, startPosition } = toRefs(state);
const pullToRefreshListRef = ref();
const postPopupRef = ref(null);
async function getTableData(page, pageSize) {
  const { data } = await getPosts({
    userId: userInfo.value.id,
    page: page,
    pageSize: pageSize,
  });
  return data;
}
async function deletePost(id) {
  await deletePosts({ id, userId: userInfo.value.id });
  pullToRefreshListRef.value.deleteTableData(id);
  showToast("删除成功");
}

async function refresh() {
  pullToRefreshListRef.value.fetchData(true);
}
function addPost() {
  postPopupRef.value.openPopup();
}
function showImage(imgList,index) {
  state.imgUrl = imgList;
  state.startPosition = index;
  state.showImg = true;
}
</script>

<style lang='scss' scoped>
.grid-item {
  padding: 4px; /* 设置间距 */
}
.friend-circle {
  padding: 16px;
  background-color: #f5f5f5;
  background: linear-gradient(to right, #ff7e5f, #feb47b);
  margin-top: 46px;
  min-height: 90%;
  padding-bottom: 50px;
}

.post-item {
  background-color: #f9e6ff;
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.user-info-box {
  display: flex;
  justify-content: space-between;
}
.user-info {
  display: flex;
  width: 100%;
  align-items: center;
  margin-bottom: 12px;
  gap: 10px;

  .user-name {
    font-size: 16px;
    font-weight: bold;
  }
}

.post-content {
  margin-bottom: 12px;
  font-size: 14px;
  color: #333;
}

.post-images {
  margin-bottom: 12px;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;

  .post-time {
    font-size: 12px;
    color: #999;

    .delete-icon {
      margin-left: 8px;
      cursor: pointer;
    }
  }

  .post-location {
    font-size: 12px;
    color: #999;
  }
}

.post-actions {
  display: flex;
  justify-content: space-around;
  padding: 8px;
  border-radius: 4px;

  .action-icon {
    font-size: 24px;
    color: #c0bdbd;
    cursor: pointer;
  }
}

.nav-bar {
  position: fixed;
  width: 100%;
}

.self-post {
  display: flex;
  text-align: right;
  .user-info {
    flex-direction: row-reverse;
  }
}
.self-post-item {
  background-color: #fff8e7;
}
</style>